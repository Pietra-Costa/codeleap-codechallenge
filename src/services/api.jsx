const BASE_URL = "https://dev.codeleap.co.uk/careers/";

// export const fetchPosts = async () => {
//   const response = await fetch(BASE_URL);
//   if (!response.ok) throw new Error("Failed to fetch posts");
//   return response.json();
// };

export const fetchPosts = async (page = 1, limit = 10) => {
  const response = await fetch(BASE_URL);
  const data = await response.json();
  return data;
};

export const createPost = async postData => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
};

export const editPost = async (id, updatedData) => {
  const response = await fetch(`${BASE_URL}${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) throw new Error("Failed to edit post");
  return response.json();
};

export const deletePost = async id => {
  const response = await fetch(`${BASE_URL}${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete post");
};
