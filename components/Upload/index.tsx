'use client';

import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Paragraph } from '@/components/Paragraph';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileImportIcon } from '@hugeicons/core-free-icons';
import { getAuthHeaders } from '@/lib/apiClient';

type ParsedQuestion = {
  questionText: string;
  options: string[];
  correctAnswer: string;
  examType: string;
  examYear: number;
  subject: string;
};

const normalizeLine = (line: string) => line.replace(/\u00A0/g, ' ').trim();

const groupTextByLine = (items: any[]) => {
  const linesMap = new Map<number, string>();
  for (const item of items) {
    const transform = item.transform || [];
    const y = Math.round((transform[5] ?? 0) * 10) / 10;
    const existing = linesMap.get(y) ?? '';
    const text = normalizeLine(item.str ?? '');
    if (!text) continue;
    linesMap.set(y, existing ? `${existing} ${text}` : text);
  }
  return Array.from(linesMap.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([, value]) => value);
};

const parseQuestionsFromText = (
  rawText: string,
  examType: string,
  examYear: string,
  subject: string,
): ParsedQuestion[] => {
  const lines = rawText
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter((line) => line.length > 0);

  const blocks: string[][] = [];
  let currentBlock: string[] = [];

  for (const line of lines) {
    if (/^\d+\./.test(line)) {
      if (currentBlock.length) {
        blocks.push(currentBlock);
      }
      currentBlock = [line];
    } else {
      if (currentBlock.length === 0) {
        currentBlock = [line];
      } else {
        currentBlock.push(line);
      }
    }
  }
  if (currentBlock.length) {
    blocks.push(currentBlock);
  }

  if (blocks.length === 0) {
    throw new Error('No questions found in the uploaded file.');
  }

  return blocks.map((block, index) => {
    const questionLine = block.find((line) => /^\d+\./.test(line));
    const optionLines = block.filter((line) => /^[A-D]\./i.test(line));
    const answerLine = block.find((line) => /^correctAnswer\s*:/i.test(line));

    if (!questionLine) {
      throw new Error(`Question ${index + 1} is missing a numbered question line.`);
    }
    if (optionLines.length !== 4) {
      throw new Error(`Question ${index + 1} must have exactly 4 options (A, B, C, D).`);
    }
    if (!answerLine) {
      throw new Error(`Question ${index + 1} is missing a correctAnswer line.`);
    }

    const questionText = questionLine.replace(/^\d+\./, '').trim();
    const options = optionLines.map((line) => line.replace(/^[A-D]\./i, '').trim());
    const rawCorrectAnswer = answerLine.replace(/^correctAnswer\s*:/i, '').trim();
    const normalizedCorrectAnswer = rawCorrectAnswer.replace(/[.,;]+$/, '').trim();

    const matchedOption = options.find(
      (option) => option.toLowerCase() === normalizedCorrectAnswer.toLowerCase(),
    );
    if (!matchedOption) {
      throw new Error(
        `Question ${index + 1} has a correctAnswer that does not match any option. Expected exact option text.`,
      );
    }

    return {
      questionText,
      options,
      correctAnswer: matchedOption,
      examType,
      examYear: Number(examYear),
      subject,
    };
  });
};

const extractTextFromPdf = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfjsModule = await import('pdfjs-dist/legacy/build/pdf');
  const pdfjsLib = (pdfjsModule as any)?.default ?? pdfjsModule;

  // Use a hosted worker path instead of the removed/bundled worker entry path.
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.16.0/pdf.worker.min.js';

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pagesText: string[] = [];
  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
    const page = await pdf.getPage(pageIndex);
    const content = await page.getTextContent();
    const pageLines = groupTextByLine(content.items);
    pagesText.push(pageLines.join('\n'));
  }

  return pagesText.join('\n');
};

const parseJsonQuestions = async (
  file: File,
  examType: string,
  examYear: string,
  subject: string,
): Promise<ParsedQuestion[]> => {
  const content = await file.text();
  const payload = JSON.parse(content);
  const questions = Array.isArray(payload) ? payload : [payload];

  if (questions.length === 0) {
    throw new Error('JSON must contain one or more question objects.');
  }

  return questions.map((item, index) => {
    if (
      !item?.questionText ||
      !Array.isArray(item.options) ||
      item.options.length !== 4 ||
      !item?.correctAnswer
    ) {
      throw new Error(`JSON question ${index + 1} is malformed. Each question needs questionText, 4 options, and correctAnswer.`);
    }

    const normalizedCorrectAnswer = String(item.correctAnswer).trim();
    const matchedOption = item.options.find(
      (option: string) => String(option).trim().toLowerCase() === normalizedCorrectAnswer.toLowerCase(),
    );
    if (!matchedOption) {
      throw new Error(
        `JSON question ${index + 1} has a correctAnswer that does not exactly match one of the options.`,
      );
    }

    return {
      questionText: String(item.questionText).trim(),
      options: item.options.map((option: string) => String(option).trim()),
      correctAnswer: matchedOption,
      examType,
      examYear: Number(examYear),
      subject,
    };
  });
};

