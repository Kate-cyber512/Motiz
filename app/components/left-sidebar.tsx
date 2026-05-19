import {
  memoryItems,
  motionIntent,
  parameters,
  suggestions,
} from "./mock-data";
import { SidebarSection } from "./sidebar-section";

export function LeftSidebar() {
  return (
    <aside className="hidden min-h-0 flex-col bg-[#0b0d10] lg:flex">
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-5">
        <SidebarSection title="Motion Intent">
          <div className="space-y-3">
            {motionIntent.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/8 bg-white/[0.03] p-3"
              >
                <p className="text-xs uppercase text-neutral-500">
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-neutral-200">{item.value}</p>
              </div>
            ))}
          </div>
        </SidebarSection>

        <SidebarSection title="AI Suggestions">
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="w-full rounded-lg border border-white/8 bg-white/[0.03] p-3 text-left text-sm leading-5 text-neutral-300 transition hover:border-white/16 hover:bg-white/[0.06]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </SidebarSection>

        <SidebarSection title="Parameter Panel">
          <div className="space-y-4">
            {parameters.map((parameter) => (
              <div key={parameter.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-neutral-400">{parameter.label}</span>
                  <span className="text-neutral-200">{parameter.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-neutral-200"
                    style={{ width: parameter.level }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SidebarSection>
      </div>

      <div className="border-t border-white/8 p-5">
        <SidebarSection title="Memory">
          <div className="space-y-2">
            {memoryItems.map((item) => (
              <div
                key={item}
                className="rounded-lg bg-white/[0.03] px-3 py-2 text-xs leading-5 text-neutral-400"
              >
                {item}
              </div>
            ))}
          </div>
        </SidebarSection>
      </div>
    </aside>
  );
}
