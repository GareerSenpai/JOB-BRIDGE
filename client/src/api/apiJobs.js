import supabaseClient from "@/utils/supabase.js";

const getJobs = async (token) => {
  const supabase = await supabaseClient(token);
  let query = supabase.from("jobs").select("*");

  const { data, error } = await query;
  if (error) {
    console.log("Error: ", error);
    throw error;
  }

  return data;
};

export { getJobs };
