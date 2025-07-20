import React from 'react'
import { cn } from '@/lib/utils'

interface PasswordStrengthMeterProps {
  strength: number
  passwordType: 'random' | 'smart' | 'memorable' | 'pin'
  className?: string
}

const getStrengthColor = (strength: number): string => {
  if (strength >= 80) return 'bg-green-500'
  if (strength >= 60) return 'bg-yellow-500'
  if (strength >= 40) return 'bg-orange-500'
  return 'bg-red-500'
}

const getStrengthText = (strength: number, type: string): string => {
  switch (type) {
    case 'pin':
      if (strength >= 35) return 'Strong PIN'
      if (strength >= 25) return 'Good PIN'
      if (strength >= 15) return 'Fair PIN'
      return 'Weak PIN'
    
    case 'memorable':
      if (strength >= 70) return 'Very Memorable & Secure'
      if (strength >= 55) return 'Good & Memorable'
      if (strength >= 40) return 'Fair & Memorable'
      return 'Weak but Memorable'
    
    case 'smart':
      if (strength >= 75) return 'Excellent Smart Password'
      if (strength >= 60) return 'Good Smart Password'
      if (strength >= 45) return 'Fair Smart Password'
      return 'Weak Smart Password'
    
    case 'random':
    default:
      if (strength >= 80) return 'Very Strong'
      if (strength >= 60) return 'Strong'
      if (strength >= 40) return 'Fair'
      return 'Weak'
  }
}

const getStrengthDescription = (strength: number, type: string): string => {
  switch (type) {
    case 'pin':
      if (strength >= 35) return 'This PIN avoids common patterns and is sufficiently long'
      if (strength >= 25) return 'This PIN is reasonably secure for most uses'
      if (strength >= 15) return 'Consider using a longer PIN or avoiding simple patterns'
      return 'This PIN may be easily guessed - use a longer, more random PIN'
    
    case 'memorable':
      if (strength >= 70) return 'Great balance of memorability and security with good word variety'
      if (strength >= 55) return 'Good memorable password with decent complexity'
      if (strength >= 40) return 'Memorable but could benefit from more words or numbers'
      return 'Easy to remember but consider adding more complexity'
    
    case 'smart':
      if (strength >= 75) return 'Excellent pattern-based password with good entropy'
      if (strength >= 60) return 'Good smart password following secure patterns'
      if (strength >= 45) return 'Decent smart password, could be more complex'
      return 'Smart pattern but needs more complexity'
    
    case 'random':
    default:
      if (strength >= 80) return 'Excellent random password with high entropy'
      if (strength >= 60) return 'Strong random password suitable for sensitive accounts'
      if (strength >= 40) return 'Adequate for most purposes, consider longer length'
      return 'Too weak - increase length or add more character types'
  }
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  strength,
  passwordType,
  className,
}) => {
  const strengthColor = getStrengthColor(strength)
  const strengthText = getStrengthText(strength, passwordType)
  const strengthDescription = getStrengthDescription(strength, passwordType)

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          Password Strength
        </span>
        <span className={cn('font-semibold', {
          'text-green-600 dark:text-green-400': strength >= 80,
          'text-yellow-600 dark:text-yellow-400': strength >= 60 && strength < 80,
          'text-orange-600 dark:text-orange-400': strength >= 40 && strength < 60,
          'text-red-600 dark:text-red-400': strength < 40,
        })}>
          {strengthText}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={cn('h-2.5 rounded-full transition-all duration-300 ease-in-out', strengthColor)}
          style={{ width: `${Math.max(strength, 5)}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">
          Score: {strength}/100
        </span>
        <div className="flex space-x-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn('w-2 h-2 rounded-full', {
                'bg-green-500': strength >= 80 && level <= 4,
                'bg-yellow-500': strength >= 60 && strength < 80 && level <= 3,
                'bg-orange-500': strength >= 40 && strength < 60 && level <= 2,
                'bg-red-500': strength < 40 && level <= 1,
                'bg-gray-300 dark:bg-gray-600': 
                  (strength >= 80 && level > 4) ||
                  (strength >= 60 && strength < 80 && level > 3) ||
                  (strength >= 40 && strength < 60 && level > 2) ||
                  (strength < 40 && level > 1),
              })}
            />
          ))}
        </div>
      </div>
      
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
        {strengthDescription}
      </p>
    </div>
  )
}
