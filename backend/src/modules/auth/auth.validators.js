const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must have at least 3 characters")
    .max(100, "Name must have at most 100 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must have at least 6 characters")
    .max(100, "Password must have at most 100 characters"),
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email"),

  password: z
    .string()
    .min(1, "Password is required"),
});

module.exports = {
  registerSchema,
  loginSchema,
};