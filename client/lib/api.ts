//Call existing apis
const API = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";

// Existing backend routes - for showing connection 
export async function getTodos() {
  const r = await fetch(`${API}/api/todos`);
  if (!r.ok) throw new Error(await r.text());
  return r.json() as Promise<Array<{ _id: string; text: string }>>;
}

export async function addTodo(text: string) {
  const r = await fetch(`${API}/api/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

//For when authentication endpoints ready 
export async function createUser(_: any) { throw new Error("Auth not ready"); }
export async function startSession(_: any) { throw new Error("Auth not ready"); }
