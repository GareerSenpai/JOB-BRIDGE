import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import States from "../data/locations.json";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { lazy, Suspense, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { getCompanies } from "@/api/apiCompanies";
import { BarLoader, ClipLoader } from "react-spinners";
import { useUser } from "@clerk/clerk-react";
// import AddCompanyDrawer from "@/components/AddCompanyDrawer.jsx";
import { Controller, useForm } from "react-hook-form";
// import MDEditor from "@uiw/react-md-editor";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewJob } from "@/api/apiJobs";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

const MDEditor = lazy(() => import("@uiw/react-md-editor"));
const AddCompanyDrawer = lazy(() =>
  import("@/components/AddCompanyDrawer.jsx")
);

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
      <h1 className="text-5xl sm:text-5xl md:text-7xl gradient gradient-title text-center font-extrabold pt-2 pb-10">
        Post a Job
      </h1>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="w-full">
          <Input
            placeholder="Job Title"
            className="px-4"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500 mt-2">{errors.title.message}</p>
          )}
        </div>
        <div className="w-full">
          <Textarea
            placeholder="Job Description"
            className="px-4"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 mt-2">{errors.description.message}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full">
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
                      {States.map((state) => (
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
            {errors.location && (
              <p className="text-red-500 mt-2">{errors.location.message}</p>
            )}
          </div>
          <div className="w-full">
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
            {errors.company_id && (
              <p className="text-red-500 mt-2">{errors.company_id.message}</p>
            )}
          </div>
          <AddCompanyDrawer fetchCompanies={companyFn} />
        </div>

        <div className="w-full">
          <Controller
            name="requirements"
            control={control}
            render={({ field }) => (
              <>
                <Label htmlFor="requirements" className="text-lg">
                  Requirements:{" "}
                </Label>
                <Suspense fallback={<Skeleton className="w-full h-48" />}>
                  <MDEditor
                    value={field.value}
                    onChange={field.onChange}
                    className="mt-2"
                  />
                </Suspense>
              </>
            )}
          />
          {errors.requirements && (
            <p className="text-red-500 mt-2">{errors.requirements.message}</p>
          )}
        </div>
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
