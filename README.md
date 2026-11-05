# Boti Comissões

Criar um app de controle de comissão RV Promotor, com:

Registro de Inícios e Reinícios

Cálculo automático em tempo real

Somente a meta do ciclo configurável

Gatilhos e valores fixos

Layout premium Grupo Boticário

🧱 ESTRUTURA DO APP
🔹 ABA 1 — INÍCIOS
Campos para preenchimento manual:

Nome do cliente

Número do pedido

Data (automática)

Campos automáticos:

Total de inícios no ciclo

Faixa atingida (automática)

Valor por início

Comissão total de inícios

🔹 ABA 2 — REINÍCIOS
Campos para preenchimento manual:

Nome do cliente

Número do pedido

Data (automática)

Campos automáticos:

Total de reinícios no ciclo

Faixa atingida (automática)

Valor por reinício

Comissão total de reinícios

🔹 ABA 3 — CONFIGURAÇÃO DO CICLO
Campos editáveis:

🎯 Meta do ciclo – Inícios (ex: 25)

🎯 Meta do ciclo – Reinícios (ex: 15)

⚠️ Observação:

Apenas essas metas podem ser alteradas

Todos os gatilhos e valores permanecem fixos

🧮 GATILHOS FIXOS (NÃO EDITÁVEIS)
Inícios

Gatilho: 4 → R$ 10

Meta: 7 → R$ 20

Super Meta: 9 → R$ 35

Sonho Grande: 11 → R$ 45

Reinícios

Gatilho: 4 → R$ 5

Meta: 9 → R$ 10

Super Meta: 13 → R$ 15

Sonho Grande: 15 → R$ 20

⚙️ LÓGICA AUTOMÁTICA DE CÁLCULO
A cada novo registro:

Soma automaticamente a quantidade

Identifica a faixa atingida

Aplica o valor correto por unidade

Atualiza o total da comissão em tempo real

📊 DASHBOARD (TOPO DO APP)

Exibir em cards premium:

Total de Inícios

Comissão de Inícios (R$)

Total de Reinícios

Comissão de Reinícios (R$)

Total Geral do Ciclo (R$)

Progresso da meta do ciclo (%)

🎨 LAYOUT PREMIUM – GRUPO BOTICÁRIO

Verde Boticário (#006B3F)

Branco predominante

Detalhes em dourado suave

Cards com sombra leve

Tipografia moderna

Visual clean e corporativo

🚀 EXPERIÊNCIA DO USUÁRIO

Interface simples

Apenas digitar nome e pedido

Tudo calcula sozinho

Feedback visual quando bate metas

Sensação de app profissional

📌 RESULTADO FINAL

Um app/planilha inteligente, onde:
✔ Você só cadastra pedidos
✔ O valor recebido aparece automaticamente
✔ Acompanhe o ganho em tempo real
✔ Ajuste apenas a meta do ciclo
✔ Visual premium do Grupo Boticário

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://boty-cash-flow.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/253b0715-9bab-4971-a260-ef89dda4cbd5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
