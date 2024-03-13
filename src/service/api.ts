// src/api/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8090/",
});

export default axiosInstance;

export const loginUser = async (data: unknown) => {
  const response = await axiosInstance.post("login", data);
  return response.data;
};

// Create (POST)
export const signUp = async (data: unknown) => {
  const response = await axiosInstance.post("sign_up", data);
  return response.data;
};

// Example Read (GET)
export const getUser = async (userId: unknown) => {
  const response = await axiosInstance.get(`user/${userId}`);
  return response.data;
};

// Update (PUT)
export const updateUser = async (userId: unknown, data: unknown) => {
  const response = await axiosInstance.put(`user/${userId}`, data);
  return response.data;
};

// Delete (DELETE)
export const deleteUser = async (userId: unknown) => {
  const response = await axiosInstance.delete(`user/${userId}`);
  return response.data;
};
