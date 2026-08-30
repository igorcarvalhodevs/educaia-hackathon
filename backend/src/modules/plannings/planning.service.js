const prisma = require("../../config/prisma");

async function createPlanning(userId, data) {
  return prisma.planning.create({
    data: {
      userId,
      ...data,
    },
  });
}

async function listPlannings(userId) {
  return prisma.planning.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getPlanningById(userId, planningId) {
  return prisma.planning.findFirst({
    where: {
      id: planningId,
      userId,
    },
  });
}

async function updatePlanning(userId, planningId, data) {
  const planning = await getPlanningById(
    userId,
    planningId
  );

  if (!planning) {
    return null;
  }

  return prisma.planning.update({
    where: {
      id: planningId,
    },
    data,
  });
}

async function deletePlanning(userId, planningId) {
  const planning = await getPlanningById(
    userId,
    planningId
  );

  if (!planning) {
    return null;
  }

  await prisma.planning.delete({
    where: {
      id: planningId,
    },
  });

  return true;
}

module.exports = {
  createPlanning,
  listPlannings,
  getPlanningById,
  updatePlanning,
  deletePlanning,
};