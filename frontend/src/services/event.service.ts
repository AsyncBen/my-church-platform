import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants";

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  accent: string;
  createdAt: string;
}

const TOKEN_KEY = "auth_token";

export const eventService = {
  async getAll(): Promise<Event[]> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    
    const res = await fetch(`${API_URL}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || "Failed to fetch events");
    }
    return json.data as Event[];
  },
};