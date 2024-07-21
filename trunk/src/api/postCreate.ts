import axios from "axios";
import { API_URL } from "./API_URL";

export const createPost = async ({
  token,
  body,
}: {
  token: string;
  body: FormData;
}) => {
  try {
    const res = await axios.post(`${API_URL}/forms/package/${token}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error: any) {
    // For debug
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
