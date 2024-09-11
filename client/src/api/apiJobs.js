import supabaseClient from "@/utils/supabase.js";

const getJobs = async (
  token,
  { location, company_id, searchQuery, limit, page }
) => {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select("*, company:companies(name, logo_url), saved:saved_jobs(id)");

  let queryTotalCount = supabase.from("jobs").select("*", {
    count: "exact",
    head: true,
  });

  if (location) {
    query = query.eq("location", location);
    queryTotalCount = queryTotalCount.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
    queryTotalCount = queryTotalCount.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
    queryTotalCount = queryTotalCount.ilike("title", `%${searchQuery}%`);
  }

  const { count: totalCount, error: countError } = await queryTotalCount;
  if (countError) {
    console.log("Error while counting jobs: ", countError);
    throw countError;
  }

  if (page && limit) {
    const start = (page - 1) * limit;
    const end = page * limit - 1;
    query = query.range(start, end);
  }

  const { data: jobs, error: jobError } = await query;
  if (jobError) {
    console.log("Error while fetching jobs: ", error);
    throw error;
  }

  // console.log("page: ", page);
  // console.log("totalCount: ", totalCount);
  // console.log("jobs: ", jobs);

  return { jobs, totalCount };
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

const getSingleJob = async (token, { job_id }) => {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select(
      "*, company: companies(name, logo_url), applications: applications(*)"
    )
    .eq("id", job_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.log("Error while fetching single job: ", error);
    throw error;
  }

  return data;
};

const updateHiringStatus = async (token, { job_id }, isOpen) => {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  const { data, error } = await query;

  if (error) {
    console.log("Error while updating hiring status: ", error);
    throw error;
  }

  return data;
};

// post job
const addNewJob = async (token, _, jobData) => {
  const supabase = await supabaseClient(token);

  let query = supabase.from("jobs").insert([jobData]).select();
  const { data, error } = await query;
  if (error) {
    console.log("Error creating job: ", error);
    throw error;
  }

  return data;
};

const getSavedJobs = async (token) => {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("saved_jobs")
    .select("*, job:jobs(*, company:companies(name, logo_url))");

  const { data, error } = await query;
  if (error) {
    console.log("Error fetching saved jobs: ", error);
    throw error;
  }

  return data;
};

const getMyJobs = async (token, { recruiter_id }, _) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(name, logo_url), saved:saved_jobs(id)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.log("Error fetching my jobs: ", error);
    throw error;
  }

  return data;
};

const deleteJob = async (token, { job_id }, _) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.log("Error while deleting job: ", error);
    throw error;
  }

  return data;
};

export {
  getJobs,
  saveJob,
  getSingleJob,
  updateHiringStatus,
  addNewJob,
  getSavedJobs,
  getMyJobs,
  deleteJob,
};
