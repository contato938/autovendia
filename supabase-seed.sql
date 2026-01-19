-- Script de Seed para Popular o Banco com Dados de Teste
-- Execute no SQL Editor do Supabase Dashboard

-- ========================================
-- 0. SEED TENANT: GARCIA AUTO PEÇAS
-- ========================================
INSERT INTO public.tenants (id, nome, cnpj, logo_url)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Garcia Auto Peças',
  '12.345.678/0001-90',
  NULL
)
ON CONFLICT (id) DO UPDATE
SET nome = EXCLUDED.nome,
    cnpj = EXCLUDED.cnpj,
    updated_at = now();

-- ========================================
-- 1. CAMPANHAS DE EXEMPLO
-- ========================================
INSERT INTO public.campaigns (tenant_id, platform, name, status, spend, leads, purchases, revenue, roas)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'google', 'Google Search - Peças Automotivas SP', 'active', 5234.50, 87, 12, 24680.00, 4.71),
  ('11111111-1111-1111-1111-111111111111', 'google', 'Google Search - Freios e Suspensão', 'active', 3890.20, 65, 9, 18450.00, 4.74),
  ('11111111-1111-1111-1111-111111111111', 'google', 'Google Search - Amortecedores', 'active', 3245.80, 54, 8, 16320.00, 5.03),
  ('11111111-1111-1111-1111-111111111111', 'google', 'Google Display - Manutenção Veículos', 'active', 2145.80, 42, 5, 9820.00, 4.58),
  ('11111111-1111-1111-1111-111111111111', 'google', 'Google Shopping - Kit Embreagem', 'active', 1989.50, 35, 6, 12450.00, 6.26),
  ('11111111-1111-1111-1111-111111111111', 'google', 'Google Performance Max - Auto Peças', 'active', 4567.30, 72, 11, 22340.00, 4.89),
  ('11111111-1111-1111-1111-111111111111', 'google', 'Google Search - Filtros e Óleos', 'active', 1678.90, 28, 4, 7850.00, 4.68),
  ('11111111-1111-1111-1111-111111111111', 'google', 'Google Display - Pneus e Alinhamento', 'paused', 1234.50, 21, 2, 4560.00, 3.69),
  ('11111111-1111-1111-1111-111111111111', 'google', 'Google Search - Baterias Automotivas', 'active', 2890.70, 48, 7, 14670.00, 5.08),
  ('11111111-1111-1111-1111-111111111111', 'google', 'Google Shopping - Pastilhas de Freio', 'active', 1567.30, 28, 3, 6240.00, 3.98)
ON CONFLICT DO NOTHING;

-- ========================================
-- 2. LEADS COM ATRIBUIÇÃO COMPLETA
-- ========================================
-- Gerar 50 leads distribuídos entre as campanhas
DO $$
DECLARE
  campaign_record RECORD;
  lead_id uuid;
  i INTEGER;
