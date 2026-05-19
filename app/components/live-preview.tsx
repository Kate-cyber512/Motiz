"use client";

import { motion } from "motion/react";

export function LivePreview() {
  return (
    <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
            Live Preview
          </p>
          <h2 className="mt-1 text-lg font-medium text-neutral-100">
            Onboarding hero interaction
          </h2>
        </div>
        <div className="hidden items-center gap-2 text-xs text-neutral-500 sm:flex">
          <span className="rounded-md border border-white/8 px-2 py-1">
            1440 x 900
          </span>
          <span className="rounded-md border border-white/8 px-2 py-1">
            Draft
          </span>
        </div>
      </div>

      <div className="relative min-h-[360px] flex-1 overflow-hidden rounded-lg border border-white/10 bg-[#14171c]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute left-5 top-5 flex gap-2">
          <span className="size-2 rounded-full bg-red-400/80" />
          <span className="size-2 rounded-full bg-yellow-300/80" />
          <span className="size-2 rounded-full bg-emerald-300/80" />
        </div>

        <div className="relative grid h-full place-items-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-lg rounded-lg border border-white/12 bg-[#0d1014] p-5 shadow-2xl shadow-black/40"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-500">Scene 01</p>
                <h3 className="text-xl font-medium text-white">
                  Shape the motion, then ship the code.
                </h3>
              </div>
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="size-11 rounded-lg border border-white/10 bg-white"
              />
            </div>

            <div className="space-y-3">
              {["Intent parsed", "Motion path suggested", "Export ready"].map(
                (label, index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 * index }}
                    className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2"
                  >
                    <span className="text-sm text-neutral-300">{label}</span>
                    <span className="h-1.5 w-16 rounded-full bg-white/20">
                      <span className="block h-full w-2/3 rounded-full bg-white" />
                    </span>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
