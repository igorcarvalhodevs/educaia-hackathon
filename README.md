# EducaIA

Assistente educacional com Inteligência Artificial para criação, revisão e gerenciamento de planejamentos pedagógicos personalizados.

O EducaIA foi desenvolvido como projeto de Hackathon da Pós-Tech, integrando aplicação mobile, API backend, banco de dados relacional, autenticação, Inteligência Artificial generativa e testes automatizados.

## 1. Sobre o projeto

Professores frequentemente precisam elaborar planejamentos de aula considerando não apenas disciplina e conteúdo, mas também características específicas de cada turma, como:

- série ou ano escolar;
- duração disponível;
- quantidade de alunos;
- nível de aprendizagem;
- perfil da turma;
- necessidades de acessibilidade;
- recursos disponíveis;
- disponibilidade de internet;
- metodologia pedagógica.

O EducaIA utiliza essas informações para gerar, com apoio de Inteligência Artificial, uma proposta estruturada de planejamento de aula.

A solução foi concebida mantendo o professor no centro do processo decisório: o conteúdo gerado pela IA pode ser revisado e editado antes de ser salvo e também pode ser posteriormente consultado, alterado ou excluído.

## 2. Fluxo principal

```text
Professor
    ↓
Aplicativo mobile
    ↓
Autenticação JWT
    ↓
Formulário pedagógico
    ↓
API Express
    ↓
Serviço de Inteligência Artificial
    ↓
Google Gemini
    ↓
Planejamento gerado
    ↓
Revisão humana
    ↓
Persistência no PostgreSQL
    ↓
Consulta / edição / exclusão
```

## 3. Arquitetura

A solução é dividida em três componentes principais:

### Mobile

Aplicação desenvolvida com React Native e Expo.

Responsável por:

- autenticação do professor;
- coleta do contexto pedagógico;
- solicitação de geração do planejamento;
- revisão do conteúdo produzido pela IA;
- salvamento dos planejamentos;
- listagem dos planejamentos do usuário;
- visualização formatada;
- edição;
- exclusão.

### Backend

API REST desenvolvida com Node.js e Express.

Responsável por:

- autenticação;
- emissão e validação de JWT;
- autorização;
- validação dos dados;
- regras de negócio;
- integração com Inteligência Artificial;
- persistência;
- isolamento dos recursos por usuário;
- tratamento de erros.

### Banco de dados

PostgreSQL 16 executado em container Docker.

O acesso ao banco é realizado através do Prisma ORM.

## 4. Tecnologias

### Backend

- Node.js
- Express 5
- Prisma ORM 7
- PostgreSQL 16
- JWT
- bcryptjs
- Zod
- Helmet
- CORS
- Google Gemini API
- Jest
- Supertest
- Docker

### Mobile

- React Native
- Expo SDK 57
- TypeScript
- React Navigation
- Expo SecureStore

## 5. Inteligência Artificial

O EducaIA utiliza a API do Google Gemini para geração dos planejamentos pedagógicos.

O backend constrói um prompt estruturado considerando dados fornecidos pelo professor, como disciplina, série, tema, duração, quantidade de alunos, nível de aprendizagem, perfil da turma, necessidades de acessibilidade, recursos, disponibilidade de internet e metodologia.

A integração com a IA ocorre exclusivamente através do backend.

A chave da API de Inteligência Artificial não é armazenada nem exposta no aplicativo mobile.

O conteúdo produzido pela IA não é tratado como decisão pedagógica definitiva. O professor pode revisar e modificar o planejamento antes de persistir o resultado.

## 6. Segurança

O projeto implementa diferentes controles de segurança.

### Autenticação

O acesso às funcionalidades protegidas utiliza JSON Web Token (JWT).

### Senhas

As senhas são armazenadas utilizando hash com bcryptjs.

### Armazenamento do token no mobile

O token de autenticação é armazenado utilizando Expo SecureStore.

### Autorização e isolamento dos dados

Os planejamentos são vinculados ao usuário autenticado.

As operações de consulta, atualização e exclusão verificam a propriedade do recurso no backend, impedindo que um usuário acesse ou modifique planejamentos pertencentes a outro usuário.

### Proteção da API

O backend utiliza Helmet e CORS.

### Segredos

Arquivos `.env` são ignorados pelo Git e não devem ser versionados.

## 7. Funcionalidades

O sistema implementa:

- cadastro de usuário;
- login;
- persistência de sessão;
- logout;
- autenticação JWT;
- criação de planejamento com IA;
- contextualização pedagógica da geração;
- revisão humana do conteúdo;
- salvamento no banco de dados;
- listagem de planejamentos;
- consulta individual;
- visualização formatada do planejamento;
- edição;
- exclusão;
- controle de propriedade dos recursos;
- tratamento de falhas do provedor de IA.

