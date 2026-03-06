const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { z } = require("zod");
const localDb = require("./store/local-db");
const mongoDb = require("./store/mongo-db");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const jwtSecret = process.env.JWT_SECRET || "dev-only-secret-change-me";
const mongoUri = process.env.MONGODB_URI;
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  "http://localhost:8081,http://localhost:19006,http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (
  process.env.NODE_ENV === "production" &&
  jwtSecret === "dev-only-secret-change-me"
) {
  throw new Error("JWT_SECRET must be set in production.");
}

const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(128),
  role: z.enum(["farmer", "investor"]),
});

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(128),
  role: z.enum(["farmer", "investor"]),
  nic: z.string().trim().min(6).max(20),
  farmerId: z.string().trim().max(40).optional(),
});

const insightSchema = z.object({
  entityId: z.string().trim().min(1).max(80),
});

const investmentRequestSchema = z.object({
  crop: z.string().trim().min(2).max(40),
  location: z.string().trim().min(2).max(60),
  amountNeeded: z.coerce.number().int().min(1000).max(10000000),
  riskLevel: z.enum(["Low", "Medium", "High"]),
  summary: z.string().trim().min(10).max(300),
  historicalReturnRate: z.string().trim().min(3).max(20).optional(),
});

const investSchema = z.object({
  amount: z.coerce.number().int().min(1000).max(1000000).default(5000),
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["farmer", "investor"], required: true },
    nic: { type: String, required: true, trim: true, maxlength: 20 },
    farmerId: { type: String, trim: true, maxlength: 40 },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

let mongoEnabled = false;

function signSessionToken(user) {
  return jwt.sign(
    {
      sub: user.id || user._id?.toString(),
      role: user.role,
      email: user.email,
    },
    jwtSecret,
    { expiresIn: "7d" },
  );
}

async function connectDatabase() {
  if (!mongoUri) {
    await localDb.loadDb();
    console.warn(
      "MONGODB_URI not set. Backend is running in local JSON database mode.",
    );
    return;
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
  await mongoDb.ensureSeedData(User);
  mongoEnabled = true;
}

async function findUserByEmail(email) {
  if (mongoEnabled) {
    return User.findOne({ email });
  }

  return localDb.findUserByEmail(email);
}

async function createUser(payload) {
  if (mongoEnabled) {
    const created = await User.create({
      name: payload.name,
      email: payload.email,
      passwordHash: await bcrypt.hash(payload.password, 10),
      role: payload.role,
      nic: payload.nic,
      farmerId: payload.farmerId,
    });

    return created;
  }

  return localDb.createUser(payload);
}

async function getFarmerInvestors(userId) {
  if (mongoEnabled) {
    return mongoDb.getFarmerInvestors(userId);
  }

  return localDb.getFarmerInvestors(userId);
}

async function getInvestorFarmers() {
  if (mongoEnabled) {
    return mongoDb.getInvestorFarmers();
  }

  return localDb.getInvestorFarmers();
}

async function getFarmerInvestmentRequests(userId) {
  if (mongoEnabled) {
    return mongoDb.getFarmerInvestmentRequests(userId);
  }

  return localDb.getFarmerInvestmentRequests(userId);
}

async function createFarmerInvestmentRequest(userId, farmerName, payload) {
  if (mongoEnabled) {
    return mongoDb.createInvestmentRequest(userId, farmerName, payload);
  }

  return localDb.createInvestmentRequest(userId, farmerName, payload);
}

async function deleteFarmerInvestmentRequest(userId, requestId) {
  if (mongoEnabled) {
    return mongoDb.deleteInvestmentRequest(userId, requestId);
  }

  return localDb.deleteInvestmentRequest(userId, requestId);
}

async function investInFarmerRequest(
  requestId,
  investorUserId,
  investorName,
  amount,
) {
  if (mongoEnabled) {
    return mongoDb.investInRequest(
      requestId,
      investorUserId,
      investorName,
      amount,
    );
  }

  return localDb.investInRequest(
    requestId,
    investorUserId,
    investorName,
    amount,
  );
}

async function getInvestmentInsight(entityId) {
  if (mongoEnabled) {
    return mongoDb.getInsight(entityId);
  }

  return localDb.getInsight(entityId);
}

function sanitizeUser(user) {
  return {
    id: user.id || user._id?.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function requireAuth(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const token = authorization.slice(7);

  try {
    req.auth = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.auth?.role !== role) {
      return res
        .status(403)
        .json({ message: "You do not have access to this resource." });
    }

    return next();
  };
}

app.disable("x-powered-by");
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS."));
    },
    credentials: false,
  }),
);
app.use(express.json({ limit: "10kb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts. Please try again later.",
  },
});

app.get("/api/health", async (_req, res) => {
  res.json({
    ok: true,
    database: mongoEnabled ? "mongodb" : "local-json",
  });
});

app.post("/api/auth/login", authLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid login payload." });
  }

  const { email, password, role } = parsed.data;
  const user = await findUserByEmail(email);

  if (!user || user.role !== role) {
    return res
      .status(401)
      .json({ message: "Invalid email, password, or role." });
  }

  const passwordHash = user.passwordHash || user.password;
  const validPassword = await bcrypt.compare(password, passwordHash);
  if (!validPassword) {
    return res
      .status(401)
      .json({ message: "Invalid email, password, or role." });
  }

  return res.json({
    token: signSessionToken(user),
    user: sanitizeUser(user),
  });
});

