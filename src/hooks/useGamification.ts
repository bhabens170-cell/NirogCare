import { useState, useEffect, useCallback } from 'react';
import { Achievement, HealthGoal } from '@/types/health';

interface UserStats {
  totalPoints: number;
  currentLevel: number;
  pointsToNextLevel: number;
  streakDays: number;
  completedGoals: number;
  unlockedAchievements: number;
  totalAchievements: number;
}

interface GamificationEvent {
  type: 'step_goal' | 'water_goal' | 'medication_taken' | 'exercise_completed' | 'symptom_logged' | 'bp_logged' | 'weight_logged';
  value: number;
  timestamp: string;
}

// Achievement definitions
const ACHIEVEMENTS: Achievement[] = [
  // Daily achievements
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Log your first step count',
    icon: '👟',
    category: 'daily',
    points: 10,
    maxProgress: 1
  },
  {
    id: 'hydration_hero',
    title: 'Hydration Hero',
    description: 'Drink 8 glasses of water in a day',
    icon: '💧',
    category: 'daily',
    points: 15,
    maxProgress: 8
  },
  {
    id: 'medication_master',
    title: 'Medication Master',
    description: 'Take all medications on time for a week',
    icon: '💊',
    category: 'daily',
    points: 50,
    maxProgress: 7
  },
  
  // Weekly achievements
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Meet all daily goals for 7 days straight',
    icon: '🏆',
    category: 'weekly',
    points: 100,
    maxProgress: 7
  },
  {
    id: 'step_champion',
    title: 'Step Champion',
    description: 'Walk 70,000 steps in a week',
    icon: '🚶',
    category: 'weekly',
    points: 75,
    maxProgress: 70000
  },
  
  // Monthly achievements
  {
    id: 'monthly_milestone',
    title: 'Monthly Milestone',
    description: 'Maintain a 30-day streak',
    icon: '🌟',
    category: 'monthly',
    points: 200,
    maxProgress: 30
  },
  {
    id: 'health_tracker',
    title: 'Health Tracker',
    description: 'Log health metrics for 30 days',
    icon: '📊',
    category: 'monthly',
    points: 150,
    maxProgress: 30
  },
  
  // Health monitoring achievements
  {
    id: 'bp_tracker',
    title: 'BP Tracker',
    description: 'Log blood pressure 10 times',
    icon: '❤️',
    category: 'health',
    points: 30,
    maxProgress: 10
  },
  {
    id: 'weight_watcher',
    title: 'Weight Watcher',
    description: 'Log weight for 14 days straight',
    icon: '⚖️',
    category: 'health',
    points: 40,
    maxProgress: 14
  },
  
  // Special achievements
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete morning routine before 8 AM for 5 days',
    icon: '🌅',
    category: 'special',
    points: 60,
    maxProgress: 5
  },
  {
    id: 'consistency_king',
    title: 'Consistency King',
    description: 'Use the app for 100 days',
    icon: '👑',
    category: 'special',
    points: 500,
    maxProgress: 100
  }
];

