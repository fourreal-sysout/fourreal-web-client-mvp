export interface LoginRequest {
  playerId: string;
}

export interface LoginResponse {
  token: string;
  playerId: string;
}

export interface PlayerStateResponse {
  playerId: string;
  isVip: boolean;
  diamondBalance: number;
  keyBalance: number;
}

export interface NextNodeRequest {
  playerId: string;
  bookId: string;
  currentNodeId: string;
  chapterId: string;
  chosenOptionId?: string;
}

export interface NextNodeResponse {
  nodeId: string;
  type: string;
  text: string;
  speaker: string;
  isChapterEnd: boolean;
}

export interface SaveStateRequest {
  playerId: string;
  bookId: string;
}

export interface SaveStateResponse {
  currentNodeId: string;
  stateVariables: Record<string, string>;
}

export interface UpdateStateRequest {
  playerId: string;
  bookId: string;
  currentNodeId: string;
  stateVariables: Record<string, string>;
}

export interface UpdateStateResponse {
  success: boolean;
}
