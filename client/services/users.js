import axios from "axios";

export const userLogin = async (formData) => {
  const newUser = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  // Send the data to the API
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/login`,
      newUser
    );
    console.log("LOGIN SUCCESS", response.data);
    return response;
  } catch (err) {
    console.error("LOGIN ERROR", err.response?.data || err.message);
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
