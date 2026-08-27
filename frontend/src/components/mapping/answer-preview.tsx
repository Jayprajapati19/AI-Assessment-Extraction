"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Question, Answer, Mapping } from "@/lib/types";
import {
  MessageSquare,
  Gauge,
  ArrowRight,
  FileQuestion,
  AlertTriangle,
} from "lucide-react";

interface AnswerPreviewProps {
  question: Question | null;
  answer: Answer | null;
  mapping: Mapping | null;
}

export default function AnswerPreview({
  question,
  answer,
  mapping,
}: AnswerPreviewProps) {
  if (!question) {
    return (
      <div className="h-full flex items-center justify-center py-16">
        <div className="text-center">
          <FileQuestion className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-500">
            Select a question to view its answer
          </p>
        </div>
      </div>
    );
  }

  const confidence = mapping?.confidence ?? answer?.confidence ?? 0;
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className="space-y-4">
      {/* Question */}
      <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/15">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md bg-violet-500/20 flex items-center justify-center text-[10px] font-bold text-violet-300">
            {question.displayNumber}
          </div>
          <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider">
            Question
          </span>
          {question.marks && (
            <span className="ml-auto text-[10px] text-slate-500">
              {question.marks} marks
            </span>
          )}
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          {question.text}
        </p>
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <ArrowRight className="w-4 h-4 text-slate-600 rotate-90" />
      </div>

      {/* Answer */}
      {answer ? (
        <div
          className={cn(
            "p-4 rounded-xl border",
            mapping?.status === "matched"
              ? "bg-emerald-500/5 border-emerald-500/15"
              : mapping?.status === "needs_review"
              ? "bg-amber-500/5 border-amber-500/15"
              : "bg-slate-900/50 border-slate-800/50"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Student Answer
            </span>
            <span className="ml-auto text-[10px] text-slate-600">
              Page {answer.page}
              {answer.pages && answer.pages.length > 1
                ? ` - ${answer.pages[answer.pages.length - 1]}`
                : ""}
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
            {answer.text}
          </p>

          {/* Confidence */}
          <div className="mt-4 flex items-center gap-3">
            <Gauge className="w-4 h-4 text-slate-600" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500">
                  AI Confidence
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    confidencePercent >= 80
                      ? "text-emerald-400"
                      : confidencePercent >= 60
                      ? "text-amber-400"
                      : "text-red-400"
                  )}
                >
                  {confidencePercent}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    confidencePercent >= 80
                      ? "bg-emerald-500"
                      : confidencePercent >= 60
                      ? "bg-amber-500"
                      : "bg-red-500"
                  )}
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15 text-center">
          <AlertTriangle className="w-8 h-8 text-red-400/60 mx-auto mb-2" />
          <p className="text-sm text-red-400">No answer found</p>
          <p className="text-xs text-slate-600 mt-1">
            The student did not answer this question
          </p>
        </div>
      )}
    </div>
  );
}
