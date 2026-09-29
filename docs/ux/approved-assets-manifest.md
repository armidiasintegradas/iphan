# Ativos visuais aprovados

Status de integração: **em execução**

## Regra

As referências visuais aprovadas são a fonte de verdade. Não substituir por imagens genéricas sem nova aprovação.

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

## Estado atual

Integrados no repositório:
- [x] marca oficial Iphan;
- [x] card de prioridade “decisão técnica”;
- [ ] demais imagens aprovadas — migração binária em andamento.

## Regra de fallback

Durante a migração, o front-end procura primeiro o ativo local aprovado e usa o fallback existente somente se o arquivo ainda não estiver no deploy. Quando todos os arquivos estiverem presentes, os fallbacks externos devem ser removidos.
