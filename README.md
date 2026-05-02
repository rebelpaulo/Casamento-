# Convite de Casamento — Paulo & Mória

App Next.js 16 (App Router) com Supabase para gerir RSVPs e configurações do evento.

## Funcionalidades

- **Landing pública** (`/`) — apresenta data, local, programa, dress code e hotéis. Renderiza dinamicamente a partir da Supabase.
- **Formulário RSVP** — POST `/api/register` valida payload, faz rate limit por IP e insere via service role (RLS protege escritas indevidas).
- **Dashboard admin** (`/admin`) — autenticação por cookie HTTP-only assinado (HMAC-SHA256, comparação timing-safe). Aprova/rejeita pedidos e edita configurações.
- **Aprovação** — abre WhatsApp (`wa.me`) com mensagem pré-preenchida contendo o link do grupo de convidados.
- **Settings whitelisted** — só chaves conhecidas passam para a BD.

## Variáveis de ambiente

Já fornecidas pela integração Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Específicas da app (configurar em **Vars**):

- `ADMIN_USER` (default: `paulimoria`)
- `ADMIN_PASS` (default: `morianeto`) — **muda em produção**
- `ADMIN_SESSION_SECRET` — string aleatória longa para assinar cookies
- `WHATSAPP_GROUP_LINK` — opcional; preferir guardar em `wedding_settings`

## Schema (Supabase)

- `wedding_settings` — singleton (`id = 1`) com todos os campos do evento.
- `wedding_registrations` — pedidos de RSVP com `status` (`PENDENTE` / `APROVADO` / `REJEITADO`).
- RLS:
  - `wedding_settings` — leitura pública.
  - `wedding_registrations` — `INSERT` público com validação (regex email, limites). Leitura/update/delete só via service role no servidor.

## Scripts

```bash
npm run dev    # desenvolvimento
npm run build  # build de produção
npm start      # servidor de produção
```
