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

  return response.data;
};

export const getAllClaims = async (status, pageNumber) => {
  const response = await api.get("/claims/get-paginated-claims", {
    params: {
      status: status,
      pageNumber: pageNumber,
    },
  });
  return response.data;
};

export const getClaimsMetrics = async () => {
  const response = await api.get("/claims/get-claims-metrics");
  return response.data;
};

export const getMyClaims = async () => {
  const response = await api.get("/claims/my-claims");
  return response.data;
};

export const updateClaimStatus = async (claimId, status) => {
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
  deductible,
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

export const updatePassword = async (oldPassword, newPassword) => {
  const response = await api.patch("/auth/change-password", {
    oldPassword,
    newPassword,
  });

  return response.data;
};

export const simulatePeril = async (count) => {
  const response = await api.post(
    "/claims/simulate-peril",
    {},
    {
      params: {
        claimCount: count,
      },
    },
  );
  return response;
};
