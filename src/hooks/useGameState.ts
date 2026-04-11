import { useState } from 'react';
import { apiClient } from '../services/apiClient';
import { DEFAULT_BOOK_ID, DEFAULT_CHAPTER_ID, INITIAL_NODE_ID } from '../config/constants';
import type { NextNodeRequest, NextNodeResponse } from '../types/api';

interface GameState {
  currentNode: NextNodeResponse | null;
  currentNodeId: string | null;
  chapterId: string | null;
  bookId: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useGameState(playerId: string | null) {
  const [gameState, setGameState] = useState<GameState>({
    currentNode: null,
    currentNodeId: null,
    chapterId: null,
    bookId: null,
    isLoading: false,
    error: null,
  });

  const login = async (playerId: string) => {
    setGameState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiClient.login({ playerId });
      setGameState((prev) => ({
        ...prev,
        playerId: response.playerId,
        bookId: DEFAULT_BOOK_ID,
        isLoading: false,
      }));

      // Load saved state from Player State MS
      try {
        const savedState = await apiClient.getSaveState(response.playerId, DEFAULT_BOOK_ID);
        if (savedState.currentNodeId && savedState.currentNodeId !== '__unset__') {
          // Resume from saved node
          const nodeResponse = await apiClient.getNextNode({
            playerId: response.playerId,
            bookId: DEFAULT_BOOK_ID,
            currentNodeId: savedState.currentNodeId,
            chapterId: DEFAULT_CHAPTER_ID,
          });
          setGameState((prev) => ({
            ...prev,
            currentNode: nodeResponse,
            currentNodeId: nodeResponse.nodeId,
            isLoading: false,
          }));
          return;
        }
      } catch {
        // No saved state, continue with new game
        console.log('No saved state found, starting new game');
      }

      // Start new game
      await startGame(DEFAULT_CHAPTER_ID);
    } catch (error) {
      setGameState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
      }));
    }
  };

  const getNextNode = async (nodeId: string, chapterId: string, chosenOptionId?: string) => {
    if (!playerId) {
      setGameState((prev) => ({ ...prev, error: 'Player not authenticated' }));
      return;
    }

    setGameState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const request: NextNodeRequest = {
        playerId,
        bookId: gameState.bookId || DEFAULT_BOOK_ID,
        currentNodeId: nodeId,
        chapterId,
        chosenOptionId,
      };
      const response = await apiClient.getNextNode(request);

      setGameState({
        currentNode: response,
        currentNodeId: response.nodeId,
        chapterId,
        bookId: gameState.bookId || DEFAULT_BOOK_ID,
        isLoading: false,
        error: null,
      });

      // Save progress to Player State MS
      try {
        await apiClient.updateState({
          playerId,
          bookId: gameState.bookId || DEFAULT_BOOK_ID,
          currentNodeId: response.nodeId,
          stateVariables: {},
        });
      } catch (e) {
        console.error('Failed to save state:', e);
      }

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
    setGameState({
      currentNode: null,
      currentNodeId: null,
      chapterId: null,
      bookId: null,
      isLoading: false,
      error: null,
    });
  };

  const startGame = (chapterId: string = DEFAULT_CHAPTER_ID) => {
    // Start from node_001 (first node in the graph)
    return getNextNode(INITIAL_NODE_ID, chapterId);
  };

  return {
    ...gameState,
    playerId,
    login,
    getNextNode,
    startGame,
    resetGame,
  };
}
