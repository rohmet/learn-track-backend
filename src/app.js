import express from "express";
import cors from "cors";
import "dotenv/config";
import { supabase } from "./config/supabase.js";

import authRoutes from "./api/auth/auth.routes.js";
import dashboardRoutes from "./api/dashboard/dashboard.routes.js";
import progressRoutes from "./api/progress/progress.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// === Routes ===
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/progress", progressRoutes);

// === TES KONEKSI ===
app.get("/api/test", async (req, res) => {
  try {
    // ambil data dari tabel 'learning_paths'
    const { data, error } = await supabase
      .from("learning_paths")
      .select("name");

    if (error) {
      throw error;
    }

    res.status(200).json({
      message: "Connection to Supabase successful!",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to connect to Supabase",
      error: error.message,
    });
  }
});

export default app;
