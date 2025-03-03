import query from "../db";

export const selectAllTasks = async (userId: string) => {
  const result = await query(
    "WITH Task AS (SELECT t.id, t.title, t.priority, t.completed, t.deadline, t.created_at, c.name AS category_name FROM task AS t LEFT JOIN categories AS c ON t.category_id = c.id WHERE t.user_id = $1) SELECT * FROM Task",
    [userId]
  );
  return result.rows || null;
};

export const insertTask = async (
  title: string,
  user_id: string,
  category_id: string,
  deadline: string,
  priority: number,
  description: string
) => {
  const result = await query(
    "INSERT INTO task (title, user_id, category_id, deadline, priority, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *, (SELECT name as category_name FROM categories where id = $3)",
    [title, user_id, category_id, deadline, priority, description]
  );
  console.log("🚀 ~ insertTask ~ result:", result.rows);

  return result.rows[0] || null;
};

export const selectTaskCategory = async (category_id: string) => {
  const result = await query("SELECT name ");
};

export const selectUserTaskCategory = async (userId: string) => {
  const result = await query(
    "WITH TaskCount AS (SELECT t.category_id, COUNT(*) AS task_count FROM task t WHERE t.user_id = $1 GROUP BY t.category_id) SELECT c.name AS category_name, tc.task_count FROM TaskCount tc JOIN categories c ON tc.category_id = c.id ORDER BY tc.task_count DESC",
    [userId]
  );
  return result.rows || null;
};

export const selectTaskCount = async (userId: string) => {
  const result = await query(
      "SELECT TO_CHAR(created_at, 'Dy') AS day,  COUNT(*) AS total_tasks, SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) AS completed_tasks, ROUND((SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) * 100.0) / NULLIF(COUNT(*), 0),2) AS productivity FROM task WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '6 days' GROUP BY day ORDER BY MIN(created_at)",
    [userId]
  );
  return result.rows || null;
};

export const updateCompleted = async (userId: string, taskId: string) => {
  const result = await query(
    "UPDATE task SET completed = true WHERE user_id = $1 AND id = $2",
    [userId, taskId]
  );
  return result.rows ? { completed: "complete" } : null;
};
