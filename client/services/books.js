import axios from "axios";
import Cookies from "js-cookie";

export const searchGoogleAPI = async (title, author) => {
  const query = `${title} ${author}`;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&maxResults=1`;

  try {
    const response = await axios.get(url);
    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[0].volumeInfo;
    }
    return null;
  } catch (error) {
    console.error("Google Books API error:", error.message);
    return null;
  }
};

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

  const title = formData.get("title");
  const author = formData.get("author");

  const bookApiData = await searchGoogleAPI(title, author);

  const newBook = {
    title: title,
    author: author,
    format_type: formData.get("format_type"),
    purchase_method: formData.get("purchase_method"),
    genres: formData.get("genres"),
    description: bookApiData?.description || null,
    cover_image: bookApiData?.imageLinks?.medium || null,
    page_count: bookApiData?.pageCount || null,
  };

  // Send the data to the API
  try {
    const response = await axios.post(
      // TODO - fix the hardcoded shelf number
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shelves/1/books`,
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
