# UI/UX — Fonte de verdade visual

## Status
APROVADO — 29/09/2026

As referências visuais aprovadas nesta etapa são a fonte de verdade para toda a implementação do Sistema de Gestão da Preservação.

## Regra principal

A implementação deve reproduzir os layouts aprovados com máxima fidelidade, sem reinterpretar a direção visual.

Preservar:
- composição;
- proporções;
- hierarquia tipográfica;
- espaçamentos;
- grid;
- sidebar;
- header;
- cards;
- estados;
- mapas;
- fotografias;
- tabelas;
- filtros;
- indicadores;
- mobile;
- Intelligence;
- comportamento responsivo.

Não introduzir uma nova linguagem visual sem nova aprovação.

## Telas aprovadas

### Desktop
1. Login
2. Hoje
3. Patrimônio — mapa/lista
4. Ficha do bem cultural
5. Cockpit da intervenção
6. Fiscalizações e Controle
7. Conservação
8. Documentos

### Mobile
9. Campo
10. Intelligence

## Navegação principal
- Hoje
- Patrimônio
- Intervenções
- Campo
- Fiscalizações
- Conservação
- Documentos
- Intelligence

## Direção visual
- base clara/off-white;
- grande uso de espaço em branco;
- sidebar clara;
- verde institucional apenas como ação/seleção principal;
- vermelho e amarelo apenas para status;
- títulos editoriais de alto contraste;
- textos e interface em sans-serif limpa;
- fotografias documentais de patrimônio;
- mapas com protagonismo quando o contexto for territorial;
- bordas discretas;
- sombras muito leves;
- cantos arredondados moderados;
- densidade informacional controlada.

## Marca
A marca institucional do Iphan deve permanecer separada do nome do sistema e da unidade de contexto.

Estrutura visual:
1. marca oficial do Iphan;
2. nome funcional: Sistema de Gestão da Preservação;
3. contexto separado: Superintendência do Iphan em Pernambuco / Beta 01 quando aplicável.

Nunca criar “IPHAN OS” como nova marca.

## Paleta oficial
- Verde Iphan: #007350
- Vermelho Iphan: #CA4D37
- Amarelo Iphan: #E5A923
- Cinza institucional: #A7A9AC
- Preto: #000000
- Branco: #FFFFFF

Cores neutras adicionais podem existir somente como superfícies e fundos, sem competir com a identidade institucional.

## Tipografia
- Trajan: somente no logotipo oficial;
- interface: sans-serif contemporânea, preferencialmente Inter ou equivalente;
- títulos editoriais: usar a família definida no design aprovado, mantendo contraste e proporções visuais.

## Responsividade
Desktop e mobile não devem ser simples redimensionamentos um do outro.

Desktop:
- sidebar persistente;
- conteúdo em grids;
- mapas/tabelas em áreas amplas;
- densidade moderada.

Mobile:
- ações primárias grandes;
- uso com uma mão;
- Campo como fluxo prioritário;
- navegação inferior;
- Intelligence simplificado;
- menos informação simultânea.

## Regras de implementação
- não substituir componentes aprovados por alternativas genéricas;
- não alterar proporções de cards ou ordem das informações sem necessidade técnica real;
- quando houver limitação técnica, manter primeiro a hierarquia e a leitura visual;
- dados demonstrativos devem ser explicitamente identificados até conexão com a base real;
- não simular integrações oficiais inexistentes;
- todo estado de risco usa texto + ícone + cor.

## Critério de aceite
Uma tela só é considerada concluída quando:
1. corresponde visualmente à referência aprovada;
2. funciona em desktop/tablet/mobile quando aplicável;
3. mantém os tokens do design;
4. não apresenta overflow ou quebras;
5. mantém acessibilidade básica;
6. preserva as regras do manual da marca.
