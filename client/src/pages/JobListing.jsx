import React, { useEffect, useState } from "react";
import { getJobs } from "../api/apiJobs.js";
import { useSession } from "@clerk/clerk-react";

const JobListing = () => {
  const [jobs, setJobs] = useState([]);

  const { session } = useSession(); // Call useSession at the top level
  useEffect(() => {
    const fetchJobs = async () => {
      const token = await session.getToken({
        template: "supabase",
      });

      const jobs = await getJobs(token);
      setJobs(jobs);
    };

    fetchJobs();
  }, [session]); // Add session to dependency array

  console.log(jobs);
  return <div>JobListing</div>;
};

export default JobListing;
