import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChangePasswordMutation, useLoginMutation } from '@/redux/services/authApi';
import type { AuthApiError } from '@/types/auth.types';

const allowedRoles = [
  { label: "Angel & VC's",        apiRole: 'angel' },
  { label: 'Compliance Team',     apiRole: 'compliance_team' },
  { label: 'Lendrix Team Access', apiRole: 'team_access' },
];

type Step = 'role' | 'email' | 'current' | 'new' | 'success';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('role');

  const [roleOpen, setRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [currentError, setCurrentError] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newError, setNewError] = useState('');

  const [login] = useLoginMutation();
  const [changePassword, { isLoading: submitting }] = useChangePasswordMutation();

  const getApiRole = () => allowedRoles.find(r => r.label === selectedRole)?.apiRole ?? '';

  const handleRoleSelect = (label: string) => {
    setSelectedRole(label);
    setRoleOpen(false);
    setEmail('');
    setEmailError('');
  };

  const handleEmailNext = () => {
    if (!email.trim()) { setEmailError('Please enter your email.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Please enter a valid email.'); return; }
    setEmailError('');
    setStep('current');
  };

  const handleCurrentNext = () => {
    if (!currentPassword) { setCurrentError('Please enter your current password.'); return; }
    setCurrentError('');
    setStep('new');
  };

  const handleNewPassword = async () => {
    if (newPassword.length < 6) { setNewError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setNewError('Passwords do not match.'); return; }
    setNewError('');

    try {
      // Step 1: Login with current credentials to obtain Bearer token
      const loginData = await login({
        email: email.trim(),
        password: currentPassword,
        role: getApiRole(),
      }).unwrap();

      // Step 2: Call change-password with the obtained token
      await changePassword({
        role: getApiRole(),
        email: email.trim(),
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
        token: loginData.access_token,
      }).unwrap();

      setStep('success');
    } catch (err) {
      const apiError = err as { data?: AuthApiError };
      setNewError(apiError?.data?.message || 'Invalid credentials or failed to change password.');
    }
  };

  const stepNumber = { role: 1, email: 2, current: 3, new: 4, success: 5 };
  const steps = ['Role', 'Email', 'Current Password', 'New Password'];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <img src="/logo.png" alt="Lendrix Ventech" className="w-10 h-10" />
            </div>
            <div>
              <div className="font-bold text-2xl text-foreground">Lendrix Ventech</div>
              <div className="text-sm text-muted-foreground">Empowering Entrepreneurs & Ecosystem</div>
            </div>
          </Link>

          <h1 className="text-3xl font-bold mb-1">Reset Password</h1>
          <p className="text-muted-foreground mb-6">Follow the steps to reset your password</p>

          {/* Step Indicator */}
          {step !== 'success' && (
            <div className="flex items-center gap-2 mb-8">
              {steps.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      stepNumber[step] > i + 1 ? 'bg-green-500 text-white' :
                      stepNumber[step] === i + 1 ? 'bg-primary text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {stepNumber[step] > i + 1 ? '✓' : i + 1}
                    </div>
                    <span className="text-[10px] text-muted-foreground hidden sm:block">{s}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-4 transition-colors ${stepNumber[step] > i + 1 ? 'bg-green-500' : 'bg-muted'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Step 1 — Select Role */}
          {step === 'role' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="space-y-2">
                <Label>Select Your Role</Label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRoleOpen(o => !o)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-lg text-sm transition-all ${
                      roleOpen ? 'border-primary border-2' : 'border-border hover:border-primary'
                    }`}
                  >
                    <span className={selectedRole ? 'text-foreground' : 'text-muted-foreground'}>
                      {selectedRole || 'Select role'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${roleOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {roleOpen && (
                    <ul className="absolute z-20 mt-1 w-full bg-white border border-border rounded-lg shadow-lg overflow-hidden">
                      {allowedRoles.map(r => (
                        <li key={r.label}>
                          <button
                            type="button"
                            onClick={() => handleRoleSelect(r.label)}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary hover:text-white transition-colors"
                          >
                            {r.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <Button className="w-full gradient-primary text-primary-foreground" disabled={!selectedRole} onClick={() => setStep('email')}>
                Next
              </Button>
            </motion.div>
          )}

          {/* Step 2 — Email */}
          {step === 'email' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                    className="pl-9"
                  />
                </div>
                {emailError && <p className="text-xs text-red-500">{emailError}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep('role')}>Back</Button>
                <Button className="flex-1 gradient-primary text-primary-foreground" onClick={handleEmailNext}>Next</Button>
              </div>
            </motion.div>
          )}

          {/* Step 3 — Current Password */}
          {step === 'current' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={e => { setCurrentPassword(e.target.value); setCurrentError(''); }}
                    className="pl-9 pr-10"
                  />
                  <button type="button" onClick={() => setShowCurrent(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {currentError && <p className="text-xs text-red-500">{currentError}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep('email')}>Back</Button>
                <Button className="flex-1 gradient-primary text-primary-foreground" onClick={handleCurrentNext}>Next</Button>
              </div>
            </motion.div>
          )}

          {/* Step 4 — New Password */}
          {step === 'new' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showNew ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setNewError(''); }}
                    className="pl-9 pr-10"
                  />
                  <button type="button" onClick={() => setShowNew(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setNewError(''); }}
                    className="pl-9 pr-10"
                  />
                  <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {newError && <p className="text-xs text-red-500">{newError}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep('current')}>Back</Button>
                <Button className="flex-1 gradient-primary text-primary-foreground" disabled={submitting} onClick={handleNewPassword}>
                  {submitting ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 5 — Success */}
          {step === 'success' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold">Password Changed!</h2>
              <p className="text-muted-foreground text-sm">Your password has been successfully updated. Please login with your new password.</p>
              <Button className="w-full gradient-primary text-primary-foreground" onClick={() => navigate('/login?role=admin')}>
                Go to Login
              </Button>
            </motion.div>
          )}

          {step !== 'success' && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Remember your password?{' '}
              <Link to="/login?role=admin" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          )}
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-white/20 max-w-sm mx-auto">
              <div className="text-4xl mb-3">🔐</div>
              <h2 className="text-xl font-bold mb-2">Secure Password Reset</h2>
              <p className="text-white/70 text-sm">Only authorized roles can reset their password through this portal.</p>
            </div>
            <p className="text-white/60 text-sm">Compliance Team · Angel & VC's · Lendrix Team Access</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
