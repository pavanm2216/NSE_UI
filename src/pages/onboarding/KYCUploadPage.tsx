import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CreditCard, Building2, Car, Check, Loader2, ShieldCheck, ShieldX, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { verifyPan, verifyDrivingLicence, verifyBankAccount, PanResult, DLResult, BankResult } from '@/services/kycService';

const STEPS = [
  { id: 1, label: 'PAN Card',  icon: CreditCard },
  { id: 2, label: 'Driving Licence', icon: Car },
  { id: 3, label: 'Bank',     icon: Building2 },
];

type AnyResult = PanResult | DLResult | BankResult;

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
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-gray-600">
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

const KYCUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 — PAN
  const [pan, setPan] = useState('');
  const [panResult, setPanResult] = useState<PanResult | null>(null);

  // Step 2 — Driving Licence
  const [dlFile, setDlFile] = useState<File | null>(null);
  const [dlResult, setDlResult] = useState<DLResult | null>(null);

  // Step 3 — Bank
  const [bankData, setBankData] = useState({ accountNumber: '', name: '', ifsc: '', phone: '' });
  const [bankResult, setBankResult] = useState<BankResult | null>(null);

  const handleVerifyPan = async () => {
    setLoading(true); setPanResult(null);
    const result = await verifyPan(pan.trim().toUpperCase());
    setPanResult(result);
    setLoading(false);
  };

  const handleVerifyDL = async () => {
    if (!dlFile) return;
    setLoading(true); setDlResult(null);
    const result = await verifyDrivingLicence(dlFile);
    setDlResult(result);
    setLoading(false);
  };

  const handleVerifyBank = async () => {
    setLoading(true); setBankResult(null);
    const result = await verifyBankAccount(bankData.accountNumber, bankData.name, bankData.ifsc, bankData.phone);
    setBankResult(result);
    setLoading(false);
  };

  const canProceed =
    (step === 1 && panResult?.success && panResult?.verified) ||
    (step === 2) || // DL is skippable — always allow next
    (step === 3 && bankResult?.success && bankResult?.verified);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      const accountType = localStorage.getItem('lendrix_account_type');
      navigate(accountType === 'organization' ? '/onboarding/org-kyc' : '/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/register');
  };

  const progress = (step / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Join 50,000+ users</h2>
            <p className="text-white/80 max-w-sm mb-8">Start your journey towards financial freedom with India's most trusted platform.</p>
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
              <div className="text-xs text-muted-foreground">KYC Verification</div>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center mb-6">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
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
                    <h2 className="text-xl font-bold mb-1">PAN Card Verification</h2>
                    <p className="text-sm text-muted-foreground">Enter your PAN number to verify your tax identity</p>
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

              {/* Step 2 — Driving Licence (file upload, optional) */}
              {step === 2 && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-xl font-bold">Driving Licence</h2>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Optional</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Upload your driving licence image or PDF to verify</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dlFile">Upload Driving Licence</Label>
                    <label
                      htmlFor="dlFile"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all"
                    >
                      {dlFile ? (
                        <div className="flex flex-col items-center gap-1 text-sm">
                          <Car className="w-6 h-6 text-primary" />
                          <span className="font-medium text-primary">{dlFile.name}</span>
                          <span className="text-xs text-muted-foreground">{(dlFile.size / 1024).toFixed(1)} KB</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-muted-foreground text-sm">
                          <Car className="w-6 h-6" />
                          <span>Click to upload DL image / PDF</span>
                          <span className="text-xs">JPG, PNG, PDF up to 5MB</span>
                        </div>
                      )}
                      <input
                        id="dlFile" type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => { setDlFile(e.target.files?.[0] || null); setDlResult(null); }}
                      />
                    </label>
                  </div>
                  <Button onClick={handleVerifyDL} disabled={loading || !dlFile} className="w-full gradient-primary text-white">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</> : 'Verify Driving Licence'}
                  </Button>
                  {dlResult && <ResultBanner result={dlResult} />}
                </>
              )}

              {/* Step 3 — Bank */}
              {step === 3 && (
                <>
                  <div>
                    <h2 className="text-xl font-bold mb-1">Bank Account Verification</h2>
                    <p className="text-sm text-muted-foreground">Enter your bank account details to verify</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber" placeholder="026291800001191"
                        value={bankData.accountNumber}
                        onChange={(e) => { setBankData({ ...bankData, accountNumber: e.target.value }); setBankResult(null); }}
                        className="h-12 tracking-widest"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Account Holder Name</Label>
                      <Input
                        id="bankName" placeholder="John Doe"
                        value={bankData.name}
                        onChange={(e) => { setBankData({ ...bankData, name: e.target.value }); setBankResult(null); }}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifsc">IFSC Code</Label>
                      <Input
                        id="ifsc" placeholder="YESB0000262"
                        value={bankData.ifsc}
                        onChange={(e) => { setBankData({ ...bankData, ifsc: e.target.value.toUpperCase() }); setBankResult(null); }}
                        className="h-12 uppercase tracking-widest"
                        maxLength={11}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankPhone">Linked Mobile Number</Label>
                      <Input
                        id="bankPhone" type="tel" placeholder="9999999999"
                        value={bankData.phone}
                        onChange={(e) => { setBankData({ ...bankData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }); setBankResult(null); }}
                        className="h-12 tracking-widest"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleVerifyBank}
                    disabled={loading || !bankData.accountNumber || !bankData.ifsc}
                    className="w-full gradient-primary text-white"
                  >
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying...</> : 'Verify Bank Account'}
                  </Button>
                  {bankResult && <ResultBanner result={bankResult} />}
                </>
              )}

              {/* Navigation */}
              <div className="flex gap-3 pt-1">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" /> {step === 1 ? 'Back to Register' : 'Previous'}
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={step !== 2 && !canProceed}
                  className={`flex-1 ${canProceed || step === 2 ? 'gradient-primary text-white' : 'bg-muted text-muted-foreground'}`}
                >
                  {step === 3 ? 'Complete KYC' : step === 2 ? 'Skip / Next' : 'Next'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">Step {step} of {STEPS.length} — KYC Verification</p>
        </div>
      </div>
    </div>
  );
};

export default KYCUploadPage;
