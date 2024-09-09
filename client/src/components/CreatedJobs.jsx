import { deleteJob, getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect, useMemo, useState } from "react";
import JobCard from "./JobCard";
import { BarLoader, ClipLoader } from "react-spinners";
import ViewBy from "./ViewBy";

const CreatedJobs = () => {
  const [sortBy, setSortBy] = useState("newest");
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

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Job Title (Ascending)", value: "job-title-ascending" },
    { label: "Job Title (Descending)", value: "job-title-descending" },
  ];

  const sortedJobs = useMemo(() => {
    if (!createdJobs) return [];

    let jobs = [...createdJobs];

    switch (sortBy) {
      case "newest":
        return jobs;
      case "oldest":
        return jobs.reverse();
      case "job-title-ascending":
        return jobs.sort((a, b) => a.title.localeCompare(b.title));
      case "job-title-descending":
        return jobs.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return jobs;
    }
  }, [sortBy, createdJobs]);

  if (createdJobs) {
    console.log(createdJobs);
  }

  return (
    <>
      {loadingCreatedJobs && (
        <div className="flex justify-center">
          <ClipLoader color="#36d7b7" width={"100%"} className="mb-4" />
        </div>
      )}
      {!loadingCreatedJobs && createdJobs?.length > 0 && (
        <ViewBy
          options={sortOptions}
          onChange={(value) => setSortBy(value)}
          placeholder="Sort By"
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {sortedJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isMyJob={true}
            savedInit={job.saved[0]?.length > 0}
            onJobAction={fnCreatedJobs}
          />
        ))}
      </div>
      {createdJobs && createdJobs.length === 0 && <p>No jobs posted yet</p>}
    </>
  );
};

export default CreatedJobs;
