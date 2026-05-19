export function PromptDock() {
  return (
    <div className="border-t border-white/8 bg-[#0b0d10] p-4 sm:p-5">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-neutral-500">
            Prompt
          </label>
          <textarea
            rows={2}
            defaultValue="Create a calm product onboarding motion with a soft reveal, subtle spring, and exportable component structure."
            className="min-h-20 w-full resize-none bg-transparent text-sm leading-6 text-neutral-200 outline-none placeholder:text-neutral-600"
          />
        </div>

        <div className="flex shrink-0 gap-2">
          <button className="rounded-lg border border-dashed border-white/18 px-4 py-3 text-sm text-neutral-300 transition hover:bg-white/8">
            Upload
          </button>
          <button className="rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-neutral-200">
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
