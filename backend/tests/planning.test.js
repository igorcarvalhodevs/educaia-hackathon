require("dotenv").config({ quiet: true });

const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../src/app");
const prisma = require("../src/config/prisma");

describe("CRUD de Planejamentos e Ownership", () => {
  let userA;
  let userB;

  let tokenA;
  let tokenB;

  let planningId;

  const testId = Date.now();

  const emailA = `professor.a.${testId}@educaia.test`;
  const emailB = `professor.b.${testId}@educaia.test`;

  const planningData = {
    subject: "Ciências",
    grade: "7º ano",
    topic: "Ecossistemas brasileiros",
    duration: 50,
    classSize: 35,
    learningLevel: "Intermediário",
    classProfile:
      "Turma heterogênea com diferentes níveis de aprendizagem",
    accessibilityNeeds:
      "Um estudante apresenta dificuldade de leitura",
    resources: "Quadro e projetor",
    internetAccess: "Limitada",
    methodology: "Mista",
    generatedContent:
      "Plano de aula gerado e revisado pelo professor.",
  };

  beforeAll(async () => {
    // Cria dois usuários exclusivos para este teste.
    // Não usamos Ana/Carlos para manter os testes isolados.
    userA = await prisma.user.create({
      data: {
        name: "Professor Teste A",
        email: emailA,
        passwordHash: "hash-de-teste",
      },
    });

    userB = await prisma.user.create({
      data: {
        name: "Professor Teste B",
        email: emailB,
        passwordHash: "hash-de-teste",
      },
    });

    tokenA = jwt.sign(
      {
        sub: userA.id,
        email: userA.email,
        name: userA.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    tokenB = jwt.sign(
      {
        sub: userB.id,
        email: userB.email,
        name: userB.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  });

  test("deve criar um planejamento para o usuário autenticado", async () => {
    const response = await request(app)
      .post("/plannings")
      .set("Authorization", `Bearer ${tokenA}`)
      .send(planningData);

    expect(response.status).toBe(201);

    expect(response.body.id).toBeDefined();

    expect(response.body.subject).toBe(
      planningData.subject
    );

    expect(response.body.topic).toBe(
      planningData.topic
    );

    expect(response.body.userId).toBe(userA.id);

    planningId = response.body.id;
  });

  test("deve listar os planejamentos do próprio usuário", async () => {
    const response = await request(app)
      .get("/plannings")
      .set("Authorization", `Bearer ${tokenA}`);

    expect(response.status).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);

    const planning = response.body.find(
      (item) => item.id === planningId
    );

    expect(planning).toBeDefined();

    expect(planning.userId).toBe(userA.id);
  });

  test("deve consultar o próprio planejamento por ID", async () => {
    const response = await request(app)
      .get(`/plannings/${planningId}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(response.status).toBe(200);

    expect(response.body.id).toBe(planningId);

    expect(response.body.userId).toBe(userA.id);

    expect(response.body.topic).toBe(
      "Ecossistemas brasileiros"
    );
  });

  test("deve permitir que o proprietário atualize o planejamento", async () => {
    const response = await request(app)
      .put(`/plannings/${planningId}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        topic: "Biomas e ecossistemas brasileiros",
        duration: 60,
      });

    expect(response.status).toBe(200);

    expect(response.body.topic).toBe(
      "Biomas e ecossistemas brasileiros"
    );

    expect(response.body.duration).toBe(60);
  });

  test("usuário B não deve conseguir consultar planejamento do usuário A", async () => {
    const response = await request(app)
      .get(`/plannings/${planningId}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(response.status).toBe(404);

    expect(response.body.message).toBe(
      "Planning not found"
    );
  });

  test("usuário B não deve conseguir alterar planejamento do usuário A", async () => {
    const response = await request(app)
      .put(`/plannings/${planningId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        topic: "Tentativa de alteração indevida",
      });

    expect(response.status).toBe(404);

    expect(response.body.message).toBe(
      "Planning not found"
    );
  });

  test("usuário B não deve conseguir excluir planejamento do usuário A", async () => {
    const response = await request(app)
      .delete(`/plannings/${planningId}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(response.status).toBe(404);

    expect(response.body.message).toBe(
      "Planning not found"
    );
  });

  test("deve confirmar que tentativa do usuário B não alterou o planejamento", async () => {
    const response = await request(app)
      .get(`/plannings/${planningId}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(response.status).toBe(200);

    expect(response.body.topic).toBe(
      "Biomas e ecossistemas brasileiros"
    );

    expect(response.body.duration).toBe(60);
  });

  test("deve permitir que o proprietário exclua o planejamento", async () => {
    const response = await request(app)
      .delete(`/plannings/${planningId}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(response.status).toBe(204);
  });

  test("planejamento excluído não deve mais existir", async () => {
    const response = await request(app)
      .get(`/plannings/${planningId}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(response.status).toBe(404);

    expect(response.body.message).toBe(
      "Planning not found"
    );
  });

  afterAll(async () => {
    // A relação possui onDelete: Cascade,
    // então eventuais planejamentos dos usuários de teste
    // também são removidos.
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [emailA, emailB],
        },
      },
    });

    await prisma.$disconnect();
  });
});