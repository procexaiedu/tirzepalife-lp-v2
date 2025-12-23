-- Objetivo: permitir que o chat do site crie um "pré-lead" somente quando o usuário enviar o Form Card,
-- salvando triagem por session_id (ex.: web_123@s.whatsapp.net), sem exigir telefone imediatamente.

-- 1) Permitir pré-lead sem telefone
ALTER TABLE public.clientes
  ALTER COLUMN telefone_whatsapp DROP NOT NULL;

-- 2) Garantir 1 registro por sessão do chat
-- IMPORTANTE:
-- No Postgres, `ON CONFLICT (session_id)` só funciona se existir um índice/constraint UNIQUE
-- "compatível" com a especificação do ON CONFLICT.
--
-- Se você tiver (ou já criou) um índice UNIQUE *parcial* como:
--   CREATE UNIQUE INDEX ... ON public.clientes(session_id) WHERE session_id IS NOT NULL;
-- então o Postgres NÃO aceita `ON CONFLICT (session_id)` sem o WHERE correspondente.
--
-- Recomendação: manter o índice UNIQUE SEM predicado (UNIQUE já permite múltiplos NULL).
DROP INDEX IF EXISTS public.unique_clientes_session_id;
CREATE UNIQUE INDEX unique_clientes_session_id
  ON public.clientes (session_id);

-- 3) (Opcional) Caso você queira controlar por status:
--    - use status_qualificacao para stages do web chat (ex.: 'awaiting_intent', 'awaiting_whatsapp', 'awaiting_name')
--    - mantenha 'qualificado' apenas quando tiver telefone + nome e quiser disparar o fluxo do WhatsApp/vendas.


