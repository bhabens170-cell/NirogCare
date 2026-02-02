import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Contrast, Eye, Volume2, Type, Accessibility } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useThemeContext } from '@/components/ui/ThemeProvider';

export default function ThemeSettings() {
  const {
    settings,
    isDarkMode,
    updateTheme,
    updateFontSize,
    toggleHighContrast,
    toggleReducedMotion,
    toggleScreenReader,
    getFontSize
  } = useThemeContext();

  const [isOpen, setIsOpen] = useState(false);

  const fontSizes = [
    { value: 'small', label: 'Small', description: '14px' },
    { value: 'medium', label: 'Medium', description: '16px' },
    { value: 'large', label: 'Large', description: '18px' },
    { value: 'extra-large', label: 'Extra Large', description: '20px' }
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Accessibility className="w-4 h-4" />
        Accessibility
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 top-full mt-2 w-80 z-50"
        >
          <Card className="shadow-lg border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Accessibility className="w-5 h-5" />
                Accessibility Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={settings.theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateTheme('light')}
                    className="flex items-center gap-1"
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </Button>
                  <Button
                    variant={settings.theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateTheme('dark')}
                    className="flex items-center gap-1"
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </Button>
                  <Button
                    variant={settings.theme === 'auto' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateTheme('auto')}
                    className="flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Auto
                  </Button>
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Font Size
                </Label>
                <Select value={settings.fontSize} onValueChange={updateFontSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        <div>
                          <div className="font-medium">{size.label}</div>
                          <div className="text-xs text-muted-foreground">{size.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Contrast className="w-4 h-4" />
                    High Contrast
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Increase contrast for better visibility
                  </p>
                </div>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={toggleHighContrast}
                />
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Reduced Motion
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Minimize animations and transitions
                  </p>
                </div>
                <Switch
                  checked={settings.reducedMotion}
                  onCheckedChange={toggleReducedMotion}
                />
              </div>

              {/* Screen Reader Mode */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Screen Reader Mode
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Optimize for screen readers
                  </p>
                </div>
                <Switch
                  checked={settings.screenReader}
                  onCheckedChange={toggleScreenReader}
                />
              </div>

              {/* Preview */}
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Preview Text</p>
                <p style={{ fontSize: getFontSize() }} className="text-muted-foreground">
                  This is how text will appear with your current settings. You can adjust the theme, font size, and contrast to find the most comfortable reading experience.
                </p>
              </div>

              {/* Close Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Close Settings
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
