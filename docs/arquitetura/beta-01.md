# Arquitetura funcional — IPHAN OS Beta 01

## Princípio central

O IPHAN OS é uma camada operacional de gestão. Ele não substitui os sistemas institucionais oficiais; deve organizar o trabalho diário e, quando autorizado, interoperar com SEI, SICG, Fiscalis, Transferegov e outras bases.

## Núcleo do domínio

```text
Organização
└── Unidade
    └── Usuários

Bem cultural
├── Ambientes
│   └── Elementos
├── Intervenções
│   ├── Contratos
│   ├── Cronograma
│   ├── Serviços
│   ├── Medições
│   ├── Fiscalizações
│   ├── Ocorrências
│   ├── Restrições
│   ├── Pendências
│   └── Decisões
├── Documentos
├── Evidências
└── Inspeções de conservação
```

## Fluxo crítico do Beta 01

1. cadastrar bem cultural;
2. criar intervenção;
3. definir responsáveis;
4. cadastrar cronograma;
5. registrar visita em campo;
6. anexar evidências;
7. abrir ocorrência;
8. atribuir responsável;
9. registrar decisão;
10. encerrar ocorrência com rastreabilidade.

## Perfis iniciais

- administrador institucional;
- superintendente/gestor;
- coordenador;
- fiscal;
- técnico;
- executor/contratada.

## Telas prioritárias

1. Hoje;
2. Patrimônio;
3. Intervenções;
4. Campo;
5. Controle;
6. Conservação;
7. Documentos;
8. Intelligence.

## Princípios de UX

- decisão antes de dashboard;
- mobile-first para campo;
- poucos passos;
- evidência sempre vinculada ao contexto;
- alertas acionáveis;
- rastreabilidade explícita;
- linguagem pública brasileira, sem jargão técnico desnecessário;
- dados demonstrativos claramente identificados como simulados até integração com bases oficiais.
