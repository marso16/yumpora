import axios from "axios";
import { supabase } from "./supabase";

const instance = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_URL,
});

instance.interceptors.request.use(async (config) => {
  try {
    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise((resolve) =>
      setTimeout(resolve, 2000, null),
    );
    const result = await Promise.race([sessionPromise, timeoutPromise]);
    const session = result?.data?.session;

    const token =
      session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY;

    config.headers = {
      ...config.headers,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  } catch {
    config.headers = {
      ...config.headers,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    };
  }

  return config;
});

export default instance;
