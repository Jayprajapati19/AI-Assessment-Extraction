"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Sparkles,
  FileSearch,
  PenTool,
  ScanLine,
  Link2,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { getAssessment } from "@/lib/api";
import { AssessmentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/app-layout";

const steps = [
  {
    id: "extracting_questions",
    label: "Extracting Questions",
    description: "Analyzing question paper structure",
    icon: FileSearch,
  },
  {
    id: "extracting_answers",
    label: "Reading Answers",
    description: "Transcribing handwritten responses",
    icon: PenTool,
  },
  {
    id: "detecting_regions",
    label: "Detecting Regions",
    description: "Identifying answer bounding boxes",
    icon: ScanLine,
  },
  {
    id: "mapping_answers",
    label: "Mapping Answers",
    description: "Linking answers to questions",
    icon: Link2,
  },
];

export default function ProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;

  const [status, setStatus] = useState<AssessmentStatus>("extracting_questions");
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const pollStatus = useCallback(async () => {
    try {
      const data = await getAssessment(assessmentId);
      setStatus(data.status);

      if (data.status === "completed") {
        setCompleted(true);
        return true;
      }
      if (data.status === "error") {
        setError(data.error || "Processing failed");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [assessmentId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const done = await pollStatus();
      if (done) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [pollStatus]);

  const currentStepIndex = steps.findIndex((s) => s.id === status);

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* AI Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              {!completed && !error && (
                <div className="absolute -inset-2 rounded-3xl border-2 border-violet-500/30 animate-ping" />
              )}
              {completed && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-slate-950">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-center text-xl font-bold text-white mb-2">
            {error
              ? "Processing Failed"
              : completed
              ? "Processing Complete"
              : "AI Processing"}
          </h2>
          <p className="text-center text-sm text-slate-400 mb-10">
            {error
              ? error
              : completed
              ? "All questions and answers have been extracted and mapped."
              : "Analyzing your documents with Gemini AI..."}
          </p>

          {/* Steps */}
          <div className="space-y-3 mb-10">
            {steps.map((step, i) => {
              const isActive = step.id === status && !completed && !error;
              const isDone = completed || i < currentStepIndex;
              const isPending = !completed && i > currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-500",
                    isActive
                      ? "bg-violet-500/10 border border-violet-500/20"
                      : isDone
                      ? "bg-emerald-500/5 border border-emerald-500/10"
                      : "bg-slate-900/50 border border-slate-800/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500",
                      isActive
                        ? "bg-violet-500/20 text-violet-400"
                        : isDone
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-slate-800 text-slate-600"
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4.5 h-4.5" />
                    ) : (
                      <step.icon
                        className={cn(
                          "w-4.5 h-4.5",
                          isActive && "animate-pulse"
                        )}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isActive
                          ? "text-white"
                          : isDone
                          ? "text-emerald-300"
                          : "text-slate-600"
                      )}
                    >
                      {step.label}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        isActive || isDone
                          ? "text-slate-500"
                          : "text-slate-700"
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          {error && (
            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30 transition-colors text-sm font-medium"
            >
              <AlertCircle className="w-4 h-4" />
              Try Again
            </button>
          )}

          {completed && (
            <button
              onClick={() => router.push(`/mapping/${assessmentId}`)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:from-violet-500 hover:to-indigo-500 transition-all duration-300"
            >
              Start Mapping
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
