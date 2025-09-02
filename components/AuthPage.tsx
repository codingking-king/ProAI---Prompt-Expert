import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SparklesIcon } from './icons/SparklesIcon';
import Spinner from './common/Spinner';
import { LockIcon } from './icons/LockIcon';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { toast } from 'react-hot-toast';

const InputField: React.FC<{id: string, type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon: React.ReactNode}> = 
({ id, type, placeholder, value, onChange, icon }) => (
    <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
        </span>
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
            className="w-full pl-10 pr-3 py-2.5 bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
    </div>
);

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login, signup } = useAuth();

    const handleToggleMode = () => {
        setIsLogin(!isLogin);
        setError(null);
        setName('');
        setEmail('');
        setPassword('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password || (!isLogin && !name)) {
            setError("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(name, email, password);
                toast.success('Account created successfully! Please sign in.');
                setIsLogin(true);
                setName('');
                setPassword('');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4 transition-colors duration-300">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <SparklesIcon className="w-12 h-12 text-indigo-500 dark:text-indigo-400 mx-auto" />
                    <h1 className="text-4xl font-bold mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">
                        Welcome to ProAI
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{isLogin ? 'Sign in to your account' : 'Create an account to get started'}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <InputField 
                                id="name"
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                icon={<UserCircleIcon className="w-5 h-5 text-slate-400"/>}
                            />
                        )}
                        <InputField 
                            id="email"
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<EnvelopeIcon className="w-5 h-5 text-slate-400"/>}
                        />
                         <InputField 
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<LockIcon className="w-5 h-5 text-slate-400"/>}
                        />

                        {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}
                        
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-md shadow-lg transition-all duration-200 ease-in-out hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner />
                                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                                    </>
                                ) : (
                                    isLogin ? 'Sign In' : 'Create Account'
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={handleToggleMode} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline ml-1 focus:outline-none">
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;