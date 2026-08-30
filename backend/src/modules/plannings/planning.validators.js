const { z } = require("zod");

const planningSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(2, "Subject is required"),

  grade: z
    .string()
    .trim()
    .min(1, "Grade is required"),

  topic: z
    .string()
    .trim()
    .min(2, "Topic is required"),

  duration: z
    .number()
    .int()
    .positive("Duration must be greater than zero"),

  classSize: z
    .number()
    .int()
    .positive()
    .optional(),

  learningLevel: z
    .string()
    .trim()
    .optional(),

  classProfile: z
    .string()
    .trim()
    .optional(),

  accessibilityNeeds: z
    .string()
    .trim()
    .optional(),

  resources: z
    .string()
    .trim()
    .optional(),

  internetAccess: z
    .string()
    .trim()
    .optional(),

  methodology: z
    .string()
    .trim()
    .optional(),

  generatedContent: z
    .string()
    .trim()
    .min(1, "Generated content is required"),
});

const generatePlanningSchema = z.object({
  subject: z.string().trim().min(2),
  grade: z.string().trim().min(1),
  topic: z.string().trim().min(2),

  duration: z
    .number()
    .int()
    .positive(),

  classSize: z
    .number()
    .int()
    .positive()
    .optional(),

  learningLevel: z
    .string()
    .trim()
    .optional(),

  classProfile: z
    .string()
    .trim()
    .optional(),

  accessibilityNeeds: z
    .string()
    .trim()
    .optional(),

  resources: z
    .string()
    .trim()
    .optional(),

  internetAccess: z
    .string()
    .trim()
    .optional(),

  methodology: z
    .string()
    .trim()
    .optional(),
});

const updatePlanningSchema = planningSchema.partial();

module.exports = {
  planningSchema,
  updatePlanningSchema,
  generatePlanningSchema,
};