import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  PlayerStateResponse,
  NextNodeRequest,
  NextNodeResponse,
} from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth interceptor
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/api/v1/auth/login', request);
    return response.data;
  }

  async getPlayerState(playerId: string): Promise<PlayerStateResponse> {
    const response = await this.client.get<PlayerStateResponse>('/api/v1/player/state', {
      params: { playerId },
    });
    return response.data;
  }

  async getNextNode(request: NextNodeRequest): Promise<NextNodeResponse> {
    const response = await this.client.post<NextNodeResponse>('/api/v1/play/next-node', request);
    return response.data;
  }
}

export const apiClient = new ApiClient();
