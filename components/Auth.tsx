
import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

interface AuthProps {
  onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          if (!user.emailVerified) {
            // Block access and show verification screen if not verified
            await signOut(auth);
            setRegisteredEmail(email);
            setVerificationSent(true);
            return;
          }
          onClose();
        } catch (err: any) {
          // Requirement: If credentials incorrect, show specific message
          setError("Email or password is incorrect");
        }
      } else {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          if (userCredential.user) {
            // Send verification email and do not sign in automatically
            await sendEmailVerification(userCredential.user);
            await signOut(auth);
            setRegisteredEmail(email);
            setVerificationSent(true);
          }
        } catch (err: any) {
          // Requirement: If the email already exists, show specific message
          if (err.code === 'auth/email-already-in-use') {
            setError("User already exists. Please sign in");
          } else {
            setError(err.message || "An error occurred during sign up");
          }
        }
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setResendStatus('sending');
    try {
      // Re-auth is often needed to get a fresh user object to send email
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      await signOut(auth);
      setResendStatus('sent');
      setTimeout(() => setResendStatus('idle'), 5000);
    } catch (err: any) {
      setError("Could not resend email. Please try logging in again.");
      setVerificationSent(false);
      setResendStatus('idle');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user && result.user.emailVerified) {
        onClose();
      } else if (result.user) {
        await signOut(auth);
        setRegisteredEmail(result.user.email || '');
        setVerificationSent(true);
      }
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed');
    }
  };

  if (verificationSent) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative border border-slate-200 p-8 text-center">
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full text-2xl">
            ✉️
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Email Verification Required</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            We have sent you a verification email to <span className="font-bold text-slate-900">{registeredEmail}</span>. Please verify it and log in.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setVerificationSent(false);
                setIsLogin(true);
                setError('');
              }}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              Login
            </button>
            
            <button
              onClick={handleResendEmail}
              disabled={resendStatus !== 'idle'}
              className="w-full bg-slate-50 text-slate-600 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-all disabled:opacity-50 text-sm"
            >
              {resendStatus === 'sending' ? 'Sending...' : 
               resendStatus === 'sent' ? '✓ Email Resent' : 'Resend Verification Email'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative border border-slate-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 transition-colors"
        >
          ✕
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Premium Financial Intelligence
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-xl text-center font-medium animate-in fade-in zoom-in duration-200">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center space-x-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium mb-6"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            <span>Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">Or email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="ml-1 text-indigo-600 font-bold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
