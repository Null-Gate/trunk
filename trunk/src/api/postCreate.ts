import axios from "axios";
import { API_URL } from "./API_URL";

export const createPost = async ({
  token,
  body,
}: {
  token: string;
  body: any;
}) => {
  try {
    const res = await axios.post(`${API_URL}/forms/package/${token}`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(res.data);
    return res.data;
  } catch (error: any) {
    // console.log(error.response);
    // For debug
    if (error.response) {
      console.log(error.response);
      throw new Error(error.response.data?.msg || "Server Error");
    } else if (error.request) {
      console.log(error.request);
      throw new Error("No response received from the server");
    } else {
      throw new Error("Request error");
    }
  }
};
