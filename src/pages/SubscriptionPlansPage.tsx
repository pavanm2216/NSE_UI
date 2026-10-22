import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Check, CreditCard } from 'lucide-react';
import Header from '@/components/landing/Header';
import TopHeader from '@/components/landing/TopHeader';
import Footer from '@/components/landing/Footer';

interface SubscriptionPlan {
  id: string;
  name: string;
  duration: string;
  price: number;
  features: string[];
  description: string;
  popular?: boolean;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'privy',
    name: 'Privy Alpha\nLeague',
    duration: 'Lifetime',
    price: 4999,
    description: 'A network initiative connecting people to opportunities.',
    features: [
      // 'Contact up to 20 businesses',
      // 'Detailed business information',
      // 'Priority email support',
      // 'Lifetime access',
    ],
  },
  {
    id: 'angel',
    name: 'Angel Wealth\nLeague',
    duration: 'Lifetime',
    price: 9999,
    description: 'Newedge Portfolio: Smart Diversification for Businesses and Individuals.',
    features: [
      // 'Contact up to 50 businesses',
      // 'Complete business information',
      // 'Priority support 24/7',
      // 'Lifetime access',
      // 'Exclusive deals',
    ],
    popular: true,
  },
  {
    id: 'private',
    name: 'Private Wealth\nLeague',
    duration: 'Lifetime',
    price: 19999,
    description: 'Crafting Intelligent Solutions to Preserve Wealth and Create Enduring Legacies.',
    features: [
      // 'Unlimited business contacts',
      // 'Complete business information',
      // 'Dedicated account manager',
      // 'Priority support 24/7',
      // 'Lifetime access',
      // 'Exclusive deals & early access',
    ],
  },
];

