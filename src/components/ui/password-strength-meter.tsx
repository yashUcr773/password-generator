import { cn } from "@/lib/utils"

interface PasswordStrengthMeterProps {
  strength: number
  className?: string
}

export const PasswordStrengthMeter = ({ strength, className }: PasswordStrengthMeterProps) => {
  const getStrengthLabel = (score: number): string => {
    if (score < 25) return 'Very Weak'
    if (score < 50) return 'Weak'
    if (score < 75) return 'Good'
    if (score < 90) return 'Strong'
    return 'Very Strong'
  }

  const getStrengthColor = (score: number): string => {
    if (score < 25) return 'bg-red-500'
    if (score < 50) return 'bg-orange-500'
    if (score < 75) return 'bg-yellow-500'
    if (score < 90) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthTextColor = (score: number): string => {
    if (score < 25) return 'text-red-700 dark:text-red-400'
    if (score < 50) return 'text-orange-700 dark:text-orange-400'
    if (score < 75) return 'text-yellow-700 dark:text-yellow-400'
    if (score < 90) return 'text-blue-700 dark:text-blue-400'
    return 'text-green-700 dark:text-green-400'
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Password Strength</span>
        <span className={cn("text-sm font-semibold", getStrengthTextColor(strength))}>
          {getStrengthLabel(strength)}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={cn(
            "h-2 rounded-full transition-all duration-300 ease-in-out",
            getStrengthColor(strength)
          )}
          style={{ width: `${strength}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground text-center">
        {strength}/100
      </div>
    </div>
  )
}
