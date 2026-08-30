const planningService = require("./planning.service");
const aiService = require("../ai/ai.service");

const {
  planningSchema,
  updatePlanningSchema,
  generatePlanningSchema,
} = require("./planning.validators");

async function create(req, res) {
  try {
    const validation = planningSchema.safeParse(
      req.body
    );

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors:
          validation.error.flatten().fieldErrors,
      });
    }

    const planning =
      await planningService.createPlanning(
        req.user.id,
        validation.data
      );

    return res.status(201).json(planning);
  } catch (error) {
    console.error(
      "Error creating planning:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function list(req, res) {
  try {
    const plannings =
      await planningService.listPlannings(
        req.user.id
      );

    return res.status(200).json(plannings);
  } catch (error) {
    console.error(
      "Error listing plannings:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getById(req, res) {
  try {
    const planning =
      await planningService.getPlanningById(
        req.user.id,
        req.params.id
      );

    if (!planning) {
      return res.status(404).json({
        message: "Planning not found",
      });
    }

    return res.status(200).json(planning);
  } catch (error) {
    console.error(
      "Error retrieving planning:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function update(req, res) {
  try {
    const validation =
      updatePlanningSchema.safeParse(
        req.body
      );

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors:
          validation.error.flatten().fieldErrors,
      });
    }

    const planning =
      await planningService.updatePlanning(
        req.user.id,
        req.params.id,
        validation.data
      );

    if (!planning) {
      return res.status(404).json({
        message: "Planning not found",
      });
    }

    return res.status(200).json(planning);
  } catch (error) {
    console.error(
      "Error updating planning:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function remove(req, res) {
  try {
    const deleted =
      await planningService.deletePlanning(
        req.user.id,
        req.params.id
      );

    if (!deleted) {
      return res.status(404).json({
        message: "Planning not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(
      "Error deleting planning:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function generate(req, res) {
  try {
    const validation = generatePlanningSchema.safeParse(
      req.body
    );

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors:
          validation.error.flatten().fieldErrors,
      });
    }

    const generatedContent =
      await aiService.generatePlanning(
        validation.data
      );

    return res.status(200).json({
      generatedContent,
      disclaimer:
        "Conteúdo gerado com apoio de inteligência artificial. Revise antes da aplicação.",
    });
  } catch (error) {
    console.error(
      "Error generating planning with AI:",
      error
    );

    return res.status(502).json({
      message:
        "Unable to generate planning at this time",
    });
  }
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  generate,
};