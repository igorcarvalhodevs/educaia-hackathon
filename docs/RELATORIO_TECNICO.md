# Relatório Técnico — EducaIA

## Hackathon — Pós-Tech

## 1. Identificação do projeto

**Projeto:** EducaIA  
**Tipo:** Aplicação mobile educacional com Inteligência Artificial generativa  
**Objetivo:** Apoiar professores na criação, revisão e gerenciamento de planejamentos pedagógicos personalizados.

O EducaIA foi desenvolvido como projeto de Hackathon da Pós-Tech, integrando aplicação mobile, API backend, banco de dados relacional, autenticação, Inteligência Artificial generativa, segurança e testes automatizados.

A proposta central é utilizar Inteligência Artificial como ferramenta de apoio ao professor, preservando a autonomia humana sobre o planejamento pedagógico.

---

## 2. Problema identificado

A elaboração de planejamentos de aula exige que o professor considere simultaneamente diversos elementos, entre eles:

- disciplina;
- conteúdo;
- série ou ano escolar;
- duração disponível;
- quantidade de alunos;
- nível de aprendizagem;
- características da turma;
- necessidades de acessibilidade;
- recursos disponíveis;
- disponibilidade de internet;
- metodologia pedagógica.

Esse processo pode demandar tempo significativo, especialmente quando o planejamento precisa ser adaptado às características concretas de uma turma.

O EducaIA foi concebido para auxiliar nessa atividade por meio da geração de uma proposta inicial de planejamento pedagógico contextualizada.

A Inteligência Artificial não substitui a decisão do professor. O conteúdo produzido permanece editável antes do salvamento, permitindo revisão, adaptação e validação humana.

---

## 3. Solução desenvolvida

A solução implementada permite ao professor:

- autenticar-se no aplicativo;
- manter sua sessão autenticada;
- informar o contexto pedagógico da aula;
- solicitar a geração de um planejamento;
- utilizar Inteligência Artificial generativa;
- revisar o conteúdo produzido;
- editar manualmente o resultado;
- salvar o planejamento;
- consultar seus planejamentos;
- visualizar o conteúdo de forma estruturada;
- editar planejamentos existentes;
- excluir planejamentos;
- acessar somente recursos pertencentes à sua própria conta.

O fluxo principal implementado é:

```text
Professor
   ↓
Aplicativo mobile
   ↓
Autenticação JWT
   ↓
Formulário pedagógico
   ↓
API REST
   ↓
Construção do prompt
   ↓
Serviço de Inteligência Artificial
   ↓
Google Gemini
   ↓
Planejamento gerado
   ↓
Revisão e edição humana
   ↓
Persistência no PostgreSQL
   ↓
Consulta, edição ou exclusão
```

---

## 4. Arquitetura da solução

A arquitetura foi dividida em três componentes principais.

### 4.1 Aplicativo mobile

Desenvolvido utilizando:

- React Native;
- Expo SDK 57;
- TypeScript;
- React Navigation;
- Expo SecureStore.

O aplicativo é responsável pela interação com o professor.

Entre suas responsabilidades estão:

- autenticação;
- gerenciamento da sessão;
- preenchimento do contexto pedagógico;
- comunicação com a API;
- apresentação do conteúdo gerado;
- revisão humana;
- salvamento;
- listagem;
- visualização;
- edição;
- exclusão.

### 4.2 Backend

O backend foi desenvolvido utilizando Node.js e Express.

Suas principais responsabilidades são:

- autenticação;
- emissão e validação de JWT;
- autorização;
- validação de dados;
- regras de negócio;
- persistência;
- integração com Inteligência Artificial;
- controle de propriedade dos recursos;
- tratamento de erros.

A organização interna utiliza separação entre controllers, services, validators, routes, middlewares e providers.

Essa divisão reduz o acoplamento entre responsabilidades e facilita testes e manutenção.

### 4.3 Banco de dados

Foi utilizado PostgreSQL 16 executado em container Docker.

O acesso aos dados ocorre através do Prisma ORM.

O modelo de dados relaciona os planejamentos ao usuário proprietário, permitindo que o backend aplique controle de acesso aos recursos persistidos.

---

## 5. Inteligência Artificial

