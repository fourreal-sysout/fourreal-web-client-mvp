import type { PlayerStateResponse } from '../types/api';

interface PlayerStateProps {
  playerState: PlayerStateResponse | null;
  onStartGame: () => void;
  onLogout: () => void;
}

export function PlayerState({ playerState, onStartGame, onLogout }: PlayerStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Player Dashboard</h2>
      <div className="space-y-4">
        {playerState ? (
          <>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Player ID:</span>
              <span className="font-mono text-gray-900">{playerState.playerId}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">VIP Status:</span>
              <span className={playerState.isVip ? 'text-purple-600 font-bold' : 'text-gray-600'}>
                {playerState.isVip ? '✨ VIP' : 'Free'}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">💎 Diamonds:</span>
              <span className="font-mono text-purple-600 font-bold">{playerState.diamondBalance}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">🔑 Keys:</span>
              <span className="font-mono text-blue-600 font-bold">{playerState.keyBalance}</span>
            </div>
          </>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-500">Loading player data...</span>
          </div>
        )}
      </div>
      <div className="mt-6 space-x-4">
        <button
          onClick={onStartGame}
          className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Start Game
        </button>
        <button
          onClick={onLogout}
          className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
