require("dotenv").config();
const request = require("supertest");
const jwt = require("jsonwebtoken");

jest.mock("../src/modules/ai/providers/gemini.provider", () => ({
  generateContent: jest.fn(),
}));

const geminiProvider = require(
  "../src/modules/ai/providers/gemini.provider"
);

const app = require("../src/app");

describe("POST /plannings/generate", () => {
  let token;

  beforeAll(() => {
    token = jwt.sign(
      {
        sub: "test-user-id",
        name: "Professor Teste",
        email: "professor@educaia.test",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve gerar planejamento usando o provider de IA", async () => {
    geminiProvider.generateContent.mockResolvedValue(
      "PLANO DE AULA GERADO PELO MOCK"
    );

    const response = await request(app)
      .post("/plannings/generate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        subject: "Ciências",
        grade: "7º ano",
        topic: "Ecossistemas brasileiros",
        duration: 50,
        classSize: 35,
        learningLevel: "Intermediário",
        classProfile: "Turma heterogênea",
        accessibilityNeeds:
          "Um estudante apresenta dificuldade de leitura",
        resources: "Quadro e projetor",
        internetAccess: "Limitada",
        methodology: "Mista",
      });

    expect(response.status).toBe(200);

    expect(response.body.generatedContent).toBe(
      "PLANO DE AULA GERADO PELO MOCK"
    );

    expect(response.body.disclaimer).toBeDefined();

    expect(geminiProvider.generateContent).toHaveBeenCalledTimes(1);

    const promptEnviado =
      geminiProvider.generateContent.mock.calls[0][0];

    expect(promptEnviado).toContain("Ciências");
    expect(promptEnviado).toContain("7º ano");
    expect(promptEnviado).toContain(
      "Ecossistemas brasileiros"
    );
    expect(promptEnviado).toContain("50 minutos");
    expect(promptEnviado).toContain(
      "Turma heterogênea"
    );
    expect(promptEnviado).toContain(
      "Quadro e projetor"
    );
    expect(promptEnviado).toContain("Limitada");
  });

  test("deve rejeitar requisição sem JWT", async () => {
    const response = await request(app)
      .post("/plannings/generate")
      .send({
        subject: "Ciências",
        grade: "7º ano",
        topic: "Ecossistemas",
        duration: 50,
      });

    expect(response.status).toBe(401);

    expect(
      geminiProvider.generateContent
    ).not.toHaveBeenCalled();
  });

  test("deve rejeitar dados pedagógicos inválidos", async () => {
    const response = await request(app)
      .post("/plannings/generate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        subject: "",
        grade: "",
        topic: "",
        duration: -10,
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Invalid data"
    );

    expect(
      geminiProvider.generateContent
    ).not.toHaveBeenCalled();
  });

  test("deve tratar falha do provider de IA", async () => {
    const error = new Error("AI provider unavailable");
    error.code = "AI_PROVIDER_ERROR";
    error.status = 503;

    geminiProvider.generateContent.mockRejectedValue(error);

    const response = await request(app)
      .post("/plannings/generate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        subject: "Ciências",
        grade: "7º ano",
        topic: "Ecossistemas",
        duration: 50,
      });

    expect(response.status).toBe(502);

    expect(response.body.message).toBe(
      "Unable to generate planning at this time"
    );
  });
});