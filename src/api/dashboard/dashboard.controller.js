import { supabase } from "../../config/supabase.js";

export const getMyDashboard = async (req, res) => {
  const userId = req.user.id;

  try {
    const { data: enrollments, error: enrollError } = await supabase
      .from("enrollments")
      .select(
        `
        id, 
        course_id,
        courses (
          name,
          learning_paths ( name )
        )
      `
      )
      .eq("user_id", userId);

    if (enrollError) throw enrollError;

    const dashboardData = await Promise.all(
      enrollments.map(async (enroll) => {
        const { data: progressData, error: rpcError } = await supabase.rpc(
          "get_course_progress",
          { p_enrollment_id: enroll.id }
        );

        if (rpcError) throw rpcError;

        return {
          enrollment_id: enroll.id,
          course: {
            course_id: enroll.course_id,
            name: enroll.courses.name,
            learning_path: enroll.courses.learning_paths.name,
          },
          progress_percent: progressData,
        };
      })
    );

    res.status(200).json({
      user: {
        name: req.user.user_metadata?.full_name || req.user.email,
        email: req.user.email,
      },
      enrollments: dashboardData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
