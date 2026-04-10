import { useState } from 'react';
import { apiClient } from '../services/apiClient';
import type { NextNodeRequest, NextNodeResponse } from '../types/api';

interface GameState {
  currentNode: NextNodeResponse | null;
  currentNodeId: string | null;
  chapterId: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useGameState(playerId: string | null) {
  const [gameState, setGameState] = useState<GameState>({
    currentNode: null,
    currentNodeId: localStorage.getItem('current_node_id') || null,
    chapterId: localStorage.getItem('chapter_id') || null,
    isLoading: false,
    error: null,
  });

  const getNextNode = async (nodeId: string, chapterId: string) => {
    if (!playerId) {
      setGameState((prev) => ({ ...prev, error: 'Player not authenticated' }));
      return;
    }

    setGameState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const request: NextNodeRequest = {
        playerId,
        bookId: 'book_open_hearts_01', // Hardcoded for MVP
        currentNodeId: nodeId,
        chapterId,
      };
      const response = await apiClient.getNextNode(request);
      
      localStorage.setItem('current_node_id', response.nodeId);
      localStorage.setItem('chapter_id', chapterId);
      
      setGameState({
        currentNode: response,
        currentNodeId: response.nodeId,
        chapterId,
        isLoading: false,
        error: null,
      });
      return response;
    } catch (error) {
      setGameState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to get next node',
      }));
      throw error;
    }
  };

  const resetGame = () => {
    localStorage.removeItem('current_node_id');
    localStorage.removeItem('chapter_id');
    setGameState({
      currentNode: null,
      currentNodeId: null,
      chapterId: null,
      isLoading: false,
      error: null,
    });
  };

  const startGame = (chapterId: string = 'ch_01') => {
    // Start from node_001 (first node in the graph)
    return getNextNode('node_001', chapterId);
  };

  return {
    ...gameState,
    getNextNode,
    startGame,
    resetGame,
  };
}
