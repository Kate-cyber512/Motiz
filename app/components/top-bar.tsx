"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { exportOptions } from "./mock-data";

type TopBarProps = {
  onOpenAssets: () => void;
};

export function TopBar({ onOpenAssets }: TopBarProps) {
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/8 bg-[#0b0d10]/95 px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white text-sm font-semibold text-black">
          MP
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-wide">
            Motion Playground
          </h1>
          <p className="hidden text-xs text-neutral-500 sm:block">
            AI-native motion workspace
          </p>
        </div>
      </div>

      <nav className="flex items-center gap-2">
        <button
          onClick={onOpenAssets}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200 transition hover:bg-white/10"
        >
          Assets
        </button>

        <div className="relative">
          <button
            onClick={() => setExportOpen((open) => !open)}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200 transition hover:bg-white/10"
          >
            Export
            <span className="text-neutral-500">v</span>
          </button>

          <AnimatePresence>
            {exportOpen ? (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 top-11 z-20 w-44 rounded-lg border border-white/10 bg-[#15181d] p-1 shadow-2xl shadow-black/40"
              >
                {exportOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setExportOpen(false)}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm text-neutral-300 transition hover:bg-white/8 hover:text-white"
                  >
                    {option}
                  </button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <button className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-neutral-200 transition hover:bg-white/10">
          K
        </button>
      </nav>
    </header>
  );
}
