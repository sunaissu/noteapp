import env from "@/util/config";
import { Note } from "../../model/note";
import { User } from "../../model/user";
import Router from "next/router";

async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.ok) {
    return response;
  } else {
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const errorBody = isJson ? await response.json() : null;
    const errorMessage = errorBody?.error || `HTTP error ${response.status}`;
    if (response.status == 401) {
      Router.push("/unauthorized");
      throw Error("You are not authorized to access this resource");
    }
    throw Error(errorMessage);
  }
}

export async function getLoginUser(): Promise<User> {
  const response = await fetch(`${env.SERVER_URL}/api/users/getUser`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || "Failed to fetch user");
  }
  const body = await response.json();
  return body.user;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export async function registerUser(user: RegisterCredentials): Promise<User> {
  const response = await fetch(`${env.SERVER_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
    credentials: "include",
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || "Failed to fetch user");
  }
  const body = await response.json();
  return body.user;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export async function loginUser(user: LoginCredentials): Promise<User> {
  const response = await fetch(`${env.SERVER_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
    credentials: "include",
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || "Failed to fetch user");
  }
  const body = await response.json();
  return body.user;
}

export async function logout() {
  await fetch(`${env.SERVER_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function fetchNotes(): Promise<Note[]> {
  const response = await fetchData(`${env.SERVER_URL}/api/notes`, {
    method: "GET",
    credentials: "include",
  });
  return await response.json();
}

export async function fetchSharedNotes(): Promise<Note[]> {
  const response = await fetchData(`${env.SERVER_URL}/api/notes/shared`, {
    method: "GET",
    credentials: "include",
  });
  return await response.json();
}

export async function fetchFavoriteNotes(): Promise<Note[]> {
  const response = await fetchData(`${env.SERVER_URL}/api/notes/favorites`, {
    method: "GET",
    credentials: "include",
  });
  return await response.json();
}

export async function toggleFavoriteNote(noteId: string): Promise<Note> {
  const response = await fetchData(
    `${env.SERVER_URL}/api/notes/${noteId}/favorite`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
  );
  return await response.json();
}

export interface NoteInput {
  title?: string;
  text?: string;
  type?: string;
}

export async function createNotes(note: NoteInput) {
  const response = await fetchData(`${env.SERVER_URL}/api/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
    credentials: "include",
  });
  return await response.json();
}

export async function updateNotes(
  id: string,
  note: NoteInput,
  keepalive?: boolean,
) {
  const response = await fetchData(`${env.SERVER_URL}/api/notes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
    credentials: "include",
    keepalive,
  });
  return await response.json();
}

export async function deleteNotes(id: string) {
  const response = await fetchData(`${env.SERVER_URL}/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}
