import supabaseClient from "@/utils/supabase";

const getCompanies = async (token) => {
  const supabase = await supabaseClient(token);

  let query = supabase.from("companies").select("*");
  const { data, error } = await query;
  if (error) {
    console.log("Error while fetching companies: ", error);
    throw error;
  }

  return data;
};

export { getCompanies };
