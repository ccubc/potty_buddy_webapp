import { useState } from 'react';
import { apiClient } from '../lib/api';

interface UserRegistrationProps {
  onUserCreated: (userId: number, username: string) => void;
}

export default function UserRegistration({ onUserCreated }: UserRegistrationProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Login or create user
      const result = await apiClient.loginOrCreateUser(username.trim(), password);
      onUserCreated(result.user.id, result.user.username);
      
      // Show success message based on whether it's a new user or login
      if (result.isNewUser) {
        console.log('Account created successfully!');
      } else {
        console.log('Welcome back!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login or create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/peppa_potty_logo.png" 
              alt="Potty Buddy Logo" 
              className="w-60 h-60 md:w-72 md:h-72 object-contain transition-transform hover:scale-105"
              loading="eager"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Potty Buddy</h2>
          <p className="text-gray-600">Track your child's potty training progress</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Enter username..."
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter password..."
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In / Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Enter your username and password to sign in or create a new account!
          </p>
        </div>
      </div>
    </div>
  );
} 