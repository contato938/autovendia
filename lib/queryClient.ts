import { QueryClient } from '@tanstack/react-query';

/**
 * Configuração global do React Query Client
 * Otimizada para performance com cache adequado e retry policies
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache de 5 minutos - dados permanecem "fresh" por esse tempo
      staleTime: 5 * 60 * 1000,
      
      // Garbage collection após 10 minutos - dados ficam na memória mas marcados como "stale"
      gcTime: 10 * 60 * 1000,
      
      // Não refetch automaticamente quando janela recebe foco
      // (evita requests desnecessárias quando usuário volta à aba)
      refetchOnWindowFocus: false,
      
      // Não refetch ao montar componente se dados estão "fresh"
      refetchOnMount: false,
      
      // Refetch ao reconectar (útil para apps offline-first)
      refetchOnReconnect: 'always',
      
      // Retry apenas 1 vez em caso de erro (não 3x default)
      retry: 1,
      
      // Delay entre retries: 1 segundo
      retryDelay: 1000,
    },
    mutations: {
      // Retry mutations apenas em erros de rede
      retry: (failureCount, error: any) => {
        if (failureCount >= 2) return false;
        return error?.message?.includes('network') || error?.code === 'ECONNREFUSED';
      },
    },
  },
});
