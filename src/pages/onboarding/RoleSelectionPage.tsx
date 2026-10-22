import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  TrendingUp, 
  Building2, 
  Briefcase, 
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/hooks/useAuth';

const roles = [
  {
    id: 'customer' as UserRole,
    title: 'Customer',
    description: 'Apply for loans, manage finances, and track applications',
    icon: User,
    color: 'from-info to-info/80',
  },
  {
    id: 'investor' as UserRole,
    title: 'Investor',
    description: 'Invest in mutual funds, bonds, and grow your wealth',
    icon: TrendingUp,
    color: 'from-success to-success/80',
  },
  {
    id: 'broker' as UserRole,
    title: 'Broker',
    description: 'List properties, manage leads, and close deals',
    icon: Building2,
    color: 'from-warning to-warning/80',
  },
  {
    id: 'consultant' as UserRole,
    title: 'Consultant',
    description: 'Offer expert advice and grow your consulting business',
    icon: Briefcase,
    color: 'from-accent to-accent/80',
  },
];

const RoleSelectionPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();
  const { setRole } = useAuth();

  const handleContinue = () => {
    if (selectedRole) {
      setRole(selectedRole);
      navigate('/onboarding/kyc');
    }
  };

  return (
    <div className="min-h-screen p-8 gradient-mesh">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">Choose your role</h1>
            <p className="text-muted-foreground text-lg">
              Select how you want to use Lendrix. You can always add more roles later.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <button
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                    selectedRole === role.id
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                      <role.icon className="w-6 h-6 text-white" />
                    </div>
                    {selectedRole === role.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{role.title}</h3>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </button>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground min-w-[200px]"
              onClick={handleContinue}
              disabled={!selectedRole}
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
