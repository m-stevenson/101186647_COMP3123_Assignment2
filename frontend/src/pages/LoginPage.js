// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/user/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-10">Login</h1>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-8 py-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400"
              />
            </div>

            {/* Button */}
            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                className="px-10 py-2.5 rounded-xl bg-rose-400 hover:bg-rose-500 text-white text-sm font-medium shadow-sm transition-transform duration-100 active:scale-95"
              >
                Login
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="text-center text-xs text-red-500 mt-1">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-rose-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