A funcionalidade central do EducaIA utiliza a API do Google Gemini.

A integração com a Inteligência Artificial ocorre exclusivamente no backend.

O aplicativo mobile não recebe nem armazena a chave da API do provedor.

A partir das informações fornecidas pelo professor, o backend constrói um prompt pedagógico estruturado considerando, quando informados:

- disciplina;
- série ou ano;
- tema;
- duração;
- quantidade de alunos;
- nível de aprendizagem;
- perfil da turma;
- necessidades de acessibilidade;
- recursos disponíveis;
- disponibilidade de internet;
- metodologia.

O conteúdo retornado pelo modelo é enviado ao aplicativo para revisão.

### 5.1 Human-in-the-loop

Uma decisão importante do projeto foi manter o professor no centro do processo decisório.

O planejamento produzido pela IA não é automaticamente tratado como resultado pedagógico definitivo.

Antes da persistência, o professor pode:

1. analisar o conteúdo;
2. alterar o texto;
3. adaptar estratégias;
4. complementar informações;
5. somente então salvar o planejamento.

Dessa forma, a IA funciona como mecanismo de apoio à elaboração do conteúdo, e não como substituição da avaliação profissional do professor.

---

## 6. Abstração do provedor de IA

A integração com Inteligência Artificial foi isolada em camada própria do backend.

A estrutura separa:

- serviço de IA;
- implementação específica do provedor Gemini.

Essa decisão reduz o acoplamento entre as regras de negócio e o provedor externo.

Como consequência, uma futura substituição ou inclusão de outro modelo de Inteligência Artificial pode ser realizada com impacto reduzido sobre as demais camadas da aplicação.

---

## 7. Autenticação e autorização

A autenticação utiliza JSON Web Token — JWT.

O fluxo implementado contempla:

1. cadastro do usuário;
2. armazenamento seguro da senha por hash;
3. login;
4. validação das credenciais;
5. emissão do token;
6. envio do token nas requisições protegidas;
7. validação do token pelo backend.

As senhas são armazenadas utilizando hash com bcryptjs.

No aplicativo mobile, o token é persistido através do Expo SecureStore.

Isso permite restaurar a sessão do usuário sem armazenar o token diretamente em armazenamento comum da aplicação.

---

## 8. Controle de propriedade dos recursos

Os planejamentos são associados ao usuário autenticado.

As operações de consulta, alteração e exclusão verificam a propriedade do recurso no backend.

Portanto, a segurança não depende apenas da interface mobile.

Mesmo que um usuário tente consultar diretamente um identificador pertencente a outra conta, o backend aplica a restrição correspondente.

Durante o desenvolvimento foram realizados testes específicos utilizando usuários diferentes para validar esse comportamento.

---

## 9. API REST

### 9.1 Autenticação

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

### 9.2 Planejamentos

```text
POST   /plannings/generate
POST   /plannings
GET    /plannings
GET    /plannings/:id
PUT    /plannings/:id
DELETE /plannings/:id
```

As rotas relacionadas aos planejamentos são protegidas por autenticação.

---

## 10. Persistência

O projeto utiliza PostgreSQL e Prisma ORM.

Entre as entidades implementadas estão:

- User;
- Planning;
- Activity.

O relacionamento entre usuário e planejamento permite associar cada recurso ao respectivo proprietário.

As migrations do Prisma fazem parte do repositório, permitindo reproduzir a estrutura do banco de dados em outro ambiente.

---

## 11. Segurança

Foram adotadas diferentes medidas de segurança.

### 11.1 Senhas

As senhas não são armazenadas em texto puro.

É utilizado bcryptjs para geração e verificação dos hashes.

### 11.2 JWT

As funcionalidades protegidas exigem token válido.

### 11.3 SecureStore

O aplicativo utiliza Expo SecureStore para persistência do token de autenticação no dispositivo.

### 11.4 Ownership

O backend verifica a propriedade dos planejamentos nas operações aplicáveis.

### 11.5 Proteção da API

A aplicação utiliza Helmet e CORS.

### 11.6 Credenciais

Arquivos `.env` são ignorados pelo Git.

Credenciais reais e chaves de API não devem ser versionadas.