export const UploadComponent = () => {
  const [examType, setExamType] = useState('');
  const [subject, setSubject] = useState('');
  const [examYear, setExamYear] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewQuestions, setPreviewQuestions] = useState<ParsedQuestion[]>([]);
  const [parseError, setParseError] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const examTypes = ['JSCE', 'SSCE', 'UTME', 'Post-UTME'];
  const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History'];
  const examYears = ['2024', '2025', '2026', '2027'];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const isAcceptedFile = (file: File) => {
    const name = file.name.toLowerCase();
    return (
      file.type === 'application/pdf' ||
      file.type === 'application/json' ||
      name.endsWith('.pdf') ||
      name.endsWith('.json')
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (isAcceptedFile(file)) {
        setSelectedFile(file);
      } else {
        setParseError('Only PDF and JSON files are supported.');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isAcceptedFile(file)) {
        setSelectedFile(file);
      } else {
        setParseError('Only PDF and JSON files are supported.');
      }
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewQuestions([]);
    setParseError('');
    setSuccessMessage('');
    setIsParsing(false);
    setIsSaving(false);
  };

  const handleParseFile = async () => {
    setParseError('');
    setSuccessMessage('');
    setPreviewQuestions([]);

    if (!examType || !subject || !examYear || !selectedFile) {
      setParseError('Please select exam type, subject, year, and a file before parsing.');
      return;
    }

    setIsParsing(true);
    try {
      let parsedQuestions: ParsedQuestion[] = [];
      if (selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf')) {
        const rawText = await extractTextFromPdf(selectedFile);
        parsedQuestions = parseQuestionsFromText(rawText, examType, examYear, subject);
      } else {
        parsedQuestions = await parseJsonQuestions(selectedFile, examType, examYear, subject);
      }
      setPreviewQuestions(parsedQuestions);
      if (parsedQuestions.length === 0) {
        setParseError('No valid questions were parsed from the uploaded file.');
      }
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Unable to parse file.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirmSave = async () => {
    if (previewQuestions.length === 0) {
      setParseError('No parsed questions available to save.');
      return;
    }

    setParseError('');
    setSuccessMessage('');
    setIsSaving(true);

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(previewQuestions),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Save failed with status ${response.status}`);
      }

      setSuccessMessage('Questions saved successfully.');
      resetForm();
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Failed to save questions.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="py-8 px-4 w-full flex flex-col bg-[rgba(228,231,236,0.2)]">
      <Header text="Upload Questions" />
      <Paragraph text="Upload your own questions or documents to generate questions" />

      <div className="mt-8 flex-1 flex flex-col">
        {/* Upload Settings Section */}
        <div className="mb-8 p-6 bg-white rounded-xl" style={{ border: '1px solid #E4E7EC' }}>
          <h3 style={{ color: '#1D2939' }} className="font-semibold text-base mb-6">
            Upload Settings
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Exam Type</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                style={{ border: '1px solid #D0D5DD' }}
                className="w-full px-[10px] py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 text-sm"
              >
                <option value="">Select exam type</option>
                {examTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{ border: '1px solid #D0D5DD' }}
                className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 text-sm"
              >
                <option value="">Select subject</option>
                {subjects.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Exam Year</label>
              <select
                value={examYear}
                onChange={(e) => setExamYear(e.target.value)}
                style={{ border: '1px solid #D0D5DD' }}
                className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 text-sm"
              >
                <option value="">Select exam year</option>
                {examYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Upload File Section */}
        <div className="flex-1 flex flex-col bg-white p-6 rounded-lg" style={{ border: '1px solid #E4E7EC' }}>
          <h3 style={{ color: '#1D2939' }} className="font-semibold text-base mb-6">
            Upload File
          </h3>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ border: dragOver ? '2px solid #0A5BFF' : '2px dashed #D0D5DD' }}
            className={`flex-1 rounded-xl p-8 text-center flex flex-col items-center justify-center transition-colors ${
              dragOver ? 'bg-blue-50' : 'bg-white'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.json"
              onChange={handleFileSelect}
              className="hidden"
            />

            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75z"
              />
            </svg>

            <p className="text-gray-700 font-medium text-base mb-1">Drop file here or click to upload</p>
            <p className="text-gray-500 text-sm mb-6">Supports PDF and JSON files only</p>

            {selectedFile && (
              <p className="text-green-600 text-sm mb-4">
                ✓ Selected: <span className="font-medium">{selectedFile.name}</span>
              </p>
            )}

            <button
              type="button"
              onClick={handleSelectFile}
              className="px-6 cursor-pointer flex flex-row items-center justify-between py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition text-sm"
            >
              <HugeiconsIcon icon={FileImportIcon} />
              <span className="ml-2 text-base">Select file</span>
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleParseFile}
              disabled={isParsing || !selectedFile || !examType || !subject || !examYear}
              className="w-full px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50"
            >
              {isParsing ? 'Parsing file...' : 'Parse & Preview'}
            </button>
          </div>

          {parseError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <span className="font-semibold">Parse error:</span> {parseError}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {previewQuestions.length > 0 && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-semibold text-slate-900">Preview parsed questions</h4>
                  <p className="text-sm text-slate-600">Review the extracted questions before saving.</p>
                </div>
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Confirm & Save'}
                </button>
              </div>

              <div className="space-y-4">
                {previewQuestions.slice(0, 10).map((question, idx) => (
                  <div key={`${question.questionText}-${idx}`} className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">{idx + 1}. {question.questionText}</p>
                    <ul className="mt-2 grid gap-2 text-sm text-slate-700">
                      {question.options.map((option, optionIndex) => (
                        <li key={optionIndex} className={`rounded-md px-3 py-2 ${question.correctAnswer === option ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-slate-50 border border-slate-200'}`}>
                          {String.fromCharCode(65 + optionIndex)}. {option}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-slate-500">Correct answer: <span className="font-semibold text-slate-800">{question.correctAnswer}</span></p>
                  </div>
                ))}
                {previewQuestions.length > 10 && (
                  <p className="text-sm text-slate-600">Showing 10 of {previewQuestions.length} parsed questions.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
