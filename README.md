## Auvet Frontend

Aplicação frontend em React/TypeScript para a aplicação Auvet para gestão de clínicas veterinárias. Utiliza Mantine UI, React Router v6 e Vite.

### Stack
- React 18 + TypeScript
- Mantine UI v7
- React Router DOM v6
- Vite 5
- Selenium (testes end-to-end simples)

### Pré‑requisitos
- Node.js 18+
- npm (ou pnpm/yarn, se preferir)

### Instalação e execução
```bash
npm install
npm run dev
```
A aplicação roda por padrão em `http://localhost:5173`.

### Build e preview
```bash
npm run build
npm run preview
```

### Testes (Selenium)
```bash
npm run test:selenium
npm run test:selenium:admin-flow
```

### Estrutura de pastas (resumo)
```
src/
├─ components/     # Componentes reutilizáveis
├─ pages/          # Páginas (rotas)
├─ services/       # Lógica de negócio
├─ repositories/   # Acesso a APIs
├─ hooks/          # Hooks customizados
├─ contexts/       # Context API
├─ interfaces/     # Tipos e interfaces TS
├─ utils/          # Utilitários (HttpClient, storage, etc.)
└─ config/         # Configurações (ENV, temas, etc.)
```

### Convenções principais
- Path aliases: `@` aponta para `src` (ex.: `@/components/Button`).
- TypeScript estrito, sem `any` sem necessidade.
- Componentes e arquivos em PascalCase para páginas/componentes; funções/hooks em camelCase.
- UI com Mantine: botões com `radius="xl"`, inputs com `radius="md"`, uso de `Container size="xl"`.

### APIs e ambiente
O projeto consome duas APIs distintas:
- Autenticação: `auvet-autenticacao` (sem token)
- Backend: `auvet-backend` (com Bearer token)

As URLs são definidas em `src/config/env.ts`. Em desenvolvimento, o Vite faz proxy:
- `/auth-api` → `https://auvet-autenticacao.onrender.com/api`
- `/backend-api` → `https://auvet-backend.onrender.com/api`

Produção utiliza as URLs completas automaticamente.

### HTTP e autenticação
- Todas as requisições usam `HttpClient` (`@/utils/httpClient`).
- Token é obtido via `getToken` e adicionado automaticamente quando `auth: true`.
- Token é mantido em memória; o CNPJ da clínica é salvo no localStorage.

### Navegação
- Rotas com React Router v6.
- Use `Link` para navegação declarativa e `useNavigate` para navegação programática.

### Estilo e design
- Mantine UI v7 como base.
- Paleta primária: laranja `#f87537` (accent `#ff9f00`), fundos claros, texto escuro.
- Prefira props do Mantine para espaçamentos/cores/responsividade.

### Desenvolvimento
- Execute `npm run dev` e utilize o proxy do Vite para chamadas às APIs sem CORS.
- Siga os padrões de nomenclatura, tipagem explícita e separação entre `services` e `repositories`.



