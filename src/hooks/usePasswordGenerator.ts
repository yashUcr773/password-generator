import { useState, useCallback } from 'react'

type PasswordType = 'random' | 'smart' | 'memorable' | 'pin'

interface PasswordOptions {
  type: PasswordType
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
  customSymbols?: string
  pinLength?: number
  pinNoRepeats?: boolean
  pinNoSequence?: boolean
  pinExcludeDigits?: string
  memorableWordCount?: number
  memorableSeparator?: string
  memorableCapitalization?: 'none' | 'first' | 'all' | 'random'
  memorableIncludeNumbers?: boolean
  memorableNumberPosition?: 'end' | 'between' | 'random'
  smartComplexity?: 'simple' | 'medium' | 'complex'
  smartIncludeSpecialChars?: boolean
  smartWordOrder?: 'adjective-noun' | 'verb-noun' | 'random'
  randomMinUppercase?: number
  randomMinLowercase?: number
  randomMinNumbers?: number
  randomMinSymbols?: number
  randomNoAmbiguous?: boolean
}

interface UsePasswordGeneratorReturn {
  password: string
  options: PasswordOptions
  updateOptions: (newOptions: Partial<PasswordOptions>) => void
  generatePassword: () => void
  copyToClipboard: () => Promise<boolean>
  getPasswordStrength: () => number
}

const DEFAULT_SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
const SIMILAR_CHARS = 'il1Lo0O'

// Enhanced word lists for memorable passwords
const NOUNS = [
  'apple', 'bridge', 'castle', 'dragon', 'eagle', 'forest', 'galaxy', 'harbor', 'island', 'jungle',
  'knight', 'lighthouse', 'mountain', 'ocean', 'palace', 'quartz', 'river', 'sunset', 'tower', 'universe',
  'village', 'waterfall', 'crystal', 'phoenix', 'thunder', 'meadow', 'comet', 'pyramid', 'volcano', 'wizard',
  'butterfly', 'diamond', 'elephant', 'falcon', 'giraffe', 'horizon', 'iceberg', 'jaguar', 'kangaroo', 'leopard',
  'moonlight', 'nebula', 'orchard', 'panther', 'rainbow', 'sapphire', 'tornado', 'umbrella', 'valley', 'whisper',
  'anchor', 'beacon', 'compass', 'dolphin', 'emerald', 'firefly', 'glacier', 'hamster', 'iguana', 'jackal',
  'keystone', 'lavender', 'magnet', 'nautilus', 'ocelot', 'penguin', 'quasar', 'rabbit', 'starfish', 'turtle',
  'unicorn', 'violet', 'whale', 'xenon', 'yacht', 'zebra', 'amber', 'bronze', 'copper', 'desert',
  'eclipse', 'fountain', 'garden', 'hammer', 'iodine', 'jasmine', 'kiwi', 'lemon', 'marble', 'nectar',
  'olive', 'prism', 'quill', 'rose', 'silver', 'topaz', 'urchin', 'vanilla', 'willow', 'xylophone',
  'yarrow', 'zircon', 'acorn', 'badger', 'cedar', 'daisy', 'ember', 'fern', 'grape', 'hazel',
  'iris', 'jade', 'kestrel', 'lily', 'mint', 'nutmeg', 'onyx', 'pearl', 'quartz', 'ruby',
  'sage', 'tulip', 'umber', 'vine', 'walnut', 'xylem', 'yew', 'zinc', 'atom', 'blaze',
  'coral', 'dune', 'echo', 'flame', 'geyser', 'heron', 'ivory', 'jewel', 'kelp', 'lotus',
  'mesa', 'nova', 'opal', 'pine', 'quill', 'reef', 'storm', 'thyme', 'umber', 'vortex'
]

