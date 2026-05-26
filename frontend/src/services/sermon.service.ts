import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROUTES } from "../constants";

export interface Sermon {
  id: string;
  title: string;
  description?: string;
  status: "DRAFT" | "READY" | "DELIVERED";
  scriptureList?: string[];
  queue?: string[];
  createdAt: string;
  updatedAt: string;
}

const TOKEN_KEY = "auth_token";

export const sermonService = {
  async getAll(): Promise<Sermon[]> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);

    const res = await fetch(API_ROUTES.sermons.getAll, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Failed to fetch sermons");
    return json.data as Sermon[];
  },

  async getById(id: string): Promise<Sermon> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);

    const res = await fetch(API_ROUTES.sermons.getById(id), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Failed to fetch sermon");
    return json.data as Sermon;
  },
};