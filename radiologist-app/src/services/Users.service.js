import axiosInstance from "../utils/axios-instance";
import { errorHandler } from "../utils/error-handler";
import { usersUrl } from "../utils/urls"; // e.g., "/api/users"

// Generic: Get users with optional filters
const getUsers = async ({ role, status } = {}) => {
  try {
    const params = {};
    if (role) params.role = role;
    if (status) params.status = status;

    const res = await axiosInstance.get(usersUrl, { params });

    return res.data; // Raw user list
  } catch (error) {
    return errorHandler(error);
  }
};

// Get single user by ID
const getSingleUser = async (userId) => {
  try {
    const res = await axiosInstance.get(`${usersUrl}/${userId}`);
    return res.data;
  } catch (error) {
    return errorHandler(error);
  }
};

const updateUser = async (userId, payload) => {
  try {
    const res = await axiosInstance.patch(`${usersUrl}/${userId}`, payload);
    return res.data;
  } catch (error) {
    return errorHandler(error);
  }
};

// ✅ New: Update user status
const updateUserStatus = async (userId, status) => {
  try {
    const res = await axiosInstance.patch(`${usersUrl}/${userId}/status`, { status });
    return res.data;
  } catch (error) {
    return errorHandler(error);
  }
};

// Utility: Get just active radiologists (for Autocomplete etc.)
const getRadiologists = async () => {
  try {
    const users = await getUsers({ role: "RADIOLOGIST", status: "ACTIVE" });

    // Format for FormAutocomplete: { label, id }
    return users.map((user) => ({
      label: user.name,
      id: user.id,
    }));
  } catch (error) {
    return errorHandler(error);
  }
};

export const UserService = {
  getUsers,
  getSingleUser,
  updateUser,
  updateUserStatus, // new function
  getRadiologists, // shortcut
};
