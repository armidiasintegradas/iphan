# Sistema de Gestão da Preservação — Beta 01

Camada operacional para acompanhamento de bens culturais, intervenções, fiscalização, evidências, decisões, medições e conservação.

## Escopo do Beta 01

O projeto está configurado para a Superintendência do Iphan em Pernambuco e foi desenhado para complementar — não substituir — sistemas oficiais como SEI, SICG, Fiscalis e Transferegov.

Fluxo central:

**CONHECER → PLANEJAR → INTERVIR → FISCALIZAR → VALIDAR → PRESERVAR**

## Módulos atuais

- Hoje — visão de prioridades e indicadores;
- Patrimônio — cadastro, mapa e prontuário do bem;
- Intervenções — portfólio e cockpit operacional;
- Cronograma — planejado × executado;
- Campo — ocorrências e evidências;
- Fiscalizações — agenda e checklist;
- Controle — decisões, restrições, responsáveis e prazos;
- Medições — registro e conferência;
- Conservação — inspeções preventivas;
- Documentos — referências e arquivos;
- Auditoria — trilha de alterações;
- Inteligência — consultas operacionais baseadas nos dados do sistema;
- Administração — usuários, perfis e permissões.

## Backend

O Beta está conectado ao projeto Supabase dedicado **iphan**.

Estrutura aplicada:

- PostgreSQL;
- Supabase Auth;
- Storage privado para evidências;
- Row Level Security (RLS);
- auditoria automática;
- perfis por função;
- unidade institucional de Pernambuco.

As migrations versionadas ficam em `supabase/migrations/`.

## Primeiro acesso

A rota `/cadastro` cria o usuário no Supabase Auth.

- todo novo usuário cadastrado recebe perfil `consulta`;
- a promoção inicial para `admin` é feita de forma controlada no Supabase;
- depois disso, Administrador/Gestor pode alterar perfis em **Administração → Usuários e permissões**.

## Stack

- Next.js 16 / App Router
- React 19
- TypeScript
- CSS próprio
- Supabase
- MapLibre GL + OpenStreetMap
- GitHub Actions para validação de build

## Status

O código principal está conectado ao backend real. Dados demonstrativos estão sendo removidos das telas operacionais; banco vazio é tratado como estado vazio.

A publicação web ainda precisa de um ambiente que execute Next.js com rotas de servidor e Server Actions. GitHub Pages sozinho não executa essa arquitetura.

> A marca oficial do Iphan deve ser usada somente com o arquivo institucional aprovado. O componente visual temporário do projeto não deve ser tratado como marca oficial.

## Publicação

O ambiente de produção é acionado pela branch `main` conectada à Vercel.


<!-- deployment trigger: approved login 2026-09-29 -->
