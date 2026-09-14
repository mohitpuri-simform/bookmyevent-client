import { Eye } from 'lucide-react'

export function StageBanner() {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold tracking-wide text-primary-foreground">
      <Eye className="size-4 shrink-0" />
      ALL EYES THIS WAY
    </div>
  )
}
