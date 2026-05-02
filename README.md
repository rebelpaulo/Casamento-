# Casamento - Next.js

Aplicação web de casamento com:
- Página pública de RSVP
- Dashboard admin
- API route de guest login com rate limit
- Persistência local em `data/db.json`

## Deploy (Vercel)
- `next` está definido em `dependencies`.
- `vercel-build` foi adicionado para forçar build explícito com Next.
- `vercel.json` define `framework: nextjs` e `buildCommand`.

## Scripts
- `npm run dev`
- `npm run build`
- `npm run vercel-build`
- `npm run start`


## Deploy na Vercel (estado atual)

Esta repo está configurada para deploy como **Next.js** via `vercel.json`:
- `framework: nextjs`
- `installCommand: npm install`
- `buildCommand: npm run vercel-build`
- `outputDirectory: .next`

Se a Vercel voltar a mostrar "No Next.js version detected", confirme no projeto Vercel que o **Root Directory** aponta para a pasta raiz desta repo (onde está o `package.json`).
