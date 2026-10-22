import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, TrendingUp, Shield, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetPlansQuery } from '@/redux/services/membershipApi';
import { useAppDispatch } from '@/redux/hooks';
import { setSelectedPlan } from '@/redux/slices/membershipSlice';
import {
  DEFAULT_PLAN_VISUAL,
  PLAN_VISUALS,
  formatINR,
} from '@/constants/membership.constants';
import type { MembershipPlan } from '@/types/membership.types';

const iconMap = {
  crown: Crown,
  trending: TrendingUp,
  shield: Shield,
};

const PlanCard: React.FC<{
  plan: MembershipPlan;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ plan, isSelected, onSelect }) => {
  const visual = PLAN_VISUALS[plan.plan_code] ?? DEFAULT_PLAN_VISUAL;
  const Icon = iconMap[visual.iconName];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left p-6 rounded-2xl border-2 transition-all bg-card ${
        isSelected
          ? 'border-primary shadow-lg bg-primary/5'
          : 'border-border hover:border-primary/50 hover:shadow-md'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${visual.iconBg} flex items-center justify-center mb-4`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-bold mb-1">{plan.plan_name}</h3>
      <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
        {plan.description || 'Premium membership plan'}
      </p>
      <div className="text-xl font-bold text-primary">{formatINR(plan.amount)}</div>
      <p className="text-xs text-muted-foreground mt-1">
        Valid for {plan.duration_days} days
      </p>
    </button>
  );
};

const PremiumPlansPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: plans = [], isLoading, isError, error, refetch } = useGetPlansQuery();
  const [selectedCode, setSelectedCode] = React.useState<string | null>(null);

  const handleProceed = () => {
    const plan = plans.find((p) => p.plan_code === selectedCode);
    if (!plan) return;

    dispatch(
      setSelectedPlan({
        plan_code: plan.plan_code,
        plan_name: plan.plan_name,
        amount: plan.amount,
        duration_days: plan.duration_days,
        description: plan.description,
      })
    );
    navigate('/dashboard/premium-checkout');
  };

  const errorMessage =
    error && 'message' in error ? String(error.message) : 'Failed to load membership plans.';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Choose Your Premium Plan</h1>
        <p className="text-muted-foreground mt-1">Select a membership that suits your goals</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading plans...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-destructive">{errorMessage}</p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && plans.length === 0 && (
        <div className="rounded-xl border border-border p-8 text-center text-muted-foreground">
          No active membership plans are available right now.
        </div>
      )}

      {!isLoading && plans.length > 0 && (
        <>
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {plans.map((plan) => (
              <PlanCard
                key={plan.plan_code}
                plan={plan}
                isSelected={selectedCode === plan.plan_code}
                onSelect={() => setSelectedCode(plan.plan_code)}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              className="min-w-[220px] bg-[#2A938F] hover:bg-[#237d7a] text-white font-semibold"
              disabled={!selectedCode}
              onClick={handleProceed}
            >
              Proceed to Payment
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PremiumPlansPage;
