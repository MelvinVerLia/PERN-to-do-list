import query from "../db";

export const selectAllCategories = async () => {
  const response = await query("SELECT * FROM categories");
  return response.rows || null;
};
