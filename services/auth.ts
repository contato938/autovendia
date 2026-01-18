import { User } from '@/types';
import { http } from './http';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    try {
      return await http.post<{ token: string; user: User }>('/auth/login', { email, password });
    } catch (error: any) {
      if (error.message === 'NO_API_CONFIGURED') {
        // Fallback: mock local
        await delay(600);
        
        // Mock user baseado no email
        const user: User = {
          id: 'u1',
          nome: email.includes('carlos') ? 'Carlos Gerente' : 'Usuário',
          email,
          role: 'admin',
          tenantId: 't1',
          avatarUrl: 'https://i.pravatar.cc/150?u=1'
        };
        
        return {
          token: `token_${email}_${Date.now()}`,
          user
        };
      }
      throw error;
    }
  },

  me: async (token: string): Promise<User> => {
    try {
      return await http.get<User>('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error: any) {
      if (error.message === 'NO_API_CONFIGURED') {
        // Fallback: extrai do token
        await delay(300);
        const emailMatch = token.match(/token_(.+?)_/);
        const email = emailMatch ? emailMatch[1] : 'carlos@autovend.ia';
        
        return {
          id: 'u1',
          nome: email.includes('carlos') ? 'Carlos Gerente' : 'Usuário',
          email,
          role: 'admin',
          tenantId: 't1',
          avatarUrl: 'https://i.pravatar.cc/150?u=1'
        };
      }
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await http.post('/auth/logout');
    } catch (error: any) {
      if (error.message === 'NO_API_CONFIGURED') {
        await delay(200);
        return;
      }
      throw error;
    }
  }
};
