import type { ReactNode } from 'react'

interface SectionDividerProps {
  label: string
  sublabel?: string
  actions?: ReactNode
}

export function SectionDivider({ label, sublabel, actions }: SectionDividerProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-baseline gap-2 whitespace-nowrap">
        <span className="text-sm font-semibold tracking-wide">{label}</span>
        {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
      </div>
      <div className="h-px min-w-8 flex-1 bg-border" />
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
