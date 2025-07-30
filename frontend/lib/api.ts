const API_BASE_URL = 'https://potty-buddy-webapp.onrender.com/api';

export interface User {
  id: number;
  username: string;
  created_at: string;
}

export interface Event {
  id: number;
  event_type: 'dirty_pants' | 'potty';
  created_at: string;
}

export interface Statistics {
  dailyEvents: Array<{
    event_type: 'dirty_pants' | 'potty';
    date: string;
    count: string;
  }>;
  totals: {
    dirty_pants?: number;
    potty?: number;
  };
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Check if username exists
  async checkUsername(username: string): Promise<{ exists: boolean; user: User | null }> {
    return this.request<{ exists: boolean; user: User | null }>(`/users/${encodeURIComponent(username)}`);
  }

  // Login or create user
  async loginOrCreateUser(username: string, password: string): Promise<{ message: string; user: User; isNewUser: boolean }> {
    return this.request<{ message: string; user: User; isNewUser: boolean }>('/users', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // Log new event
  async logEvent(userId: number, eventType: 'dirty_pants' | 'potty'): Promise<{ message: string; event: Event }> {
    return this.request<{ message: string; event: Event }>('/events', {
      method: 'POST',
      body: JSON.stringify({ userId, eventType }),
    });
  }

  // Get user statistics
  async getStatistics(userId: number): Promise<Statistics> {
    return this.request<Statistics>(`/events/${userId}`);
  }
}

export const apiClient = new ApiClient(); 