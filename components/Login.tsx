import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast({
        title: 'Validation',
        description: 'Please enter email and password.',
        variant: 'destructive',
      });
      return;
    }
    setSubmitting(true);
    try {
      if (isSignUp) {
        await signUp(email.trim(), password, { name: name.trim() || undefined });
        toast({
          title: 'Sign up successful',
          description: 'Check your email to confirm your account, or sign in if already confirmed.',
        });
      } else {
        await signIn(email.trim(), password);
        toast({ title: 'Signed in', description: 'Welcome back.' });
      }
    } catch (err: any) {
      toast({
        title: isSignUp ? 'Sign up failed' : 'Sign in failed',
        description: err?.message ?? 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">CollabSync Pro</CardTitle>
          <p className="text-sm text-slate-500">
            {isSignUp ? 'Create an account' : 'Sign in to continue'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <Label htmlFor="name">Name (optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Please wait...' : isSignUp ? 'Sign up' : 'Sign in'}
            </Button>
            <button
              type="button"
              onClick={() => setIsSignUp((v) => !v)}
              className="w-full text-center text-sm text-slate-500 hover:text-slate-700"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
