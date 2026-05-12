import { useState, useEffect, useRef } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { PlayerState } from './components/PlayerState';
import { GameScreen } from './components/GameScreen';
import { useAuth } from './hooks/useAuth';
import { useGameState } from './hooks/useGameState';

type AppView = 'login' | 'dashboard' | 'game';

function App() {
  const { isAuthenticated, playerId, login, logout, fetchPlayerState, playerState } = useAuth();
  const { currentNode, getNextNode, startGame, resetGame, isLoading: gameLoading, chapterId } = useGameState(playerId);
  const [view, setView] = useState<AppView>(() => isAuthenticated ? 'dashboard' : 'login');
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      fetchPlayerState().catch(() => {
        // New player with no saves — playerState stays null, dashboard still renders
      });
    }
  }, [isAuthenticated, fetchPlayerState]);

  const handleLogin = async (playerId: string) => {
    try {
      await login(playerId);
      setView('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleStartGame = async () => {
    try {
      const node = await startGame();
      if (node) {
        setView('game');
      }
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };

  const handleNextNode = async () => {
    if (!currentNode) return;
    try {
      await getNextNode(currentNode.nodeId, chapterId || 'ch_01');
    } catch (error) {
      console.error('Failed to get next node:', error);
    }
  };

  const handleBackToMenu = () => {
    setView('dashboard');
  };

  const handleLogout = () => {
    logout();
    resetGame();
    setView('login');
  };

  if (view === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (view === 'dashboard') {
    return (
      <PlayerState
        playerState={playerState}
        onStartGame={handleStartGame}
        onLogout={handleLogout}
      />
    );
  }

  if (view === 'game') {
    return (
      <GameScreen
        currentNode={currentNode}
        isLoading={gameLoading}
        error={null}
        onNext={handleNextNode}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  return null;
}

export default App;
