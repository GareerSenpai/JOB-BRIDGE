import { getApplications } from "@/api/apiApplications";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import ApplicantCard from "./ApplicantCard";
import { BarLoader } from "react-spinners";

const CreatedApplications = () => {
  const { user } = useUser();

  const {
    fn: fnApplications,
    data: applications,
    loading: loadingApplications,
    error: errorApplications,
  } = useFetch(getApplications, { user_id: user.id });

  useEffect(() => {
    fnApplications();
  }, []);

  if (loadingApplications) {
    return <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />;
  }

  return (
    <div>
      {applications?.map((application) => (
        <div className="mb-4">
          <ApplicantCard
            application={application}
            key={application.id}
            isCandidate={true}
          />
        </div>
      ))}
    </div>
  );
};

export default CreatedApplications;
