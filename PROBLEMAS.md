# Lista de Problemas

Este documento contém uma lista de problemas identificados no projeto que precisam ser resolvidos.

---

## Problemas Pendentes

### 1. Modal de Edição de Ferramenta - Campos Vazios

**Descrição:** Quando o usuário clica em editar uma ferramenta, o modal abre com todos os campos vazios, obrigando o usuário a preencher todos os dados novamente.

**Comportamento Esperado:** O modal deveria vir pré-preenchido com os dados atuais da ferramenta, permitindo que o usuário edite apenas o que deseja alterar.

**Arquivos Relacionados:**
- `src/components/CreateToolDialog.tsx` (linhas 95-115)
- `src/routes/dashboard.my-tools.tsx` (linha 77-80)

**Observações:** 
- O código já tenta preencher os valores em `defaultValues` quando `tool` está presente
- Pode ser um problema de sincronização do formulário ou reset incorreto
- Verificar se o `form.reset()` está sendo chamado antes de abrir o modal

---

### 2. Descrição Longa Sem Quebra de Linha na Página de Detalhes

**Descrição:** Quando uma ferramenta tem uma descrição grande e o usuário clica em "Ver Detalhes", a descrição não quebra linha e fica atravessando para fora da área designada.

**Solução Proposta:**
- Adicionar limite de caracteres na descrição
- Na listagem de todas as ferramentas, aplicar `ellipsis` para truncar descrições longas
- Na página de detalhes, garantir que a descrição quebre linha corretamente

**Arquivos Relacionados:**
- `src/routes/tools.$toolId.tsx` (linha 112) - Página de detalhes
- `src/routes/index.tsx` (linha 174-176) - Listagem de ferramentas

**Observações:**
- Na listagem já existe `line-clamp-3` mas pode não estar funcionando corretamente
- Na página de detalhes, o texto precisa de `word-break` ou `whitespace-pre-wrap`

---

### 3. Possibilidade de Alugar Próprias Ferramentas

**Descrição:** É possível que um usuário alugue suas próprias ferramentas, o que não faz sentido do ponto de vista de negócio.

**Solução Necessária:** Implementar validação para impedir que o usuário alugue suas próprias ferramentas.

**Arquivos Relacionados:**
- `src/routes/tools.$toolId.tsx` (linha 68-74) - Função `handleRent`
- `src/routes/tools.$toolId.rent.tsx` - Página de checkout
- Possivelmente precisa de validação no backend também

**Observações:**
- Verificar se há informação do `owner` disponível no objeto `tool`
- Pode ser necessário comparar `tool.owner` com o usuário autenticado
- Desabilitar botão "Alugar Agora" ou mostrar mensagem apropriada

---

### 4. Campo Valor com Comportamento Estranho

**Descrição:** O campo de valor (preço por dia) já vem preenchido com 0 e não é possível apagá-lo nem alterá-lo facilmente, resultando em um comportamento estranho.

**Arquivos Relacionados:**
- `src/components/CreateToolDialog.tsx` (linhas 214-233) - Campo `price_per_day`
- `src/lib/schemas.ts` (linhas 48-51) - Validação do schema

**Observações:**
- O campo tem `min="0.01"` mas o `defaultValue` é `0`
- O `onChange` converte para `parseFloat` ou `0`, o que pode estar causando o problema
- Pode ser necessário permitir campo vazio temporariamente ou melhorar a lógica de conversão

---

### 5. Aluguel Não Aparece em "Meus Aluguéis" Após Criação

**Descrição:** Após alugar uma ferramenta de outro usuário e ser redirecionado, quando vai para a página "Meus Aluguéis", nada aparece. É necessário entender o fluxo completo.

**Arquivos Relacionados:**
- `src/routes/dashboard.my-rentals.tsx` - Página de meus aluguéis
- `src/hooks/useMyRentals.ts` - Hook que busca os aluguéis
- `src/hooks/useCreateRental.ts` - Hook que cria o aluguel
- `src/routes/tools.$toolId.rent.tsx` - Página de checkout

**Observações:**
- Verificar se após criar o aluguel, há redirecionamento correto
- Verificar se a query `useMyRentals` está sendo invalidada/refetchada após criar novo aluguel
- Pode ser problema de cache do React Query
- Verificar se o endpoint `/rentals/my/` está retornando os dados corretos

---

### 6. Página "Meus Aluguéis" Precisa de Divisão/Abas

