import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDemoStore } from '../../store/useDemoStore';
import { BrandLogo } from '../../components/layout/BrandLogo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setAdminAuthenticated } = useDemoStore();
  const [email, setEmail] = useState('demo@futureshuttles.example');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthenticated(true);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#F6F2EB] flex flex-col justify-center items-center p-4 text-left">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <BrandLogo size="lg" className="justify-center" />
          <h2 className="font-serif text-2xl font-normal text-ink pt-2">
            Admin Backend Portal
          </h2>
          <p className="text-xs text-ink-3">
            Prototype demonstration environment for evaluation
          </p>
        </div>

        <div className="bg-surface rounded-xl p-8 border border-border shadow-sh-2 space-y-5">
          <div className="p-3 bg-accent-soft/60 rounded-md border border-accent/20 flex items-center gap-2 text-xs text-ink">
            <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
            <span>Pre-filled credentials. Click below to enter.</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Staff Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Enter Demo Admin
              </Button>
            </div>
          </form>

          <div className="pt-2 text-center">
            <Link to="/" className="text-xs text-ink-3 hover:text-ink underline">
              Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
