import axios from "axios";
import Cookies from "js-cookie";

export const searchGoogleAPI = async (title, author) => {
  const query = `intitle:${title}+inauthor:${author}`;
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

  const coverFile = formData.get("cover_image");
  const title = formData.get("title");
  const author = formData.get("author");

  const bookApiData = await searchGoogleAPI(title, author);

  formData.append("page_count", bookApiData?.pageCount || null);
  formData.append("description", bookApiData?.description || null);
  // Only append google book api cover if no cover image was uploaded
  if (
    (coverFile.name == "" || coverFile.size === 0) &&
    bookApiData?.imageLinks?.thumbnail
  ) {
    formData.append("cover_image_url", bookApiData.imageLinks.thumbnail);
  }

  // Send the data to the API
  try {
    const response = await axios.post(
      // TODO - fix the hardcoded shelf number
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shelves/1/books`,
      formData,
      {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
          "Content-Type": "multipart/form-data",
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
