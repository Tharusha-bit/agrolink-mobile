const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");

const seedPath = path.join(__dirname, "..", "data", "local-db.json");

const profileIdToLegacyInvestorId = {
  "investor-101": "demo-investor-1",
  "investor-102": "demo-investor-2",
  "investor-103": "demo-investor-3",
};

const investorDirectory = {
  "demo-investor-1": {
    profileId: "investor-101",
    company: "Green Horizon Capital",
    preferredReturnRate: "14% avg",
  },
  "demo-investor-2": {
    profileId: "investor-102",
    company: "Harvest Bridge Fund",
    preferredReturnRate: "17% avg",
  },
  "demo-investor-3": {
    profileId: "investor-103",
    company: "FieldSpring Ventures",
    preferredReturnRate: "13% avg",
  },
};

const investorConnectionSchema = new mongoose.Schema(
  {
    farmerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    investorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    profileId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    investedAmount: { type: Number, required: true, min: 0 },
    preferredReturnRate: { type: String, required: true, trim: true },
    activeProjects: { type: Number, required: true, min: 0 },
    fitNote: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

investorConnectionSchema.index(
  { farmerUserId: 1, investorUserId: 1 },
  { unique: true },
);

const requestInvestmentSchema = new mongoose.Schema(
  {
    investorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    investorName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    investedAt: { type: Date, required: true, default: Date.now },
  },
  { _id: true },
);

const investmentRequestSchema = new mongoose.Schema(
  {
    externalId: { type: String, trim: true, unique: true, sparse: true },
    farmerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    farmerName: { type: String, required: true, trim: true },
    crop: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    amountNeeded: { type: Number, required: true, min: 0 },
    raisedAmount: { type: Number, required: true, min: 0, default: 0 },
    historicalReturnRate: { type: String, required: true, trim: true },
    riskLevel: { type: String, enum: ["Low", "Medium", "High"], required: true },
    summary: { type: String, required: true, trim: true },
    createdAt: { type: Date, required: true, default: Date.now },
    investments: { type: [requestInvestmentSchema], default: [] },
  },
  { timestamps: false },
);

const InvestorConnection =
  mongoose.models.InvestorConnection ||
  mongoose.model("InvestorConnection", investorConnectionSchema);

const InvestmentRequest =
  mongoose.models.InvestmentRequest ||
  mongoose.model("InvestmentRequest", investmentRequestSchema);

async function readSeedData() {
  const raw = await fs.readFile(seedPath, "utf8");
  return JSON.parse(raw);
}

function formatRequest(request) {
  return {
    id: request._id.toString(),
    farmerUserId: request.farmerUserId.toString(),
    farmerName: request.farmerName,
    name: request.farmerName,
    crop: request.crop,
    location: request.location,
    amountNeeded: request.amountNeeded,
    raisedAmount: request.raisedAmount,
    historicalReturnRate: request.historicalReturnRate,
    riskLevel: request.riskLevel,
    summary: request.summary,
    createdAt: request.createdAt,
    investments: (request.investments || []).map((investment) => ({
      id: investment._id.toString(),
      investorUserId: investment.investorUserId.toString(),
      investorName: investment.investorName,
      amount: investment.amount,
      investedAt: investment.investedAt,
    })),
  };
}

function buildDynamicInsight(request) {
  const fundedRatio =
    request.amountNeeded > 0 ? request.raisedAmount / request.amountNeeded : 0;
  const confidence =
    request.riskLevel === "Low"
      ? "High confidence"
      : request.riskLevel === "Medium"
        ? "Medium confidence"
        : "Low confidence";
  const recommendation =
    request.riskLevel === "Low"
      ? "This request looks investable if you want a steadier agricultural position."
      : request.riskLevel === "Medium"
        ? "This request can work well if you are comfortable with moderate execution risk."
        : "Only consider this request if your portfolio can absorb higher volatility.";

  return {
    entityId: request._id.toString(),
    headline: `${request.crop} request from ${request.farmerName}`,
    recommendation,
    previousRate: `Comparable ${request.crop.toLowerCase()} projects have returned around ${request.historicalReturnRate}.`,
    outlook: `${Math.round(fundedRatio * 100)}% of the target is already funded, which ${
      fundedRatio >= 0.5 ? "improves" : "still leaves"
    } execution confidence.`,
    confidence,
    summary: `${request.farmerName} is requesting ${request.amountNeeded.toLocaleString()} LKR for ${request.crop.toLowerCase()} operations in ${request.location}. Risk is currently marked as ${request.riskLevel.toLowerCase()}.`,
  };
}

async function ensureSeedData(User) {
  const seedData = await readSeedData();
  const usersByLegacyId = new Map();

  for (const seedUser of seedData.users) {
    const user = await User.findOneAndUpdate(
      { email: seedUser.email },
      {
        $set: {
          name: seedUser.name,
          email: seedUser.email,
          role: seedUser.role,
          nic: seedUser.nic,
          farmerId: seedUser.farmerId,
          passwordHash: seedUser.passwordHash,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    usersByLegacyId.set(seedUser.id, user);
  }

  for (const seedRequest of seedData.investmentRequests || []) {
    const farmerUser = usersByLegacyId.get(seedRequest.farmerUserId);
    if (!farmerUser) {
      continue;
    }

    const investments = (seedRequest.investments || [])
      .map((investment) => {
        const investorUser = usersByLegacyId.get(investment.investorUserId);
        if (!investorUser) {
          return null;
        }

        return {
          investorUserId: investorUser._id,
          investorName: investment.investorName,
          amount: investment.amount,
          investedAt: new Date(investment.investedAt),
        };
      })
      .filter(Boolean);

    await InvestmentRequest.findOneAndUpdate(
      { externalId: seedRequest.id },
      {
        $set: {
          farmerUserId: farmerUser._id,
          farmerName: seedRequest.farmerName,
          crop: seedRequest.crop,
          location: seedRequest.location,
          amountNeeded: seedRequest.amountNeeded,
          raisedAmount: seedRequest.raisedAmount,
          historicalReturnRate: seedRequest.historicalReturnRate,
          riskLevel: seedRequest.riskLevel,
          summary: seedRequest.summary,
          createdAt: new Date(seedRequest.createdAt),
          investments,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  for (const [legacyFarmerId, connections] of Object.entries(
    seedData.farmerInvestorConnections || {},
  )) {
    const farmerUser = usersByLegacyId.get(legacyFarmerId);
    if (!farmerUser) {
      continue;
    }

    for (const connection of connections) {
      const legacyInvestorId = profileIdToLegacyInvestorId[connection.id];
      const investorUser = legacyInvestorId
        ? usersByLegacyId.get(legacyInvestorId)
        : null;

      if (!investorUser) {
        continue;
      }

      await InvestorConnection.findOneAndUpdate(
        {
          farmerUserId: farmerUser._id,
          investorUserId: investorUser._id,
        },
        {
          $set: {
            profileId: connection.id,
            name: connection.name,
            company: connection.company,
            investedAmount: connection.investedAmount,
            preferredReturnRate: connection.preferredReturnRate,
            activeProjects: connection.activeProjects,
            fitNote: connection.fitNote,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );
    }
  }
}

async function getFarmerInvestors(userId) {
  const connections = await InvestorConnection.find({ farmerUserId: userId })
    .sort({ investedAmount: -1, name: 1 })
    .lean();

  return connections.map((connection) => ({
    id: connection.profileId,
    name: connection.name,
    company: connection.company,
    investedAmount: connection.investedAmount,
    preferredReturnRate: connection.preferredReturnRate,
    activeProjects: connection.activeProjects,
    fitNote: connection.fitNote,
  }));
}

async function getInvestorFarmers() {
  const requests = await InvestmentRequest.find({})
    .sort({ createdAt: -1 })
    .exec();

  return requests.map(formatRequest);
}

async function getFarmerInvestmentRequests(userId) {
  const requests = await InvestmentRequest.find({ farmerUserId: userId })
    .sort({ createdAt: -1 })
    .exec();

  return requests.map(formatRequest);
}

async function createInvestmentRequest(userId, farmerName, payload) {
  const request = await InvestmentRequest.create({
    farmerUserId: userId,
    farmerName,
    crop: payload.crop,
    location: payload.location,
    amountNeeded: payload.amountNeeded,
    raisedAmount: 0,
    historicalReturnRate: payload.historicalReturnRate || "15% avg",
    riskLevel: payload.riskLevel,
    summary: payload.summary,
    createdAt: new Date(),
    investments: [],
  });

  return formatRequest(request);
}

async function deleteInvestmentRequest(userId, requestId) {
  const request = await InvestmentRequest.findOne({
    _id: requestId,
    farmerUserId: userId,
  });

  if (!request) {
    throw new Error("Investment request not found.");
  }

  for (const investment of request.investments || []) {
    const connection = await InvestorConnection.findOne({
      farmerUserId: request.farmerUserId,
      investorUserId: investment.investorUserId,
    });

    if (!connection) {
      continue;
    }

    connection.investedAmount = Math.max(
      connection.investedAmount - investment.amount,
      0,
    );

    if (connection.investedAmount === 0) {
      await connection.deleteOne();
      continue;
    }

    await connection.save();
  }

  const formattedRequest = formatRequest(request);
  await request.deleteOne();
  return formattedRequest;
}

async function investInRequest(requestId, investorUserId, investorName, amount) {
  const request = await InvestmentRequest.findById(requestId);

  if (!request) {
    throw new Error("Investment request not found.");
  }

  const remaining = Math.max(request.amountNeeded - request.raisedAmount, 0);
  if (remaining <= 0) {
    throw new Error("This request is already fully funded.");
  }

  const appliedAmount = Math.min(amount, remaining);
  request.raisedAmount += appliedAmount;
  request.investments.push({
    investorUserId,
    investorName,
    amount: appliedAmount,
    investedAt: new Date(),
  });
  await request.save();

  const investorMeta =
    investorDirectory[investorUserId] ||
    investorDirectory[investorUserId.toString()] || {
      profileId: investorUserId.toString(),
      company: "AgroLink Capital Network",
      preferredReturnRate: "15% avg",
    };

  const connection = await InvestorConnection.findOne({
    farmerUserId: request.farmerUserId,
    investorUserId,
  });

  if (connection) {
    connection.investedAmount += appliedAmount;
    connection.fitNote = `Recently invested in ${request.crop.toLowerCase()} operations for ${request.farmerName}.`;
    await connection.save();
  } else {
    await InvestorConnection.create({
      farmerUserId: request.farmerUserId,
      investorUserId,
      profileId: investorMeta.profileId,
      name: investorName,
      company: investorMeta.company,
      investedAmount: appliedAmount,
      preferredReturnRate: investorMeta.preferredReturnRate,
      activeProjects: 1,
      fitNote: `Recently invested in ${request.crop.toLowerCase()} operations for ${request.farmerName}.`,
    });
  }

  return formatRequest(request);
}

async function getInsight(entityId) {
  const request = await InvestmentRequest.findById(entityId);
  if (!request) {
    return null;
  }

  return buildDynamicInsight(request);
}

module.exports = {
  ensureSeedData,
  getFarmerInvestors,
  getInvestorFarmers,
  getFarmerInvestmentRequests,
  createInvestmentRequest,
  deleteInvestmentRequest,
  investInRequest,
  getInsight,
};