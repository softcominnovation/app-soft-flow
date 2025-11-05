# Guia de criacao de autocompletes (assistants)

Este guia descreve como estao estruturados os autocompletes (assistants) do SoftFlow e qual o fluxo para criar novos itens reaproveitando o padrao existente.

## Estrutura atual
- **Tipos (`src/types/assistant`)**: cada assistant expoe uma interface TypeScript (`IUserAssistant`, `IProductAssistant`, `IProjectAssistant`, etc.) com o formato retornado pelo backend.
- **Services (`src/services/*Services.tsx`)**: funcoes `assistant` responsaveis por chamar as rotas internas (`/api/assistant/...`) com suporte a parametros de pesquisa.
- **Rotas Next (`src/app/api/assistant`)**: arquivos `*.ts` que tratam cookies, montam a chamada para a API externa (`/auxiliar/...`) e pastas com `route.ts` reexportando o metodo HTTP.
- **Camada de UI**: os filtros usam `react-select/async` e o hook `useAsyncSelect` para lidar com debounce, labels e valores.
- **Helpers compartilhados**: `getBaseApiUrl` resolve a URL base do backend; `js-cookie` fornece o `user_id` logado quando necessario.

## Passo a passo para um novo autocomplete
1. **Definir o tipo**: crie uma interface em `src/types/assistant` contendo exatamente os campos retornados pela API externa.
2. **Service**: adicione um arquivo em `src/services` exportando `async function assistant(data)` que chama `axios.get('/api/assistant/<nome>')` repassando os parametros.
3. **Rota interna**: crie uma pasta `src/app/api/assistant/<nome>` e dentro dela o arquivo `route.ts` copiando a estrutura existente (cookies -> headers -> chamada a `${getBaseApiUrl()}/auxiliar/<endpoint>`). Esta estrutura de pasta é necessária para o Next.js 13+ reconhecer a rota corretamente.
4. **Integracao no front**:
   - Importe o novo service no componente correspondente.
   - Configure `useAsyncSelect` com `fetchItems`, `getOptionLabel` e `getOptionValue`.
   - No `fetchItems` passe sempre os parametros exigidos pelo backend. Quando houver dependencia de usuario, mande `usuario_id` do filtro selecionado ou, em fallback, `Cookies.get('user_id')`.
   - O hook dispara automaticamente uma busca em branco apos 1 segundo sem digitar quando o menu e aberto (onMenuOpen). Isso garante que ao apenas clicar no autocomplete as opcoes iniciais sejam recuperadas. Ajuste `debounceMs` conforme o caso.
5. **Atualizar filtros e payloads**: inclua o novo campo no tipo de filtros (`ICaseFilter`, por exemplo) e garanta que o payload enviado aos services/tabelas contenha o identificador retornado pelo autocomplete.

## Exemplos de Implementação

### Autocomplete de Versões
O autocomplete de versões é um exemplo de implementação que depende de outro campo (produto). 

```typescript
// 1. Interface do tipo em src/types/assistant/IVersionAssistant.ts
interface IVersionAssistant {
    id: string;
    versao: string | null;
    abertura: string | null;
    fechamento: string | null;
    sequencia: string;
    testador_id: number;
}

// 2. Service em src/services/versionsServices.ts
export const assistant = async ({ produto_id }: { produto_id: string }) => {
    const response = await axios.get('/api/assistant/versions', { params: { produto_id } });
    return response.data as IVersionAssistant[];
};

// 3. Rota de API em src/app/api/assistant/versions.ts
export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token');

        if (!token) {
            return NextResponse.json('Cookie não encontrado', { status: 400 });
        }

        const url = new URL(request.url);
        const params = new URLSearchParams(url.search);
        const requestData = Object.fromEntries(params.entries());

        // Validar se produto_id foi fornecido
        if (!requestData.produto_id) {
            return NextResponse.json('produto_id é obrigatório', { status: 400 });
        }
        
        const response = await axios.get(`${getBaseApiUrl()}/auxiliar/versoes`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token.value}`,
            },
            params: requestData,
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar versões:', error);
        return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
    }
}

