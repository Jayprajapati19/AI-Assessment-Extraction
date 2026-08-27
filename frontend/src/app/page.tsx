"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, BookOpen, FileText } from "lucide-react";
import AppLayout from "@/components/layout/app-layout";
import UploadCard from "@/components/upload/upload-card";
import { uploadFiles, startExtraction } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [questionPaper, setQuestionPaper] = useState<File | null>(null);
  const [answerSheet, setAnswerSheet] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canStart = questionPaper && answerSheet && !isUploading;

  const handleStart = useCallback(async () => {
    if (!questionPaper || !answerSheet) return;
    setIsUploading(true);
    setError(null);

    try {
      const { id } = await uploadFiles(questionPaper, answerSheet);
      await startExtraction(id);
      router.push(`/processing/${id}`);
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setIsUploading(false);
    }
  }, [questionPaper, answerSheet, router]);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Assessment Extraction
              </h1>
              <p className="text-sm text-slate-400">
                Upload your documents to begin AI-powered analysis
              </p>
            </div>
          </div>
        </div>

        {/* Upload Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Step 1
              </span>
            </div>
            <UploadCard
              title="Question Paper"
              description="Upload the original question paper"
              accept=".pdf,.jpg,.jpeg,.png"
              file={questionPaper}
              onFileChange={setQuestionPaper}
              icon="question"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Step 2
              </span>
            </div>
            <UploadCard
              title="Student Answer Sheet"
              description="Upload the student's handwritten answers"
              accept=".pdf,.jpg,.jpeg,.png"
              file={answerSheet}
              onFileChange={setAnswerSheet}
              icon="answer"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Start Button */}
        <div className="flex justify-center">
          <button
            disabled={!canStart}
            onClick={handleStart}
            className="group flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:from-violet-600 disabled:hover:to-indigo-600"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Start Processing
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "AI-Powered",
              desc: "Uses Gemini Vision for accurate extraction",
            },
            {
              title: "Smart Mapping",
              desc: "Maps answers by content, not just order",
            },
            {
              title: "Region Detection",
              desc: "Highlights exact answer locations on pages",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800/50"
            >
              <p className="text-sm font-medium text-slate-300">
                {item.title}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
