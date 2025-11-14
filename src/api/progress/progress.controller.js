import { supabase } from "../../config/supabase.js";

export const updateTutorialStatus = async (req, res) => {
  const { tutorialId } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  if (!["not_started", "in_progress", "completed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status provided" });
  }

  try {
    const { data: tutorial, error: tutError } = await supabase
      .from("tutorials")
      .select("course_id")
      .eq("id", tutorialId)
      .single();

    if (tutError || !tutorial) {
      return res.status(404).json({ error: "Tutorial not found" });
    }

    const { data: enrollment, error: enrollError } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", tutorial.course_id)
      .single();

    if (enrollError || !enrollment) {
      return res
        .status(403)
        .json({ error: "You are not enrolled in this course" });
    }

    const { data: progressUpdate, error: upsertError } = await supabase
      .from("tutorial_progress")
      .upsert(
        {
          enrollment_id: enrollment.id,
          tutorial_id: tutorialId,
          status: status,
          completed_at:
            status === "completed" ? new Date().toISOString() : null,
        },
        {
          onConflict: "enrollment_id, tutorial_id",
        }
      )
      .select()
      .single();

    if (upsertError) throw upsertError;

    const { data: newProgress, error: rpcError } = await supabase.rpc(
      "get_course_progress",
      { p_enrollment_id: enrollment.id }
    );
    if (rpcError) throw rpcError;

    res.status(200).json({
      message: "Progress updated successfully",
      tutorial_id: progressUpdate.tutorial_id,
      new_status: progressUpdate.status,
      new_course_progress: newProgress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
