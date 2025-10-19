import { cn } from "@/lib/utils"

interface CenteredBorderProps {
  width?: string
  color?: string
  thickness?: string
  className?: string
}

export function CenteredBorder({
  width = "95%",
  color = "border-zinc-800",
  thickness = "border-b-2",
  className,
}: CenteredBorderProps) {
  return (
    <div 
      className={cn(
        "absolute bottom-0 left-1/2 transform -translate-x-1/2",
        thickness,
        color,
        className || ""
      )}
      style={{ width }}
    />
  )
}