const ADJECTIVES = [
  'brave', 'clever', 'daring', 'elegant', 'fierce', 'gentle', 'heroic', 'infinite', 'joyful', 'keen',
  'loyal', 'mighty', 'noble', 'radiant', 'swift', 'vibrant', 'wise', 'zealous', 'bright', 'calm',
  'divine', 'eternal', 'faithful', 'golden', 'humble', 'intense', 'jovial', 'kind', 'luminous', 'mystic',
  'nimble', 'peaceful', 'quick', 'robust', 'serene', 'triumphant', 'unique', 'valiant', 'wonderful', 'xenial',
  'abundant', 'brilliant', 'cosmic', 'dazzling', 'electric', 'fantastic', 'graceful', 'harmonic', 'inspiring', 'jaunty',
  'kinetic', 'lively', 'magnetic', 'nimble', 'optimistic', 'pristine', 'quantum', 'resilient', 'spectacular', 'tranquil',
  'ultimate', 'vivacious', 'wondrous', 'exotic', 'youthful', 'zestful', 'artful', 'bold', 'creative', 'dynamic',
  'efficient', 'fluid', 'genuine', 'honest', 'ideal', 'jubilant', 'keen', 'lovely', 'majestic', 'natural',
  'organic', 'perfect', 'quiet', 'refined', 'smooth', 'timeless', 'uplifting', 'vital', 'warm', 'excellent',
  'yearning', 'zonal', 'ancient', 'blessed', 'cheerful', 'delicate', 'endless', 'fresh', 'glorious', 'happy',
  'immense', 'joyous', 'keen', 'lasting', 'marvelous', 'noble', 'outstanding', 'precious', 'quiet', 'radiant',
  'stunning', 'timeless', 'upbeat', 'vibrant', 'wholesome', 'extraordinary', 'youthful', 'zealous', 'amazing', 'beautiful',
  'charming', 'delightful', 'energetic', 'fabulous', 'glowing', 'harmonious', 'incredible', 'joyful', 'kaleidoscopic', 'luminescent',
  'magnificent', 'nurturing', 'optimistic', 'passionate', 'quixotic', 'radiant', 'spirited', 'thriving', 'uplifting', 'vivid',
  'whimsical', 'exuberant', 'youthful', 'zestful', 'adventurous', 'blissful', 'curious', 'determined', 'enthusiastic', 'fearless'
]

const VERBS = [
  'achieve', 'build', 'create', 'discover', 'explore', 'flourish', 'grow', 'inspire', 'journey', 'kindle',
  'learn', 'master', 'navigate', 'overcome', 'pursue', 'question', 'rise', 'soar', 'thrive', 'unite',
  'venture', 'wander', 'excel', 'bloom', 'conquer', 'dream', 'evolve', 'forge', 'gleam', 'heal',
  'illuminate', 'jump', 'kindle', 'launch', 'manifest', 'nurture', 'observe', 'prosper', 'quest', 'radiate',
  'sparkle', 'transform', 'unleash', 'visualize', 'witness', 'expand', 'yield', 'zoom', 'ascend', 'balance',
  'celebrate', 'dance', 'embrace', 'flow', 'generate', 'harmonize', 'ignite', 'join', 'kindle', 'liberate',
  'motivate', 'nourish', 'optimize', 'pioneer', 'quicken', 'rejuvenate', 'strengthen', 'transcend', 'uplift', 'validate',
  'welcome', 'xerox', 'yearn', 'zap', 'amplify', 'boost', 'cultivate', 'develop', 'energize', 'focus',
  'guide', 'harness', 'innovate', 'jolt', 'kickstart', 'leverage', 'multiply', 'narrow', 'open', 'polish',
  'qualify', 'refine', 'streamline', 'target', 'upgrade', 'value', 'win', 'xerox', 'yell', 'zero',
  'accelerate', 'breakthrough', 'captivate', 'deliver', 'enhance', 'fuel', 'galvanize', 'heighten', 'implement', 'jump',
  'keep', 'lead', 'maximize', 'network', 'orchestrate', 'power', 'qualify', 'revolutionize', 'synchronize', 'turbocharge',
  'understand', 'venture', 'work', 'x-ray', 'yield', 'zero', 'activate', 'brighten', 'clarify', 'demonstrate',
  'educate', 'facilitate', 'grasp', 'handle', 'impact', 'justify', 'keep', 'locate', 'measure', 'obtain',
  'plan', 'quote', 'respond', 'support', 'track', 'update', 'verify', 'weigh', 'examine', 'yield'
]

// Additional specialized word lists for variety
const NATURE_WORDS = [
  'aurora', 'breeze', 'cascade', 'dewdrop', 'eclipse', 'frost', 'glacier', 'horizon', 'island', 'jungle',
  'lagoon', 'meadow', 'nectar', 'oasis', 'petal', 'quartz', 'ravine', 'stream', 'tundra', 'valley',
  'waterfall', 'zenith', 'bark', 'coral', 'dune', 'ember', 'fern', 'grove', 'heath', 'inlet'
]

