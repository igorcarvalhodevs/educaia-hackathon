# Arquitetura do EducaIA

## 1. Visão geral

O EducaIA é uma aplicação mobile educacional que utiliza Inteligência Artificial generativa como apoio à elaboração de planejamentos pedagógicos personalizados.

A solução foi estruturada com separação entre aplicação mobile, API backend, banco de dados relacional e serviço externo de Inteligência Artificial.

O professor permanece no centro do processo decisório: o conteúdo produzido pela IA pode ser revisado e editado antes de ser persistido no banco de dados.

---

## 2. Arquitetura da solução

```text
┌─────────────────────────────┐
│         Professor           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│     Aplicativo Mobile       │
│   React Native + Expo       │
│                             │
│ • Login                     │
│ • Formulário pedagógico     │
│ • Revisão do conteúdo       │
│ • Gestão dos planejamentos  │
└──────────────┬──────────────┘
               │
               │ HTTP / JSON
               │ JWT
               ▼
┌─────────────────────────────┐
│         API REST            │
│      Node.js + Express      │
│                             │
│ • Autenticação              │
│ • Autorização               │
│ • Validação                 │
│ • Regras de negócio         │
│ • CRUD                      │
│ • Tratamento de erros       │
└───────┬─────────────┬───────┘
        │             │
        │             │
        ▼             ▼
┌───────────────┐  ┌───────────────────┐
│ PostgreSQL 16 │  │ Camada de IA      │
│               │  │                   │
│ Prisma ORM 7  │  │ ai.service.js     │
│               │  │        │          │
│ • Users       │  │        ▼          │
│ • Plannings   │  │ Gemini Provider   │
│ • Activities  │  │        │          │
└───────────────┘  │        ▼          │
                   │ Google Gemini API │
                   └───────────────────┘
```

---

## 3. Componentes

### 3.1 Aplicativo mobile

O aplicativo foi desenvolvido utilizando React Native, Expo e TypeScript.

Principais responsabilidades:

- autenticação do professor;
- persistência segura da sessão;
- coleta das informações pedagógicas;
- solicitação da geração de planejamento;
- apresentação do conteúdo produzido pela IA;
- revisão humana;
- edição do conteúdo;
- salvamento;
- consulta dos planejamentos;
- atualização;
- exclusão.

O token JWT é armazenado no dispositivo utilizando Expo SecureStore.

O aplicativo não possui acesso direto ao banco de dados nem à API do provedor de Inteligência Artificial.

---

### 3.2 Backend

O backend foi desenvolvido utilizando Node.js e Express.

A API centraliza:

- autenticação;
- autorização;
- emissão e validação de JWT;
- validação das requisições;
- regras de negócio;
- controle de propriedade dos recursos;
- persistência;
- integração com Inteligência Artificial;
- tratamento de exceções.

Essa arquitetura impede que regras críticas de segurança dependam exclusivamente da interface mobile.

---

### 3.3 Banco de dados

O projeto utiliza PostgreSQL 16 executado em container Docker.

O acesso ao banco é realizado através do Prisma ORM 7.

O modelo possui três entidades principais:

```text
User
 │
 │ 1:N
 ▼
Planning
 │
 │ 1:N
 ▼
Activity
```

Cada planejamento possui vínculo com o usuário proprietário por meio de `userId`.

Essa relação é utilizada pelo backend para garantir isolamento dos recursos entre usuários.

---

## 4. Autenticação e autorização

A autenticação utiliza JSON Web Token (JWT).

Fluxo:

```text
Professor
   ↓
POST /auth/login
   ↓
Validação das credenciais
   ↓
bcryptjs
   ↓
JWT emitido pelo backend
   ↓
SecureStore no dispositivo
   ↓
Authorization: Bearer <token>
   ↓
Middleware requireAuth
   ↓
Rotas protegidas
```

As senhas não são armazenadas em texto puro.

O backend utiliza bcryptjs para criação e verificação dos hashes.

---

## 5. Controle de propriedade

A autorização não depende apenas da existência de um JWT válido.

Os planejamentos são vinculados ao usuário autenticado.

Nas operações individuais, o backend considera simultaneamente:

```text
planning.id
+
authenticated user.id
```

Consequentemente, um usuário autenticado não pode consultar, alterar ou excluir planejamentos pertencentes a outro usuário.

Quando o recurso não pertence ao usuário autenticado, a API não expõe sua existência ao solicitante.

---

## 6. Integração com Inteligência Artificial

A geração do planejamento ocorre exclusivamente através do backend.

Fluxo:

```text
Professor
   ↓
Formulário pedagógico
   ↓
POST /plannings/generate
   ↓
Validação
   ↓
Construção do prompt
   ↓
ai.service.js
   ↓
Gemini Provider
   ↓
Google Gemini API
   ↓
Conteúdo gerado
   ↓
Aplicativo mobile
```

O prompt pode considerar:

