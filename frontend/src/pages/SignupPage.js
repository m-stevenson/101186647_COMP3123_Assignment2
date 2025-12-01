// src/pages/SignupPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function SignupPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/user/signup', form);
      setMessage('Signup successful. You can now login.');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-10">Register</h1>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-8 py-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
              />
            </div>

            {/* Button */}
            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                className="px-10 py-3 rounded-xl bg-rose-400 hover:bg-rose-500 text-white text-sm font-medium"
              >
                Register
              </button>
            </div>

            {error && (
              <div className="text-center text-xs text-red-500">
                {error}
              </div>
            )}
            {message && (
              <div className="text-center text-xs text-emerald-600">
                {message}
              </div>
            )}
          </form>
        </div>

        <p className="mt-6 text-center text-sm ">
          Already have an account?
          <Link to="/login" className="text-rose-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
