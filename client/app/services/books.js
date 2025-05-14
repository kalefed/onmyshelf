import axios from "axios";

export const getBooks = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/books`
  );

  return response.data;
};
