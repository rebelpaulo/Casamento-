# Landing Page de Casamento (Paulo Silva + Mória Neto)

## Funcionalidades
- Página pública com formulário RSVP (nome, email, telefone, adultos 1-2, crianças 0-3).
- Dashboard admin protegido por Basic Auth:
  - user: `paulimoria`
  - pass: `morianeto`
- Aprovação/rejeição de pedidos.
- Ao aprovar: gera link de WhatsApp (`wa.me`) para abrir no computador e enviar manualmente ao número configurado (`+351916989048`) com link do grupo.
- Configuração completa no admin via JSON (morada, hotéis, horário, dress code etc.).
- Persistência em ficheiro JSON (`data/db.json`) como solução temporária até ligar base de dados real.

## Segurança e boas práticas implementadas
- Separação de área pública/admin.
- Validação de payload RSVP no backend.
- Credenciais e links sensíveis configuráveis por variáveis de ambiente.

## Variáveis de ambiente
- `PORT` (default `3000`)
- `ADMIN_USER` (default `paulimoria`)
- `ADMIN_PASS` (default `morianeto`)
- `WHATSAPP_NUMBER` (default `+351916989048`)
- `WHATSAPP_GROUP_LINK` (default placeholder)
- `DB_PATH` (default `./data/db.json`)

## Executar
```bash
npm start
```

## Testes
```bash
npm test
```