app.post("/api/auth/register", authLimiter, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid registration payload." });
  }

  const payload = parsed.data;
  if (payload.role === "farmer" && !payload.farmerId) {
    return res
      .status(400)
      .json({ message: "Farmer ID is required for farmer accounts." });
  }

  const existing = await findUserByEmail(payload.email);
  if (existing) {
    return res
      .status(409)
      .json({ message: "An account with this email already exists." });
  }

  const user = await createUser(payload);
  return res.status(201).json({
    token: signSessionToken(user),
    user: sanitizeUser(user),
  });
});

app.get("/api/dashboard/summary", requireAuth, (req, res) => {
  if (req.auth.role === "farmer") {
    return res.json({
      role: "farmer",
      metrics: {
        activeFields: 8,
        pendingFunding: 120000,
        verifiedDocuments: 4,
      },
    });
  }

  return res.json({
    role: "investor",
    metrics: {
      liveDeals: 12,
      portfolioValue: 1200000,
      expectedReturn: 18,
    },
  });
});

app.get(
  "/api/farmer/investors",
  requireAuth,
  requireRole("farmer"),
  async (req, res) => {
    const investors = await getFarmerInvestors(req.auth.sub);

    res.json({
      role: "farmer",
      investors,
    });
  },
);

app.get(
  "/api/investor/farmers",
  requireAuth,
  requireRole("investor"),
  async (_req, res) => {
    const farmers = await getInvestorFarmers();

    res.json({
      role: "investor",
      farmers,
    });
  },
);

app.get(
  "/api/farmer/investment-requests",
  requireAuth,
  requireRole("farmer"),
  async (req, res) => {
    const requests = await getFarmerInvestmentRequests(req.auth.sub);

    res.json({
      role: "farmer",
      requests,
    });
  },
);

app.post(
  "/api/farmer/investment-requests",
  requireAuth,
  requireRole("farmer"),
  async (req, res) => {
    const parsed = investmentRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      const validationErrors = parsed.error.issues.map((issue) => {
        const field = issue.path.length > 0 ? String(issue.path[0]) : "request";
        return `${field}: ${issue.message}`;
      });

      return res.status(400).json({
        message: validationErrors[0] || "Invalid investment request payload.",
        validationErrors,
      });
    }

    const user = await findUserByEmail(req.auth.email);
    if (!user) {
      return res.status(404).json({ message: "Farmer account not found." });
    }

    const request = await createFarmerInvestmentRequest(
      req.auth.sub,
      user.name,
      parsed.data,
    );

    return res.status(201).json(request);
  },
);

app.delete(
  "/api/farmer/investment-requests/:requestId",
  requireAuth,
  requireRole("farmer"),
  async (req, res) => {
    try {
      const deletedRequest = await deleteFarmerInvestmentRequest(
        req.auth.sub,
        req.params.requestId,
      );

      return res.json({
        message: "Investment request deleted.",
        request: deletedRequest,
      });
    } catch (error) {
      return res.status(404).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete investment request.",
      });
    }
  },
);

app.get(
  "/api/investor/investment-requests",
  requireAuth,
  requireRole("investor"),
  async (_req, res) => {
    const requests = await getInvestorFarmers();

    res.json({
      role: "investor",
      requests,
    });
  },
);

app.post(
  "/api/investor/investment-requests/:requestId/invest",
  requireAuth,
  requireRole("investor"),
  async (req, res) => {
    const parsed = investSchema.safeParse(req.body || {});
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid investment amount." });
    }

    const user = await findUserByEmail(req.auth.email);
    if (!user) {
      return res.status(404).json({ message: "Investor account not found." });
    }

    try {
      const updated = await investInFarmerRequest(
        req.params.requestId,
        req.auth.sub,
        user.name,
        parsed.data.amount,
      );
      return res.json(updated);
    } catch (error) {
      return res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to complete investment.",
      });
    }
  },
);

app.post(
  "/api/ai/investment-insight",
  requireAuth,
  requireRole("investor"),
  async (req, res) => {
    const parsed = insightSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid AI insight request." });
    }

    const insight = await getInvestmentInsight(parsed.data.entityId);
    if (!insight) {
      return res
        .status(404)
        .json({ message: "No insight available for this entity." });
    }

    return res.json(insight);
  },
);

app.get(
  "/api/farmer/overview",
  requireAuth,
  requireRole("farmer"),
  (_req, res) => {
    res.json({ ok: true, message: "Farmer overview access granted." });
  },
);

app.get(
  "/api/investor/overview",
  requireAuth,
  requireRole("investor"),
  (_req, res) => {
    res.json({ ok: true, message: "Investor overview access granted." });
  },
);

app.use((err, _req, res, _next) => {
  if (err instanceof mongoose.Error) {
    return res.status(500).json({ message: "Database error." });
  }

  if (err?.message === "Origin not allowed by CORS.") {
    return res.status(403).json({ message: "Origin not allowed." });
  }

  return res.status(500).json({ message: "Internal server error." });
});

async function bootstrap() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`AgroLink backend listening on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start AgroLink backend", error);
  process.exit(1);
});
