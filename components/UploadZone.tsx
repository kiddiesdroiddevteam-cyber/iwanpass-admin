"use client";

import { useRef, useState } from "react";
import { Upload, FileText, FileJson, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  accept: string;
  label: string;
  description: string;
  icon: "pdf" | "json";
  onFile: (file: File) => void;
  disabled?: boolean;
}

const UploadZone = ({ accept, label, description, icon, onFile, disabled }: UploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = "";
  };

  const Icon = icon === "pdf" ? FileText : FileJson;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 w-full rounded-[1.5rem] border-2 border-dashed p-10 transition-all duration-200 cursor-pointer group",
        "bg-white",
        dragging
          ? "border-blue-400 shadow-[0_20px_50px_-30px_rgba(14,165,233,0.8)]"
          : "border-slate-200 hover:border-blue-300",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-200",
        "bg-slate-100 group-hover:bg-blue-50",
        dragging && "bg-blue-50"
      )}>
        <Icon className={cn(
          "w-8 h-8 transition-colors duration-200",
          "text-slate-500 group-hover:text-blue-600",
          dragging && "text-blue-600"
        )} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
      <div className={cn(
        "flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200",
        "bg-blue-600 text-white hover:bg-blue-700",
        dragging && "bg-primary text-primary-foreground"
      )}>
        <Upload className="w-4 h-4" />
        Select file
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </button>
  );
};

export default UploadZone;
