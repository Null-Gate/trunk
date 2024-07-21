import axios from "axios";
import { loginProps, signUpProps } from "../utils/types";
import { API_URL } from "./API_URL";


export const login = async (body: loginProps) => {
  try {
    const res = await axios.post(`${API_URL}/login`, body);
    return res.data; // Return the response data
  } catch (error: any) {
    // Handle error and return error response data
    if (error.response) {
      console.log("Response error:", error.response.data);
      console.log("Response status:", error.response.status);
      console.log("Response headers:", error.response.headers);
    } else if (error.request) {
      console.log("Request error:", error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log("Config:", error.config);
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const signUp = async (body: signUpProps) => {
  try {
    const res = await axios.post(`${API_URL}/sign_up`, body);
    return res.data; // Return the response data
  } catch (error: any) {
    // Handle error and return error response data
    if (error.response) {
      console.log("Response error:", error.response.data);
      console.log("Response status:", error.response.status);
      console.log("Response headers:", error.response.headers);
    } else if (error.request) {
      console.log("Request error:", error.request);
    } else {
      console.log("Error", error.message);
    }
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