A chave utilizada para integração com Inteligência Artificial permanece exclusivamente no ambiente do backend.

---

## 12. Tratamento de falhas da Inteligência Artificial

Serviços externos podem apresentar indisponibilidade, erro ou limitação temporária.

Por esse motivo, a integração com IA possui tratamento específico de exceções.

Quando o provedor não consegue gerar o planejamento, a API devolve resposta controlada ao aplicativo, evitando que a falha externa comprometa as demais funcionalidades.

A suíte automatizada também contempla cenário de indisponibilidade do provedor.

Nos testes, a camada externa é simulada por mocks, evitando dependência de chamadas reais à API do Gemini.

---

## 13. Testes automatizados

O backend utiliza:

- Jest;
- Supertest.

A suíte contempla testes relacionados a:

- cadastro;
- autenticação;
- credenciais inválidas;
- proteção de rotas;
- validação de JWT;
- criação de planejamentos;
- consulta;
- atualização;
- exclusão;
- autorização;
- propriedade dos recursos;
- geração através da camada de IA;
- tratamento de indisponibilidade do provedor.

### 13.1 Resultado

Resultado final validado:

```text
Test Suites: 3 passed, 3 total
Tests:       22 passed, 22 total
Snapshots:   0 total
```

Portanto, a suíte possui **22 testes aprovados de 22 executados**.

### 13.2 Cobertura

Cobertura validada durante o desenvolvimento:

```text
Statements : 83.24%
Branches   : 80%
Functions  : 90.9%
Lines      : 83.24%
```

A camada de serviço de IA, serviços de autenticação e planejamento, validators e diversas rotas apresentam cobertura integral ou elevada.

A integração direta do provider Gemini possui cobertura inferior porque as chamadas externas são deliberadamente substituídas por mocks durante os testes automatizados.

Essa estratégia evita consumo da API externa e torna a suíte determinística.

---

## 14. Qualidade do aplicativo mobile

O código TypeScript foi validado utilizando:

```bash
npx tsc --noEmit
```

A verificação foi concluída sem erros de compilação TypeScript.

O ambiente Expo também foi validado utilizando:

```bash
npx expo-doctor
```

Resultado:

```text
21/21 checks passed
No issues detected
```

---

## 15. Validação em dispositivo físico

O aplicativo foi executado e validado em dispositivo móvel físico utilizando Expo Go.

Durante os testes foram validados:

- comunicação do smartphone com o backend;
- autenticação real;
- persistência da sessão;
- logout;
- navegação;
- formulário pedagógico;
- geração de planejamento pela IA;
- revisão do resultado;
- edição do conteúdo;
- persistência;
- listagem;
- consulta;
- edição;
- exclusão.

A geração com Google Gemini foi validada de ponta a ponta através do aplicativo mobile e do backend.

---

## 16. Principais decisões de arquitetura

### IA exclusivamente no backend

Evita exposição da chave do provedor no aplicativo.

### JWT

Permite autenticação stateless da API.

### Expo SecureStore

Evita persistência do token em mecanismo inadequado para informações de autenticação.

### Prisma ORM

Fornece abstração para persistência e gerenciamento das migrations do PostgreSQL.

### Docker

Padroniza a execução do banco de dados no ambiente de desenvolvimento.

### Ownership no backend

Garante que o controle de acesso não dependa exclusivamente da interface mobile.

### Provider de IA desacoplado

Reduz dependência direta entre as regras de negócio e o Google Gemini.

### Human-in-the-loop

Preserva a revisão e decisão final do professor sobre o conteúdo pedagógico produzido.

---

## 17. Desafios encontrados e soluções adotadas

### 17.1 Configuração do Prisma

A versão utilizada do Prisma exigiu adequação da configuração da conexão e utilização do adapter PostgreSQL.

A configuração foi ajustada e posteriormente validada através de geração do client e migrations.

### 17.2 Comunicação entre dispositivo físico e backend

Como o aplicativo foi testado em dispositivo físico, `localhost` não poderia representar o computador que executava a API.

Foi utilizada comunicação através da rede local, apontando o aplicativo para o endereço da máquina responsável pela execução do backend.

### 17.3 Persistência segura da sessão

