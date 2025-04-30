'use client';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useRedirectIfAuthenticated } from '../hooks/RedirectIfAuthenticated';
import { saveTokens } from '../utils/auth';
import { validateLoginFormUserInputData } from '../utils/validations';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { login } = useUser();
  const { user, loadingUser, checking } = useRedirectIfAuthenticated();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  

  if (loadingUser || checking) {
    return (
      <div className="flex items-center justify-center bg-[#121212]">
        <img src="/loading.svg" alt="Loading..." className="w-16 h-16 animate-spin" />
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    else if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validations = validateLoginFormUserInputData({ username, password });
    if (!validations.isValid) {
      setError(validations.errors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/login/`, {
        username,
        password
      });

      if (response.status === 200) {
        const { access, refresh } = response.data;
        saveTokens({ accessToken: access, refreshToken: refresh });
        login();
        router.push('/servers');
      } else {
        setError({ general: 'Invalid username or password' });
      }
    } catch (err) {
      setError({ general: 'Invalid username or password' });
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center max-h-screen transition-colors duration-300">
      <div className="w-full max-w-md p-10 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#292929] rounded-lg shadow-xl transition-shadow">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4">Welcome Back</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm">Please login to your account</p>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username or Email"
            className="w-full p-4 rounded-md bg-gray-100 dark:bg-[#2c2c2c] text-gray-900 dark:text-gray-100 placeholder-gray-500 border border-gray-300 dark:border-[#444] focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            autoComplete="off"
          />
          {error?.username && <p className="text-red-500 text-sm">{error.username}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-4 rounded-md bg-gray-100 dark:bg-[#2c2c2c] text-gray-900 dark:text-gray-100 placeholder-gray-500 border border-gray-300 dark:border-[#444] focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            autoComplete="off"
          />
          {error?.password && <p className="text-red-500 text-sm">{error.password}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-[#3b3b3b] dark:hover:bg-[#363636] text-white p-4 rounded-md font-semibold transition-colors duration-300 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <img src="/loading.svg" alt="Loading..." className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {error?.general && <p className="text-red-500 text-sm">{error.general}</p>}
        </form>

       
      </div>
    </div>
  );
}
