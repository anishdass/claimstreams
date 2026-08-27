import api from "../api/axios";

export const loginCall = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const raiseNewClaim = async (policyNumber, perilType, claimedAmount) => {
  const response = await api.post("/claims/create", {
    policyNumber,
    perilType,
    claimedAmount,
  });

  return response;
};

export const getAllClaims = async () => {
  const response = await api.get("/claims/get-all-claims");
  return response;
};

export const updateStatusClaim = async (claimId, status) => {
  const response = await api.put("/claims/update-status", {
    claimId,
    status,
  });
  return response;
};

export const fetchUpdatedPerils = async () => {
  const response = await api.get("/policies/get-perils");
  return response;
};

export const createPolicy = async (
  policyHolderEmail,
  policyHolderName,
  coveredPeril,
  maxCoverageLimit,
  deductible
) => {
  const response = await api.post("/policies/create", {
    policyHolderEmail,
    policyHolderName,
    coveredPeril,
    maxCoverageLimit,
    deductible,
  });
  return response;
};

export const registerUser = async (email, password, fullName, role) => {
  const response = await api.post("/auth/register", {
    email,
    password,
    fullName,
    role,
  });
  return response;
};

export const simulatePeril = async (count) => {
  const response = await api.post(
    "/claims/simulate-peril",
    {},
    {
      params: {
        claimCount: count,
      },
    }
  );
  return response;
};
