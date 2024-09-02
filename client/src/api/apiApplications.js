import supabaseClient from "@/utils/supabase.js";
import { supabaseUrl } from "@/utils/supabase.js";

const applyForJob = async (token, _, applicantData) => {
  const supabase = await supabaseClient(token);
  const random = Date.now();

  const filename = `resume-${random}-${applicantData.candidate_id}`;

  const resumeURL = `${supabaseUrl}/storage/v1/object/public/resumes/${filename}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(filename, applicantData.resume);

  if (storageError) {
    console.log("Error while uploading resume: ", error);
    throw error;
  }

  const { data, error: insertError } = await supabase
    .from("applications")
    .insert({
      ...applicantData,
      resume: resumeURL,
    })
    .select();

  if (insertError) {
    console.log("Error while inserting data to applications db: ", insertError);
    throw insertError;
  }

  return data;
};

const updateApplicationStatus = async (token, { job_id }, status) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  if (error || data.length === 0) {
    console.log("Error while updating application status: ", error);
    throw error;
  }

  return data;
};

export { applyForJob, updateApplicationStatus };
