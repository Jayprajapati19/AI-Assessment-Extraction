"use client";

import React, { useCallback, useRef, useState } from "react";
import { Upload, FileText, Image, X, Check } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";

interface UploadCardProps {
  title: string;
  description: string;
  accept: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  icon: "question" | "answer";
}

export default function UploadCard({
  title,
  description,
  accept,
  file,
  onFileChange,
  icon,
}: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        const ext = droppedFile.name.split(".").pop()?.toLowerCase();
        if (["pdf", "jpg", "jpeg", "png"].includes(ext || "")) {
          onFileChange(droppedFile);
        }
      }
    },
    [onFileChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) onFileChange(selected);
    },
    [onFileChange]
  );

  const getFileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText className="w-5 h-5 text-red-400" />;
    return <Image className="w-5 h-5 text-blue-400" />;
  };

  return (
    <div
      className={cn(
        "relative group rounded-2xl border-2 border-dashed transition-all duration-300",
        file
          ? "border-violet-500/30 bg-violet-500/5"
          : isDragging
          ? "border-violet-500 bg-violet-500/10 scale-[1.01]"
          : "border-slate-700/50 bg-slate-900/50 hover:border-slate-600/50 hover:bg-slate-800/30"
      )}
    >
      {/* Filled state */}
      {file ? (
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
              <Check className="w-6 h-6 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-violet-400 uppercase tracking-wider mb-1">
                {title}
              </p>
              <div className="flex items-center gap-2 mb-1">
                {getFileIcon(file.name)}
                <p className="text-sm font-medium text-white truncate">
                  {file.name}
                </p>
              </div>
              <p className="text-xs text-slate-500">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Replace button */}
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-3 w-full py-2 rounded-xl border border-slate-700/50 text-xs font-medium text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
          >
            Replace file
          </button>
        </div>
      ) : (
        /* Empty state / Drop zone */
        <div
          className="p-8 cursor-pointer text-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div
            className={cn(
              "w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all duration-300",
              icon === "question"
                ? "bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20"
                : "bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/20"
            )}
          >
            <Upload
              className={cn(
                "w-6 h-6",
                icon === "question" ? "text-violet-400" : "text-indigo-400"
              )}
            />
          </div>
          <p className="text-sm font-semibold text-white mb-1">{title}</p>
          <p className="text-xs text-slate-500 mb-4">{description}</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400">
            <Upload className="w-3.5 h-3.5" />
            Drag & drop or click to browse
          </div>
          <p className="mt-3 text-[10px] text-slate-600">
            PDF, JPG, PNG • Max 50MB
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
