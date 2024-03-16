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

export const uploadCar = async ({
  formData,
  token,
}: {
  formData: FormData;
  token: unknown;
}) => {
  const response = await axiosInstance.post(`forms/car/${token}`, formData);
  return response.data;
};

interface SetAvailableCarData {
  car_id: string;
  from_where: string;
  to_where: string;
  date_to_go: string; 
}

export const setAvailableCar = async ({
  data,
  token,
}: {
  data: SetAvailableCarData;
  token: string; 
}) => {
  const response = await axios.post(
    `http://127.0.0.1:8090/post/car/${token}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const registrationAsDriver = async ({
  formData,
  token,
}: {
  formData: FormData;
  token: unknown;
}) => {
  const response = await axiosInstance.post(`forms/driver/${token}`, formData);
  return response.data;
};

export const uploadPackage = async ({
  formData,
  token,
}: {
  formData: FormData;
  token: unknown;
}) => {
  const response = await axiosInstance.post(`forms/package/${token}`, formData);
  return response.data;
};

// Example Read (GET)
export const getUser = async (userName: unknown) => {
  const response = await axiosInstance.get(`fetch/user/${userName}`);
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
