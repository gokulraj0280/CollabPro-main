import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import DecryptedText from '@/components/ui/DecryptedText';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin,
                },
            });

            if (error) {
                setMessage('Error: ' + error.message);
            } else {
                setMessage('Check your email for the login link!');
            }
        } catch (err: any) {
            setMessage('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 glass-panel border border-white/10 rounded-2xl relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col gap-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-black mb-2">
                            <DecryptedText text="CollabSync Pro" speed={50} />
                        </h1>
                        <p className="text-slate-400 text-sm">Sign in via Magic Link or use Demo mode</p>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Sending link...' : 'Send Magic Link'}
                        </button>
                    </form>

                    {message && (
                        <div className="text-center text-sm font-semibold p-3 bg-white/5 rounded-lg border border-white/10">
                            {message}
                        </div>
                    )}

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-500 text-xs">OR</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <button
                        onClick={handleDemoLogin}
                        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
                    >
                        Continue in Demo Mode
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
