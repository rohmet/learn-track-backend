import { supabase } from "../../config/supabase.js";

// Mendaftarkan pengguna baru
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, password, and name are required" });
    }

    // Mendaftarkan pengguna baru ke Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // kirim 'name' sebagai metadata
        // Ini akan ditangkap oleh trigger 'handle_new_user'
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;

    return res.status(201).json({ user: data.user, session: data.session });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Login pengguna
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Login menggunakan Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;

    return res.status(200).json({ user: data.user, session: data.session });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
