import axios from "axios";
import { FieldValues } from "react-hook-form";

const API_URL = "https://kargate.site";

export const login = async (body: FieldValues) => {
  try {
    const res = await axios.post(`${API_URL}/login`, body);
    return res.data; // Return the response data
  } catch (error: any) {
    return error.response.data;
  }
};