const PlanCard = ({ plan, onSelect, mobile = false }: { plan: SubscriptionPlan; onSelect: (p: SubscriptionPlan) => void; mobile?: boolean }) => {
  const textColor = 'text-white';
  const mutedColor = 'text-white font-bold';

  const backgrounds: Record<string, string> = {
    privy:   'linear-gradient(145deg, hsl(var(--primary)/0.95), hsl(var(--secondary)/0.40))',
    // privy:   'linear-gradient(145deg, hsl(var(--primary)/0.65), hsl(var(--secondary)/0.90))',
    angel:  'linear-gradient(145deg, hsl(var(--primary)/0.65), hsl(var(--secondary)/0.90))',
    // angel:  'linear-gradient(145deg, hsl(var(--primary)), hsl(var(--secondary)))',
    private: 'linear-gradient(145deg, hsl(var(--primary)), hsl(var(--secondary)))',
  };

  // Mobile: smaller triangle, desktop: full size
  const w = mobile ? 210 : 285;
  const h = mobile ? 260 : 350;
  const contentW = mobile ? 125 : 170;
  const bottomOffset = mobile ? 24 : 65;

  return (
    <div
      className={plan.popular ? 'drop-shadow-2xl' : 'drop-shadow-md'}
      style={{
        width: `${w}px`,
        height: `${h}px`,
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        background: backgrounds[plan.id],
        border: 'none',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <div
        className="absolute flex flex-col items-center text-center"
        style={{ bottom: `${bottomOffset}px`, left: '50%', transform: 'translateX(-50%)', width: `${contentW}px` }}
      >
        {/* {plan.popular && <Badge className="mb-1 text-[10px] px-1.5 py-0 bg-white/20 text-white border-0">Most Popular</Badge>} */}
        {/* <span className="text-[10px] font-bold mb-1 px-2 py-0.5 rounded-full bg-white/20 text-white">{plan.duration}</span> */}
        <span className={`${plan.id === 'privy' ? (mobile ? 'text-base' : 'text-lg') : (mobile ? 'text-sm' : 'text-base')} font-bold leading-tight whitespace-pre-line mb-2 ${textColor}`}>{plan.name}</span>
        <span className={`${mobile ? 'text-[10px]' : 'text-xs'} font-semibold leading-snug mb-2 text-center ${mutedColor}`}>{plan.description}</span>
        <ul className={`${mobile ? 'space-y-0.5' : 'space-y-1'} mb-2 text-left w-full`}>
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-1">
              <Check className={`${mobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} shrink-0 mt-0.5 text-white`} />
              <span className={`text-[9px] leading-tight ${mutedColor}`}>{feature}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => onSelect(plan)}
          className="w-full text-[10px] font-semibold py-1 px-2 rounded border-0 transition-colors bg-white text-primary hover:bg-white/90"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

const SubscriptionPlansPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay'>('razorpay');
  const { toast } = useToast();

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Payment Successful!",
        description: `You've successfully subscribed to the ${selectedPlan.name} plan.`,
      });

      // In real app, this would:
      // 1. Process payment via Stripe/Razorpay
      // 2. Update user subscription in database
      // 3. Send confirmation email
      // 4. Redirect to marketplace or dashboard

      setIsPaymentModalOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Select Your Privileged Plan</h1>
          <p className="text-xl text-muted-foreground">
            Get access to verified Businesses and grow your Networth
          </p>
        </div>

        {/* Mobile: vertical stack | Desktop: triangular layout */}

        {/* Mobile layout */}
        <div className="flex flex-col items-center gap-1 md:hidden">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelect={handleSelectPlan} mobile />
          ))}
        </div>

        {/* Desktop triangular layout */}
        <div className="relative w-full max-w-4xl mx-auto hidden md:block" style={{ minHeight: '620px' }}>

          {/* TOP CENTER — Privy League */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '20px' }}>
            <PlanCard plan={plans[0]} onSelect={handleSelectPlan} />
          </div>

          {/* BOTTOM LEFT — Angel League */}
          <div className="absolute" style={{ left: '40px', bottom: '0' }}>
            <PlanCard plan={plans[1]} onSelect={handleSelectPlan} />
          </div>

          {/* BOTTOM RIGHT — Private League */}
          <div className="absolute" style={{ right: '40px', bottom: '0' }}>
            <PlanCard plan={plans[2]} onSelect={handleSelectPlan} />
          </div>

        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include secure payment processing and Further activation
          </p>
        </div>
      </div>

      <Footer />

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="w-[92vw] max-w-sm p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-2 border-b">
            <DialogTitle className="text-sm font-semibold">Complete Your Payment</DialogTitle>
            <DialogDescription className="text-xs">
              {selectedPlan?.name.replace('\n', ' ')} Plan — ₹{selectedPlan?.price}
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[70vh] px-4 py-3 space-y-3">
            <div>
              <Label className="text-xs">Payment Method</Label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <Button
                  variant={paymentMethod === 'razorpay' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('razorpay')}
                  className="h-auto py-2 text-xs"
                >
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    Razorpay
                  </div>
                </Button>
                <Button
                  variant={paymentMethod === 'stripe' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('stripe')}
                  className="h-auto py-2 text-xs"
                >
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    Stripe
                  </div>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <Label htmlFor="cardNumber" className="text-xs">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1 h-8 text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="expiry" className="text-xs">Expiry</Label>
                  <Input id="expiry" placeholder="MM/YY" className="mt-1 h-8 text-xs" />
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-xs">CVV</Label>
                  <Input id="cvv" placeholder="123" className="mt-1 h-8 text-xs" />
                </div>
              </div>
              <div>
                <Label htmlFor="name" className="text-xs">Cardholder Name</Label>
                <Input id="name" placeholder="John Doe" className="mt-1 h-8 text-xs" />
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium">Total Amount</span>
                <span className="text-base font-bold">₹{selectedPlan?.price}</span>
              </div>
              <Button onClick={handlePayment} className="w-full h-8 text-xs">
                Pay Now
              </Button>
            </div>

            <p className="text-[10px] text-center text-muted-foreground pb-1">
              Secure & encrypted. By proceeding you agree to our terms.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlansPage;
