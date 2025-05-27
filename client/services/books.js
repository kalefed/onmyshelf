import axios from "axios";
import Cookies from "js-cookie";

export const getBooksOnShelf = async (shelf_type) => {
  // Get the CSRF token from the cookie
  const csrfToken = Cookies.get("csrf_access_token");

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shelves/${shelf_type}/books`,

      {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
        withCredentials: true, // Include cookies (JWT token)
      }
    );
    return response.data; // Return the list of books on the shelf
  } catch (error) {
    console.error(
      "Error fetching books:",
      error.response?.data || error.message
    );
    return []; // Return an empty array in case of error
  }
};

export const addBook = async (formData) => {
  // Get the CSRF token from the cookie
  const csrfToken = Cookies.get("csrf_access_token");

  const newBook = {
    title: formData.get("title"),
    author: formData.get("author"),
    format_type: formData.get("format_type"),
    purchase_method: formData.get("purchase_method"),
    genres: formData.get("genres"),
  };

  // Send the data to the API
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shelves/5/books`,
      newBook,
      {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
        withCredentials: true, // Include cookies (JWT token)
      }
    );
    console.log("POST SUCCESS", response.data);
    return response;
  } catch (err) {
    console.error("POST ERROR", err.response?.data || err.message);
    throw err;
  }
};

export const getBook = async ({ shelf_type, id }) => {
  // Get the CSRF token from the cookie
  const csrfToken = Cookies.get("csrf_access_token");

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shelves/${shelf_type}/books/${id}`,

      {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
        withCredentials: true, // Include cookies (JWT token)
      }
    );
    return response.data; // Return the list of books on the shelf
  } catch (error) {
    console.error(
      "Error fetching book:",
      error.response?.data || error.message
    );
    return []; // Return an empty array in case of error
  }
};
