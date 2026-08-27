"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Mapping, Question, Answer } from "@/lib/types";
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight } from "lucide-react";

interface QuestionListProps {
  questions: Question[];
  mappings: Mapping[];
  answers: Answer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const statusConfig = {
  matched: {
    label: "Matched",
    icon: CheckCircle2,
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  unanswered: {
    label: "Unanswered",
    icon: XCircle,
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    dot: "bg-red-500",
  },
  needs_review: {
    label: "Review",
    icon: AlertTriangle,
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-500",
  },
};

export default function QuestionList({
  questions,
  mappings,
  answers,
  selectedId,
  onSelect,
}: QuestionListProps) {
  return (
    <div className="space-y-1.5">
      {questions.map((q) => {
        const mapping = mappings.find((m) => m.questionId === q.id);
        const status = mapping?.status || "unanswered";
        const config = statusConfig[status];
        const isSelected = selectedId === q.id;
        const answer = mapping?.answerId
          ? answers.find((a) => a.id === mapping.answerId)
          : null;

        return (
          <button
            key={q.id}
            onClick={() => onSelect(q.id)}
            className={cn(
              "w-full text-left px-4 py-3 rounded-xl border transition-all duration-200",
              isSelected
                ? "bg-violet-500/10 border-violet-500/30 shadow-lg shadow-violet-500/5"
                : "bg-slate-900/50 border-slate-800/50 hover:bg-slate-800/50 hover:border-slate-700/50"
            )}
          >
            <div className="flex items-center gap-3">
              {/* Question number */}
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                  isSelected
                    ? "bg-violet-500/20 text-violet-300"
                    : "bg-slate-800 text-slate-400"
                )}
              >
                {q.displayNumber}
              </div>

              {/* Question text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 truncate">{q.text}</p>
                <div className="flex items-center gap-2 mt-1">
                  {q.marks && (
                    <span className="text-[10px] text-slate-600">
                      {q.marks} marks
                    </span>
                  )}
                  {answer && (
                    <span className="text-[10px] text-slate-600">
                      • Page {answer.page}
                    </span>
                  )}
                </div>
              </div>

              {/* Status badge */}
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider shrink-0",
                  config.bg,
                  config.text,
                  "border",
                  config.border
                )}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
                {config.label}
              </div>

              {isSelected && (
                <ChevronRight className="w-4 h-4 text-violet-400 shrink-0" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
