"use client";

import { motion } from "motion/react";
import { assets } from "./mock-data";

type AssetsDrawerProps = {
  onClose: () => void;
};

export function AssetsDrawer({ onClose }: AssetsDrawerProps) {
  return (
    <>
      <motion.button
        aria-label="Close assets drawer"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-30 bg-black/50"
      />

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="fixed right-0 top-0 z-40 flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-[#101318] shadow-2xl shadow-black/60"
      >
        <div className="flex h-16 items-center justify-between border-b border-white/8 px-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
              Assets
            </p>
            <h2 className="text-base font-medium text-white">
              Workspace library
            </h2>
          </div>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-lg border border-white/10 text-neutral-300 transition hover:bg-white/8"
          >
            x
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {assets.map((asset) => (
            <button
              key={asset.name}
              className="w-full rounded-lg border border-white/8 bg-white/[0.03] p-4 text-left transition hover:border-white/16 hover:bg-white/[0.06]"
            >
              <div className="mb-4 h-24 rounded-md border border-white/8 bg-[#171b21]" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-100">
                    {asset.name}
                  </p>
                  <p className="text-xs text-neutral-500">{asset.type}</p>
                </div>
                <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-neutral-400">
                  {asset.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.aside>
    </>
  );
}
