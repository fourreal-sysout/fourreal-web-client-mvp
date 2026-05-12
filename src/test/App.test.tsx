import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

const { mockLogin, mockGetNextNode, mockGetPlayerState, mockGetSaveState, mockUpdateState } =
  vi.hoisted(() => ({
    mockLogin: vi.fn(),
    mockGetNextNode: vi.fn(),
    mockGetPlayerState: vi.fn(),
    mockGetSaveState: vi.fn(),
    mockUpdateState: vi.fn(),
  }));

vi.mock('../services/apiClient', () => ({
  apiClient: {
    login: mockLogin,
    getNextNode: mockGetNextNode,
    getPlayerState: mockGetPlayerState,
    getSaveState: mockGetSaveState,
    updateState: mockUpdateState,
  },
}));

const loginResponse = { token: 'mock-jwt', playerId: 'player-001' };

const firstNode = {
  nodeId: 'node_001',
  type: 'NODE_TYPE_DIALOGUE',
  text: 'The story begins.',
  speaker: 'Narrator',
  isChapterEnd: false,
};

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  mockGetSaveState.mockRejectedValue(new Error('no save'));
  mockUpdateState.mockResolvedValue({ success: true });
  mockGetPlayerState.mockRejectedValue(new Error('no state'));
});

describe('App — handleStartGame', () => {
  it('navigates to game screen when startGame succeeds', async () => {
    mockLogin.mockResolvedValue(loginResponse);
    mockGetNextNode.mockResolvedValue(firstNode);

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText(/player id/i), {
      target: { value: 'player-001' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(screen.getByText('Player Dashboard')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /start game/i }));

    await waitFor(() => expect(screen.getByText('The story begins.')).toBeInTheDocument());
  });

  it('stays on dashboard when startGame fails (downstream error)', async () => {
    mockLogin.mockResolvedValue(loginResponse);
    mockGetNextNode.mockRejectedValue(new Error('gRPC UNAVAILABLE'));

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText(/player id/i), {
      target: { value: 'player-001' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(screen.getByText('Player Dashboard')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /start game/i }));

    await waitFor(() => expect(screen.getByText('Player Dashboard')).toBeInTheDocument());
  });
});