const TECHNOLOGY_WORDS = [
  'algorithm', 'binary', 'circuit', 'database', 'ethernet', 'firewall', 'gigabyte', 'hardware', 'interface', 'javascript',
  'kernel', 'laptop', 'modem', 'network', 'operating', 'protocol', 'quantum', 'router', 'software', 'terminal',
  'upload', 'virtual', 'wireless', 'pixel', 'matrix', 'server', 'coding', 'digital', 'encrypt', 'fiber'
]

const COSMIC_WORDS = [
  'asteroid', 'blackhole', 'constellation', 'dimension', 'eclipse', 'fusion', 'galaxy', 'hydrogen', 'infinity', 'jupiter',
  'kinetic', 'lunar', 'meteor', 'nebula', 'orbit', 'pulsar', 'quasar', 'radiation', 'satellite', 'telescope',
  'universe', 'vacuum', 'wormhole', 'xenon', 'year', 'zodiac', 'comet', 'plasma', 'solar', 'cosmic'
]

const MYTHICAL_WORDS = [
  'atlantis', 'basilisk', 'centaur', 'dragon', 'elixir', 'fairy', 'griffin', 'hydra', 'immortal', 'jinn',
  'kraken', 'legend', 'minotaur', 'nymph', 'oracle', 'phoenix', 'quest', 'rune', 'sphinx', 'titan',
  'unicorn', 'valkyrie', 'wizard', 'xerus', 'yeti', 'zeus', 'amulet', 'banshee', 'chimera', 'deity'
]

// Character sets for different security levels
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
const SAFE_SYMBOLS = '!@#$%^&*'
const EXTENDED_SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

