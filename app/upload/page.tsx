"use client";
import { useState, useCallback } from "react";
import { FileText, FileJson, Loader2, X, ChevronRight, Braces, Settings2 } from "lucide-react";
import UploadZone from "@/components/UploadZone";
import { DashbaordComponent } from "@/components/dashboard";

export const dynamic = 'force-dynamic';
import JsonEditor from "@/components/JsonEditor";
import { Header } from "@/components/Header";
import { Paragraph } from "@/components/Paragraph";
import Label from "@/components/Label";
import { parseExamPDF } from '../../services/pdftojson';
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type Mode = "idle" | "loading" | "editor";

const Index = () => {
  const [mode, setMode] = useState<Mode>("idle");
  const [jsonValue, setJsonValue] = useState("");
  const [filename, setFilename] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState("");
  
  // Metadata State
  const [metadata, setMetadata] = useState({
    examType: "",
    subject: "",
    imageUrl: "",
    examYear: "",
  });

  const handlePdf = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a valid PDF file.");
      return;
    }
    if (!metadata.subject) {
      setError("Please enter a subject before uploading.");
      return;
    }

    setError(null);
    setMode("loading");
    setFilename(file.name);
    setProgress("Parsing PDF...");
    
    try {
      // Use the live metadata from state
      const data = await parseExamPDF(file, metadata);
      setProgress("Formatting JSON...");
      setJsonValue(JSON.stringify(data, null, 2));
      setMode("editor");
    } catch (e) {
      setError(`Failed to parse PDF: ${(e as Error).message}`);
      setMode("idle");
    }
  }, [metadata]);

  const handleReset = () => {
    setMode("idle");
    setJsonValue("");
    setFilename(undefined);
    setError(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="bg-white" style={{ border: "1px solid #E4E7EC" }} >
        <DashbaordComponent />
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <Header text="Upload Questions" />
            <Paragraph text="Upload your own questions or documents to generate questions" />

          <div className="mt-6 space-y-6">
            {mode === "idle" && (
              <>
                <section style={{border:" 1px solid #E2E4E9"}} className="bg-white rounded-xl border border-border p-6">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <Header text="Upload Settings" />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label text="Exam Type" />
                      <select
                        value={metadata.examType}
                        onChange={(e) => setMetadata({ ...metadata, examType: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Select exam type</option>
                        <option value="JAMB">JAMB</option>
                        <option value="WAEC">WAEC</option>
                        <option value="NECO">NECO</option>
                        <option value="Common Entrance">Common Entrance</option>
                      </select>
                    </div>

                    <div>
                      <Label text="Subject" />
                      <select
                        value={metadata.subject}
                        onChange={(e) => setMetadata({ ...metadata, subject: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Select subject</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="English">English</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="History">History</option>
                      </select>
                    </div>

                    <div>
                      <Label text="Exam Year" />
                      <select
                        value={metadata.examYear}
                        onChange={(e) => setMetadata({ ...metadata, examYear: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="">Select exam year</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-xl border border-border p-6" style={{border:" 1px solid #E2E4E9"}}>
                  <div className="mb-6">
                    <h2 className="text-base font-semibold text-slate-900">Upload File</h2>
                  </div>
                  <UploadZone
                    accept=".pdf,.json"
                    label="Drop file here or click to upload"
                    description="Supports PDF and JSON files only"
                    icon="pdf"
                    onFile={handlePdf}
                  />
                </section>
              </>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <span className="font-semibold">Parse error:</span> {error}
              </div>
            )}

            {mode === "loading" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <FileText className="h-8 w-8" />
                </div>
                <p className="text-sm font-semibold text-slate-900">{progress}</p>
                <p className="mt-2 text-sm text-slate-500">{filename}</p>
              </div>
            )}

            {mode === "editor" && (
              <div className="rounded-[1.5rem] bg-white border border-border p-6 shadow-sm">
                <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-50 text-xs">
                  <FileJson className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-mono text-slate-700 truncate">{filename ?? "output.json"}</span>
                  <span className="ml-auto rounded-full bg-blue-100 px-2 py-1 text-[11px] font-semibold text-blue-700">
                    {metadata.examType} - {metadata.subject}
                  </span>
                </div>
                <div className="mt-4" style={{ minHeight: '60vh' }}>
                  <JsonEditor value={jsonValue} onChange={setJsonValue} filename={filename} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

