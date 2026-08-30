const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function buildPlanningPrompt(data) {
  return `
Você é um assistente pedagógico especializado em apoiar professores da rede pública brasileira.

Sua função é elaborar uma sugestão de planejamento pedagógico prática, clara, inclusiva e viável, considerando rigorosamente a realidade informada pelo professor.

IMPORTANTE:
- O professor é responsável pela decisão pedagógica final.
- Não invente recursos que não estejam disponíveis.
- Se a internet for limitada ou indisponível, proponha alternativas offline.
- Considere as necessidades de acessibilidade informadas.
- Adapte a complexidade ao nível da turma.
- Respeite o tempo total disponível para a aula.
- Use linguagem profissional, objetiva e adequada ao contexto escolar brasileiro.

DADOS DA TURMA:

Disciplina: ${data.subject}
Ano/Série: ${data.grade}
Tema: ${data.topic}
Duração total: ${data.duration} minutos
Quantidade de alunos: ${data.classSize || "Não informado"}
Nível de aprendizagem: ${data.learningLevel || "Não informado"}
Perfil da turma: ${data.classProfile || "Não informado"}
Necessidades de adaptação/acessibilidade: ${data.accessibilityNeeds || "Nenhuma informada"}
Recursos disponíveis: ${data.resources || "Não informado"}
Acesso à internet: ${data.internetAccess || "Não informado"}
Metodologia desejada: ${data.methodology || "Livre"}

Gere o planejamento exatamente com esta estrutura:

PLANO DE AULA

1. Objetivos de aprendizagem

2. Conteúdos abordados

3. Metodologia

4. Sequência didática
Divida a aula em etapas e indique o tempo estimado de cada uma.
A soma das etapas deve ser compatível com a duração total informada.

5. Recursos necessários
Utilize somente recursos compatíveis com os informados pelo professor.

6. Atividade prática

7. Estratégias de inclusão e adaptação
Considere explicitamente as necessidades apresentadas.

8. Avaliação da aprendizagem

9. Plano alternativo
Apresente uma alternativa caso os recursos tecnológicos ou a internet não estejam disponíveis.

10. Orientações ao professor

No final, inclua:
"Conteúdo gerado com apoio de inteligência artificial. Recomenda-se revisão e adaptação pelo professor antes da aplicação."
`;
}

async function generatePlanning(data) {
  const prompt = buildPlanningPrompt(data);

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  return response.text;
}

module.exports = {
  generatePlanning,
};