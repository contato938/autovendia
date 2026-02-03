import { dashboardGoogleService } from '@/services/dashboardGoogle';
import { supabase } from '@/lib/supabase/client';

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    rpc: jest.fn(),
  },
}));

describe('dashboardGoogleService', () => {
  const mockFilters = {
    dateRange: { preset: '30d' }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw specific error when RPC fails', async () => {
    // Setup error response
    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: null,
      error: { 
        code: 'PGRST100', 
        message: 'Database connection failed',
        details: null,
        hint: null
      },
    });

    await expect(
      dashboardGoogleService.getDashboardSummary(mockFilters)
    ).rejects.toThrow('Erro ao carregar dashboard: Database connection failed');
  });

  it('should throw validation error when response structure is invalid', async () => {
    // Setup invalid data response (missing required fields)
    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: { marketing: null }, // Missing sales, campaigns
      error: null,
    });

    await expect(
      dashboardGoogleService.getDashboardSummary(mockFilters)
    ).rejects.toThrow('Resposta inválida do servidor');
  });

  it('should return data when response is valid', async () => {
    const mockData = {
      marketing: { spend: { value: 100 } },
      sales: { revenue: { value: 500 } },
      campaigns: [],
    };

    (supabase.rpc as jest.Mock).mockResolvedValue({
      data: mockData,
      error: null,
    });

    const result = await dashboardGoogleService.getDashboardSummary(mockFilters);
    expect(result).toEqual(mockData);
  });
});
