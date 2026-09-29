# Manifesto de ativos visuais aprovados

Status: **OBRIGATÓRIO**

As imagens das referências visuais aprovadas são fonte de verdade do projeto. Não substituir por fotografias genéricas, bancos de imagem, novas gerações de IA ou variações semelhantes sem aprovação explícita.

## Ativos congelados

| Arquivo | Uso |
|---|---|
| `iphan-logo-official-lucio-costa.png` | Marca oficial colorida do Iphan, versão com Croqui de Lucio Costa |
| `login-hero.png` | Hero do Login |
| `priority-decisao.png` | Card “Decisão técnica vencida” |
| `priority-intervencao.png` | Card “Intervenção com desvio físico” |
| `priority-medicao.png` | Card “Medição aguardando conferência” |
| `priority-fiscalizacao.png` | Card “Fiscalização programada” |
| `heritage-hero.png` | Hero da Ficha do Bem Cultural |
| `heritage-thumb-01.png` | Patrimônio — thumbnail 01 |
| `heritage-thumb-02.png` | Patrimônio — thumbnail 02 |
| `heritage-thumb-03.png` | Patrimônio — thumbnail 03 |
| `heritage-thumb-04.png` | Patrimônio — thumbnail 04 |
| `intervention-progress.png` | Cockpit — imagem de progresso da intervenção |
| `field-thumb-01.png` | Campo — último registro 01 |
| `field-thumb-02.png` | Campo — último registro 02 |
| `field-thumb-03.png` | Campo — último registro 03 |

## Regras

1. Manter o mesmo enquadramento e proporção das referências.
2. Não usar Unsplash, placeholders ou imagens “parecidas” na versão de fidelidade.
3. Não alterar saturação, temperatura, contraste ou composição sem aprovação.
4. A marca oficial deve manter proporções e área de respiro previstas no manual.
5. O nome do sistema e “Pernambuco” permanecem separados da marca Iphan.
6. Responsividade pode recortar a imagem por `object-fit: cover`, mas o ponto focal deve permanecer o mesmo da referência.
7. Quando houver versão desktop e mobile, usar o mesmo ativo, salvo referência aprovada específica.

## Estrutura alvo

```text
/public/brand/iphan-logo-official-lucio-costa.png
/public/visual/login-hero.png
/public/visual/priority-decisao.png
/public/visual/priority-intervencao.png
/public/visual/priority-medicao.png
/public/visual/priority-fiscalizacao.png
/public/visual/heritage-hero.png
/public/visual/heritage-thumb-01.png
/public/visual/heritage-thumb-02.png
/public/visual/heritage-thumb-03.png
/public/visual/heritage-thumb-04.png
/public/visual/intervention-progress.png
/public/visual/field-thumb-01.png
/public/visual/field-thumb-02.png
/public/visual/field-thumb-03.png
```

O código só deve passar a apontar para estes caminhos quando os binários estiverem presentes no repositório/deploy, evitando telas quebradas.
