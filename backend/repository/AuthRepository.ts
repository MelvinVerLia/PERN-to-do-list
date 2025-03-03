import query from "../db"; // Your database pool

export const findUserByEmail = async (email: string) => {
  const result = await query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] || null;
};

export const insertUser = async (email: string, password: string, name:string) => {
  const result = await query("INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *", [email, password, name]);
  return result.rows[0] || null;
}