**Descrição:** A página de "Meus Aluguéis" deveria ter uma divisão (abas ou outra forma) para separar:
- Aluguéis que o usuário fez (alugou ferramentas de terceiros)
- Aluguéis recebidos (terceiros alugaram as ferramentas do usuário)

**Arquivos Relacionados:**
- `src/routes/dashboard.my-rentals.tsx` - Página atual
- `src/routes/dashboard.received-rentals.tsx` - Já existe uma página separada?
- `src/hooks/useMyRentals.ts` - Hook atual
- `src/hooks/useReceivedRentals.ts` - Verificar se existe hook para aluguéis recebidos

**Observações:**
- Verificar se já existe endpoint separado para aluguéis recebidos
- Pode ser necessário criar abas/tabs ou usar navegação entre páginas
- Verificar se `useReceivedRentals` já existe e funciona corretamente

---

### 7. Lógica de Disponibilidade de Ferramentas

**Descrição:** Tecnicamente, uma ferramenta só deveria ficar indisponível quando ela está realmente alugada (status "approved" ou durante o período de aluguel ativo), não apenas quando há um aluguel pendente.

**Comportamento Atual:** 
- A ferramenta fica indisponível assim que um aluguel é criado (status "pending")
- Isso impede que outros usuários vejam/aluguem a ferramenta mesmo que o aluguel seja rejeitado

**Comportamento Esperado:** 
- Ferramenta deve permanecer disponível enquanto o aluguel está "pending"
- Ferramenta fica indisponível apenas quando o aluguel é "approved" ou durante o período ativo
- Quando um aluguel é "rejected", a ferramenta volta a ficar disponível
- Quando um aluguel é "finished", a ferramenta volta a ficar disponível

**Arquivos Relacionados:**
- `src/mocks/handlers/rentals.handlers.ts` (linhas 83-84, 109-113, 137-141) - Lógica de disponibilidade nos mocks
- Backend: Lógica de atualização de `available` status da ferramenta

**Observações:**
- Pode ser necessário ajustar tanto frontend quanto backend
- Verificar se há lógica no backend que controla isso automaticamente
- Pode ser necessário verificar aluguéis ativos ao buscar ferramentas

---

### 8. Possibilidade de Deletar Ferramenta Alugada

**Descrição:** Como owner, é possível deletar uma ferramenta mesmo quando ela está alugada. É necessário avaliar se isso faz sentido do ponto de vista de negócio.

**Questões a Considerar:**
- O que acontece com aluguéis ativos/pendentes se a ferramenta for deletada?
- Deve ser permitido deletar ferramenta com aluguéis pendentes?
- Deve ser permitido deletar ferramenta com aluguéis aprovados/ativos?
- Deve ser permitido deletar ferramenta apenas quando não há aluguéis?

**Arquivos Relacionados:**
- `src/routes/dashboard.my-tools.tsx` (linhas 82-96) - Função de deletar
- `src/hooks/useDeleteTool.ts` - Hook de deleção
- Backend: Endpoint DELETE `/api/tools/:id/`

**Observações:**
- Pode ser necessário adicionar validação no backend para impedir deleção quando há aluguéis ativos
- Pode ser necessário mostrar mensagem apropriada no frontend
- Pode ser necessário desabilitar botão de deletar quando há aluguéis ativos/pendentes

#### 📋 Onde Implementar a Validação? (Abordagem: Defesa em Profundidade)

**Resposta:** Implementar nos **3 ambientes** (Frontend, Backend e Banco de Dados) para minimizar a chance de falhas.

**1. Frontend (UX + Primeira Camada de Proteção)**
- **O que fazer:**
  - Desabilitar botão de deletar quando há aluguéis ativos/pendentes
  - Mostrar tooltip/mensagem explicativa ao usuário
  - Verificar antes de mostrar o diálogo de confirmação
- **Vantagens:** Melhor experiência do usuário, evita tentativas desnecessárias
- **Limitação:** Não confiar apenas no frontend para segurança (pode ser bypassado)

**2. Backend (Validação Principal - PRIORITÁRIO)**
- **O que fazer:**
  - Verificar se existem aluguéis com status `approved` ou `pending` antes de deletar
  - Retornar erro HTTP 400/409 com mensagem clara se houver aluguéis ativos
  - Permitir deleção apenas se não houver aluguéis ativos/pendentes
- **Vantagens:**
  - Mensagens de erro claras e específicas
  - Lógica de negócio centralizada e testável
  - Fácil de manter e modificar
  - Pode incluir lógica complexa (ex: permitir deletar se todos os aluguéis estão "finished")
