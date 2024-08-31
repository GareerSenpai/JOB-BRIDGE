import supabaseClient from "@/utils/supabase.js";

const getJobs = async (token, { location, company_id, searchQuery }) => {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select("*, company:companies(name, logo_url), saved:saved_jobs(id)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.log("Error: ", error);
    throw error;
  }

  return data;
};

const saveJob = async (token, { alreadySaved }, saveData) => {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    const { data, error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id);

    if (error) {
      console.log("Error while deleting saved job: ", error);
      throw error;
    }

    return data;
  }

  const { data, error } = await supabase
    .from("saved_jobs")
    .insert([saveData])
    .select();
  if (error) {
    console.log("Error while saving job: ", error);
    throw error;
  }

  return data;
};

export { getJobs, saveJob };
