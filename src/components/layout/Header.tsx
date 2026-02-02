/**
 * NirogCare - Premium Header Component
 * Features: Dark mode toggle, Language selector, smooth animations
 */

import { Heart, Menu, Globe, MessageSquare, Sparkles, X, ChevronRight, Home, Briefcase, MapPin, Lightbulb, Landmark, Settings, User, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LanguageSelector from './LanguageSelector';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useThemeContext } from '@/components/ui/ThemeProvider';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/services', label: 'Services', icon: Briefcase },
  { href: '/nearby-stores', label: 'Pharmacy', icon: MapPin },
  { href: '/health-tips', label: 'Tips', icon: Lightbulb },
  { href: '/govt-schemes', label: 'Schemes', icon: Landmark },
];

const quickLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Theme context for dark mode
  const { settings, updateTheme, isDarkMode } = useThemeContext();

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 50], [0, 1]);
  const headerBlur = useTransform(scrollY, [0, 50], [0, 20]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    updateTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <>
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm'
            : 'bg-transparent'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 0.95 }}
                className="relative w-10 h-10 md:w-12 md:h-12 rounded-2xl gradient-hero flex items-center justify-center shadow-glow overflow-hidden"
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5 }}
                />
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <Heart className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground relative z-10" fill="currentColor" />
                </motion.div>
              </motion.div>
              <div className="hidden sm:block">
                <motion.h1
                  className="font-display font-bold text-lg md:text-xl text-foreground leading-tight flex items-center gap-2"
                  whileHover={{ x: 2 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  Nirog Care
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                  </motion.div>
                </motion.h1>
                <p className="text-xs text-muted-foreground">AI Health Companion</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, type: 'spring' }}
                  >
                    <Link
                      to={link.href}
                      className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all group"
                    >
                      {/* Active background */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-primary rounded-xl shadow-sm"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}

                      {/* Hover background */}
                      {!isActive && (
                        <motion.div
                          className="absolute inset-0 bg-muted rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      )}

                      <span className={`relative z-10 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                        {link.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Dark Mode Toggle */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl relative"
                  onClick={toggleDarkMode}
                  aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  <AnimatePresence mode="wait">
                    {isDarkMode ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="w-5 h-5 text-yellow-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>

              {/* Language Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl relative"
                  onClick={() => setShowLangModal(true)}
                >
                  <Globe className="w-5 h-5" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </Button>
              </motion.div>

              {/* AI Chat Button - Desktop */}
              <Link to="/chat" className="hidden md:block">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="rounded-xl gradient-hero shadow-glow hover:shadow-lg transition-all gap-2 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                    />
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <MessageSquare className="w-4 h-4 relative z-10" />
                    </motion.div>
                    <span className="relative z-10">AI Chat</span>
                  </Button>
                </motion.div>
              </Link>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" className="rounded-xl">
                      <AnimatePresence mode="wait">
                        {isOpen ? (
                          <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                          >
                            <X className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="menu"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                          >
                            <Menu className="w-5 h-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0 border-l border-border">
                  <div className="flex flex-col h-full">
                    {/* Sheet Header */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 border-b border-border bg-gradient-to-br from-primary/5 to-transparent"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center shadow-lg"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />
                        </motion.div>
                        <div>
                          <h2 className="font-display font-bold text-lg flex items-center gap-2">
                            Nirog Care
                            <Sparkles className="w-4 h-4 text-primary" />
                          </h2>
                          <p className="text-xs text-muted-foreground">AI Health Companion</p>
                        </div>
                      </div>

                      {/* Theme Toggle in Mobile Menu */}
                      <div className="mt-4 flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                        <span className="text-sm font-medium text-foreground">Dark Mode</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleDarkMode}
                          className="rounded-lg h-8 px-3"
                        >
                          {isDarkMode ? (
                            <><Sun className="w-4 h-4 mr-2 text-yellow-500" /> Light</>
                          ) : (
                            <><Moon className="w-4 h-4 mr-2" /> Dark</>
                          )}
                        </Button>
                      </div>
                    </motion.div>

                    {/* Nav Links */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                      {navLinks.map((link, index) => {
                        const isActive = location.pathname === link.href;
                        const Icon = link.icon;
                        return (
                          <motion.div
                            key={link.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              to={link.href}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all group ${isActive
                                  ? 'bg-primary text-primary-foreground shadow-md'
                                  : 'text-foreground hover:bg-muted'
                                }`}
                            >
                              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                              <span className="flex-1">{link.label}</span>
                              <motion.div
                                animate={isActive ? { x: [0, 3, 0] } : {}}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'text-primary-foreground' : ''}`} />
                              </motion.div>
                            </Link>
                          </motion.div>
                        );
                      })}

                      {/* Divider */}
                      <div className="py-4">
                        <div className="h-px bg-border" />
                      </div>

                      {/* Quick Links */}
                      <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Access</p>
                      {quickLinks.map((link, index) => {
                        const Icon = link.icon;
                        return (
                          <motion.div
                            key={link.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (navLinks.length + index) * 0.05 }}
                          >
                            <Link
                              to={link.href}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-foreground hover:bg-muted transition-all group"
                            >
                              <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                              <span className="flex-1">{link.label}</span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </nav>

                    {/* Footer Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 border-t border-border space-y-3 bg-muted/30"
                    >
                      {/* Language Selector Button */}
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowLangModal(true);
                          setIsOpen(false);
                        }}
                        className="w-full rounded-xl h-12 text-base font-semibold"
                      >
                        <Globe className="w-5 h-5 mr-2" />
                        Change Language
                      </Button>

                      <Link to="/chat" onClick={() => setIsOpen(false)}>
                        <Button className="w-full rounded-xl gradient-hero gap-2 h-12 text-base font-semibold shadow-lg relative overflow-hidden">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          />
                          <MessageSquare className="w-5 h-5 relative z-10" />
                          <span className="relative z-10">AI Health Chat</span>
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        className="w-full rounded-xl h-12 text-base font-semibold"
                        onClick={() => window.open('tel:108')}
                      >
                        <motion.span
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="flex items-center gap-2"
                        >
                          🚨 Emergency - 108
                        </motion.span>
                      </Button>
                    </motion.div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>

      <LanguageSelector open={showLangModal} onOpenChange={setShowLangModal} />
    </>
  );
}
