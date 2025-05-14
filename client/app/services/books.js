import axios from "axios";

export const getBooks = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/books`
  );

  return response.data;
};

export const addBook = async (formData) => {
  const newBook = {
    title: formData.get("title"),
    author: formData.get("author"),
  };

  // Send the data to the API
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/books`,
      newBook
    );
    console.log("POST SUCCESS", response.data);
    return response;
  } catch (err) {
    console.error("POST ERROR", err.response?.data || err.message);
    throw err;
  }
};
