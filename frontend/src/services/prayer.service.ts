import { API_URL } from "../constants";

export interface Prayer {
  id: string;
  text: string;
  category: string;
  isAnonymous: boolean;
  prayerCount: number;
  createdAt: string;
  userId: string;
  user: {
    name: string;
  };
}

export const prayerService = {
  async getAll(token: string): Promise<Prayer[]> {
    const res = await fetch(`${API_URL}/prayers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || "Failed to fetch prayers");
    }
    return json.data as Prayer[];
  },

  async create(
    data: { text: string; category: string; isAnonymous: boolean },
    token: string
  ): Promise<Prayer> {
    const res = await fetch(`${API_URL}/prayers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || "Failed to create prayer");
    }
    return json.data as Prayer;
  },

  async pray(id: string, token: string): Promise<Prayer> {
    const res = await fetch(`${API_URL}/prayers/${id}/pray`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || "Failed to pray for request");
    }
    return json.data as Prayer;
  },

  async delete(id: string, token: string): Promise<void> {
    const res = await fetch(`${API_URL}/prayers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || "Failed to delete prayer");
    }
  },
};