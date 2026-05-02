# Casamento - Next.js

Aplicação web de casamento com:
- Página pública de RSVP
- Dashboard admin
- API route de guest login com rate limit
- Persistência local em `data/db.json`

## Fix aplicado
Foi corrigida a assinatura de `rateLimit` no endpoint `app/api/guest-login/route.ts`, removendo o segundo argumento para compatibilidade com a função utilitária tipada atual.

## Scripts
- `pnpm dev`
- `pnpm build`
- `pnpm start`
