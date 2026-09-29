# Ativos visuais aprovados

Status de integração: **em execução — layout consolidado, ativos binários em migração**

## Regra

As referências visuais aprovadas são a fonte de verdade. Não substituir por imagens genéricas sem nova aprovação.

## Fonte de verdade do UI

A implementação atual já segue a direção aprovada em:

- Login
- Hoje
- Patrimônio
- Ficha do bem cultural
- Intervenções
- Cockpit da intervenção
- Cronograma
- Medições
- Evidências
- Fiscalizações
- Controle
- Conservação
- Documentos
- Campo mobile
- Nova ocorrência
- Nova evidência
- Intelligence mobile
- Notificações
- Novo bem cultural
- Nova intervenção
- Nova fiscalização
- Usuários e permissões
- Auditoria

Todos os builds dessa fase concluíram com sucesso.

## Caminhos oficiais no front-end

### Marca
- `/brand/iphan-lucio-costa.webp` — marca oficial colorida com croqui de Lucio Costa.

### Hoje
- `/visual/priority-decisao.webp`
- `/visual/priority-intervencao.webp`
- `/visual/priority-medicao.webp`
- `/visual/priority-fiscalizacao.webp`

### Login
- `/visual/login-hero.webp`

### Patrimônio
- `/visual/heritage-hero.webp`
- `/visual/heritage-thumb-01.webp`
- `/visual/heritage-thumb-02.webp`
- `/visual/heritage-thumb-03.webp`
- `/visual/heritage-thumb-04.webp`

### Intervenção
- `/visual/intervention-progress.webp`

### Campo
- `/visual/field-thumb-01.webp`
- `/visual/field-thumb-02.webp`
- `/visual/field-thumb-03.webp`

## Binários já presentes no GitHub

- [x] `public/brand/iphan-lucio-costa.webp`
- [x] `public/visual/priority-decisao.webp`

## Binários preparados a partir das referências aprovadas

Os seguintes ativos já foram extraídos das referências aprovadas e estão prontos para publicação no repositório:

- [x] login hero
- [x] quatro imagens de prioridades
- [x] hero do patrimônio
- [x] quatro thumbnails de patrimônio
- [x] imagem de progresso da intervenção
- [x] três thumbnails de campo

A publicação binária restante será feita sem regenerar ou reinterpretar os recortes.

## Regra de fallback

Enquanto um ativo aprovado ainda não estiver fisicamente em `public/visual`, o front-end mantém o fallback existente para não quebrar a produção.

Assim que o arquivo local estiver publicado:
1. o ativo aprovado local passa a ser a primeira fonte;
2. o fallback externo deve ser removido;
3. a tela deve ser novamente verificada em desktop, tablet e mobile.

## Critério de conclusão visual

Uma tela só é considerada final quando:
- layout corresponde à referência aprovada;
- imagem/recorte aprovado está local;
- não existe dependência de imagem externa temporária;
- build está verde;
- responsividade foi conferida.