export function useGamification() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    currentLevel: 1,
    pointsToNextLevel: 100,
    streakDays: 0,
    completedGoals: 0,
    unlockedAchievements: 0,
    totalAchievements: ACHIEVEMENTS.length
  });

  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [recentEvents, setRecentEvents] = useState<GamificationEvent[]>([]);
  const [levelUpAnimation, setLevelUpAnimation] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem('nirogcare_gamification_stats');
      const savedAchievements = localStorage.getItem('nirogcare_achievements');
      const savedGoals = localStorage.getItem('nirogcare_goals');
      const savedEvents = localStorage.getItem('nirogcare_events');

      if (savedStats) setUserStats(JSON.parse(savedStats));
      if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedEvents) setRecentEvents(JSON.parse(savedEvents));
    } catch (error) {
      console.error('Error loading gamification data:', error);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('nirogcare_gamification_stats', JSON.stringify(userStats));
      localStorage.setItem('nirogcare_achievements', JSON.stringify(achievements));
      localStorage.setItem('nirogcare_goals', JSON.stringify(goals));
      localStorage.setItem('nirogcare_events', JSON.stringify(recentEvents));
    } catch (error) {
      console.error('Error saving gamification data:', error);
    }
  }, [userStats, achievements, goals, recentEvents]);

  // Calculate points needed for next level
  const calculatePointsToNextLevel = useCallback((currentLevel: number) => {
    return currentLevel * 100;
  }, []);

  // Check for level up
  const checkLevelUp = useCallback((points: number, currentLevel: number) => {
    const pointsNeeded = calculatePointsToNextLevel(currentLevel);
    return points >= pointsNeeded;
  }, [calculatePointsToNextLevel]);

  // Award points to user
  const awardPoints = useCallback((points: number) => {
    setUserStats(prev => {
      const newTotalPoints = prev.totalPoints + points;
      const shouldLevelUp = checkLevelUp(newTotalPoints, prev.currentLevel);
      
      if (shouldLevelUp) {
        setLevelUpAnimation(true);
        setTimeout(() => setLevelUpAnimation(false), 3000);
        
        return {
          ...prev,
          totalPoints: newTotalPoints,
          currentLevel: prev.currentLevel + 1,
          pointsToNextLevel: calculatePointsToNextLevel(prev.currentLevel + 1)
        };
      }
      
      return {
        ...prev,
        totalPoints: newTotalPoints,
        pointsToNextLevel: calculatePointsToNextLevel(prev.currentLevel) - (newTotalPoints - (prev.currentLevel * 100))
      };
    });
  }, [checkLevelUp, calculatePointsToNextLevel]);

  // Unlock achievement
  const unlockAchievement = useCallback((achievementId: string) => {
    setAchievements(prev => {
      const achievement = prev.find(a => a.id === achievementId);
      if (achievement && !achievement.unlockedAt) {
        const updatedAchievements = prev.map(a => 
          a.id === achievementId 
            ? { ...a, unlockedAt: new Date().toISOString(), progress: a.maxProgress }
            : a
        );
        
        // Award points for achievement
        awardPoints(achievement.points);
        
        // Update user stats
        setUserStats(prev => ({
          ...prev,
          unlockedAchievements: prev.unlockedAchievements + 1
        }));
        
        return updatedAchievements;
      }
      return prev;
    });
  }, [awardPoints]);

  // Update achievement progress
  const updateAchievementProgress = useCallback((achievementId: string, progress: number) => {
    setAchievements(prev => {
      const achievement = prev.find(a => a.id === achievementId);
      if (achievement && !achievement.unlockedAt) {
        const newProgress = Math.min(progress, achievement.maxProgress || 0);
        const shouldUnlock = newProgress >= (achievement.maxProgress || 0);
        
        if (shouldUnlock) {
          unlockAchievement(achievementId);
        } else {
          return prev.map(a => 
            a.id === achievementId 
              ? { ...a, progress: newProgress }
              : a
          );
        }
      }
      return prev;
    });
  }, [unlockAchievement]);

  // Log gamification event
  const logEvent = useCallback((event: GamificationEvent) => {
    setRecentEvents(prev => [event, ...prev].slice(0, 50)); // Keep last 50 events
    
    // Process event for achievements
    switch (event.type) {
      case 'step_goal':
        if (event.value >= 10000) {
          updateAchievementProgress('step_champion', (event.value / 10000) * 10000);
        }
        updateAchievementProgress('first_steps', 1);
        break;
        
      case 'water_goal':
        updateAchievementProgress('hydration_hero', event.value);
        break;
        
      case 'medication_taken':
        updateAchievementProgress('medication_master', event.value);
        break;
        
      case 'bp_logged':
        updateAchievementProgress('bp_tracker', event.value);
        break;
        
      case 'weight_logged':
        updateAchievementProgress('weight_watcher', event.value);
        break;
    }
    
    // Award points for the event
    const pointsAwarded = Math.floor(event.value / 10) + 5; // Base points + bonus
    awardPoints(pointsAwarded);
  }, [updateAchievementProgress, awardPoints]);

  // Create new goal
  const createGoal = useCallback((goal: Omit<HealthGoal, 'id' | 'createdAt'>) => {
    const newGoal: HealthGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  }, []);

  // Update goal progress
  const updateGoalProgress = useCallback((goalId: string, progress: number) => {
    setGoals(prev => {
      const goal = prev.find(g => g.id === goalId);
      if (goal) {
        const updatedGoals = prev.map(g => 
          g.id === goalId 
            ? { ...g, current: progress }
            : g
        );
        
        // Check if goal is completed
        if (progress >= goal.target && goal.isActive) {
          awardPoints(25); // Bonus points for completing a goal
          setUserStats(stats => ({
            ...stats,
            completedGoals: stats.completedGoals + 1
          }));
        }
        
        return updatedGoals;
      }
      return prev;
    });
  }, [awardPoints]);

  // Complete goal
  const completeGoal = useCallback((goalId: string) => {
    setGoals(prev => prev.map(g => 
      g.id === goalId 
        ? { ...g, isActive: false, current: g.target }
        : g
    ));
    
    awardPoints(50);
    setUserStats(stats => ({
      ...stats,
      completedGoals: stats.completedGoals + 1
    }));
  }, [awardPoints]);

  // Update streak
  const updateStreak = useCallback((increment: boolean) => {
    setUserStats(prev => ({
      ...prev,
      streakDays: increment ? prev.streakDays + 1 : Math.max(0, prev.streakDays - 1)
    }));
    
    // Check streak achievements
    if (increment) {
      setUserStats(prev => {
        if (prev.streakDays >= 7) unlockAchievement('week_warrior');
        if (prev.streakDays >= 30) unlockAchievement('monthly_milestone');
        return prev;
      });
    }
  }, [unlockAchievement]);

  // Get achievement by category
  const getAchievementsByCategory = useCallback((category: string) => {
    return achievements.filter(a => a.category === category);
  }, [achievements]);

  // Get unlocked achievements
  const getUnlockedAchievements = useCallback(() => {
    return achievements.filter(a => a.unlockedAt);
  }, [achievements]);

  // Get locked achievements
  const getLockedAchievements = useCallback(() => {
    return achievements.filter(a => !a.unlockedAt);
  }, [achievements]);

  // Get active goals
  const getActiveGoals = useCallback(() => {
    return goals.filter(g => g.isActive);
  }, [goals]);

  return {
    userStats,
    achievements,
    goals,
    recentEvents,
    levelUpAnimation,
    awardPoints,
    unlockAchievement,
    updateAchievementProgress,
    logEvent,
    createGoal,
    updateGoalProgress,
    completeGoal,
    updateStreak,
    getAchievementsByCategory,
    getUnlockedAchievements,
    getLockedAchievements,
    getActiveGoals
  };
}
