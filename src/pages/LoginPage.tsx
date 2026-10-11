import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppStore } from '../store';
import { useToast } from '../components/ui/Toast';
import { isValidEmail } from '../lib/validate';
import { ShieldCheck, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAppStore();
  const { toast } = useToast();

  const [email, setEmail] = useState('amara.okafor@proton.me');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (email === 'error@demo.com') {
      setError("We couldn't send a sign-in link. Service temporarily unreachable (simulated error).");
      return;
    }

    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 850));
    setIsLoading(false);
    setIsMagicLinkSent(true);
  };

  const handleCompleteLogin = async () => {
    setIsLoading(true);
    await login(email);
    setIsLoading(false);
    toast({
      type: 'success',
      title: 'Welcome Back',
      message: 'Logged in as Amara Okafor. Sub-wallet connected.'
    });
    navigate('/app');
  };

  const handleSSO = async (provider: string) => {
    setIsLoading(true);
    await login(`${provider.toLowerCase()}@user.meridian`);
    setIsLoading(false);
    toast({
      type: 'success',
      title: 'Authenticated',
      message: `Signed in with ${provider}.`
    });
    navigate('/app');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F5F2EC]">
      {/* Left Brand Panel (Desktop) */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#2C4A3E] text-[#EDE9E1] p-12 flex-col justify-between text-left select-none">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#EDE9E1] relative flex items-center justify-center">
            <div className="w-5 h-[1.5px] bg-[#EDE9E1] -mt-1" />
          </div>
          <span className="font-display font-medium text-2xl tracking-tight text-[#EDE9E1]">
            Meridian
          </span>
        </Link>

        <div className="space-y-4 my-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-[#B08A4E]">
            Deterministic Fairness
          </span>
          <h1 className="text-4xl xl:text-5xl font-display font-normal leading-tight text-[#EDE9E1]">
            “Your pool.
            <br />
            Your proof.”
          </h1>
          <p className="text-sm text-[#C7C1B3] max-w-sm leading-relaxed">
            Eliminating browser wallet extensions and private key management while preserving 100% on-chain cryptographic audibility.
          </p>
        </div>

        <div className="text-xs text-[#A8B5AE] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#B08A4E]" />
          <span>Settled on Base · Chainlink VRF Verifiable</span>
        </div>
      </div>

      {/* Right Form Card */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 text-left">
        <div className="w-full max-w-md bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-8 shadow-[0_6px_20px_rgba(27,36,32,0.08)]">
          <div className="mb-6">
            <Link
              to="/"
              className="text-xs text-[#7C867F] hover:text-[#1B2420] flex items-center gap-1 mb-4 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </Link>
            <h2 className="text-2xl font-display font-medium text-[#1B2420]">
              Sign in to Meridian
            </h2>
            <p className="text-xs text-[#4A5650] mt-1">
              Enter your email or select an SSO provider. No wallet required.
            </p>
          </div>

          {isMagicLinkSent ? (
            /* Magic link inbox screen */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-[#E3EBE6] border border-[#2C4A3E]/20 rounded-md text-xs text-[#2C4A3E] space-y-1">
                <div className="flex items-center gap-2 font-semibold">
                  <Mail className="w-4 h-4" />
                  <span>Check your inbox</span>
                </div>
                <p>
                  We dispatched a secure magic sign-in link to <strong className="font-mono">{email}</strong>.
                </p>
              </div>

              {/* Demo auto-continue control */}
              <div className="p-3 bg-[#FBF9F5] border border-dashed border-[#DDD8CD] rounded text-xs space-y-2">
                <span className="text-[11px] font-semibold text-[#7C867F] uppercase tracking-wider block">
                  Interactive Demo Inbox
                </span>
                <p className="text-[#4A5650]">
                  Click below to instantly simulate opening the received magic link.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  isLoading={isLoading}
                  onClick={handleCompleteLogin}
                >
                  <span>Open Demo Inbox & Continue</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <button
                type="button"
                onClick={() => setIsMagicLinkSent(false)}
                className="text-xs text-[#7C867F] hover:text-[#1B2420] underline text-center w-full block cursor-pointer"
              >
                Use a different email address
              </button>
            </div>
          ) : (
            /* Standard Login Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error || undefined}
                placeholder="name@example.com"
                helperText="Tip: use error@demo.com to test error handling."
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full"
              >
                <span>Continue with Email</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#DDD8CD]" />
                </div>
                <span className="relative bg-[#FFFFFF] px-3 text-[11px] uppercase tracking-wider font-semibold text-[#7C867F]">
                  or continue with
                </span>
              </div>

              {/* SSO Buttons */}
              <div className="space-y-2.5">
                {[
                  { name: 'Google', icon: 'G' },
                  { name: 'Apple', icon: '' },
                  { name: 'Microsoft', icon: 'M' },
                ].map((sso) => (
                  <button
                    key={sso.name}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSSO(sso.name)}
                    className="w-full h-11 px-4 rounded-md border border-[#DDD8CD] bg-[#FBF9F5] hover:bg-[#EDE9E1] text-[#1B2420] text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <span className="font-mono font-bold text-xs">{sso.icon}</span>
                    <span>Continue with {sso.name}</span>
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-[#7C867F] text-center mt-6 leading-relaxed">
                By continuing, you agree to Meridian’s{' '}
                <Link to="/" className="underline hover:text-[#1B2420]">Terms of Participation</Link> and{' '}
                <Link to="/" className="underline hover:text-[#1B2420]">Responsible Eligibility</Link>.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
