import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { PasswordStrengthMeter } from '@/components/ui/password-strength-meter'
import { usePasswordGenerator } from '@/hooks/usePasswordGenerator'
import { RefreshCw, Copy, Check, Shield, Lock, Eye, EyeOff, Key, Brain, Hash, Zap } from 'lucide-react'

export const PasswordGenerator = () => {
  const {
    password,
    options,
    updateOptions,
    generatePassword,
    copyToClipboard,
    getPasswordStrength
  } = usePasswordGenerator()
  
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Generate initial password
  useEffect(() => {
    try {
      generatePassword()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }, [generatePassword])

  const handleGeneratePassword = () => {
    try {
      setError(null)
      generatePassword()
      setCopied(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleCopyPassword = async () => {
    const success = await copyToClipboard()
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLengthChange = (value: number[]) => {
    updateOptions({ length: value[0] })
  }

  const handleCustomSymbolsChange = (value: string) => {
    updateOptions({ customSymbols: value })
  }

  const strengthScore = getPasswordStrength()

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Secure Password Generator</h1>
          </div>
          <p className="text-muted-foreground">
            Generate cryptographically secure passwords entirely in your browser
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>100% Client-Side • No Data Transmission • Privacy First</span>
          </div>
        </div>

        {/* Password Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Generated Password
              {password && <PasswordStrengthMeter strength={strengthScore} />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    readOnly
                    className="font-mono text-lg pr-10"
                    placeholder="Generated password will appear here"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  onClick={handleCopyPassword}
                  disabled={!password}
                  variant="outline"
                  size="icon"
                  aria-label="Copy password to clipboard"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={handleGeneratePassword}
                  size="icon"
                  aria-label="Generate new password"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              {copied && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Password copied to clipboard!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Password Options */}
        <Card>
          <CardHeader>
            <CardTitle>Password Options</CardTitle>
            <CardDescription>
              Customize your password requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Password Type Selection */}
            <div className="space-y-4">
              <Label>Password Type</Label>
              <RadioGroup
                value={options.type}
                onValueChange={(value) => updateOptions({ type: value as 'random' | 'smart' | 'memorable' | 'pin' })}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent">
                  <RadioGroupItem value="random" id="random" />
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <div>
                      <Label htmlFor="random" className="text-sm font-medium cursor-pointer">
                        Random
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Fully random characters
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent">
                  <RadioGroupItem value="smart" id="smart" />
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-green-500" />
                    <div>
                      <Label htmlFor="smart" className="text-sm font-medium cursor-pointer">
                        Smart
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Pattern-based secure
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent">
                  <RadioGroupItem value="memorable" id="memorable" />
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4 text-purple-500" />
                    <div>
                      <Label htmlFor="memorable" className="text-sm font-medium cursor-pointer">
                        Memorable
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Easy to remember words
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent">
                  <RadioGroupItem value="pin" id="pin" />
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-orange-500" />
                    <div>
                      <Label htmlFor="pin" className="text-sm font-medium cursor-pointer">
                        PIN
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Numbers only
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Type-specific options */}
            {options.type === 'pin' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>PIN Length</Label>
                    <span className="text-sm font-medium">{options.pinLength} digits</span>
                  </div>
                  <Slider
                    value={[options.pinLength || 6]}
                    onValueChange={(value) => updateOptions({ pinLength: value[0] })}
                    max={12}
                    min={4}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>4</span>
                    <span>12</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pinNoRepeats"
                    checked={options.pinNoRepeats || false}
                    onCheckedChange={(checked) => updateOptions({ pinNoRepeats: !!checked })}
                  />
                  <Label htmlFor="pinNoRepeats" className="text-sm">
                    Avoid repeated digits (e.g., no 1111, 2222)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pinNoSequence"
                    checked={options.pinNoSequence || false}
                    onCheckedChange={(checked) => updateOptions({ pinNoSequence: !!checked })}
                  />
                  <Label htmlFor="pinNoSequence" className="text-sm">
                    Avoid sequences (e.g., no 1234, 4321)
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pinExcludeDigits" className="text-sm">
                    Exclude specific digits
                  </Label>
                  <Input
                    id="pinExcludeDigits"
                    value={options.pinExcludeDigits || ''}
                    onChange={(e) => updateOptions({ pinExcludeDigits: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="e.g., 013"
                    className="w-32 font-mono"
                    maxLength={10}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter digits to exclude (0-9)
                  </p>
                </div>
              </div>
            )}

            {options.type === 'memorable' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Number of Words</Label>
                    <span className="text-sm font-medium">{options.memorableWordCount} words</span>
                  </div>
                  <Slider
                    value={[options.memorableWordCount || 3]}
                    onValueChange={(value) => updateOptions({ memorableWordCount: value[0] })}
                    max={6}
                    min={2}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>2</span>
                    <span>6</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="separator">Word Separator</Label>
                  <Input
                    id="separator"
                    value={options.memorableSeparator || '-'}
                    onChange={(e) => updateOptions({ memorableSeparator: e.target.value })}
                    placeholder="-"
                    className="w-20"
                    maxLength={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Capitalization Style</Label>
                  <RadioGroup
                    value={options.memorableCapitalization || 'first'}
                    onValueChange={(value) => updateOptions({ memorableCapitalization: value as 'none' | 'first' | 'all' | 'random' })}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="cap-none" />
                      <Label htmlFor="cap-none" className="text-sm">lowercase only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="first" id="cap-first" />
                      <Label htmlFor="cap-first" className="text-sm">First word only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="cap-all" />
                      <Label htmlFor="cap-all" className="text-sm">All words</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="random" id="cap-random" />
                      <Label htmlFor="cap-random" className="text-sm">Random</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="memorableNumbers"
                    checked={options.memorableIncludeNumbers !== false}
                    onCheckedChange={(checked) => updateOptions({ memorableIncludeNumbers: !!checked })}
                  />
                  <Label htmlFor="memorableNumbers" className="text-sm">
                    Include numbers for extra security
                  </Label>
                </div>

                {options.memorableIncludeNumbers !== false && (
                  <div className="space-y-3">
                    <Label>Number Placement</Label>
                    <RadioGroup
                      value={options.memorableNumberPosition || 'end'}
                      onValueChange={(value) => updateOptions({ memorableNumberPosition: value as 'end' | 'between' | 'random' })}
                      className="grid grid-cols-1 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="end" id="num-end" />
                        <Label htmlFor="num-end" className="text-sm">At the end</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="between" id="num-between" />
                        <Label htmlFor="num-between" className="text-sm">Between words</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="random" id="num-random" />
                        <Label htmlFor="num-random" className="text-sm">Random position</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            )}

            {options.type === 'smart' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Complexity Level</Label>
                  <RadioGroup
                    value={options.smartComplexity || 'medium'}
                    onValueChange={(value) => updateOptions({ smartComplexity: value as 'simple' | 'medium' | 'complex' })}
                    className="grid grid-cols-1 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="simple" id="complex-simple" />
                      <Label htmlFor="complex-simple" className="text-sm">Simple (2 numbers, 1 symbol)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="complex-medium" />
                      <Label htmlFor="complex-medium" className="text-sm">Medium (3 numbers, 1 symbol)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="complex" id="complex-complex" />
                      <Label htmlFor="complex-complex" className="text-sm">Complex (4 numbers, 2-3 symbols)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Word Pattern</Label>
                  <RadioGroup
                    value={options.smartWordOrder || 'random'}
                    onValueChange={(value) => updateOptions({ smartWordOrder: value as 'adjective-noun' | 'verb-noun' | 'random' })}
                    className="grid grid-cols-1 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="adjective-noun" id="order-adj-noun" />
                      <Label htmlFor="order-adj-noun" className="text-sm">Adjective + Noun (e.g., BrightCastle)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="verb-noun" id="order-verb-noun" />
                      <Label htmlFor="order-verb-noun" className="text-sm">Verb + Noun (e.g., CreateCastle)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="random" id="order-random" />
                      <Label htmlFor="order-random" className="text-sm">Random pattern</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smartSpecialChars"
                    checked={options.smartIncludeSpecialChars !== false}
                    onCheckedChange={(checked) => updateOptions({ smartIncludeSpecialChars: !!checked })}
                  />
                  <Label htmlFor="smartSpecialChars" className="text-sm">
                    Include special characters
                  </Label>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Smart passwords</strong> combine memorable words with numbers and symbols 
                    in predictable patterns, making them both secure and easier to type than random passwords.
                  </p>
                </div>
              </div>
            )}

            {/* Length Slider - Only show for random type */}
            {options.type === 'random' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Password Length</Label>
                  <span className="text-sm font-medium">{options.length} characters</span>
                </div>
                <Slider
                  value={[options.length]}
                  onValueChange={handleLengthChange}
                  max={128}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>128</span>
                </div>
              </div>
            )}

            {/* Character Type Options - Only show for random type */}
            {options.type === 'random' && (
              <div className="space-y-4">
                <Label>Include Character Types</Label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase"
                      checked={options.includeUppercase}
                      onCheckedChange={(checked) => 
                        updateOptions({ includeUppercase: !!checked })
                      }
                    />
                    <Label htmlFor="uppercase" className="text-sm">
                      Uppercase Letters (A-Z)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowercase"
                      checked={options.includeLowercase}
                      onCheckedChange={(checked) => 
                        updateOptions({ includeLowercase: !!checked })
                      }
                    />
                    <Label htmlFor="lowercase" className="text-sm">
                      Lowercase Letters (a-z)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="numbers"
                      checked={options.includeNumbers}
                      onCheckedChange={(checked) => 
                        updateOptions({ includeNumbers: !!checked })
                      }
                    />
                    <Label htmlFor="numbers" className="text-sm">
                      Numbers (0-9)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symbols"
                      checked={options.includeSymbols}
                      onCheckedChange={(checked) => 
                        updateOptions({ includeSymbols: !!checked })
                      }
                    />
                    <Label htmlFor="symbols" className="text-sm">
                      Symbols (!@#$%...)
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Options - Only show for random type */}
            {options.type === 'random' && (
              <div className="space-y-4">
                <Label>Advanced Options</Label>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="excludeSimilar"
                      checked={options.excludeSimilar}
                      onCheckedChange={(checked) => 
                        updateOptions({ excludeSimilar: !!checked })
                      }
                    />
                    <Label htmlFor="excludeSimilar" className="text-sm">
                      Exclude similar characters (i, l, 1, L, o, 0, O)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noAmbiguous"
                      checked={options.randomNoAmbiguous || false}
                      onCheckedChange={(checked) => 
                        updateOptions({ randomNoAmbiguous: !!checked })
                      }
                    />
                    <Label htmlFor="noAmbiguous" className="text-sm">
                      Exclude ambiguous characters (i, l, 1, L, o, 0, O, 2, Z, 5, S, 8, B)
                    </Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Minimum Character Requirements</Label>
                  
                  {options.includeUppercase && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="minUppercase" className="text-sm">Minimum Uppercase</Label>
                        <span className="text-sm font-medium">{options.randomMinUppercase || 1}</span>
                      </div>
                      <Slider
                        value={[options.randomMinUppercase || 1]}
                        onValueChange={(value) => updateOptions({ randomMinUppercase: value[0] })}
                        max={Math.min(10, Math.floor(options.length / 2))}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  )}

                  {options.includeLowercase && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="minLowercase" className="text-sm">Minimum Lowercase</Label>
                        <span className="text-sm font-medium">{options.randomMinLowercase || 1}</span>
                      </div>
                      <Slider
                        value={[options.randomMinLowercase || 1]}
                        onValueChange={(value) => updateOptions({ randomMinLowercase: value[0] })}
                        max={Math.min(10, Math.floor(options.length / 2))}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  )}

                  {options.includeNumbers && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="minNumbers" className="text-sm">Minimum Numbers</Label>
                        <span className="text-sm font-medium">{options.randomMinNumbers || 1}</span>
                      </div>
                      <Slider
                        value={[options.randomMinNumbers || 1]}
                        onValueChange={(value) => updateOptions({ randomMinNumbers: value[0] })}
                        max={Math.min(10, Math.floor(options.length / 2))}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  )}

                  {options.includeSymbols && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="minSymbols" className="text-sm">Minimum Symbols</Label>
                        <span className="text-sm font-medium">{options.randomMinSymbols || 1}</span>
                      </div>
                      <Slider
                        value={[options.randomMinSymbols || 1]}
                        onValueChange={(value) => updateOptions({ randomMinSymbols: value[0] })}
                        max={Math.min(10, Math.floor(options.length / 2))}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>

                {options.includeSymbols && (
                  <div className="space-y-2">
                    <Label htmlFor="customSymbols" className="text-sm">
                      Custom Symbol Set
                    </Label>
                    <Input
                      id="customSymbols"
                      value={options.customSymbols || ''}
                      onChange={(e) => handleCustomSymbolsChange(e.target.value)}
                      placeholder="!@#$%^&*()_+-=[]{}|;:,.<>?"
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the symbols you want to include in your password
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h3 className="font-medium text-green-800 dark:text-green-300">
                  Privacy & Security Notice
                </h3>
                <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                  <li>• Passwords are generated using cryptographically secure randomness</li>
                  <li>• All generation happens locally in your browser</li>
                  <li>• No passwords are stored, transmitted, or logged</li>
                  <li>• This tool works completely offline</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
