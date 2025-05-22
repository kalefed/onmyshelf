import axios from "axios";
import Cookies from "js-cookie";

export const userLogin = async (formData) => {
  const newUser = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  // Send the data to the API
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/login`,
      newUser,
      { withCredentials: true }
    );
    return response;
  } catch (err) {
    throw err;
  }
};

export const userLogout = async () => {
  // Get the CSRF token from the cookie
  const csrfToken = Cookies.get("csrf_access_token");

  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/logout`,
      {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
        withCredentials: true, // Include cookies (JWT token)
      }
    );
    console.log("LOGOUT SUCCESS", response.data);
    return response;
  } catch (err) {
    throw err;
  }
};

export const userRegister = async (formData) => {
  const newUser = {
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
  };

  // Send the data to the API
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/register`,
      newUser
    );
    console.log("REGISTER SUCCESS", response.data);
    return response;
  } catch (err) {
    console.error("REGISTER ERROR", err.response?.data || err.message);
    throw err;
  }
};
