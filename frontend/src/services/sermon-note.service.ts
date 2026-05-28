import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants";

const BASE_URL = `${API_URL}/api/sermon-notes`;

export interface SermonNote {
  id: string;
  userId: string;
  sermonId?: string;
  title: string;
  scripture?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  sermon?: {
    title: string;
  };
}

const getToken = async () => {
  return AsyncStorage.getItem("auth_token");
};

export const sermonNoteService = {
  async create(data: { sermonId?: string; title: string; scripture?: string; content: string }): Promise<SermonNote> {
    const token = await getToken();
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Failed to create note");
    return json.data;
  },

  async getAll(sermonId?: string): Promise<SermonNote[]> {
    const token = await getToken();
    const url = sermonId ? `${BASE_URL}?sermonId=${sermonId}` : BASE_URL;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Failed to fetch notes");
    return json.data;
  },

  async getById(id: string): Promise<SermonNote> {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Failed to fetch note");
    return json.data;
  },

  async update(id: string, data: Partial<{ title: string; scripture?: string; content: string }>): Promise<SermonNote> {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Failed to update note");
    return json.data;
  },

  async delete(id: string): Promise<void> {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Failed to delete note");
  },
};