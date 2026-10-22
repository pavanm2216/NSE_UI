import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CreditCard, FileText, Building2, Award, Check, Loader2, ShieldCheck, ShieldX, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { verifyPan, verifyGst, verifyCin, verifyUam, PanResult, GstResult, CinResult, UamResult } from '@/services/kycService';

const STEPS = [
  { id: 1, label: 'PAN',  icon: CreditCard },
  { id: 2, label: 'GST',  icon: FileText },
  { id: 3, label: 'CIN',  icon: Building2 },
  { id: 4, label: 'UAM',  icon: Award },
];

type AnyResult = PanResult | GstResult | CinResult | UamResult;

const ResultBanner: React.FC<{ result: AnyResult }> = ({ result }) => {
  if (result.success && result.verified) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-green-200 bg-green-50 p-4 space-y-2"
      >
        <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
          <ShieldCheck className="w-4 h-4" /> Verified Successfully
        </div>
        <div className="grid grid-cols-1 gap-y-0.5 text-xs text-gray-600">
          {Object.entries(result)
            .filter(([k, v]) => !['success', 'verified', 'message'].includes(k) && v)
            .map(([k, v]) => (
              <span key={k}>
                <span className="font-medium capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span> {String(v)}
              </span>
            ))}
        </div>
        <p className="text-xs text-green-600 font-medium">{result.message}</p>
      </motion.div>
    );
  }
  const isWarn = result.success && !result.verified;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 flex items-start gap-2 text-sm ${
        isWarn ? 'border-yellow-200 bg-yellow-50 text-yellow-700' : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      {isWarn ? <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <ShieldX className="w-4 h-4 mt-0.5 shrink-0" />}
      <span>{result.message}</span>
    </motion.div>
  );
};

const OrgKYCPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [pan, setPan] = useState('');
  const [panResult, setPanResult] = useState<PanResult | null>(null);

  const [gst, setGst] = useState('');
  const [gstResult, setGstResult] = useState<GstResult | null>(null);

  const [cin, setCin] = useState('');
  const [cinResult, setCinResult] = useState<CinResult | null>(null);

  const [uam, setUam] = useState('');
  const [uamResult, setUamResult] = useState<UamResult | null>(null);

  const handleVerifyPan = async () => {
    setLoading(true); setPanResult(null);
    setPanResult(await verifyPan(pan.trim().toUpperCase()));
    setLoading(false);
  };

  const handleVerifyGst = async () => {
    setLoading(true); setGstResult(null);
    setGstResult(await verifyGst(gst.trim().toUpperCase()));
    setLoading(false);
  };

  const handleVerifyCin = async () => {
    setLoading(true); setCinResult(null);
    setCinResult(await verifyCin(cin.trim().toUpperCase()));
    setLoading(false);
  };

  const handleVerifyUam = async () => {
    setLoading(true); setUamResult(null);
    setUamResult(await verifyUam(uam.trim().toUpperCase()));
    setLoading(false);
  };

  const canProceed =
    (step === 1 && panResult?.success && panResult?.verified) ||
    (step === 2 && gstResult?.success && gstResult?.verified) ||
    (step === 3 && cinResult?.success && cinResult?.verified) ||
    step === 4; // UAM is optional

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else navigate('/dashboard');
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/onboarding/kyc');
  };

  const progress = (step / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Organisation Verification</h2>
            <p className="text-white/80 max-w-sm mb-8">Complete your organisation's KYC to unlock all business features on Lendrix.</p>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {[
                { label: 'Loans Processed', value: '₹1,200 Cr+' },
                { label: 'Investments', value: '₹2,500 Cr+' },
                { label: 'Properties Listed', value: '5,000+' },
                { label: 'Expert Consultants', value: '500+' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left border border-white/20">
                  <div className="text-xl font-bold number-display text-white">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-[#f5f6fa] overflow-y-auto">
        <div className="w-full max-w-lg">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <img src="/logo.png" alt="Lendrix" className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-base leading-tight">Lendrix Ventech</div>
              <div className="text-xs text-muted-foreground">Organisation KYC</div>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center mb-6">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1 min-w-[50px]">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    s.id < step ? 'bg-green-500 text-white' :
                    s.id === step ? 'bg-primary text-white shadow-md shadow-primary/30' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {s.id < step ? <Check className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs font-medium ${s.id === step ? 'text-primary' : 'text-muted-foreground'}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-5 rounded-full transition-colors ${s.id < step ? 'bg-green-400' : 'bg-muted'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.28 }}
              className="bg-white rounded-2xl shadow-sm border border-border p-5 sm:p-8 space-y-6"
            >

              {/* Step 1 — PAN */}
              {step === 1 && (
                <>
                  <div>
                    <h2 className="text-xl font-bold mb-1">PAN Verification</h2>
                    <p className="text-sm text-muted-foreground">Enter your organisation's PAN number</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number</Label>
                    <Input
                      id="pan" placeholder="ABCDE1234F"
                      value={pan}
                      onChange={(e) => { setPan(e.target.value.toUpperCase()); setPanResult(null); }}
                      maxLength={10}
                      className="tracking-[0.3em] uppercase text-center text-base font-bold h-12"
                    />
                    <p className="text-xs text-muted-foreground">Format: 5 letters + 4 digits + 1 letter</p>
                  </div>
                  <Button onClick={handleVerifyPan} disabled={loading || pan.length < 10} className="w-full gradient-primary text-white">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</> : 'Verify PAN'}
                  </Button>
                  {panResult && <ResultBanner result={panResult} />}
                </>
              )}

              {/* Step 2 — GST */}
              {step === 2 && (
                <>
                  <div>
                    <h2 className="text-xl font-bold mb-1">GST Verification</h2>
                    <p className="text-sm text-muted-foreground">Enter your organisation's GST number</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gst">GST Number</Label>
                    <Input
                      id="gst" placeholder="29AACCO0639A1ZT"
                      value={gst}
                      onChange={(e) => { setGst(e.target.value.toUpperCase()); setGstResult(null); }}
                      maxLength={15}
                      className="tracking-widest uppercase text-center text-base font-bold h-12"
                    />
                    <p className="text-xs text-muted-foreground">15-character GST Identification Number</p>
                  </div>
                  <Button onClick={handleVerifyGst} disabled={loading || gst.length < 15} className="w-full gradient-primary text-white">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</> : 'Verify GST'}
                  </Button>
                  {gstResult && <ResultBanner result={gstResult} />}
                </>
              )}

              {/* Step 3 — CIN */}
              {step === 3 && (
                <>
                  <div>
                    <h2 className="text-xl font-bold mb-1">CIN Verification</h2>
                    <p className="text-sm text-muted-foreground">Enter your Company Identification Number</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cin">CIN Number</Label>
                    <Input
                      id="cin" placeholder="U72900KA2018PTC118488"
                      value={cin}
                      onChange={(e) => { setCin(e.target.value.toUpperCase()); setCinResult(null); }}
                      maxLength={21}
                      className="tracking-widest uppercase text-center text-base font-bold h-12"
                    />
                    <p className="text-xs text-muted-foreground">21-character Corporate Identification Number</p>
                  </div>
                  <Button onClick={handleVerifyCin} disabled={loading || cin.length < 21} className="w-full gradient-primary text-white">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</> : 'Verify CIN'}
                  </Button>
                  {cinResult && <ResultBanner result={cinResult} />}
                </>
              )}

              {/* Step 4 — UAM (Optional) */}
              {step === 4 && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-xl font-bold">Udyam / UAM Verification</h2>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Optional</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Enter your Udyam registration number or skip to continue</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uam">Udyam Number</Label>
                    <Input
                      id="uam" placeholder="UDYAM-KR-03-0005831"
                      value={uam}
                      onChange={(e) => { setUam(e.target.value.toUpperCase()); setUamResult(null); }}
                      className="tracking-widest uppercase text-center text-base font-bold h-12"
                    />
                  </div>
                  <Button onClick={handleVerifyUam} disabled={loading || !uam} className="w-full gradient-primary text-white">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</> : 'Verify UAM'}
                  </Button>
                  {uamResult && <ResultBanner result={uamResult} />}
                </>
              )}

              {/* Navigation */}
              <div className="flex gap-3 pt-1">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={step !== 4 && !canProceed}
                  className={`flex-1 ${canProceed || step === 4 ? 'gradient-primary text-white' : 'bg-muted text-muted-foreground'}`}
                >
                  {step === 4 ? 'Complete KYC' : 'Next'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">Step {step} of {STEPS.length} — Organisation KYC</p>
        </div>
      </div>
    </div>
  );
};

export default OrgKYCPage;
