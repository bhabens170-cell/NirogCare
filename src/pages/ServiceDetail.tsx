import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { servicesByCategory } from '@/data/healthData';
import Header from '@/components/layout/Header';
import FloatingChatButton from '@/components/layout/FloatingChatButton';
import { ArrowLeft, CheckCircle2, Landmark, MapPin, MessageCircle, Sparkles, Stethoscope, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BreathingCircle from '@/components/tools/BreathingCircle';
import PeriodTracker from '@/components/tools/PeriodTracker';

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  // Find the service
  let service = null;
  for (const category of Object.values(servicesByCategory)) {
    const found = category.find((s) => s.id === serviceId);
    if (found) {
      service = found;
      break;
    }
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">Service not found</p>
            <Button onClick={() => navigate('/')} className="rounded-xl">
              Go Home
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  // Check if this is a mental health stress/anxiety service
  const isBreathingService = serviceId === 'mental-stress';
  const isPeriodTracker = serviceId === 'female-period';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary font-medium mb-6 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        {/* Service Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="relative overflow-hidden gradient-hero text-white p-6 md:p-8">
            {/* Background decorations */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <div className="relative">
              <motion.div
                className="inline-flex items-center gap-2 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Stethoscope className="w-5 h-5" />
                <span className="text-sm font-medium text-white/80">Health Service</span>
              </motion.div>
              <h1 className="font-display text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                {service.title}
                <Sparkles className="w-6 h-6 text-amber-300" />
              </h1>
              <p className="text-white/80 text-lg">
                {service.subtitle}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Interactive Tool Section */}
            {isBreathingService && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="p-2 bg-teal-500/10 rounded-xl">
                    <Activity className="w-5 h-5 text-teal-500" />
                  </div>
                  Breathing Exercise
                </h2>
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6">
                  <BreathingCircle />
                </div>
              </motion.div>
            )}

            {isPeriodTracker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="p-2 bg-rose-500/10 rounded-xl">
                    <span className="text-xl">📅</span>
                  </div>
                  Your Cycle Tracker
                </h2>
                <PeriodTracker />
              </motion.div>
            )}

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-foreground text-lg leading-relaxed">
                {service.description}
              </p>
            </motion.div>

            {/* Health Tips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <span className="text-xl">💡</span>
                </div>
                Health Tips
              </h2>
              <div className="space-y-3">
                {service.tips.map((tip, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                    className="flex items-start gap-3 bg-primary/5 border border-primary/10 rounded-xl p-4"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-foreground">{tip}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Government Schemes */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <motion.div
                  className="p-2 bg-amber-500/10 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Landmark className="w-5 h-5 text-amber-500" />
                </motion.div>
                Related Govt Schemes
              </h2>
              <div className="space-y-3">
                {service.schemes.map((scheme, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-xl p-4"
                  >
                    <p className="text-amber-900 font-medium">{scheme}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 pt-4"
            >
              <Link to="/nearby-stores" className="flex-1">
                <Button className="w-full gradient-hero rounded-xl h-12 shadow-lg">
                  <MapPin className="w-5 h-5 mr-2" />
                  Find Nearby Pharmacy
                </Button>
              </Link>
              <Link to="/chat" className="flex-1">
                <Button variant="outline" className="w-full rounded-xl h-12 border-primary/20 hover:bg-primary/5">
                  <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                  Ask Health Assistant
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <FloatingChatButton />
    </div>
  );
}
