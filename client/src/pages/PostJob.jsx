import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { State } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { getCompanies } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useUser } from "@clerk/clerk-react";
import AddCompanyDrawer from "@/components/AddCompanyDrawer.jsx";
import { Controller, useForm } from "react-hook-form";
import MDEditor from "@uiw/react-md-editor";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewJob } from "@/api/apiJobs";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const { isLoaded, user } = useUser();

  const navigate = useNavigate();

  const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    location: z.string().min(1, { message: "Select a Location" }),
    company_id: z.string().min(1, { message: "Select or add a new Company" }),
    requirements: z.string().min(1, { message: "Requirements are required" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const {
    fn: companyFn,
    data: companies,
    loading: companyLoading,
  } = useFetch(getCompanies);

  const {
    fn: addNewJobFn,
    data: addNewJobData,
    error: addNewJobError,
    loading: addNewJobLoading,
  } = useFetch(addNewJob);

  useEffect(() => {
    if (isLoaded) companyFn();
  }, [isLoaded]);

  useEffect(() => {
    if (addNewJobData?.length > 0) {
      navigate("/jobs");
    }
  }, [addNewJobLoading]);

  const onSubmit = (data) => {
    addNewJobFn({ ...data, recruiter_id: user.id, isOpen: true });
    reset();
  };

  if (!isLoaded) {
    return <BarLoader color="#36d7b7" width={"100%"} />;
  }

  if (user?.unsafeMetadata?.role === "candidate") {
    return <div>Only Recruiters can post jobs</div>;
  }

  // When the below code is run, it will show BarLoader twice because of the useEffect used above to fetch companies
  // TODO: fix this
  // if (!isLoaded || companyLoading) {
  //   return <BarLoader color="#36d7b7" width={"100%"} />;
  // }

  return (
    <div>
      <h1 className="text-3xl sm:text-5xl md:text-7xl gradient gradient-title text-center font-extrabold pt-2 pb-10">
        Post a Job
      </h1>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Input
          placeholder="Job Title"
          className="px-4"
          {...register("title")}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea
          placeholder="Job Description"
          className="px-4"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="px-4 select-none">
                  <SelectValue placeholder="Job Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map((state) => (
                      <SelectItem
                        key={state.isoCode}
                        value={state.name}
                        className="hover:cursor-pointer"
                      >
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="px-4 select-none">
                  <SelectValue placeholder="Company">
                    {field.value
                      ? companies?.find(
                          (company) => company.id === Number(field.value)
                        )?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map((company) => (
                      <SelectItem
                        key={company.id}
                        value={company.id}
                        className="hover:cursor-pointer"
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <AddCompanyDrawer fetchCompanies={companyFn} />
        </div>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor
              value={field.value}
              onChange={field.onChange}
              previewOptions={{
                components: {
                  // Override the style for ul elements
                  ul: ({ node, ...props }) => (
                    <ul
                      {...props}
                      style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}
                    />
                  ),
                },
              }}
            />
          )}
        />
        {addNewJobLoading && <BarLoader color="#36d7b7" width={"100%"} />}
        {addNewJobError?.message && (
          <p className="text-red-500">{addNewJobError.message}</p>
        )}
        <Button type="submit" variant="blue" size="lg" className="mt-2 mb-4">
          Post Job
        </Button>
        {/* {postJobFormErrors?.message && (
          <p className="text-red-500">{postJobFormErrors.message}</p>
        )} */}
      </form>
    </div>
  );
};

export default PostJob;