Para evitar armazenamento inadequado do token, foi utilizado Expo SecureStore.

### 17.4 Integração com Inteligência Artificial

A integração foi isolada em camada específica, permitindo tratamento de erros e simulação do provedor nos testes automatizados.

### 17.5 Autorização

Além da autenticação, tornou-se necessário garantir que um usuário não pudesse acessar planejamentos de outro.

A solução foi implementar verificação de ownership diretamente nas operações do backend.

### 17.6 Conteúdo gerado pela IA

O retorno do modelo pode possuir estrutura textual rica.

Foi implementada visualização apropriada no aplicativo, mantendo também possibilidade de edição do conteúdo pelo professor.

---

## 18. Resultados alcançados

Ao final do desenvolvimento, foi obtida uma aplicação funcional capaz de executar o ciclo principal proposto:

**autenticação → contextualização pedagógica → geração por IA → revisão humana → persistência → gerenciamento do planejamento.**

Os principais resultados técnicos incluem:

- aplicação mobile funcional;
- API REST;
- autenticação JWT;
- persistência segura da sessão;
- banco PostgreSQL;
- Prisma ORM;
- Docker;
- integração real com Google Gemini;
- geração contextualizada de planejamentos;
- revisão humana;
- CRUD de planejamentos;
- autorização baseada em propriedade;
- tratamento de falhas externas;
- testes automatizados;
- 22 testes aprovados;
- cobertura superior a 80% em statements, branches e lines;
- validação TypeScript;
- validação Expo;
- documentação técnica.

---

## 19. Limitações e evoluções futuras

O projeto foi desenvolvido no contexto de um Hackathon e possui possibilidades de evolução.

Entre as melhorias futuras estão:

- publicação do backend em infraestrutura de nuvem;
- banco de dados gerenciado;
- configuração dinâmica da URL da API por ambiente;
- recuperação de senha;
- autenticação multifator;
- paginação da listagem de planejamentos;
- filtros e pesquisa;
- exportação de planejamento para PDF;
- compartilhamento de planejamentos;
- versionamento das alterações;
- templates pedagógicos;
- biblioteca de planejamentos;
- métricas de utilização;
- observabilidade e logging estruturado;
- testes automatizados do aplicativo mobile;
- pipeline CI/CD;
- suporte a múltiplos provedores de IA;
- políticas adicionais de governança de IA.

Essas evoluções não alteram o funcionamento do MVP entregue, mas representam caminhos para amadurecimento da solução.

---

## 20. Conclusão

O EducaIA demonstra a integração de tecnologias mobile, backend, banco de dados e Inteligência Artificial generativa em uma solução educacional completa.

A arquitetura procura equilibrar funcionalidade, segurança, separação de responsabilidades, testabilidade e experiência do usuário.

Um dos princípios centrais adotados foi utilizar a Inteligência Artificial como ferramenta de apoio, mantendo a revisão humana antes da consolidação do planejamento.

Além da geração de conteúdo, o sistema implementa autenticação, autorização, persistência, gerenciamento dos planejamentos e tratamento de falhas, compondo um fluxo funcional de ponta a ponta.

Os testes automatizados e as validações realizadas demonstram o funcionamento das principais regras de negócio e dos mecanismos de segurança implementados.

O resultado é um MVP funcional no qual a Inteligência Artificial auxilia o processo pedagógico sem retirar do professor a decisão final sobre o conteúdo utilizado.

---

## 21. Evidências técnicas da entrega

### Backend

```text
Node.js
Express 5
Prisma ORM 7
PostgreSQL 16
JWT
bcryptjs
Zod
Helmet
CORS
Google Gemini API
Jest
Supertest
Docker
```

### Mobile

```text
React Native
Expo SDK 57
TypeScript
React Navigation
Expo SecureStore
```

### Testes

```text
Test Suites: 3 passed, 3 total
Tests:       22 passed, 22 total

Statements : 83.24%
Branches   : 80%
Functions  : 90.9%
Lines      : 83.24%
```

### Validação mobile

```text
TypeScript: sem erros

Expo Doctor:
21/21 checks passed
No issues detected
```

---

### EducaIA — Inteligência Artificial como apoio ao planejamento pedagógico, mantendo o professor no centro da decisão.