- disciplina;
- série ou ano escolar;
- tema;
- duração;
- quantidade de alunos;
- nível de aprendizagem;
- perfil da turma;
- necessidades de acessibilidade;
- recursos disponíveis;
- disponibilidade de internet;
- metodologia pedagógica.

---

## 7. Abstração do provedor de IA

A integração com o provedor externo foi isolada da lógica principal da aplicação.

Estrutura:

```text
modules/
└── ai/
    ├── ai.service.js
    └── providers/
        └── gemini.provider.js
```

A camada de serviço não precisa concentrar detalhes específicos da API externa.

Essa decisão reduz o acoplamento entre a regra de negócio e o provedor de Inteligência Artificial.

---

## 8. Human in the loop

O EducaIA não trata a resposta da Inteligência Artificial como decisão pedagógica definitiva.

O fluxo implementado é:

```text
IA gera
   ↓
Professor visualiza
   ↓
Professor revisa
   ↓
Professor pode editar
   ↓
Professor decide salvar
   ↓
Persistência no PostgreSQL
```

Esse mecanismo mantém supervisão humana sobre o conteúdo produzido.

---

## 9. Segurança

### Credenciais

Chaves de API e demais credenciais são mantidas em variáveis de ambiente e não são versionadas no Git.

### Token

O JWT é armazenado no mobile utilizando Expo SecureStore.

### API

O backend utiliza Helmet e CORS.

### Autorização

As rotas de planejamento exigem autenticação e verificam a propriedade dos recursos.

### Inteligência Artificial

A chave do provedor de IA permanece exclusivamente no backend.

O aplicativo mobile não recebe nem armazena essa credencial.

---

## 10. Tratamento de falhas da IA

O provedor externo é isolado pela camada de integração de Inteligência Artificial.

Caso ocorra uma falha durante a geração, a exceção é tratada pela API e uma resposta controlada é devolvida ao aplicativo.

Isso evita que indisponibilidades externas comprometam as demais funcionalidades do sistema.

Nos testes automatizados, a dependência externa é substituída por mocks.

---

## 11. Persistência

O fluxo de persistência é separado da geração.

```text
POST /plannings/generate
        ↓
conteúdo gerado
        ↓
revisão humana
        ↓
POST /plannings
        ↓
PostgreSQL
```

Essa separação permite que o professor revise o resultado antes de efetivamente criar o planejamento persistente.

---

## 12. API

### Autenticação

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Planejamentos

```text
POST   /plannings/generate
POST   /plannings
GET    /plannings
GET    /plannings/:id
PUT    /plannings/:id
DELETE /plannings/:id
```

As rotas de planejamento são protegidas por autenticação.

---

## 13. Testes automatizados

O backend utiliza Jest e Supertest.

A suíte automatizada cobre:

- autenticação;
- credenciais inválidas;
- rotas protegidas;
- autorização;
- propriedade dos recursos;
- CRUD de planejamentos;
- geração de planejamento;
- camada de Inteligência Artificial com mocks.

Resultado validado:

```text
Test Suites: 3 passed, 3 total
Tests:       22 passed, 22 total
```

Cobertura validada:

```text
Statements : 83.24%
Branches   : 80%
Functions  : 90.9%
Lines      : 83.24%
```

---

## 14. Decisões arquiteturais

### IA somente no backend

Evita exposição da credencial do provedor no aplicativo.

### JWT

Permite autenticação stateless da API.

### SecureStore

Evita persistência do token em armazenamento simples do dispositivo.

### Prisma ORM

Centraliza o acesso ao PostgreSQL e o modelo relacional.

### Docker

Padroniza o ambiente do banco de dados.

### Provider de IA desacoplado

Reduz dependência direta entre a regra de negócio e o Google Gemini.

### Ownership no backend

Impede que a segurança dos planejamentos dependa exclusivamente do aplicativo mobile.

### Revisão humana antes da persistência

Mantém o professor responsável pela decisão final sobre o conteúdo pedagógico.

---

## 15. Fluxo completo

```text
Professor
   ↓
Login
   ↓
JWT
   ↓
Formulário pedagógico
   ↓
API REST
   ↓
Prompt estruturado
   ↓
Gemini
   ↓
Planejamento gerado
   ↓
Revisão e edição humana
   ↓
Salvamento
   ↓
PostgreSQL
   ↓
Consulta
   ↓
Edição / exclusão
```

---

## 16. Estrutura arquitetural resumida

```text
Presentation
    │
    └── React Native / Expo
             │
             ▼
Application / API
    │
    └── Express
         │
         ├── Auth
         ├── Plannings
         └── AI Service
               │
               └── Gemini Provider
         │
         ▼
Persistence
    │
    └── Prisma ORM
             │
             ▼
        PostgreSQL
```

---

**EducaIA — Inteligência Artificial como apoio ao planejamento pedagógico, mantendo o professor no centro da decisão.**