import { useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Component: Login
 * Functionality: Renders authentication inputs and invokes the login context action.
 * Why it is required: Captures user credentials securely at the UI boundary.
 */
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-950 px-4'>
      <div className='w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-xl'>
        <h2 className='text-xl font-bold text-white mb-2'>ClaimStreams</h2>
        <p className='text-xs text-slate-400 mb-6'>
          Sign in to access your platform dashboard
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>
              Email Address
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='name@company.com'
              className='w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
          </div>
          <div>
            <label className='block text-xs font-medium text-slate-300 mb-1'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='******'
              className='w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all active:scale-95'>
            Sign In to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