export const usePasswordGenerator = (): UsePasswordGeneratorReturn => {
  const [password, setPassword] = useState('')
  const [options, setOptions] = useState<PasswordOptions>({
    type: 'random',
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    customSymbols: DEFAULT_SYMBOLS,
    pinLength: 6,
    pinNoRepeats: false,
    pinNoSequence: false,
    pinExcludeDigits: '',
    memorableWordCount: 3,
    memorableSeparator: '-',
    memorableCapitalization: 'first',
    memorableIncludeNumbers: true,
    memorableNumberPosition: 'end',
    smartComplexity: 'medium',
    smartIncludeSpecialChars: true,
    smartWordOrder: 'random',
    randomMinUppercase: 1,
    randomMinLowercase: 1,
    randomMinNumbers: 1,
    randomMinSymbols: 1,
    randomNoAmbiguous: false,
  })

  // Secure random number generator
  const generateSecureRandom = useCallback((max: number): number => {
    const array = new Uint32Array(1)
    window.crypto.getRandomValues(array)
    return array[0] % max
  }, [])

  // Get random element from array
  const getRandomElement = useCallback((arr: string[]): string => {
    return arr[generateSecureRandom(arr.length)]
  }, [generateSecureRandom])

  // Enhanced character set builder
  const buildCharacterSet = useCallback((options: PasswordOptions): string => {
    let charset = ''
    
    if (options.includeLowercase) charset += LOWERCASE
    if (options.includeUppercase) charset += UPPERCASE
    if (options.includeNumbers) charset += NUMBERS
    if (options.includeSymbols) {
      charset += options.customSymbols || EXTENDED_SYMBOLS
    }
    
    if (options.excludeSimilar && charset) {
      charset = charset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('')
    }
    
    return charset
  }, [])

  // Enhanced random password generation with better distribution
  const generateRandomPassword = useCallback((options: PasswordOptions): string => {
    const charset = buildCharacterSet(options)
    if (!charset) return ''

    const minUppercase = options.randomMinUppercase || 0
    const minLowercase = options.randomMinLowercase || 0
    const minNumbers = options.randomMinNumbers || 0
    const minSymbols = options.randomMinSymbols || 0
    const noAmbiguous = options.randomNoAmbiguous || false
    
    let password = ''
    const requiredChars: string[] = []
    
    // Build character sets for minimum requirements
    let uppercaseChars = UPPERCASE
    let lowercaseChars = LOWERCASE
    let numberChars = NUMBERS
    let symbolChars = options.customSymbols || EXTENDED_SYMBOLS
    
    if (options.excludeSimilar || noAmbiguous) {
      const ambiguousChars = noAmbiguous ? 'il1Lo0O2Z5S8B' : SIMILAR_CHARS
      uppercaseChars = uppercaseChars.split('').filter(char => !ambiguousChars.includes(char)).join('')
      lowercaseChars = lowercaseChars.split('').filter(char => !ambiguousChars.includes(char)).join('')
      numberChars = numberChars.split('').filter(char => !ambiguousChars.includes(char)).join('')
      symbolChars = symbolChars.split('').filter(char => !ambiguousChars.includes(char)).join('')
    }
    
    // Add minimum required characters
    if (options.includeUppercase && minUppercase > 0) {
      for (let i = 0; i < Math.min(minUppercase, options.length); i++) {
        if (uppercaseChars.length > 0) {
          requiredChars.push(uppercaseChars[generateSecureRandom(uppercaseChars.length)])
        }
      }
    } else if (options.includeUppercase) {
      requiredChars.push(getRandomElement([...uppercaseChars]))
    }
    
    if (options.includeLowercase && minLowercase > 0) {
      for (let i = 0; i < Math.min(minLowercase, options.length); i++) {
        if (lowercaseChars.length > 0) {
          requiredChars.push(lowercaseChars[generateSecureRandom(lowercaseChars.length)])
        }
      }
    } else if (options.includeLowercase) {
      requiredChars.push(getRandomElement([...lowercaseChars]))
    }
    
    if (options.includeNumbers && minNumbers > 0) {
      for (let i = 0; i < Math.min(minNumbers, options.length); i++) {
        if (numberChars.length > 0) {
          requiredChars.push(numberChars[generateSecureRandom(numberChars.length)])
        }
      }
    } else if (options.includeNumbers) {
      requiredChars.push(getRandomElement([...numberChars]))
    }
    
    if (options.includeSymbols && minSymbols > 0) {
      for (let i = 0; i < Math.min(minSymbols, options.length); i++) {
        if (symbolChars.length > 0) {
          requiredChars.push(symbolChars[generateSecureRandom(symbolChars.length)])
        }
      }
    } else if (options.includeSymbols) {
      requiredChars.push(getRandomElement([...symbolChars]))
    }

    // Fill remaining length with random characters
    const remainingLength = Math.max(0, options.length - requiredChars.length)
    for (let i = 0; i < remainingLength; i++) {
      password += charset[generateSecureRandom(charset.length)]
    }

    // Add required characters and shuffle
    const allChars = [...password, ...requiredChars]
    
    // Fisher-Yates shuffle using secure random
    for (let i = allChars.length - 1; i > 0; i--) {
      const j = generateSecureRandom(i + 1)
      ;[allChars[i], allChars[j]] = [allChars[j], allChars[i]]
    }

    return allChars.slice(0, options.length).join('')
  }, [buildCharacterSet, getRandomElement, generateSecureRandom])

  // Enhanced smart password generation
  const generateSmartPassword = useCallback((options: PasswordOptions): string => {
    const complexity = options.smartComplexity || 'medium'
    const includeSpecialChars = options.smartIncludeSpecialChars !== false
    const wordOrder = options.smartWordOrder || 'random'
    
    // Enhanced word selection from expanded categories
    const allAdjectives = [...ADJECTIVES, ...NATURE_WORDS.filter(() => Math.random() < 0.3)]
    const allNouns = [...NOUNS, ...TECHNOLOGY_WORDS, ...COSMIC_WORDS, ...MYTHICAL_WORDS]
    const allVerbs = [...VERBS, ...NATURE_WORDS.filter(() => Math.random() < 0.2)]
    
    const adjective = getRandomElement(allAdjectives)
    const noun = getRandomElement(allNouns)
    const verb = getRandomElement(allVerbs)
    
    // Capitalize first letter of each word
    const capitalizedAdjective = adjective.charAt(0).toUpperCase() + adjective.slice(1)
    const capitalizedNoun = noun.charAt(0).toUpperCase() + noun.slice(1)
    const capitalizedVerb = verb.charAt(0).toUpperCase() + verb.slice(1)
    
    let basePattern = ''
    
    // Determine word order
    switch (wordOrder) {
      case 'adjective-noun':
        basePattern = `${capitalizedAdjective}${capitalizedNoun}`
        break
      case 'verb-noun':
        basePattern = `${capitalizedVerb}${capitalizedNoun}`
        break
      case 'random':
      default: {
        const patterns = [
          `${capitalizedAdjective}${capitalizedNoun}`,
          `${capitalizedVerb}${capitalizedNoun}`,
          `${capitalizedAdjective}${capitalizedVerb}`,
          `${capitalizedNoun}${capitalizedAdjective}`,
        ]
        basePattern = getRandomElement(patterns)
        break
      }
    }
    
    // Add complexity based on setting
    let number: string
    let symbols = ''
    
    switch (complexity) {
      case 'simple':
        number = generateSecureRandom(100).toString().padStart(2, '0')
        symbols = includeSpecialChars ? SAFE_SYMBOLS[generateSecureRandom(SAFE_SYMBOLS.length)] : ''
        break
      case 'complex':
        number = generateSecureRandom(10000).toString().padStart(4, '0')
        if (includeSpecialChars) {
          const symbolCount = 2 + generateSecureRandom(2) // 2-3 symbols
          for (let i = 0; i < symbolCount; i++) {
            symbols += SAFE_SYMBOLS[generateSecureRandom(SAFE_SYMBOLS.length)]
          }
        }
        break
      case 'medium':
      default:
        number = generateSecureRandom(1000).toString().padStart(3, '0')
        symbols = includeSpecialChars ? SAFE_SYMBOLS[generateSecureRandom(SAFE_SYMBOLS.length)] : ''
    }
    
    // Arrange final pattern
    const arrangements = [
      `${basePattern}${number}${symbols}`,
      `${symbols}${basePattern}${number}`,
      `${number}${basePattern}${symbols}`,
      `${basePattern}${symbols}${number}`,
    ]
    
    return getRandomElement(arrangements)
  }, [getRandomElement, generateSecureRandom])

  // Enhanced memorable password generation
  const generateMemorablePassword = useCallback((options: PasswordOptions): string => {
    const wordCount = options.memorableWordCount || 3
    const separator = options.memorableSeparator || '-'
    const capitalization = options.memorableCapitalization || 'first'
    const includeNumbers = options.memorableIncludeNumbers !== false
    const numberPosition = options.memorableNumberPosition || 'end'
    
    const selectedWords: string[] = []
    
    // Create expanded word pool from all categories
    const allWords = [
      ...NOUNS, 
      ...ADJECTIVES, 
      ...VERBS, 
      ...NATURE_WORDS, 
      ...TECHNOLOGY_WORDS, 
      ...COSMIC_WORDS, 
      ...MYTHICAL_WORDS
    ]
    
    // Select words ensuring variety from different categories
    const wordCategories = [
      NOUNS, ADJECTIVES, VERBS, NATURE_WORDS, 
      TECHNOLOGY_WORDS, COSMIC_WORDS, MYTHICAL_WORDS
    ]
    
    for (let i = 0; i < wordCount; i++) {
      // For variety, try to pick from different categories when possible
      if (i < wordCategories.length && generateSecureRandom(3) === 0) {
        // Occasionally pick from a specific category for thematic coherence
        const categoryIndex = generateSecureRandom(wordCategories.length)
        selectedWords.push(getRandomElement(wordCategories[categoryIndex]))
      } else {
        // Usually pick from the combined pool for maximum variety
        selectedWords.push(getRandomElement(allWords))
      }
    }
    
    // Apply capitalization
    const processedWords = selectedWords.map((word, index) => {
      switch (capitalization) {
        case 'none':
          return word
        case 'first':
          return index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
        case 'all':
          return word.charAt(0).toUpperCase() + word.slice(1)
        case 'random':
          return generateSecureRandom(2) === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
        default:
          return word
      }
    })
    
    let memorablePassword = processedWords.join(separator)
    
    // Add numbers based on position preference
    if (includeNumbers) {
      const number = generateSecureRandom(100).toString().padStart(2, '0')
      
      switch (numberPosition) {
        case 'end':
          memorablePassword += separator + number
          break
        case 'between': {
          const insertIndex = generateSecureRandom(processedWords.length - 1) + 1
          const parts = memorablePassword.split(separator)
          parts.splice(insertIndex, 0, number)
          memorablePassword = parts.join(separator)
          break
        }
        case 'random':
          if (generateSecureRandom(2) === 0) {
            memorablePassword = number + separator + memorablePassword
          } else {
            memorablePassword += separator + number
          }
          break
      }
    }
    
    return memorablePassword
  }, [getRandomElement, generateSecureRandom])

  // Enhanced PIN generation
  const generatePin = useCallback((options: PasswordOptions): string => {
    const length = options.pinLength || 6
    const excludeDigits = options.pinExcludeDigits || ''
    const noRepeats = options.pinNoRepeats || false
    const noSequence = options.pinNoSequence || false
    
    let availableDigits = '0123456789'
    
    // Remove excluded digits
    if (excludeDigits) {
      availableDigits = availableDigits.split('').filter(digit => !excludeDigits.includes(digit)).join('')
    }
    
    if (availableDigits.length === 0) {
      availableDigits = '0123456789' // Fallback if all digits excluded
    }
    
    let pin = ''
    let attempts = 0
    const maxAttempts = 50
    
    do {
      pin = ''
      const usedDigits = new Set<string>()
      
      for (let i = 0; i < length; i++) {
        let digit: string
        let digitAttempts = 0
        
        do {
          digit = availableDigits[generateSecureRandom(availableDigits.length)]
          digitAttempts++
        } while (
          digitAttempts < 20 && 
          noRepeats && 
          usedDigits.has(digit) && 
          usedDigits.size < availableDigits.length
        )
        
        pin += digit
        if (noRepeats) usedDigits.add(digit)
      }
      
      attempts++
    } while (
      attempts < maxAttempts && (
        (noRepeats && /(\d)\1{1,}/.test(pin)) ||
        (noSequence && (
          /0123|1234|2345|3456|4567|5678|6789|9876|8765|7654|6543|5432|4321|3210/.test(pin) ||
          /(\d)(\d)(\d)/.test(pin) && 
          pin.split('').some((digit, i, arr) => 
            i >= 2 && 
            parseInt(arr[i-2]) + 1 === parseInt(arr[i-1]) && 
            parseInt(arr[i-1]) + 1 === parseInt(digit)
          )
        ))
      )
    )
    
    return pin
  }, [generateSecureRandom])

  // Enhanced password strength calculation
  const calculatePasswordStrength = useCallback((password: string, type: PasswordType): number => {
    if (!password) return 0
    
    let score = 0
    const length = password.length
    
    // Base score from length (different scales for different types)
    switch (type) {
      case 'pin':
        score = Math.min(length * 8, 40) // PINs max out at 40 for length
        break
      case 'memorable':
        score = Math.min(length * 3, 60) // Memorable passwords get moderate base score
        break
      case 'smart':
        score = Math.min(length * 4, 70) // Smart passwords get good base score
        break
      case 'random':
        score = Math.min(length * 5, 80) // Random passwords get highest base score
        break
    }
    
    // Character variety bonuses
    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSymbols = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)
    
    const charTypes = [hasLowercase, hasUppercase, hasNumbers, hasSymbols].filter(Boolean).length
    score += charTypes * 5
    
    // Length bonuses
    if (length >= 12) score += 10
    if (length >= 16) score += 10
    if (length >= 20) score += 5
    
    // Pattern penalties
    if (/(.)\1{2,}/.test(password)) score -= 10 // Repeated characters
    if (/123|abc|qwe/i.test(password)) score -= 5 // Common sequences
    
    // Type-specific adjustments
    switch (type) {
      case 'smart':
        // Smart passwords get bonus for word patterns
        if (/[A-Z][a-z]+[A-Z][a-z]+\d+[!@#$%^&*]/.test(password)) score += 15
        break
      case 'memorable':
        // Memorable passwords get bonus for word separation
        if (password.includes('-') || password.includes('_')) score += 10
        break
      case 'pin':
        // PINs get penalized for simple patterns
        if (/(\d)\1{2,}/.test(password)) score -= 15
        if (/0123|1234|2345|3456|4567|5678|6789/.test(password)) score -= 20
        break
    }
    
    return Math.max(0, Math.min(100, score))
  }, [])

  const updateOptions = useCallback((newOptions: Partial<PasswordOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }))
  }, [])

  const generatePassword = useCallback(() => {
    let newPassword = ''
    
    switch (options.type) {
      case 'random':
        newPassword = generateRandomPassword(options)
        break
      case 'smart':
        newPassword = generateSmartPassword(options)
        break
      case 'memorable':
        newPassword = generateMemorablePassword(options)
        break
      case 'pin':
        newPassword = generatePin(options)
        break
      default:
        newPassword = generateRandomPassword(options)
    }
    
    setPassword(newPassword)
  }, [options, generateRandomPassword, generateSmartPassword, generateMemorablePassword, generatePin])

  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    if (!password) return false
    
    try {
      await navigator.clipboard.writeText(password)
      return true
    } catch (error) {
      console.error('Failed to copy password:', error)
      return false
    }
  }, [password])

  const getPasswordStrength = useCallback((): number => {
    return calculatePasswordStrength(password, options.type)
  }, [password, options.type, calculatePasswordStrength])

  return {
    password,
    options,
    updateOptions,
    generatePassword,
    copyToClipboard,
    getPasswordStrength,
  }
}
