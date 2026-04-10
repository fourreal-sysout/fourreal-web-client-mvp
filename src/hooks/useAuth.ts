import { useState } from 'react';
import { apiClient } from '../services/apiClient';
import type { PlayerStateResponse } from '../types/api';

interface AuthState {
  token: string | null;
  playerId: string | null;
  playerState: PlayerStateResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    token: localStorage.getItem('jwt_token'),
    playerId: localStorage.getItem('player_id'),
    playerState: null,
    isLoading: false,
    error: null,
  });

  const login = async (playerId: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiClient.login({ playerId });
      localStorage.setItem('jwt_token', response.token);
      localStorage.setItem('player_id', response.playerId);
      setAuthState({
        token: response.token,
        playerId: response.playerId,
        playerState: null,
        isLoading: false,
        error: null,
      });
      return response;
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('player_id');
    localStorage.removeItem('current_node_id');
    localStorage.removeItem('chapter_id');
    setAuthState({
      token: null,
      playerId: null,
      playerState: null,
      isLoading: false,
      error: null,
    });
  };

  const fetchPlayerState = async () => {
    if (!authState.playerId) return;
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const state = await apiClient.getPlayerState(authState.playerId);
      setAuthState((prev) => ({ ...prev, playerState: state, isLoading: false }));
      return state;
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch player state',
      }));
      throw error;
    }
  };

  const isAuthenticated = !!authState.token;

  return {
    ...authState,
    login,
    logout,
    fetchPlayerState,
    isAuthenticated,
  };
}