BEGIN
  FOR campaign_record IN 
    SELECT id, name FROM public.campaigns 
    WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
    ORDER BY RANDOM()
    LIMIT 10
  LOOP
    FOR i IN 1..5 LOOP
      INSERT INTO public.leads (
        tenant_id, 
        campaign_id, 
        name, 
        phone, 
        stage, 
        platform, 
        campaign_name, 
        gclid, 
        utm_source, 
        utm_campaign, 
        utm_medium,
        first_message_at, 
        last_message_at
      )
      VALUES (
        '11111111-1111-1111-1111-111111111111',
        campaign_record.id,
        'Lead ' || campaign_record.name || ' #' || i,
        '+5511' || LPAD(((90000000 + (RANDOM() * 9999999)::int))::text, 8, '0'),
        CASE 
          WHEN i % 5 = 0 THEN 'Vendido'
          WHEN i % 5 = 1 THEN 'Qualificado'
          WHEN i % 5 = 2 THEN 'Em conversa (WhatsApp)'
          WHEN i % 5 = 3 THEN 'Novo'
          ELSE 'Perdido'
        END,
        'google',
        campaign_record.name,
        'gclid_' || md5(random()::text),
        'google',
        'campaign_' || md5(random()::text),
        'cpc',
        NOW() - ((RANDOM() * 720)::int || ' hours')::interval,
        NOW() - ((RANDOM() * 360)::int || ' hours')::interval
      )
      RETURNING id INTO lead_id;
      
      -- Adicionar interações WhatsApp para alguns leads
      IF i % 2 = 0 THEN
        INSERT INTO public.lead_interactions (lead_id, type, direction, content, created_at)
        VALUES 
          (lead_id, 'whatsapp', 'in', 'Oi, tenho interesse no produto! Pode me passar mais informações?', NOW() - ((RANDOM() * 300)::int || ' hours')::interval),
          (lead_id, 'whatsapp', 'out', 'Olá! Tudo bem? Claro! Nossos produtos têm garantia de 12 meses...', NOW() - ((RANDOM() * 290)::int || ' hours')::interval),
          (lead_id, 'whatsapp', 'in', 'Legal! Qual o prazo de entrega?', NOW() - ((RANDOM() * 280)::int || ' hours')::interval),
          (lead_id, 'whatsapp', 'out', 'Entregamos em até 3 dias úteis para sua região!', NOW() - ((RANDOM() * 270)::int || ' hours')::interval);
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- ========================================
-- 3. MARCAR LEADS VENDIDOS COM VALOR
-- ========================================
UPDATE public.leads
SET 
  sale_value = (1200 + (random() * 1800))::numeric(10,2),
  sale_currency = 'BRL',
  sale_happened_at = NOW() - ((random() * 30)::int || ' days')::interval,
  sale_status = 'won',
  updated_at = NOW()
WHERE stage = 'Vendido'
  AND tenant_id = '11111111-1111-1111-1111-111111111111';

-- ========================================
-- 4. CONVERSÕES OFFLINE
-- ========================================
-- Criar conversões para os leads vendidos
INSERT INTO public.offline_conversions (
  tenant_id, 
  lead_id, 
  platform, 
  event_name, 
  value, 
  currency, 
  happened_at, 
  sent_at, 
  status
)
SELECT 
  tenant_id,
  id,
  platform,
  'purchase',
  sale_value,
  'BRL',
  sale_happened_at,
  CASE 
    WHEN random() < 0.8 THEN sale_happened_at + '2 hours'::interval
    ELSE NULL
  END,
  CASE 
    WHEN random() < 0.8 THEN 'sent'
    WHEN random() < 0.9 THEN 'queued'
    ELSE 'failed'
  END
FROM public.leads
WHERE stage = 'Vendido'
  AND sale_value IS NOT NULL
  AND tenant_id = '11111111-1111-1111-1111-111111111111';

-- Adicionar algumas conversões com erro
UPDATE public.offline_conversions
SET 
  error_message = 'Error: Invalid GCLID format',
  status = 'failed'
WHERE status = 'failed'
  AND tenant_id = '11111111-1111-1111-1111-111111111111';

-- ========================================
-- 5. VERIFICAÇÃO FINAL
-- ========================================
-- Contar registros criados
SELECT 
  'Campanhas' as tabela, 
  COUNT(*) as total 
FROM public.campaigns 
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
UNION ALL
SELECT 
  'Leads', 
  COUNT(*) 
FROM public.leads 
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
UNION ALL
SELECT 
  'Interações', 
  COUNT(*) 
FROM public.lead_interactions li
JOIN public.leads l ON li.lead_id = l.id
WHERE l.tenant_id = '11111111-1111-1111-1111-111111111111'
UNION ALL
SELECT 
  'Conversões', 
  COUNT(*) 
FROM public.offline_conversions 
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
UNION ALL
SELECT 
  'Leads Vendidos', 
  COUNT(*) 
FROM public.leads 
WHERE stage = 'Vendido' 
  AND tenant_id = '11111111-1111-1111-1111-111111111111';
