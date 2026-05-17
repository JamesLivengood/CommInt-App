const BASE_URL = "/api/v1";

export async function searchSubjects(query) {
  const res = await fetch(`${BASE_URL}/subjects?search=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function createSubject(name) {
  const res = await fetch(`${BASE_URL}/subjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject: { name } }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.errors?.join(", ") || "Create failed");
  return data;
}

export async function getSubject(id) {
  const res = await fetch(`${BASE_URL}/subjects/${id}`);
  if (!res.ok) throw new Error("Subject not found");
  return res.json();
}

export async function getRatings(subjectId, page = 1) {
  const res = await fetch(`${BASE_URL}/subjects/${subjectId}/ratings?page=${page}`);
  if (!res.ok) throw new Error("Failed to load ratings");
  return res.json();
}

export async function createRating(subjectId, score, comment) {
  const res = await fetch(`${BASE_URL}/subjects/${subjectId}/ratings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating: { score, comment } }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.errors?.join(", ") || "Create failed");
  return data;
}
