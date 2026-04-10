import { useState } from 'react';

interface LoginScreenProps {
  onLogin: (playerId: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [playerId, setPlayerId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerId.trim()) {
      onLogin(playerId.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">FourReal</h1>
        <p className="text-center text-gray-600 mb-6">Visual Novel Game</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="playerId" className="block text-sm font-medium text-gray-700 mb-2">
              Player ID
            </label>
            <input
              type="text"
              id="playerId"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder="Enter your player ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Login
          </button>
        </form>
        <p className="text-xs text-center text-gray-500 mt-4">
          MVP: Enter any player ID to start
        </p>
      </div>
    </div>
  );
}
