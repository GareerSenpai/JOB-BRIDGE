import supabaseClient, { supabaseUrl } from "@/utils/supabase";

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

const addCompany = async (token, _, newCompanyData) => {
  const supabase = await supabaseClient(token);
  console.log(newCompanyData);

  const random = Date.now();

  // TODO: Implement the below operations
  // update storage bucket and companies db (think of a way whether it is needed to add logo to bucket or not)
  // first check if company already exists (if company exists with same name and logo then do not create new company)

  const filename = `company_logo-${random}-${newCompanyData.name}`;

  const logo_url = `${supabaseUrl}/storage/v1/object/public/company_logo/${filename}`;

  const { error: storageError } = await supabase.storage
    .from("company_logo")
    .upload(filename, newCompanyData.logo);

  if (storageError) {
    console.log("Error while uploading logo: ", storageError);
    throw error;
  }

  const { data, error: insertError } = await supabase
    .from("companies")
    .insert({
      name: newCompanyData.name,
      logo_url,
    })
    .select();

  if (insertError) {
    console.log(
      "Error while adding new company to companies db: ",
      insertError
    );
    throw insertError;
  }
  return data;
};

export { getCompanies, addCompany };
