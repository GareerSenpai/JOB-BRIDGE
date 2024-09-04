import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/JobCard";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader, ClipLoader } from "react-spinners";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    fn: fnSavedJobs,
    data: dataSavedJobs,
    loading: loadingSavedJobs,
    error: errorSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
  }, [isLoaded]);

  // if ((isLoaded && loadingSavedJobs) || (!isLoaded && !loadingSavedJobs)) {
  //   return <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />;
  // }

  // if (isLoaded && dataSavedJobs?.length === 0) {
  //   return <p>No saved jobs</p>;
  // }

  return (
    <div>
      <h2 className="text-center text-6xl sm:text-7xl font-extrabold gradient gradient-title mb-8">
        Saved Jobs
      </h2>
      {loadingSavedJobs && (
        <div className="flex justify-center items-center">
          <ClipLoader color="#36d7b7" className="mb-4" />
        </div>
      )}
      <div
        id="SAVED_JOBS"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        {dataSavedJobs?.map((savedJob) => (
          <JobCard
            key={savedJob.id}
            job={savedJob.job}
            savedInit={true}
            onJobAction={fnSavedJobs}
          />
        ))}
        {dataSavedJobs?.length === 0 && <p>No saved jobs 👀</p>}
      </div>
    </div>
  );
};

export default SavedJobs;