- **Exemplo de implementação:**
  ```python
  # Verificar aluguéis ativos/pendentes antes de deletar
  active_rentals = Rental.objects.filter(
      tool=tool,
      status__in=['pending', 'approved']
  ).exists()
  
  if active_rentals:
      return Response(
          {"detail": "Não é possível deletar ferramenta com aluguéis ativos ou pendentes"},
          status=status.HTTP_409_CONFLICT
      )
  ```

**3. Banco de Dados (Última Linha de Defesa)**
- **O que fazer:**
  - **Opção A (Recomendada):** Foreign Key com `ON DELETE RESTRICT`
    ```sql
    ALTER TABLE rentals 
    ADD CONSTRAINT fk_rental_tool 
    FOREIGN KEY (tool_id) REFERENCES tools(id) 
    ON DELETE RESTRICT;
    ```
    - Impede deleção se houver registros relacionados
    - Erro do banco: "Cannot delete or update a parent row"
  
  - **Opção B:** Trigger ou Stored Procedure
    - Verificar status dos aluguéis antes de permitir DELETE
    - Mais complexo, mas permite lógica customizada
- **Vantagens:**
  - Última linha de defesa contra erros/bugs
  - Garante integridade mesmo em caso de acesso direto ao banco
  - Proteção contra race conditions
  - Garante consistência mesmo se backend tiver bug

**Por que essa abordagem?**
- Se o frontend falhar → backend bloqueia
- Se o backend tiver bug → banco protege
- Se alguém acessar o banco diretamente → constraint impede
- Se houver race condition → banco garante consistência

**Resumo:** Tratar nos 3 ambientes cria camadas redundantes de segurança, onde se uma falhar, as outras protegem. Isso minimiza a chance de falhas e garante maior segurança e integridade dos dados.

---

### 9. Edição de Ferramentas Alugadas/Indisponíveis

**Descrição:** Ferramentas que estão indisponíveis (alugadas) não podem ser editadas, especialmente o preço, pois isso poderia alterar o valor de um aluguel já em andamento.

**Comportamento Esperado:** 
- Impedir edição de ferramentas que têm aluguéis aprovados/ativos
- Ou pelo menos bloquear edição do campo `price_per_day` durante aluguéis ativos
- Permitir edição de outros campos que não afetam aluguéis existentes?

**Arquivos Relacionados:**
- `src/components/CreateToolDialog.tsx` - Modal de edição
- `src/routes/dashboard.my-tools.tsx` (linha 77-80) - Função `handleEdit`
- Backend: Endpoint PATCH `/api/tools/:id/`

**Observações:**
- Pode ser necessário verificar se há aluguéis ativos antes de permitir edição
- Pode ser necessário desabilitar campo de preço quando há aluguéis ativos
- Pode ser necessário mostrar mensagem explicativa ao usuário
- Verificar se há validação no backend para isso

---

### 10. Validação Impede Aluguel no Mesmo Dia

**Descrição:** O sistema não permite alugar uma ferramenta para hoje (mesmo dia). A validação está impedindo isso, mas deveria ser possível, pois um usuário pode estar alugando de manhã para usar à tarde e devolver à noite.

**Problema Atual:**
- A validação no schema exige que `start_date >= today` (linha 78)
- O input de data tem `min={new Date().toISOString().split("T")[0]}` (linha 104)
- Isso permite selecionar hoje, mas a validação pode estar comparando com hora específica

**Comportamento Esperado:** 
- Permitir alugar para o mesmo dia
- Permitir que a data de início seja hoje
- A validação deve apenas impedir datas passadas (anteriores a hoje)

**Arquivos Relacionados:**
- `src/lib/schemas.ts` (linhas 73-84) - Validação do `createRentalSchema`
- `src/routes/tools.$toolId.rent.tsx` (linha 104) - Input de data com `min`

**Observações:**
- A validação atual usa `today.setHours(0, 0, 0, 0)` e compara com `start >= today`
- Isso deveria permitir hoje, mas pode haver problema na comparação de datas
- Verificar se o problema está na validação do schema ou na comparação de datas
- Pode ser necessário ajustar a lógica de comparação para considerar apenas a data (sem hora)

---

## Observações Gerais

⚠️ **Importante:** Nem todos esses problemas podem ser resolvidos apenas no frontend. Alguns podem requerer mudanças no backend também. É necessário verificar cada caso e documentar as dependências.

---

## Problemas Resolvidos

### [Problemas resolvidos serão movidos para cá]

---

**Última atualização:** 2024-12-19 (atualizado com problemas 7-10)

