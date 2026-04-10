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
}

export interface NextNodeResponse {
  nodeId: string;
  type: string;
  text: string;
  speaker: string;
  isChapterEnd: boolean;
}
