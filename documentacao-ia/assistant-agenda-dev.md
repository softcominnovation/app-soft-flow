# Assistant: Agenda Dev (auxiliar/agenda-dev)

Este assistant retorna o panorama de projetos/casos por colaborador (abertos, corrigidos, resolvidos, etc.).

## Endpoints
- Interno (Next): `GET /api/assistant/agenda-dev?id_colaborador=...`
  - Parâmetro: `id_colaborador` via query string.
  - Descrição: a rota interna faz um GET para o backend em `/auxiliar/agenda-dev`, repassando `id_colaborador` como query string.
- Externo (Backend): `GET /auxiliar/agenda-dev?id_colaborador=...`

## Parâmetros obrigatórios
- `id_colaborador` (string): id do usuário logado.

## Exemplo de retorno
```json
[
  {
    "ordem": "-1",
    "produto": "Rotinas Squad Cloud",
    "abertos": "3",
    "corrigidos": "0",
    "retornos": "0",
    "resolvidos": "1",
    "id_colaborador": "2507",
    "Cronograma_id": "0",
    "versao": "1.0.0",
    "selecionado": "0",
    "id_produto": "287",
    "NomeSuporte": "Lins",
    "ProdutoVersao": "Rotinas Squad Cloud  1.0.0",
    "abertos_estimado": "0",
    "tem_caso_iniciado": "*"
  }
]
```

## Tipagem
Arquivo: `src/types/assistant/IAgendaDevAssistant.ts`
```ts
export default interface IAgendaDevAssistant {
  ordem: string;
  produto: string;
  abertos: string;
  corrigidos: string;
  retornos: string;
  resolvidos: string;
  id_colaborador: string;
  Cronograma_id: string;
  versao: string;
  selecionado: string;
  id_produto: string;
  NomeSuporte: string;
  ProdutoVersao: string;
  abertos_estimado: string;
  tem_caso_iniciado: string;
}
```

## Implementação (resumo)
- Rota interna: `src/app/api/assistant/agenda-dev.ts`
  - Método GET lendo `id_colaborador` de `request.url` (query string).
  - Lê `access_token` dos cookies.
  - Repassa via GET para `${getBaseApiUrl()}/auxiliar/agenda-dev` usando `params`.
- Service: `diaryDevAssistant` em `src/services/caseServices.ts`
  - Chama `axios.get('/api/assistant/agenda-dev', { params: { id_colaborador } })` e retorna `IAgendaDevAssistant[]`.

## Exemplo de uso no front
```ts
import { agendaDevAssistant } from '@/services/caseServices';

const loadAgenda = async (userId: string) => {
  const data = await agendaDevAssistant(userId);
  // data é IAgendaDevAssistant[]
  return data;
};
```

## Observações
- Garanta que o usuário esteja autenticado (cookie `access_token` presente), caso contrário a rota interna retorna 400.
- Para evitar confusão, enviamos `id_colaborador` no body para a rota interna, e ela transforma em query param para o GET externo.
