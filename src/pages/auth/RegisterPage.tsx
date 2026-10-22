import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, User, Phone, Building2, UserCircle2, Car, Loader2, CreditCard, Upload, CheckCircle2, XCircle, Eye, EyeOff, Lock,
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  generateRkycUrl, verifyDrivingLicence, verifyPan, verifyGst, verifyCin, verifyUam,
  DLResult, PanResult, GstResult, CinResult, UamResult,
} from '@/services/kycService';
import { useToast } from '@/hooks/use-toast';

type AccountType = 'individual' | 'organization';

// ─── Reusable file upload box ─────────────────────────────────────────────────
const FileUploadBox: React.FC<{
  id: string;
  label: string;
  file: File | null;
  onChange: (f: File | null) => void;
  icon?: React.ReactNode;
}> = ({ id, label, file, onChange, icon }) => (
  <label
    htmlFor={id}
    className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all"
  >
    {file ? (
      <div className="flex flex-col items-center gap-0.5">
        <CheckCircle2 className="w-4 h-4 text-green-600" />
        <span className="text-xs font-medium text-green-700 max-w-[160px] truncate">{file.name}</span>
        <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
        {icon ?? <Upload className="w-4 h-4" />}
        <span className="text-xs">{label}</span>
      </div>
    )}
    <input id={id} type="file" accept="image/*,.pdf" className="hidden"
      onChange={(e) => onChange(e.target.files?.[0] || null)} />
  </label>
);

