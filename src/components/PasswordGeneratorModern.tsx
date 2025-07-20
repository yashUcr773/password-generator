import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { PasswordStrengthMeter } from '@/components/ui/password-strength-meter'
import { usePasswordGenerator } from '@/hooks/usePasswordGenerator'
import { 
  RefreshCw, 
  Copy, 
  Check, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Key, 
  Brain, 
  Hash, 
  Zap,
  Settings,
  Sparkles,
  TrendingUp,
  Palette,
  Globe
} from 'lucide-react'

type PasswordType = 'random' | 'smart' | 'memorable' | 'pin'

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

  const strengthScore = getPasswordStrength()

  // Password type configurations for better organization
  const passwordTypes = [
    {
      id: 'random' as const,
      name: 'Random',
      description: 'Cryptographically secure random characters',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200',
      recommended: true
    },
    {
      id: 'smart' as const,
      name: 'Smart',
      description: 'Balanced security with readable patterns',
      icon: Brain,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
      recommended: false
    },
    {
      id: 'memorable' as const,
      name: 'Memorable',
      description: 'Easy to remember word combinations',
      icon: Key,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-200',
      recommended: false
    },
    {
      id: 'pin' as const,
      name: 'PIN',
      description: 'Numeric codes for quick access',
      icon: Hash,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-200',
      recommended: false
    }
  ]

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return 'text-red-500'
    if (strength <= 3) return 'text-yellow-500'
    if (strength <= 4) return 'text-blue-500'
    return 'text-green-500'
  }

  const getStrengthLabel = (strength: number) => {
    if (strength <= 2) return 'Weak'
    if (strength <= 3) return 'Fair'
    if (strength <= 4) return 'Good'
    return 'Strong'
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-5xl mx-auto space-y-8 py-8">
          {/* Modern Header with Light Gradient */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-lg opacity-60"></div>
                <div className="relative p-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-lg">
                  <Shield className="h-10 w-10" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  SecureGen
                </h1>
                <p className="text-xl text-slate-600 mt-1">
                  Advanced Password Generator
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto">
              <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
                <Lock className="h-4 w-4" />
                100% Client-Side
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 border-green-200">
                <Shield className="h-4 w-4" />
                Zero Logging
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 border-purple-200">
                <Sparkles className="h-4 w-4" />
                Privacy First
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 border-orange-200">
                <TrendingUp className="h-4 w-4" />
                Military Grade
              </Badge>
            </div>

            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Generate cryptographically secure passwords with advanced customization options. 
              All generation happens locally in your browser—no data ever leaves your device.
            </p>
          </div>

          {/* Enhanced Password Display */}
          <Card className="border-2 shadow-lg bg-white/90 backdrop-blur-sm border-blue-200">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Key className="h-5 w-5 text-blue-600" />
                  </div>
                  Generated Password
                </CardTitle>
                {password && (
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={`${getStrengthColor(strengthScore)} border-current`}
                    >
                      {getStrengthLabel(strengthScore)}
                    </Badge>
                    <PasswordStrengthMeter strength={strengthScore} />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    readOnly
                    className="font-mono text-xl h-16 pr-40 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 focus:border-blue-400 transition-all duration-200 text-slate-800"
                    placeholder="Your secure password will appear here..."
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="h-10 w-10 p-0 hover:bg-blue-100 text-slate-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {showPassword ? 'Hide password' : 'Show password'}
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyPassword}
                          disabled={!password}
                          className="h-10 w-10 p-0 hover:bg-blue-100 text-slate-600"
                        >
                          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Copy to clipboard
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          onClick={handleGeneratePassword}
                          className="h-10 px-4 bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Generate new password
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                
                {copied && (
                  <div className="flex items-center gap-2 text-green-600 animate-in fade-in duration-200">
                    <Check className="h-4 w-4" />
                    <span className="font-medium">Password copied to clipboard!</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Modern Tabbed Configuration */}
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Settings className="h-5 w-5 text-blue-600" />
                </div>
                Password Configuration
              </CardTitle>
              <CardDescription className="text-base text-slate-600">
                Choose your password type and customize the generation settings for optimal security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={options.type} onValueChange={(value) => updateOptions({ type: value as PasswordType })}>
                <TabsList className="grid w-full grid-cols-4 h-auto p-2 bg-blue-50">
                  {passwordTypes.map((type) => {
                    const isSelected = options.type === type.id
                    return (
                      <TabsTrigger 
                        key={type.id} 
                        value={type.id}
                        className={`flex flex-col items-center gap-3 h-20 p-4 relative transition-all duration-200
                          ${isSelected ? 'bg-white shadow-lg border border-blue-200' : 'hover:bg-white/70'}
                        `}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? type.bgColor : 'bg-slate-100'}`}>
                          <type.icon className={`h-5 w-5 ${isSelected ? type.color : 'text-slate-500'}`} />
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-sm text-slate-700">{type.name}</div>
                          {type.recommended && (
                            <Badge variant="outline" className="text-xs h-5 px-2 mt-1 border-blue-300 text-blue-600 bg-blue-50">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        {isSelected && (
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                        )}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>

                {/* Password Type Descriptions */}
                <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                  {passwordTypes.map((type) => 
                    options.type === type.id && (
                      <div key={type.id} className="flex items-center gap-3">
                        <type.icon className={`h-5 w-5 ${type.color}`} />
                        <p className="text-sm text-slate-600">{type.description}</p>
                      </div>
                    )
                  )}
                </div>

                {/* Type-Specific Configuration Panels */}
                <TabsContent value="pin" className="mt-8 space-y-6">
                  <Card className="border-orange-200 bg-orange-50/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                        <Hash className="h-5 w-5 text-orange-600" />
                        PIN Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label className="text-base font-medium text-slate-700">PIN Length</Label>
                          <Badge variant="outline" className="font-mono bg-white border-orange-200 text-orange-700">
                            {options.pinLength || 6} digits
                          </Badge>
                        </div>
                        <Slider
                          value={[options.pinLength || 6]}
                          onValueChange={(value) => updateOptions({ pinLength: value[0] })}
                          max={12}
                          min={4}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-slate-500">
                          <span>4 digits</span>
                          <span>12 digits</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 border border-orange-200 bg-white rounded-lg">
                          <Checkbox
                            id="pinNoRepeats"
                            checked={options.pinNoRepeats || false}
                            onCheckedChange={(checked) => updateOptions({ pinNoRepeats: !!checked })}
                          />
                          <div>
                            <Label htmlFor="pinNoRepeats" className="text-sm font-medium cursor-pointer text-slate-700">
                              No Repeated Digits
                            </Label>
                            <p className="text-xs text-slate-500">
                              Prevent consecutive identical numbers
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 border border-orange-200 bg-white rounded-lg">
                          <Checkbox
                            id="pinNoSequence"
                            checked={options.pinNoSequence || false}
                            onCheckedChange={(checked) => updateOptions({ pinNoSequence: !!checked })}
                          />
                          <div>
                            <Label htmlFor="pinNoSequence" className="text-sm font-medium cursor-pointer text-slate-700">
                              No Sequential Numbers
                            </Label>
                            <p className="text-xs text-slate-500">
                              Avoid patterns like 1234 or 4321
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="random" className="mt-8 space-y-6">
                  <Card className="border-blue-200 bg-blue-50/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                        <Zap className="h-5 w-5 text-blue-600" />
                        Random Password Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label className="text-base font-medium text-slate-700">Password Length</Label>
                          <Badge variant="outline" className="font-mono bg-white border-blue-200 text-blue-700">
                            {options.length || 12} characters
                          </Badge>
                        </div>
                        <Slider
                          value={[options.length || 12]}
                          onValueChange={(value) => updateOptions({ length: value[0] })}
                          max={128}
                          min={4}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-slate-500">
                          <span>4 chars</span>
                          <span>128 chars</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 border border-blue-200 bg-white rounded-lg">
                          <Checkbox
                            id="includeUppercase"
                            checked={options.includeUppercase !== false}
                            onCheckedChange={(checked) => updateOptions({ includeUppercase: !!checked })}
                          />
                          <div>
                            <Label htmlFor="includeUppercase" className="text-sm font-medium cursor-pointer text-slate-700">
                              Uppercase Letters
                            </Label>
                            <p className="text-xs text-slate-500 font-mono">
                              A-Z
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 border border-blue-200 bg-white rounded-lg">
                          <Checkbox
                            id="includeLowercase"
                            checked={options.includeLowercase !== false}
                            onCheckedChange={(checked) => updateOptions({ includeLowercase: !!checked })}
                          />
                          <div>
                            <Label htmlFor="includeLowercase" className="text-sm font-medium cursor-pointer text-slate-700">
                              Lowercase Letters
                            </Label>
                            <p className="text-xs text-slate-500 font-mono">
                              a-z
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 border border-blue-200 bg-white rounded-lg">
                          <Checkbox
                            id="includeNumbers"
                            checked={options.includeNumbers !== false}
                            onCheckedChange={(checked) => updateOptions({ includeNumbers: !!checked })}
                          />
                          <div>
                            <Label htmlFor="includeNumbers" className="text-sm font-medium cursor-pointer text-slate-700">
                              Numbers
                            </Label>
                            <p className="text-xs text-slate-500 font-mono">
                              0-9
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 border border-blue-200 bg-white rounded-lg">
                          <Checkbox
                            id="includeSymbols"
                            checked={options.includeSymbols || false}
                            onCheckedChange={(checked) => updateOptions({ includeSymbols: !!checked })}
                          />
                          <div>
                            <Label htmlFor="includeSymbols" className="text-sm font-medium cursor-pointer text-slate-700">
                              Symbols
                            </Label>
                            <p className="text-xs text-slate-500 font-mono">
                              !@#$%^&*
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 border border-blue-200 bg-white rounded-lg">
                          <Checkbox
                            id="excludeSimilar"
                            checked={options.excludeSimilar || false}
                            onCheckedChange={(checked) => updateOptions({ excludeSimilar: !!checked })}
                          />
                          <div>
                            <Label htmlFor="excludeSimilar" className="text-sm font-medium cursor-pointer text-slate-700">
                              Exclude Similar
                            </Label>
                            <p className="text-xs text-slate-500">
                              Avoid i, l, 1, O, 0
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 border border-blue-200 bg-white rounded-lg">
                          <Checkbox
                            id="excludeAmbiguous"
                            checked={options.excludeAmbiguous || false}
                            onCheckedChange={(checked) => updateOptions({ excludeAmbiguous: !!checked })}
                          />
                          <div>
                            <Label htmlFor="excludeAmbiguous" className="text-sm font-medium cursor-pointer text-slate-700">
                              Exclude Ambiguous
                            </Label>
                            <p className="text-xs text-slate-500">
                              Avoid { } [ ] ( ) / \ ' " `
                            </p>
                          </div>
                        </div>
                      </div>

                      {options.includeSymbols && (
                        <div className="space-y-3">
                          <Label htmlFor="customSymbols" className="text-base font-medium text-slate-700">
                            Custom Symbols (Optional)
                          </Label>
                          <Input
                            id="customSymbols"
                            type="text"
                            value={options.customSymbols || ''}
                            onChange={(e) => updateOptions({ customSymbols: e.target.value })}
                            placeholder="Enter custom symbols..."
                            className="font-mono bg-white border-blue-200 text-slate-800"
                          />
                          <p className="text-xs text-slate-500">
                            Leave empty to use default symbols, or specify your own
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="memorable" className="mt-8 space-y-6">
                  <Card className="border-purple-200 bg-purple-50/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                        <Key className="h-5 w-5 text-purple-600" />
                        Memorable Password Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label className="text-base font-medium text-slate-700">Number of Words</Label>
                          <Badge variant="outline" className="font-mono bg-white border-purple-200 text-purple-700">
                            {options.memorableWordCount || 3} words
                          </Badge>
                        </div>
                        <Slider
                          value={[options.memorableWordCount || 3]}
                          onValueChange={(value) => updateOptions({ memorableWordCount: value[0] })}
                          max={6}
                          min={2}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>2 words</span>
                          <span>6 words</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-base font-medium">Word Separator</Label>
                        <RadioGroup
                          value={options.memorableSeparator || '-'}
                          onValueChange={(value) => updateOptions({ memorableSeparator: value })}
                          className="grid grid-cols-2 md:grid-cols-4 gap-3"
                        >
                          {[
                            { value: '-', label: 'Dash', example: 'word-word' },
                            { value: '_', label: 'Underscore', example: 'word_word' },
                            { value: '.', label: 'Dot', example: 'word.word' },
                            { value: '', label: 'None', example: 'wordword' }
                          ].map((sep) => (
                            <div key={sep.value} className="flex items-center space-x-2 p-3 border rounded-lg">
                              <RadioGroupItem value={sep.value} id={`sep-${sep.value || 'none'}`} />
                              <div>
                                <Label htmlFor={`sep-${sep.value || 'none'}`} className="text-sm font-medium cursor-pointer">
                                  {sep.label}
                                </Label>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {sep.example}
                                </p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-base font-medium">Capitalization</Label>
                        <RadioGroup
                          value={options.memorableCapitalization || 'first'}
                          onValueChange={(value) => updateOptions({ memorableCapitalization: value as 'none' | 'first' | 'all' | 'random' })}
                          className="grid grid-cols-1 md:grid-cols-2 gap-3"
                        >
                          {[
                            { value: 'none', label: 'No Caps', example: 'word word' },
                            { value: 'first', label: 'First Word', example: 'Word word' },
                            { value: 'all', label: 'All Words', example: 'Word Word' },
                            { value: 'random', label: 'Random', example: 'word Word' }
                          ].map((cap) => (
                            <div key={cap.value} className="flex items-center space-x-2 p-3 border rounded-lg">
                              <RadioGroupItem value={cap.value} id={`cap-${cap.value}`} />
                              <div>
                                <Label htmlFor={`cap-${cap.value}`} className="text-sm font-medium cursor-pointer">
                                  {cap.label}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  {cap.example}
                                </p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Checkbox
                            id="memorableIncludeNumbers"
                            checked={options.memorableIncludeNumbers !== false}
                            onCheckedChange={(checked) => updateOptions({ memorableIncludeNumbers: !!checked })}
                          />
                          <div>
                            <Label htmlFor="memorableIncludeNumbers" className="text-sm font-medium cursor-pointer">
                              Include Numbers
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Add numeric suffix
                            </p>
                          </div>
                        </div>

                        {options.memorableIncludeNumbers !== false && (
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Number Position</Label>
                            <RadioGroup
                              value={options.memorableNumberPosition || 'end'}
                              onValueChange={(value) => updateOptions({ memorableNumberPosition: value as 'end' | 'between' | 'random' })}
                              className="flex flex-col space-y-2"
                            >
                              {[
                                { value: 'end', label: 'End' },
                                { value: 'between', label: 'Between Words' },
                                { value: 'random', label: 'Random' }
                              ].map((pos) => (
                                <div key={pos.value} className="flex items-center space-x-2">
                                  <RadioGroupItem value={pos.value} id={`pos-${pos.value}`} />
                                  <Label htmlFor={`pos-${pos.value}`} className="text-sm cursor-pointer">
                                    {pos.label}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="smart" className="mt-8 space-y-6">
                  <Card className="border-green-200 bg-green-50/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                        <Brain className="h-5 w-5 text-green-600" />
                        Smart Password Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <Label className="text-base font-medium">Complexity Level</Label>
                        <RadioGroup
                          value={options.smartComplexity || 'medium'}
                          onValueChange={(value) => updateOptions({ smartComplexity: value as 'simple' | 'medium' | 'complex' })}
                          className="grid grid-cols-1 md:grid-cols-3 gap-3"
                        >
                          {[
                            { value: 'simple', label: 'Simple', description: '2 digits, 1 symbol' },
                            { value: 'medium', label: 'Medium', description: '3 digits, 1 symbol' },
                            { value: 'complex', label: 'Complex', description: '4 digits, 2-3 symbols' }
                          ].map((complexity) => (
                            <div key={complexity.value} className="flex items-center space-x-2 p-3 border rounded-lg">
                              <RadioGroupItem value={complexity.value} id={`complex-${complexity.value}`} />
                              <div>
                                <Label htmlFor={`complex-${complexity.value}`} className="text-sm font-medium cursor-pointer">
                                  {complexity.label}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  {complexity.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-base font-medium">Word Order</Label>
                        <RadioGroup
                          value={options.smartWordOrder || 'random'}
                          onValueChange={(value) => updateOptions({ smartWordOrder: value as 'adjective-noun' | 'verb-noun' | 'random' })}
                          className="grid grid-cols-1 md:grid-cols-3 gap-3"
                        >
                          {[
                            { value: 'random', label: 'Random', example: 'BlueElephant42!' },
                            { value: 'adjective-noun', label: 'Adjective-Noun', example: 'BlueHouse42!' },
                            { value: 'verb-noun', label: 'Verb-Noun', example: 'RunHouse42!' }
                          ].map((order) => (
                            <div key={order.value} className="flex items-center space-x-2 p-3 border rounded-lg">
                              <RadioGroupItem value={order.value} id={`order-${order.value}`} />
                              <div>
                                <Label htmlFor={`order-${order.value}`} className="text-sm font-medium cursor-pointer">
                                  {order.label}
                                </Label>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {order.example}
                                </p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id="smartIncludeSpecialChars"
                          checked={options.smartIncludeSpecialChars !== false}
                          onCheckedChange={(checked) => updateOptions({ smartIncludeSpecialChars: !!checked })}
                        />
                        <div>
                          <Label htmlFor="smartIncludeSpecialChars" className="text-sm font-medium cursor-pointer">
                            Include Special Characters
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Add symbols for enhanced security
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-slate-500 space-y-2">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Modern Design</span>
              </div>
            </div>
            <p>Built with security and privacy in mind. All generation happens locally.</p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
