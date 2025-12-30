# Guia de Boas Práticas: React, SOLID e Componentização

## 📋 Índice

1. [Introdução](#introdução)
2. [Princípios SOLID no React](#princípios-solid-no-react)
3. [Componentização](#componentização)
4. [Hooks Customizados](#hooks-customizados)
5. [Estrutura de Arquivos](#estrutura-de-arquivos)
6. [Checklist de Refatoração](#checklist-de-refatoração)
7. [Exemplos Práticos](#exemplos-práticos)
8. [Anti-padrões a Evitar](#anti-padrões-a-evitar)

---

## Introdução

Este documento estabelece as diretrizes para criação e refatoração de componentes React seguindo os princípios SOLID, boas práticas de componentização e padrões de código limpo. Estas práticas garantem código mais manutenível, testável e escalável.

### Objetivos

- **Manutenibilidade**: Código fácil de entender e modificar
- **Reutilização**: Componentes e hooks reutilizáveis
- **Testabilidade**: Componentes isolados e fáceis de testar
- **Escalabilidade**: Estrutura que suporta crescimento do projeto
- **Legibilidade**: Código auto-documentado e claro

---

## Princípios SOLID no React

### 1. Single Responsibility Principle (SRP) - Responsabilidade Única

**Cada componente/hook deve ter apenas uma razão para mudar.**

#### ❌ Ruim
```tsx
// Componente fazendo muitas coisas
export default function UserProfile({ user }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  
  // Lógica de busca
  const fetchData = async () => { /* ... */ };
  
  // Lógica de validação
  const validateForm = () => { /* ... */ };
  
  // Lógica de formatação
  const formatDate = (date) => { /* ... */ };
  
  // Renderização complexa
  return (
    <div>
      {/* 200+ linhas de JSX */}
    </div>
  );
}
```

#### ✅ Bom
```tsx
// Componente principal - apenas orquestração
export default function UserProfile({ user }) {
  const { data, loading, fetchData } = useUserData(user.id);
  const { validate, errors } = useFormValidation();
  
  return (
    <UserProfileHeader user={user} />
    <UserProfileForm 
      user={user} 
      onValidate={validate}
      errors={errors}
    />
    <UserProfileActions 
      onSave={fetchData}
      loading={loading}
    />
  );
}

// Hook para lógica de dados
function useUserData(userId) {
  // Apenas lógica de busca de dados
}

// Hook para validação
function useFormValidation() {
  // Apenas lógica de validação
}
```

### 2. Open/Closed Principle (OCP) - Aberto para Extensão, Fechado para Modificação

**Componentes devem ser extensíveis sem modificar o código existente.**

#### ✅ Bom
```tsx
// Componente base extensível
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md',
  children,
  onClick,
  className = ''
}: ButtonProps) {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Uso - extensível via props
<Button variant="primary" className="custom-class">
  Salvar
</Button>
```

### 3. Liskov Substitution Principle (LSP) - Substituição de Liskov

**Componentes derivados devem ser substituíveis por seus componentes base.**

#### ✅ Bom
```tsx
// Interface base
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Componente base
export function BaseModal({ open, onClose, title, children }: ModalProps) {
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
}

// Componente específico que pode substituir o base
export function ConfirmModal({ open, onClose, title, message, onConfirm }: ConfirmModalProps) {
  return (
    <BaseModal open={open} onClose={onClose} title={title}>
      <p>{message}</p>
      <Button onClick={onConfirm}>Confirmar</Button>
    </BaseModal>
  );
}
```

### 4. Interface Segregation Principle (ISP) - Segregação de Interface

**Componentes não devem depender de props que não utilizam.**

#### ❌ Ruim
```tsx
interface UserCardProps {
  user: User;
  showEmail: boolean;
  showPhone: boolean;
  showAddress: boolean;
  showBio: boolean;
  // ... muitas outras props
}

// Componente recebe muitas props que não usa
function UserCard({ user, showEmail, showPhone, showAddress, showBio }: UserCardProps) {
  return (
    <div>
      <h3>{user.name}</h3>
      {/* Usa apenas algumas props */}
    </div>
  );
}
```

#### ✅ Bom
```tsx
// Interfaces segregadas
interface UserCardBasicProps {
  user: User;
  showEmail?: boolean;
}

interface UserCardDetailedProps extends UserCardBasicProps {
  showPhone: boolean;
  showAddress: boolean;
  showBio: boolean;
}

// Componente básico
function UserCardBasic({ user, showEmail }: UserCardBasicProps) {
  return (
    <div>
      <h3>{user.name}</h3>
      {showEmail && <p>{user.email}</p>}
    </div>
  );
}

// Componente detalhado
function UserCardDetailed({ user, showEmail, showPhone, showAddress, showBio }: UserCardDetailedProps) {
  return (
    <UserCardBasic user={user} showEmail={showEmail} />
    {/* Campos adicionais */}
  );
}
```

### 5. Dependency Inversion Principle (DIP) - Inversão de Dependência

**Componentes devem depender de abstrações (hooks, interfaces), não de implementações concretas.**

#### ❌ Ruim
```tsx
// Dependência direta de implementação
export default function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // Dependência direta da API
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers);
  }, []);
  
  return <div>{/* ... */}</div>;
}
```

#### ✅ Bom
```tsx
// Dependência de abstração (hook)
export default function UserList() {
  const { users, loading, error } = useUsers();
  
  return <div>{/* ... */}</div>;
}

// Hook abstrai a implementação
function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Implementação isolada
    fetchUsers().then(setUsers);
  }, []);
  
  return { users, loading };
}
```

---

## Componentização

### Quando Componentizar?

Componentize quando:

1. **Componente excede 200-300 linhas**
2. **Lógica pode ser reutilizada**
3. **Responsabilidades distintas são identificadas**
4. **Testes se tornam difíceis**
5. **JSX fica muito aninhado ou complexo**

### Estrutura de Componentização

#### 1. Componente Orquestrador (Container)

```tsx
// casesModalResume.tsx - Componente principal
export default function CasesModalResume({ open, setOpen, case: caseData }: Props) {
  // Apenas orquestração - sem lógica de negócio
  const { data, actions } = useCaseModalActions(caseData);
  
  return (
    <>
      <CaseModalStyles />
      <Modal show={open}>
        <CaseModalHeader caseData={data} />
        <CaseModalBody caseData={data} actions={actions} />
        <CaseModalFooter actions={actions} />
      </Modal>
    </>
  );
}
```

#### 2. Componentes de Apresentação (Presentational)

```tsx
// CaseModalHeader.tsx - Apenas apresentação
interface CaseModalHeaderProps {
  caseData: ICase | null;
}

export default function CaseModalHeader({ caseData }: CaseModalHeaderProps) {
  return (
    <Modal.Header>
      <Modal.Title>
        {caseData ? `Caso #${caseData.caso.id}` : 'Carregando...'}
      </Modal.Title>
    </Modal.Header>
  );
}
```

#### 3. Componentes de Layout

```tsx
// CaseModalTabs.tsx - Layout específico
interface CaseModalTabsProps {
  caseData: ICase | null;
  onCaseUpdated: (case: ICase) => void;
}

export default function CaseModalTabs({ caseData, onCaseUpdated }: CaseModalTabsProps) {
  return (
    <Tab.Container>
      <Nav variant="tabs">
        {/* Abas */}
      </Nav>
      <Tab.Content>
        {/* Conteúdo das abas */}
      </Tab.Content>
    </Tab.Container>
  );
}
```

### Regras de Componentização

1. **Um componente = Uma responsabilidade**
2. **Props bem definidas com TypeScript**
3. **Sem lógica de negócio nos componentes de apresentação**
4. **Componentes pequenos e focados (50-150 linhas ideal)**
5. **Nomes descritivos e claros**

---

## Hooks Customizados

### Quando Criar um Hook?

Crie um hook quando:

1. **Lógica é reutilizada em múltiplos componentes**
2. **Lógica de negócio está misturada com apresentação**
3. **Estado e efeitos estão complexos**
4. **Lógica pode ser testada isoladamente**

### Estrutura de Hooks

#### 1. Hook de Estado e Efeitos

```tsx
// useModalScroll.ts
/**
 * Hook para prevenir scroll do body quando modal está aberto
 * Especialmente útil no mobile
 */
export function useModalScroll(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);
}
```

#### 2. Hook de Ações (Business Logic)

```tsx
// useCaseModalActions.ts
interface UseCaseModalActionsProps {
  caseData: ICase | null;
  setCase?: (caseData: ICase | null) => void;
  onClose: () => void;
}

export function useCaseModalActions({
  caseData,
  setCase,
  onClose,
}: UseCaseModalActionsProps) {
  // Estados
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Refs
  const resumeFormRef = useRef<ResumeFormRef>(null);
  
  // Handlers
  const handleSave = async () => {
    if (!resumeFormRef.current || saving) return;
    setSaving(true);
    try {
      await resumeFormRef.current.save();
    } finally {
      setSaving(false);
    }
  };
  
  const handleDelete = async () => {
    // Lógica de deleção
  };
  
  // Retorna apenas o necessário
  return {
    resumeFormRef,
    saving,
    deleting,
    handleSave,
    handleDelete,
    // ...
  };
}
```

#### 3. Hook de Dados (Data Fetching)

```tsx
// useCaseData.ts
export function useCaseData(caseId: string | null) {
  const [data, setData] = useState<ICase | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!caseId) return;
    
    setLoading(true);
    findCase(caseId)
      .then(response => {
        setData(response.data);
        setError(null);
      })
      .catch(err => {
        setError(err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [caseId]);
  
  return { data, loading, error };
}
```

### Convenções de Hooks

1. **Sempre começar com `use`**
2. **Um hook = Uma responsabilidade**
3. **Documentar com JSDoc**
4. **Retornar objeto com propriedades nomeadas**
5. **Tratar erros adequadamente**

---

## Estrutura de Arquivos

### Organização Recomendada

```
src/app/(admin)/apps/cases/list/
├── casesModalResume.tsx          # Componente orquestrador principal
├── hooks/
│   ├── useModalScroll.ts         # Hook para scroll
│   ├── useCaseModalActions.ts   # Hook para ações do caso
│   └── index.ts                  # Exportações dos hooks
└── components/
    ├── CaseModalHeader.tsx       # Cabeçalho do modal
    ├── CaseModalStyles.tsx       # Estilos CSS
    ├── CaseModalTabs.tsx         # Abas (desktop)
    ├── CaseModalTabsMobile.tsx   # Abas (mobile)
    ├── CaseModalTimeColumn.tsx   # Coluna de tempo
    ├── CaseModalActionButtons.tsx # Botões de ação
    └── index.ts                  # Exportações dos componentes
```

### Convenções de Nomenclatura

1. **Componentes**: PascalCase (`CaseModalHeader`)
2. **Hooks**: camelCase com prefixo `use` (`useCaseModalActions`)
3. **Arquivos**: Mesmo nome do componente/hook
4. **Pastas**: camelCase ou kebab-case
5. **Interfaces/Types**: PascalCase com sufixo `Props` ou `Type`

---

## Checklist de Refatoração

### Antes de Começar

- [ ] Identificar responsabilidades distintas
- [ ] Identificar lógica reutilizável
- [ ] Identificar componentes muito grandes (>200 linhas)
- [ ] Identificar lógica de negócio misturada com apresentação

### Durante a Refatoração

#### 1. Extrair Hooks

- [ ] Lógica de estado → Hook customizado
- [ ] Lógica de efeitos → Hook customizado
- [ ] Lógica de negócio → Hook customizado
- [ ] Lógica de dados → Hook customizado

#### 2. Extrair Componentes

- [ ] JSX complexo → Componente separado
- [ ] Seções distintas → Componentes separados
- [ ] Lógica repetida → Componente reutilizável
- [ ] Estilos inline extensos → Componente de estilos

#### 3. Aplicar SOLID

- [ ] Cada componente tem uma responsabilidade única?
- [ ] Componentes são extensíveis via props?
- [ ] Interfaces estão segregadas?
- [ ] Dependências são de abstrações?

#### 4. Organizar Arquivos

- [ ] Hooks em pasta `hooks/`
- [ ] Componentes em pasta `components/`
- [ ] Exportações centralizadas em `index.ts`
- [ ] Nomes de arquivos seguem convenções

### Após a Refatoração

- [ ] Código reduzido em pelo menos 30-50%
- [ ] Componentes com menos de 200 linhas
- [ ] Hooks testáveis isoladamente
- [ ] Sem duplicação de código
- [ ] TypeScript sem erros
- [ ] Linter sem erros

---

## Exemplos Práticos

### Exemplo 1: Refatoração de Modal Complexo

#### Antes (982 linhas)

```tsx
export default function CasesModalResume({ open, setOpen, case: caseData }: Props) {
  // 20+ estados
  const [finalizing, setFinalizing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  // ... muitos outros
  
  // 10+ handlers
  const handleSave = async () => { /* 50 linhas */ };
  const handleDelete = async () => { /* 50 linhas */ };
  // ... muitos outros
  
  // 500+ linhas de JSX
  return (
    <>
      <style>{/* 300 linhas de CSS */}</style>
      <Modal>
        {/* 200 linhas de JSX */}
      </Modal>
    </>
  );
}
```

#### Depois (174 linhas)

```tsx
export default function CasesModalResume({ open, setOpen, case: caseData }: Props) {
  // Hooks customizados
  const { data, actions } = useCaseModalActions(caseData);
  useModalScroll(open);
  
  // Componentes extraídos
  return (
    <>
      <CaseModalStyles />
      <Modal>
        <CaseModalHeader caseData={data} />
        <CaseModalBody caseData={data} actions={actions} />
        <CaseModalFooter actions={actions} />
      </Modal>
    </>
  );
}
```

### Exemplo 2: Extração de Lógica de Negócio

#### Antes

```tsx
export default function UserForm({ user }: Props) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  
  // Lógica de validação misturada
  const handleSubmit = async () => {
    // Validação
    if (!email.includes('@')) {
      setErrors({ email: 'Email inválido' });
      return;
    }
    
    // API call
    await updateUser({ email, phone });
  };
  
  return <form>{/* ... */}</form>;
}
```

#### Depois

```tsx
// Hook de validação
function useUserValidation() {
  const [errors, setErrors] = useState({});
  
  const validate = (data: UserData) => {
    const newErrors = {};
    if (!data.email.includes('@')) {
      newErrors.email = 'Email inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  return { errors, validate };
}

// Hook de atualização
function useUserUpdate() {
  const [loading, setLoading] = useState(false);
  
  const update = async (data: UserData) => {
    setLoading(true);
    try {
      await updateUser(data);
    } finally {
      setLoading(false);
    }
  };
  
  return { update, loading };
}

// Componente
export default function UserForm({ user }: Props) {
  const { errors, validate } = useUserValidation();
  const { update, loading } = useUserUpdate();
  
  const handleSubmit = async (data: UserData) => {
    if (validate(data)) {
      await update(data);
    }
  };
  
  return <form>{/* ... */}</form>;
}
```

### Exemplo 3: Componentização de Lista Complexa

#### Antes

```tsx
export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('name');
  
  return (
    <div>
      {/* Filtros - 50 linhas */}
      <div>
        <input value={filter} onChange={e => setFilter(e.target.value)} />
        <select value={sort} onChange={e => setSort(e.target.value)}>
          {/* ... */}
        </select>
      </div>
      
      {/* Lista - 100 linhas */}
      <div>
        {users.map(user => (
          <div key={user.id}>
            {/* 20 linhas por item */}
          </div>
        ))}
      </div>
      
      {/* Paginação - 50 linhas */}
      <div>
        {/* ... */}
      </div>
    </div>
  );
}
```

#### Depois

```tsx
// Hook de dados
function useUsers(filter: string, sort: string) {
  const [users, setUsers] = useState([]);
  // Lógica de busca e ordenação
  return { users };
}

// Componentes
function UserListFilters({ filter, sort, onChange }) {
  return (
    <div>
      <input value={filter} onChange={e => onChange('filter', e.target.value)} />
      <select value={sort} onChange={e => onChange('sort', e.target.value)}>
        {/* ... */}
      </select>
    </div>
  );
}

function UserListItem({ user }) {
  return (
    <div>
      {/* Item da lista */}
    </div>
  );
}

function UserListPagination({ page, total, onPageChange }) {
  return (
    <div>
      {/* Paginação */}
    </div>
  );
}

// Componente principal
export default function UserList() {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('name');
  const { users } = useUsers(filter, sort);
  
  return (
    <div>
      <UserListFilters 
        filter={filter} 
        sort={sort}
        onChange={(key, value) => {
          if (key === 'filter') setFilter(value);
          if (key === 'sort') setSort(value);
        }}
      />
      <div>
        {users.map(user => (
          <UserListItem key={user.id} user={user} />
        ))}
      </div>
      <UserListPagination />
    </div>
  );
}
```

---

## Anti-padrões a Evitar

### 1. God Component (Componente Deus)

❌ **Evitar**: Componente que faz tudo

```tsx
// Componente com 500+ linhas fazendo tudo
export default function Dashboard() {
  // Busca dados
  // Valida formulários
  // Formata datas
  // Renderiza gráficos
  // Gerencia estado global
  // ...
}
```

✅ **Fazer**: Dividir em componentes especializados

```tsx
export default function Dashboard() {
  return (
    <>
      <DashboardHeader />
      <DashboardCharts />
      <DashboardTable />
      <DashboardActions />
    </>
  );
}
```

### 2. Props Drilling (Passagem Excessiva de Props)

❌ **Evitar**: Passar props através de muitos níveis

```tsx
<App user={user}>
  <Layout user={user}>
    <Header user={user}>
      <UserMenu user={user} />
    </Header>
  </Layout>
</App>
```

✅ **Fazer**: Usar Context ou composição

```tsx
<UserProvider user={user}>
  <App>
    <Layout>
      <Header>
        <UserMenu /> {/* Acessa via context */}
      </Header>
    </Layout>
  </App>
</UserProvider>
```

### 3. Lógica de Negócio em Componentes

❌ **Evitar**: Lógica complexa no componente

```tsx
export default function OrderForm() {
  const calculateTotal = () => {
    // 50 linhas de lógica de cálculo
  };
  
  return <form>{/* ... */}</form>;
}
```

✅ **Fazer**: Extrair para hook

```tsx
function useOrderCalculation() {
  const calculateTotal = () => {
    // Lógica isolada
  };
  return { calculateTotal };
}

export default function OrderForm() {
  const { calculateTotal } = useOrderCalculation();
  return <form>{/* ... */}</form>;
}
```

### 4. Estilos Inline Excessivos

❌ **Evitar**: Muitos estilos inline

```tsx
<div style={{ 
  display: 'flex', 
  flexDirection: 'column',
  padding: '1rem',
  margin: '0.5rem',
  // ... 20+ propriedades
}}>
```

✅ **Fazer**: Usar classes CSS ou styled-components

```tsx
<div className="modal-container">
  {/* ... */}
</div>
```

### 5. Estados Duplicados

❌ **Evitar**: Mesmo estado em múltiplos lugares

```tsx
// Componente A
const [loading, setLoading] = useState(false);

// Componente B
const [loading, setLoading] = useState(false);
```

✅ **Fazer**: Compartilhar via hook ou context

```tsx
// Hook compartilhado
function useLoading() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}

// Usar em ambos componentes
const { loading, setLoading } = useLoading();
```

### 6. Efeitos com Múltiplas Responsabilidades

❌ **Evitar**: useEffect fazendo muitas coisas

```tsx
useEffect(() => {
  // Busca dados
  fetchData();
  
  // Atualiza título
  document.title = 'Novo título';
  
  // Registra evento
  analytics.track('page_view');
  
  // Limpa timer
  const timer = setInterval(() => {}, 1000);
  
  return () => {
    clearInterval(timer);
  };
}, []);
```

✅ **Fazer**: Separar em múltiplos useEffect

```tsx
useEffect(() => {
  fetchData();
}, []);

useEffect(() => {
  document.title = 'Novo título';
}, []);

useEffect(() => {
  analytics.track('page_view');
}, []);

useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);
```

---

## Métricas de Qualidade

### Tamanho de Arquivos

- **Componentes**: Idealmente < 200 linhas, máximo 300 linhas
- **Hooks**: Idealmente < 150 linhas, máximo 200 linhas
- **Arquivos TypeScript**: Máximo 500 linhas

### Complexidade Ciclomática

- **Componentes**: < 10
- **Funções**: < 5
- **Hooks**: < 8

### Acoplamento

- **Baixo acoplamento**: Componentes independentes
- **Alta coesão**: Componentes com responsabilidades relacionadas

---

## Ferramentas de Apoio

### 1. ESLint

```json
{
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "max-lines": ["warn", { "max": 300 }],
    "complexity": ["warn", 10]
  }
}
```

### 2. TypeScript

- Sempre usar tipos explícitos
- Evitar `any`
- Usar interfaces para props

### 3. Testes

- Testar hooks isoladamente
- Testar componentes de apresentação
- Testar lógica de negócio

---

## Conclusão

Seguir estas práticas garante:

1. ✅ **Código mais limpo e organizado**
2. ✅ **Facilidade de manutenção**
3. ✅ **Reutilização de componentes**
4. ✅ **Testabilidade**
5. ✅ **Escalabilidade**
6. ✅ **Colaboração eficiente**

### Próximos Passos

1. Revisar código existente aplicando estas práticas
2. Criar templates de componentes e hooks
3. Estabelecer code reviews focados em SOLID
4. Documentar padrões específicos do projeto
5. Treinar equipe nas práticas estabelecidas

---

**Última atualização**: 2024
**Versão**: 1.0.0