// ─── Inline result banner ─────────────────────────────────────────────────────
const ResultBadge: React.FC<{ ok: boolean; msg: string }> = ({ ok, msg }) => (
  <div className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border ${
    ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
  }`}>
    {ok ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
    {msg}
  </div>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section: React.FC<{ title: string; optional?: boolean; children: React.ReactNode }> = ({ title, optional, children }) => (
  <div className="space-y-2 pt-1">
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold">{title}</span>
      {optional && <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">Optional</span>}
    </div>
    {children}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const RegisterPage: React.FC = () => {
  const [accountType, setAccountType] = useState<AccountType>('individual');
  const [formData, setFormData] = useState({ firstName: '', lastName: '', mobile: '', emailId: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // PAN
  const [pan, setPan] = useState('');
  const [panLoading, setPanLoading] = useState(false);
  const [panResult, setPanResult] = useState<PanResult | null>(null);
  const [panFront, setPanFront] = useState<File | null>(null);
  const [panBack, setPanBack] = useState<File | null>(null);

  // GST (org only)
  const [gst, setGst] = useState('');
  const [gstLoading, setGstLoading] = useState(false);
  const [gstResult, setGstResult] = useState<GstResult | null>(null);
  const [gstDoc, setGstDoc] = useState<File | null>(null);

  // CIN (org only)
  const [cin, setCin] = useState('');
  const [cinLoading, setCinLoading] = useState(false);
  const [cinResult, setCinResult] = useState<CinResult | null>(null);
  const [cinDoc, setCinDoc] = useState<File | null>(null);

  // UAM (org only)
  const [uam, setUam] = useState('');
  const [uamLoading, setUamLoading] = useState(false);
  const [uamResult, setUamResult] = useState<UamResult | null>(null);
  const [uamDoc, setUamDoc] = useState<File | null>(null);

  // DL
  const [dlFile, setDlFile] = useState<File | null>(null);
  const [dlLoading, setDlLoading] = useState(false);
  const [dlResult, setDlResult] = useState<DLResult | null>(null);

  // Password
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleVerifyPan = async () => {
    setPanLoading(true); setPanResult(null);
    setPanResult(await verifyPan(pan.trim().toUpperCase()));
    setPanLoading(false);
  };

  const handleVerifyGst = async () => {
    setGstLoading(true); setGstResult(null);
    setGstResult(await verifyGst(gst.trim().toUpperCase()));
    setGstLoading(false);
  };

  const handleVerifyCin = async () => {
    setCinLoading(true); setCinResult(null);
    setCinResult(await verifyCin(cin.trim().toUpperCase()));
    setCinLoading(false);
  };

  const handleVerifyUam = async () => {
    setUamLoading(true); setUamResult(null);
    setUamResult(await verifyUam(uam.trim().toUpperCase()));
    setUamLoading(false);
  };

  const handleVerifyDL = async () => {
    if (!dlFile) return;
    setDlLoading(true); setDlResult(null);
    setDlResult(await verifyDrivingLicence(dlFile));
    setDlLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: 'Weak Password', description: 'Password must be at least 8 characters.', variant: 'destructive' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: 'Password Mismatch', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const uid = `USER_${Date.now()}`;
      const result = await generateRkycUrl({
        uid, ...formData,
        isSendOtp: true,
        isHideExplanationScreen: true,
        redirectionUrl: `${window.location.origin}/onboarding/kyc`,
      });
      if (result.success && result.url) {
        const regUsers = JSON.parse(localStorage.getItem('lendrix_registered_users') || '[]');
        regUsers.push({
          uid, ...formData, accountType,
          transactionId: result.transactionId || '',
          referenceId: result.referenceId || '',
          registeredAt: new Date().toISOString(),
        });
        localStorage.setItem('lendrix_registered_users', JSON.stringify(regUsers));
        localStorage.setItem('lendrix_rkyc_txn', result.transactionId || '');
        localStorage.setItem('lendrix_rkyc_ref', String(result.referenceId || ''));
        localStorage.setItem('lendrix_account_type', accountType);
        window.location.href = result.url;
      } else {
        toast({ title: 'KYC Error', description: result.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const panVerified = panResult?.success && panResult?.verified;
  const gstVerified = gstResult?.success && gstResult?.verified;
  const cinVerified = cinResult?.success && cinResult?.verified;
  const uamVerified = uamResult?.success && uamResult?.verified;

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
      <div className="flex-1 flex items-center justify-center p-6 bg-[#f5f6fa] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-border p-8 my-6"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <img src="/logo.png" alt="Lendrix" className="w-7 h-7" />
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">Lendrix Ventech</div>
              <div className="text-xs text-muted-foreground">Empowering Entrepreneurs & Ecosystem</div>
            </div>
          </Link>

          {/* Account Type Toggle */}
          <div className="flex gap-3 mb-6">
            {(['individual', 'organization'] as AccountType[]).map((type) => (
              <button key={type} type="button" onClick={() => setAccountType(type)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  accountType === type ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-muted-foreground border-border hover:border-primary/50'
                }`}>
                {type === 'individual' ? <UserCircle2 className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                {type === 'individual' ? 'Individual' : 'Organization'}
              </button>
            ))}
          </div>

          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground mb-6">Fill in your details — KYC verification follows next</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Basic Info */}
            {[
              { id: 'firstName', label: accountType === 'organization' ? 'Contact First Name' : 'First Name', placeholder: 'John', icon: <User /> },
              { id: 'lastName',  label: accountType === 'organization' ? 'Contact Last Name'  : 'Last Name',  placeholder: 'Doe',  icon: <User /> },
            ].map(({ id, label, placeholder, icon }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id}>{label}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground">{icon}</span>
                  <Input id={id} name={id} type="text" placeholder={placeholder}
                    value={(formData as any)[id]} onChange={handleChange} className="pl-9" required />
                </div>
              </div>
            ))}

            <div className="space-y-1.5">
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="mobile" name="mobile" type="tel" placeholder="9876543210"
                  value={formData.mobile} onChange={handleChange} className="pl-9" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emailId">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="emailId" name="emailId" type="email" placeholder="you@example.com"
                  value={formData.emailId} onChange={handleChange} className="pl-9" required />
              </div>
            </div>

            {/* ── PAN Verification ── */}
            <Section title="PAN Card">
              <div className="flex gap-2">
                <Input
                  placeholder="ABCDE1234F" maxLength={10}
                  value={pan} onChange={(e) => { setPan(e.target.value.toUpperCase()); setPanResult(null); setPanFront(null); setPanBack(null); }}
                  className="uppercase tracking-widest font-bold text-center h-10 flex-1"
                />
                <Button type="button" variant="outline" size="sm" className="h-10 px-4 shrink-0"
                  onClick={handleVerifyPan} disabled={panLoading || pan.length < 10}>
                  {panLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                </Button>
              </div>
              {panResult && (
                <ResultBadge ok={!!panVerified}
                  msg={panVerified ? `✓ Verified — ${panResult.name || ''}${panResult.panStatus ? ` · ${panResult.panStatus}` : ''}` : panResult.message} />
              )}

              {/* PAN document upload — shown only after verification */}
              {panVerified && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 pt-1">
                  <p className="text-xs text-muted-foreground">Upload PAN card images</p>
                  <div className="grid grid-cols-2 gap-2">
                    <FileUploadBox id="panFront" label="PAN Front" file={panFront} onChange={setPanFront}
                      icon={<CreditCard className="w-4 h-4" />} />
                    <FileUploadBox id="panBack" label="PAN Back" file={panBack} onChange={setPanBack}
                      icon={<CreditCard className="w-4 h-4" />} />
                  </div>
                </motion.div>
              )}
            </Section>

            {/* ── Organization-only fields ── */}
            {accountType === 'organization' && (
              <>
                {/* GST */}
                <Section title="GST Number" optional>
                  <div className="flex gap-2">
                    <Input placeholder="22AAAAA0000A1Z5" maxLength={15}
                      value={gst} onChange={(e) => { setGst(e.target.value.toUpperCase()); setGstResult(null); setGstDoc(null); }}
                      className="uppercase tracking-widest h-10 flex-1" />
                    <Button type="button" variant="outline" size="sm" className="h-10 px-4 shrink-0"
                      onClick={handleVerifyGst} disabled={gstLoading || gst.length < 15}>
                      {gstLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                    </Button>
                  </div>
                  {gstResult && (
                    <ResultBadge ok={!!gstVerified}
                      msg={gstVerified ? `✓ ${gstResult.legalName || gstResult.tradeName || 'GST Verified'}` : gstResult.message} />
                  )}
                  {gstVerified && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="pt-1">
                      <FileUploadBox id="gstDoc" label="Upload GST Certificate" file={gstDoc} onChange={setGstDoc} />
                    </motion.div>
                  )}
                </Section>

                {/* CIN */}
                <Section title="CIN Number" optional>
                  <div className="flex gap-2">
                    <Input placeholder="U12345MH2020PTC123456" maxLength={21}
                      value={cin} onChange={(e) => { setCin(e.target.value.toUpperCase()); setCinResult(null); setCinDoc(null); }}
                      className="uppercase tracking-widest h-10 flex-1" />
                    <Button type="button" variant="outline" size="sm" className="h-10 px-4 shrink-0"
                      onClick={handleVerifyCin} disabled={cinLoading || cin.length < 10}>
                      {cinLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                    </Button>
                  </div>
                  {cinResult && (
                    <ResultBadge ok={!!cinVerified}
                      msg={cinVerified ? `✓ ${cinResult.companyName || 'CIN Verified'}` : cinResult.message} />
                  )}
                  {cinVerified && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="pt-1">
                      <FileUploadBox id="cinDoc" label="Upload Incorporation Certificate" file={cinDoc} onChange={setCinDoc} />
                    </motion.div>
                  )}
                </Section>

                {/* UAM */}
                <Section title="Udyam / UAM Number" optional>
                  <div className="flex gap-2">
                    <Input placeholder="UDYAM-XX-00-0000000" maxLength={19}
                      value={uam} onChange={(e) => { setUam(e.target.value.toUpperCase()); setUamResult(null); setUamDoc(null); }}
                      className="uppercase tracking-widest h-10 flex-1" />
                    <Button type="button" variant="outline" size="sm" className="h-10 px-4 shrink-0"
                      onClick={handleVerifyUam} disabled={uamLoading || uam.length < 5}>
                      {uamLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                    </Button>
                  </div>
                  {uamResult && (
                    <ResultBadge ok={!!uamVerified}
                      msg={uamVerified ? `✓ ${uamResult.nameOfEnterprise || 'UAM Verified'}` : uamResult.message} />
                  )}
                  {uamVerified && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="pt-1">
                      <FileUploadBox id="uamDoc" label="Upload Udyam Certificate" file={uamDoc} onChange={setUamDoc} />
                    </motion.div>
                  )}
                </Section>
              </>
            )}

            {/* ── Driving Licence ── */}
            <Section title="Driving Licence" optional>
              <label htmlFor="dlFile"
                className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all">
                {dlFile ? (
                  <div className="flex flex-col items-center gap-0.5">
                    <Car className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary max-w-[180px] truncate">{dlFile.name}</span>
                    <span className="text-xs text-muted-foreground">{(dlFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
                    <Car className="w-4 h-4" />
                    <span className="text-xs">Click to upload DL image / PDF</span>
                  </div>
                )}
                <input id="dlFile" type="file" accept="image/*,.pdf" className="hidden"
                  onChange={(e) => { setDlFile(e.target.files?.[0] || null); setDlResult(null); }} />
              </label>
              {dlFile && !dlResult && (
                <Button type="button" variant="outline" size="sm" className="w-full" onClick={handleVerifyDL} disabled={dlLoading}>
                  {dlLoading ? <><Loader2 className="w-3 h-3 animate-spin mr-1" />Verifying...</> : 'Verify Driving Licence'}
                </Button>
              )}
              {dlResult && (
                <ResultBadge ok={!!(dlResult.success && dlResult.verified)}
                  msg={dlResult.success && dlResult.verified
                    ? `✓ DL Verified — ${dlResult.name || ''}${dlResult.dob ? ` · DOB: ${dlResult.dob}` : ''}`
                    : dlResult.message} />
              )}
            </Section>

            {/* ── Password ── */}
            <div className="pt-2 border-t border-border space-y-3">
              <p className="text-sm font-semibold">Set Password</p>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password" type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10" required
                  />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <div className="flex gap-1 mt-1">
                    {[8, 12, 16].map((len, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= len ? ['bg-red-400', 'bg-yellow-400', 'bg-green-500'][i] : 'bg-muted'
                      }`} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      {password.length < 8 ? 'Weak' : password.length < 12 ? 'Fair' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword" type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9 pr-10" required
                  />
                  <button type="button" onClick={() => setShowConfirm(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && (
                  <p className={`text-xs ${password === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                    {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground mt-2" disabled={loading}>
              {loading ? 'Generating KYC Link...' : 'Continue to KYC'} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <FcGoogle className="mr-2 w-5 h-5" /> Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
