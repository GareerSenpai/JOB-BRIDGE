import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/JobCard";
import ViewBy from "@/components/ViewBy";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";

const SavedJobs = () => {
  const [sortBy, setSortBy] = useState("newest"); // job title(ascending), job title(defending), newest, oldest
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

  const sortedJobs = useMemo(() => {
    if (!dataSavedJobs) return [];

    let jobs = [...dataSavedJobs];

    switch (sortBy) {
      case "newest":
        return jobs;
      case "oldest":
        return jobs.reverse();
      case "job-title-ascending":
        return jobs.sort((a, b) => a.job.title.localeCompare(b.job.title));
      case "job-title-descending":
        return jobs.sort((a, b) => b.job.title.localeCompare(a.job.title));
      default:
        return jobs;
    }
  }, [sortBy, dataSavedJobs]);

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Job Title (Ascending)", value: "job-title-ascending" },
    { label: "Job Title (Descending)", value: "job-title-descending" },
  ];

  return (
    <div>
      <h2 className="text-center text-4xl xs:text-6xl sm:text-7xl font-extrabold gradient gradient-title mb-8">
        Saved Jobs
      </h2>

      {loadingSavedJobs && (
        <div className="flex justify-center items-center">
          <ClipLoader color="#36d7b7" className="mb-4" />
        </div>
      )}

      {errorSavedJobs && (
        <p className="text-center text-red-500">{errorSavedJobs}</p>
      )}

      {dataSavedJobs?.length > 0 ? (
        <>
          <ViewBy
            options={sortOptions}
            onChange={(value) => setSortBy(value)}
            placeholder="Sort By"
          />
          <div
            id="SAVED_JOBS"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          >
            {sortedJobs.map((savedJob) => (
              <JobCard
                key={savedJob.id}
                job={savedJob.job}
                savedInit={true}
                onJobAction={fnSavedJobs}
              />
            ))}
          </div>
        </>
      ) : (
        dataSavedJobs?.length === 0 && <p>No saved jobs 👀</p>
      )}
    </div>
  );
};

export default SavedJobs;
