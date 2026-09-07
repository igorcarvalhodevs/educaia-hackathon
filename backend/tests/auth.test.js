require("dotenv").config({ quiet: true });

const request = require("supertest");

const app = require("../src/app");
const prisma = require("../src/config/prisma");

describe("Autenticação", () => {
  const testId = Date.now();

  const testUser = {
    name: "Professor Teste Auth",
    email: `professor.auth.${testId}@educaia.test`,
    password: "123456",
  };

  let token;

  test("deve cadastrar um novo usuário", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(testUser);

    expect(response.status).toBe(201);

    expect(response.body.id).toBeDefined();

    expect(response.body.name).toBe(
      testUser.name
    );

    expect(response.body.email).toBe(
      testUser.email
    );

    expect(response.body.password).toBeUndefined();
    expect(response.body.passwordHash).toBeUndefined();
  });

  test("deve impedir cadastro com e-mail já registrado", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(testUser);

    expect(response.status).toBe(409);

    expect(response.body.message).toBe(
      "Email already registered"
    );
  });

  test("deve realizar login com credenciais válidas", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.status).toBe(200);

    expect(response.body.token).toBeDefined();

    expect(response.body.user).toBeDefined();

    expect(response.body.user.email).toBe(
      testUser.email
    );

    expect(response.body.user.name).toBe(
      testUser.name
    );

    token = response.body.token;
  });

  test("deve rejeitar login com senha incorreta", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: testUser.email,
        password: "senha-incorreta",
      });

    expect(response.status).toBe(401);

    expect(response.body.message).toBe(
      "Invalid credentials"
    );
  });

  test("deve rejeitar login com usuário inexistente", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: `inexistente.${testId}@educaia.test`,
        password: "123456",
      });

    expect(response.status).toBe(401);

    expect(response.body.message).toBe(
      "Invalid credentials"
    );
  });

  test("deve retornar o usuário autenticado em /auth/me", async () => {
    const response = await request(app)
      .get("/auth/me")
      .set(
        "Authorization",
        `Bearer ${token}`
      );

    expect(response.status).toBe(200);

    expect(response.body.id).toBeDefined();

    expect(response.body.email).toBe(
      testUser.email
    );

    expect(response.body.name).toBe(
      testUser.name
    );

    expect(response.body.password).toBeUndefined();
    expect(response.body.passwordHash).toBeUndefined();
  });

  test("deve rejeitar rota protegida sem token", async () => {
    const response = await request(app)
      .get("/auth/me");

    expect(response.status).toBe(401);

    expect(response.body.message).toBe(
      "Authentication token required"
    );
  });

  test("deve rejeitar token inválido", async () => {
    const response = await request(app)
      .get("/auth/me")
      .set(
        "Authorization",
        "Bearer token-invalido"
      );

    expect(response.status).toBe(401);

    expect(response.body.message).toBe(
      "Invalid or expired token"
    );
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });

    await prisma.$disconnect();
  });
});