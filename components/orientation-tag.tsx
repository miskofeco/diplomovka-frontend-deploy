import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface OrientationTagProps {
  orientation: 'left' | 'right' | 'neutral'
  confidence?: number
  reasoning?: string
  size?: 'sm' | 'md'
}

export function OrientationTag({ 
  orientation, 
  confidence = 0, 
  reasoning = "",
  size = 'sm' 
}: OrientationTagProps) {
  const getOrientationConfig = (orientation: string) => {
    switch (orientation.toLowerCase()) {
      case 'left':
        return {
          label: 'Ľavica',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          emoji: '⬅️'
        }
      case 'right':
        return {
          label: 'Pravica',
          className: 'bg-red-100 text-red-800 border-red-200',
          emoji: '➡️'
        }
      case 'neutral':
      default:
        return {
          label: 'Neutrálne',
          className: 'bg-coffee-100 text-gray-700 border-gray-200',
          emoji: '⚖️'
        }
    }
  }

  const config = getOrientationConfig(orientation)
  const confidencePercentage = Math.round(confidence * 100)

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border",
        config.className,
        size === 'md' ? "px-3 py-1.5 text-sm" : ""
      )}
      title={reasoning ? `${reasoning} (Istota: ${confidencePercentage}%)` : `Istota: ${confidencePercentage}%`}
    >
      <span className="text-xs">{config.emoji}</span>
      {config.label}
      {confidence > 0 && (
        <span className="ml-1 opacity-75">
          {confidencePercentage}%
        </span>
      )}
    </span>
  )
}