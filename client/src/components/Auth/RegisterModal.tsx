import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Calendar } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

interface Props { onSwitch: () => void; }

export default function RegisterModal({ onSwitch }: Props) {
  const { register, googleLogin } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form.name, form.email, form.password);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const res = tokenResponse as any;
        await googleLogin({
          credential: res.credential,
          accessToken: res.access_token,
        });
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Google signup failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google signup failed');
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#dadce0] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-8 sm:p-10 w-full max-w-[448px]"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#e8f0fe] rounded-full flex items-center justify-center mb-4">
            <Calendar className="text-[#1a73e8] w-6 h-6" />
          </div>
          <h1 className="text-2xl font-normal text-gray-900 mb-2">Create account</h1>
          <p className="text-[15px] text-gray-600">to continue to Calendar</p>
        </div>

        <button
          onClick={() => handleGoogleSignup()}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-full py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-500 uppercase tracking-wide">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] text-gray-500 mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-shadow"
            />
          </div>
          <div>
            <label className="block text-[13px] text-gray-500 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-shadow"
            />
          </div>
          <div>
            <label className="block text-[13px] text-gray-500 mb-1.5">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={6}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-shadow"
            />
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a73e8] text-white rounded-full py-2.5 text-sm font-medium hover:bg-[#1557b0] transition-colors disabled:opacity-60 mt-6"
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <p className="mt-8 text-[14px] text-center text-gray-600">
          Already have an account?{' '}
          <button onClick={onSwitch} className="text-[#1a73e8] hover:underline font-medium">
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}