## 8. API

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

## 9. Estrutura do projeto

```text
educaia-hackathon/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── middlewares/
│   │   └── modules/
│   │       ├── ai/
│   │       ├── auth/
│   │       └── plannings/
│   ├── tests/
│   ├── docker-compose.yml
│   └── package.json
│
├── mobile/
│   ├── assets/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── navigation/
│   │   ├── screens/
│   │   ├── services/
│   │   └── types/
│   └── package.json
│
├── docs/
├── .gitignore
└── README.md
```

## 10. Executando o projeto

### Pré-requisitos

É necessário possuir:

- Node.js;
- npm;
- Docker Desktop;
- Expo Go, para execução em dispositivo físico.

### 10.1 Banco de dados

Acesse o backend:

```bash
cd backend
```

Suba o PostgreSQL:

```bash
docker compose up -d
```

Confira o container:

```bash
docker compose ps
```

O banco configurado para desenvolvimento utiliza:

```text
PostgreSQL 16
Database: educaia
Port: 5432
```

### 10.2 Backend

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente necessárias no arquivo `.env`.

Depois execute:

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

A API é executada, por padrão, na porta:

```text
3000
```

### 10.3 Mobile

Em outro terminal:

```bash
cd mobile
npm install
npx expo start
```

Para utilização em dispositivo físico, o computador e o smartphone devem estar acessíveis pela mesma rede local quando a API estiver sendo executada localmente.

A URL da API utilizada pelo mobile deve apontar para o endereço da máquina que executa o backend.

## 11. Testes

Os testes automatizados do backend utilizam Jest e Supertest.

Para executar:

```bash
cd backend
npm test
```

Resultado validado durante o desenvolvimento:

```text
Test Suites: 3 passed, 3 total
Tests:       22 passed, 22 total
```

Para gerar a cobertura:

```bash
npm run test:coverage
```

Cobertura validada:

```text
Statements : 83.24%
Branches   : 80%
Functions  : 90.9%
Lines      : 83.24%
```

Os testes abrangem autenticação, autorização, CRUD de planejamentos e integração da camada de IA através de mocks, evitando dependência de chamadas externas durante a suíte automatizada.

## 12. Validação do mobile

Validação TypeScript:

```bash
cd mobile
npx tsc --noEmit
```

Validação do ambiente Expo:

```bash
npx expo-doctor
```

Resultado validado:

```text
21/21 checks passed
No issues detected
```

## 13. Tratamento de falhas da IA

A integração com Inteligência Artificial é isolada em uma camada própria do backend.

Em caso de indisponibilidade do provedor, a API trata a exceção e devolve uma resposta controlada ao aplicativo, evitando que uma falha externa comprometa as demais funcionalidades do sistema.

Nos testes automatizados, o provedor externo é simulado por mocks.

## 14. Decisões de arquitetura

Algumas decisões importantes adotadas no projeto:

**IA no backend:** evita exposição de credenciais no aplicativo.

**JWT:** permite autenticação stateless da API.

**SecureStore:** evita armazenamento inseguro do token no dispositivo.

**Prisma ORM:** fornece abstração e tipagem para acesso ao PostgreSQL.

**Docker:** padroniza o ambiente do banco de dados.

**Ownership no backend:** a segurança dos planejamentos não depende apenas da interface; o próprio backend verifica o usuário proprietário do recurso.

**Revisão humana:** o resultado da IA permanece editável, preservando a autonomia do professor sobre o planejamento pedagógico.

## 15. Qualidade

Antes da entrega foram realizadas verificações de:

- compilação TypeScript;
- compatibilidade das dependências Expo;
- testes automatizados;
- cobertura de testes;
- autenticação;
- autorização;
- persistência;
- CRUD;
- integração mobile/backend;
- geração por IA;
- tratamento de erros;
- revisão e edição humana do conteúdo.

## 16. Entrega

O repositório contém:

- código-fonte do backend;
- código-fonte do aplicativo mobile;
- configuração Docker;
- modelagem e migrations do banco;
- testes automatizados;
- integração com IA;
- documentação técnica.

## 17. Observação sobre credenciais

Por segurança, credenciais e chaves de API não fazem parte do repositório.

Cada ambiente deve configurar suas próprias variáveis através do arquivo `.env`.

---

**EducaIA — Inteligência Artificial como apoio ao planejamento pedagógico, mantendo o professor no centro da decisão.**