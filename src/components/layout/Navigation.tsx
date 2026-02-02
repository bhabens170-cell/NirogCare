import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MapPin, 
  Activity, 
  Brain, 
  Phone, 
  Users, 
  Trophy, 
  Watch, 
  Settings, 
  Menu, 
  X,
  Heart,
  Shield,
  MessageCircle,
  Pill
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGamification } from '@/hooks/useGamification';
import { useFamilyHealth } from '@/hooks/useFamilyHealth';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  category: 'main' | 'health' | 'family' | 'emergency' | 'settings';
}

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userStats } = useGamification();
  const { familyMembers } = useFamilyHealth();

  const navigationItems: NavigationItem[] = [
    // Main Navigation
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      path: '/dashboard',
      category: 'main'
    },
    {
      id: 'pharmacy',
      label: 'Pharmacy Locator',
      icon: <MapPin className="w-5 h-5" />,
      path: '/nearby-stores',
      category: 'main'
    },
    {
      id: 'chat',
      label: 'Health Assistant',
      icon: <MessageCircle className="w-5 h-5" />,
      path: '/chat',
      category: 'main'
    },

    // Health Features
    {
      id: 'health-monitor',
      label: 'Health Monitor',
      icon: <Activity className="w-5 h-5" />,
      path: '/health-monitor',
      category: 'health'
    },
    {
      id: 'symptom-checker',
      label: 'AI Symptom Checker',
      icon: <Brain className="w-5 h-5" />,
      path: '/symptom-checker',
      category: 'health'
    },
    {
      id: 'wearable-devices',
      label: 'Wearable Devices',
      icon: <Watch className="w-5 h-5" />,
      path: '/wearable-devices',
      category: 'health'
    },
    {
      id: 'medications',
      label: 'Medications',
      icon: <Pill className="w-5 h-5" />,
      path: '/reminders',
      category: 'health'
    },

    // Family Features
    {
      id: 'family-health',
      label: 'Family Health',
      icon: <Users className="w-5 h-5" />,
      path: '/family-health',
      badge: familyMembers.length,
      category: 'family'
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: <Trophy className="w-5 h-5" />,
      path: '/achievements',
      badge: userStats.unlockedAchievements,
      category: 'family'
    },

    // Emergency Features
    {
      id: 'emergency-contacts',
      label: 'Emergency Contacts',
      icon: <Phone className="w-5 h-5" />,
      path: '/emergency-contacts',
      category: 'emergency'
    },
    {
      id: 'medical-id',
      label: 'Medical ID',
      icon: <Shield className="w-5 h-5" />,
      path: '/medical-id',
      category: 'emergency'
    },

    // Settings
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/settings',
      category: 'settings'
    }
  ];

  const categories = [
    { id: 'main', label: 'Main', color: 'text-blue-600' },
    { id: 'health', label: 'Health', color: 'text-green-600' },
    { id: 'family', label: 'Family', color: 'text-purple-600' },
    { id: 'emergency', label: 'Emergency', color: 'text-red-600' },
    { id: 'settings', label: 'Settings', color: 'text-gray-600' }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getCategoryItems = (category: string) => {
    return navigationItems.filter(item => item.category === category);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block w-64 bg-card border-r h-screen sticky top-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">NirogCare</h1>
              <p className="text-xs text-muted-foreground">Health Platform</p>
            </div>
          </div>

          {/* User Stats */}
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Level {userStats.currentLevel}</span>
              <Badge variant="outline" className="text-xs">
                {userStats.totalPoints} pts
              </Badge>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(userStats.totalPoints / (userStats.currentLevel * 100)) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation Categories */}
          <div className="space-y-6">
            {categories.map((category) => {
              const items = getCategoryItems(category.id);
              if (items.length === 0) return null;

              return (
                <div key={category.id}>
                  <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${category.color}`}>
                    {category.label}
                  </h3>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={isActivePath(item.path) ? "secondary" : "ghost"}
                          className={`w-full justify-start h-10 ${
                            isActivePath(item.path) ? 'bg-primary/10' : ''
                          }`}
                          onClick={() => navigate(item.path)}
                        >
                          <span className="mr-3">{item.icon}</span>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && item.badge > 0 && (
                            <Badge variant="secondary" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 bg-card border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold">NirogCare</h1>
                <p className="text-xs text-muted-foreground">Level {userStats.currentLevel}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card border-b"
            >
              <div className="p-4 space-y-4">
                {categories.map((category) => {
                  const items = getCategoryItems(category.id);
                  if (items.length === 0) return null;

                  return (
                    <div key={category.id}>
                      <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${category.color}`}>
                        {category.label}
                      </h3>
                      <div className="space-y-1">
                        {items.map((item) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant={isActivePath(item.path) ? "secondary" : "ghost"}
                              className={`w-full justify-start h-10 ${
                                isActivePath(item.path) ? 'bg-primary/10' : ''
                              }`}
                              onClick={() => {
                                navigate(item.path);
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <span className="mr-3">{item.icon}</span>
                              <span className="flex-1 text-left">{item.label}</span>
                              {item.badge && item.badge > 0 && (
                                <Badge variant="secondary" className="ml-auto">
                                  {item.badge}
                                </Badge>
                              )}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