// 4. Uso no componente com dependência do produto
const {
    loadOptions: loadVersionOptions,
    selectedOption: selectedVersion,
    setSelectedOption: setSelectedVersion,
} = useAsyncSelect<IVersionAssistant>({

### Autocomplete de Origem
O autocomplete de origem é um exemplo de implementação simples, sem dependências.

```typescript
// 1. Interface do tipo
export interface IOriginAssistant {
    id: string;
    nome: string;
}

// 2. Service em src/services/originsServices.ts
export const assistant = async () => {
    try {
        const response = await axios.get('/api/assistant/origins');
        return response.data as IOriginAssistant[];
    } catch (error) {
        console.error('Error fetching origins:', error);
        return [];
    }
};

// 3. Rota de API em src/app/api/assistant/origins/route.ts
export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token');

        if (!token) {
            return NextResponse.json('Cookie não encontrado', { status: 400 });
        }
        
        const response = await axios.get(`${getBaseApiUrl()}/auxiliar/origens`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token.value}`,
            }
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar origens:', error);
        return NextResponse.json('Houve um erro ao se conectar com a API', { status: 500 });
    }
}

// 4. Uso no componente
const {
    loadOptions: loadOriginOptions,
    selectedOption: selectedOrigin,
    setSelectedOption: setSelectedOrigin,
    defaultOptions: defaultOriginOptions,
    triggerDefaultLoad: triggerOriginDefaultLoad,
    isLoading: isLoadingOrigins,
} = useAsyncSelect<IOriginAssistant>({
    fetchItems: async () => fetchOrigins(),
    getOptionLabel: (origin) => origin.nome,
    getOptionValue: (origin) => origin.id,
    debounceMs: 800,
});

// 5. Implementação no formulário com react-select/async
<Controller
    name="Id_Origem"
    control={control}
    render={({ field }) => (
        <AsyncSelect<AsyncSelectOption<IOriginAssistant>, false>
            cacheOptions
            defaultOptions={selectedOrigin ? [selectedOrigin] : defaultOriginOptions}
            loadOptions={loadOriginOptions}
            inputId="origem-id"
            className="react-select"
            classNamePrefix="react-select"
            placeholder="Selecione a origem..."
            isClearable
            styles={asyncSelectStyles}
            filterOption={filterOption}
            value={selectedOrigin}
            onChange={(option) => {
                const typedOption = option as AsyncSelectOption<IOriginAssistant>;
                setSelectedOrigin(typedOption);
                field.onChange(typedOption?.value);
            }}
            onBlur={field.onBlur}
            onMenuOpen={() => triggerOriginDefaultLoad()}
            noOptionsMessage={() => (isLoadingOrigins ? 'Carregando...' : 'Nenhuma origem encontrada')}
            loadingMessage={() => 'Carregando...'}
        />
    )}
/>
```

### Pontos importantes sobre as rotas de API
1. A rota da API deve ser criada em `src/app/api/assistant/` com o nome adequado (ex: `origins.ts`, `versions.ts`)
2. Sempre incluir verificação do token com `cookies()`
3. Adicionar os headers necessários (Content-Type e Authorization)
4. Usar `getBaseApiUrl()` para montar a URL completa
5. Tratar erros adequadamente e retornar respostas com o status correto
6. Para rotas que precisam de parâmetros, validar se foram fornecidos
7. Usar o prefixo `/auxiliar/` na chamada para a API externa
    fetchItems: async () => {
        // Só buscar versões quando houver um produto selecionado
        if (!selectedProduct) return [];
        const productId = selectedProduct.value;
        return fetchVersions({ produto_id: productId });
    },
    getOptionLabel: (version) => version.sequencia || 'Sem sequência',
    getOptionValue: (version) => version.id,
    debounceMs: 800,
});

// 4. Renderização com estados condicionais
<AsyncSelect
    loadOptions={loadVersionOptions}
    value={selectedVersion}
    isDisabled={!selectedProduct}
    onChange={(option) => {
        setSelectedVersion(option);
        field.onChange(option ? { value: option.value, label: option.label } : null);
    }}
    // ... outros props
/>
```

Pontos importantes deste exemplo:
- O autocomplete só busca dados quando há um produto selecionado
- Interface define exatamente os campos retornados pela API
- Estado disabled controlado pela dependência (produto)
- Feedback visual claro quando desabilitado através de customStyles

## Boas praticas
- Reutilize o hook `useAsyncSelect` para manter o comportamento de debounce e selecao consistente.
- Normalize os rotulos exibidos (nome, setor, etc.) para evitar `undefined` na UI.
- Sempre trate erros na camada de service (try/catch) e logue no backend para facilitar diagnostico.
- Documente particularidades (por exemplo, parametros obrigatorios como `usuario_id`, `produto_id`) diretamente no componente ou neste guia.
- Para autocompletes dependentes, sempre:
  1. Valide a existência do valor dependente antes de fazer a chamada
  2. Limpe a seleção quando o valor dependente mudar
  3. Mantenha o componente desabilitado enquanto não houver dependência

Seguindo esses passos e possivel criar novos autocompletes com comportamento padronizado e integracao transparente entre frontend e backend.
