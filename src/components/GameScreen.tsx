import type { NextNodeResponse } from '../types/api';

interface GameScreenProps {
  currentNode: NextNodeResponse | null;
  isLoading: boolean;
  error: string | null;
  onNext: () => void;
  onBackToMenu: () => void;
}

export function GameScreen({ currentNode, isLoading, error, onNext, onBackToMenu }: GameScreenProps) {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={onBackToMenu}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  if (!currentNode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <p className="text-gray-600 mb-4">No node loaded</p>
          <button
            onClick={onBackToMenu}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">FourReal</h1>
            <button
              onClick={onBackToMenu}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Node Type Badge */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
              {currentNode.type}
            </span>
          </div>

          {/* Speaker */}
          {currentNode.speaker && (
            <div className="mb-4">
              <h2 className="text-xl font-bold text-purple-700">{currentNode.speaker}</h2>
            </div>
          )}

          {/* Text */}
          <div className="mb-8">
            <p className="text-lg text-gray-800 leading-relaxed">{currentNode.text || '\u00a0'}</p>
          </div>

          {/* Chapter End */}
          {currentNode.isChapterEnd && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">🎉 Chapter Complete!</p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={onNext}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium text-lg"
          >
            {currentNode.isChapterEnd ? 'Next Chapter' : currentNode.type === 'CHOICE' ? 'Continue' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
