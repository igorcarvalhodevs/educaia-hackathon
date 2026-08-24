const authService = require("./auth.service");
const {
  registerSchema,
  loginSchema,
} = require("./auth.validators");

async function register(req, res) {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const result = await authService.register(
      validation.data
    );

    if (result.error === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error registering user:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function login(req, res) {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const result = await authService.login(
      validation.data.email,
      validation.data.password
    );

    if (!result) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error during login:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function me(req, res) {
  try {
    const user = await authService.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving current user:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  register,
  login,
  me,
};