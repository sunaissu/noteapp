import env from '@/util/config'
import { Note } from '../../model/note'
import { User } from '../../model/user'

async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init)
  if (response.ok) {
    return response
  } else {
    const errorBody = await response.json()
    const errorMessage = errorBody.error
    throw Error(errorMessage)
  }
}

export async function getLoginUser(): Promise<User> {
  const response = await fetchData(`${env.SERVER_URL}/api/users/getUser`, { method: 'GET', credentials: 'include' })
  const body = await response.json()
  return body.user
}

interface RegisterCredentials {
  username: string
  email: string
  password: string
}

export async function registerUser(user: RegisterCredentials): Promise<User> {
  const response = await fetchData(`${env.SERVER_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
    credentials: 'include'
  })
  const body = await response.json()
  return body.user
}

interface LoginCredentials {
  email: string
  password: string
}

export async function loginUser(user: LoginCredentials): Promise<User> {
  const response = await fetchData(`${env.SERVER_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
    credentials: 'include'
  })
  const body = await response.json()
  return body.user
}

export async function logout() {
  await fetch(`${env.SERVER_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' })
}

export async function fetchNotes(): Promise<Note[]> {
  const response = await fetch(`${env.SERVER_URL}/api/notes`, { method: 'GET', credentials: 'include' })
  return await response.json()
}

export interface NoteInput {
  title: string
  text?: string
  type?: string
}

export async function createNotes(note: NoteInput) {
  const response = await fetch(`${env.SERVER_URL}/api/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note),
    credentials: 'include'
  })
  return await response.json()
}

export async function updateNotes(id: string, note: NoteInput) {
  const response = await fetch(`${env.SERVER_URL}/api/notes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note),
    credentials: 'include'
  })
  return await response.json()
}

export async function deleteNotes(id: string) {
  const response = await fetch(`${env.SERVER_URL}/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  console.log(response)
}
