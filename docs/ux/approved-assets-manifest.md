# Ativos visuais aprovados

Status de integração: **CONCLUÍDA — layout consolidado e ativos visuais aprovados locais**

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

- [x] `public/brand/iphan-lucio-costa.webp` — marca oficial aprovada, usada sem fallback visual
- [x] `public/visual/priority-decisao.webp`\n- [x] `public/visual/field-thumb-01.webp`\n- [x] `public/visual/field-thumb-02.webp`\n- [x] `public/visual/field-thumb-03.webp`
- [x] `public/visual/field-thumb-01.webp`
- [x] `public/visual/field-thumb-02.webp`
- [x] `public/visual/field-thumb-03.webp`

## Binários preparados a partir das referências aprovadas

Os seguintes ativos já foram extraídos das referências aprovadas; os três recortes de Campo já estão publicados e os demais seguem prontos para publicação:

- [x] login hero — publicado
- [x] quatro imagens de prioridades — publicadas e sem fallback externo
- [x] hero do patrimônio — publicado
- [x] quatro thumbnails de patrimônio — publicados
- [x] imagem de progresso da intervenção — publicada
- [x] três thumbnails de campo — publicados no GitHub

Todos os ativos listados acima estão publicados no repositório. Os fallbacks externos foram removidos das telas aprovadas.

## Regra de fallback

Os ativos aprovados são carregados diretamente de `public/brand` e `public/visual`. Não há fallback externo nas telas aprovadas desta fase.

## Critério de conclusão visual

Uma tela só é considerada final quando:
- layout corresponde à referência aprovada;
- imagem/recorte aprovado está local;
- não existe dependência de imagem externa temporária;
- build está verde;
- responsividade foi conferida.
