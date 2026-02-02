import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Flame, Star, Award, TrendingUp, Calendar, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/hooks/useGamification';

export default function AchievementSystem() {
  const {
    userStats,
    achievements,
    goals,
    recentEvents,
    levelUpAnimation,
    getAchievementsByCategory,
    getUnlockedAchievements,
    getLockedAchievements,
    getActiveGoals
  } = useGamification();

  const [showLevelUpModal, setShowLevelUpModal] = useState(false);

  // Show level up modal when animation triggers
  useEffect(() => {
    if (levelUpAnimation) {
      setShowLevelUpModal(true);
      const timer = setTimeout(() => setShowLevelUpModal(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [levelUpAnimation]);

  const getAchievementIcon = (icon: string) => {
    return icon; // Return the emoji directly
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily': return <Calendar className="w-4 h-4" />;
      case 'weekly': return <Target className="w-4 h-4" />;
      case 'monthly': return <TrendingUp className="w-4 h-4" />;
      case 'health': return <Star className="w-4 h-4" />;
      case 'special': return <Award className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'weekly': return 'bg-green-100 text-green-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      case 'health': return 'bg-red-100 text-red-800';
      case 'special': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const unlockedAchievements = getUnlockedAchievements();
  const lockedAchievements = getLockedAchievements();
  const activeGoals = getActiveGoals();

  return (
    <div className="space-y-6">
      {/* Level Up Modal */}
      <AnimatePresence>
        {showLevelUpModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Level Up!</h2>
              <p className="text-xl text-muted-foreground mb-4">
                You're now Level {userStats.currentLevel}
              </p>
              <div className="text-4xl font-bold text-primary mb-6">
                {userStats.totalPoints} Points
              </div>
              <Button onClick={() => setShowLevelUpModal(false)}>
                Continue
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              Level {userStats.currentLevel}
            </div>
            <p className="text-sm text-muted-foreground">Current Level</p>
            <Progress 
              value={(userStats.totalPoints / (userStats.currentLevel * 100)) * 100} 
              className="mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              {userStats.pointsToNextLevel} pts to next level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {userStats.totalPoints.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5" />
              {userStats.streakDays}
            </div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {userStats.unlockedAchievements}/{userStats.totalAchievements}
            </div>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Achievements</h3>
            <Badge variant="outline">
              {unlockedAchievements.length} of {achievements.length} unlocked
            </Badge>
          </div>

          {/* Achievement Categories */}
          <div className="space-y-4">
            {['daily', 'weekly', 'monthly', 'health', 'special'].map((category) => {
              const categoryAchievements = getAchievementsByCategory(category);
              const unlockedInCategory = categoryAchievements.filter(a => a.unlockedAt).length;
              
              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      {getCategoryIcon(category)}
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                      <Badge variant="outline" className="ml-auto">
                        {unlockedInCategory}/{categoryAchievements.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {categoryAchievements.map((achievement) => (
                        <motion.div
                          key={achievement.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-3 rounded-lg border ${
                            achievement.unlockedAt 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">
                              {achievement.unlockedAt ? getAchievementIcon(achievement.icon) : '🔒'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{achievement.title}</h4>
                                <Badge className={getCategoryColor(achievement.category)}>
                                  {achievement.points} pts
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {achievement.description}
                              </p>
                              
                              {!achievement.unlockedAt && achievement.maxProgress && (
                                <div>
                                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>Progress</span>
                                    <span>{achievement.progress || 0}/{achievement.maxProgress}</span>
                                  </div>
                                  <Progress 
                                    value={((achievement.progress || 0) / achievement.maxProgress) * 100} 
                                    className="h-2" 
                                  />
                                </div>
                              )}
                              
                              {achievement.unlockedAt && (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle className="w-3 h-3" />
                                  Unlocked {formatDate(achievement.unlockedAt)}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Goals</h3>
            <Button>Create New Goal</Button>
          </div>

          {activeGoals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Active Goals</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create goals to track your progress and earn rewards
                </p>
                <Button>Create Your First Goal</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeGoals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{goal.title}</h4>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                          <Badge variant="outline">
                            {goal.type}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{goal.current} / {goal.target} {goal.unit}</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{Math.round(progress)}% complete</span>
                            {goal.deadline && (
                              <span>Due {formatDate(goal.deadline)}</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          
          {recentEvents.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Recent Activity</h3>
                <p className="text-sm text-muted-foreground">
                  Start tracking your health to see your activity here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentEvents.slice(0, 20).map((event, index) => (
                <motion.div
                  key={`${event.timestamp}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {event.type.replace(/_/g, ' ').charAt(0).toUpperCase() + event.type.slice(1).replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(event.timestamp)} at {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant="outline">
                    +{Math.floor(event.value / 10) + 5} pts
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
