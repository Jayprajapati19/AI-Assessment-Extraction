"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Mapping } from "@/lib/types";
import { Hash, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface SummaryCardsProps {
  total: number;
  mappings: Mapping[];
}

export default function SummaryCards({ total, mappings }: SummaryCardsProps) {
  const matched = mappings.filter((m) => m.status === "matched").length;
  const unanswered = mappings.filter((m) => m.status === "unanswered").length;
  const needsReview = mappings.filter(
    (m) => m.status === "needs_review"
  ).length;

  const cards = [
    {
      label: "Total Questions",
      value: total,
      icon: Hash,
      gradient: "from-slate-500/20 to-slate-600/20",
      iconColor: "text-slate-400",
      border: "border-slate-500/20",
    },
    {
      label: "Matched",
      value: matched,
      icon: CheckCircle2,
      gradient: "from-emerald-500/20 to-green-500/20",
      iconColor: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    {
      label: "Unanswered",
      value: unanswered,
      icon: XCircle,
      gradient: "from-red-500/20 to-rose-500/20",
      iconColor: "text-red-400",
      border: "border-red-500/20",
    },
    {
      label: "Needs Review",
      value: needsReview,
      icon: AlertTriangle,
      gradient: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-400",
      border: "border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            "px-4 py-3.5 rounded-xl bg-gradient-to-br border",
            card.gradient,
            card.border
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <card.icon className={cn("w-4 h-4", card.iconColor)} />
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              {card.label}
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
