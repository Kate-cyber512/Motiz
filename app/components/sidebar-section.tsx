import type { ReactNode } from "react";

type SidebarSectionProps = {
  title: string;
  children: ReactNode;
};

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          {title}
        </h2>
        <div className="h-px flex-1 bg-white/8 ml-3" />
      </div>
      {children}
    </section>
  );
}
