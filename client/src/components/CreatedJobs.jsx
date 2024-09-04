import { deleteJob, getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import JobCard from "./JobCard";
import { BarLoader, ClipLoader } from "react-spinners";

const CreatedJobs = () => {
  const { user, isLoaded } = useUser();

  const {
    fn: fnCreatedJobs,
    data: createdJobs,
    loading: loadingCreatedJobs,
    error: errorCreatedJobs,
  } = useFetch(getMyJobs, { recruiter_id: user.id });

  useEffect(() => {
    if (isLoaded) {
      fnCreatedJobs();
    }
  }, [isLoaded]);

  // if (loadingCreatedJobs) {
  //   <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />;
  // }

  return (
    <>
      {loadingCreatedJobs && (
        <div className="flex justify-center">
          <ClipLoader color="#36d7b7" width={"100%"} className="mb-4" />
        </div>
      )}
      {createdJobs?.map((job) => (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          key={job.id}
        >
          <JobCard
            job={job}
            isMyJob={true}
            savedInit={job.saved[0]?.length > 0}
            onJobAction={fnCreatedJobs}
          />
        </div>
      ))}
      {createdJobs && createdJobs.length === 0 && <p>No Jobs Found</p>}
    </>
  );
};

export default CreatedJobs;
