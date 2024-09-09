import { useUser } from "@clerk/clerk-react";
import React, { lazy, Suspense } from "react";
import { BarLoader } from "react-spinners";

const CreatedApplications = lazy(() =>
  import("../components/CreatedApplications")
);
const CreatedJobs = lazy(() => import("../components/CreatedJobs"));

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />;
  }

  return (
    <div>
      <h1 className="gradient gradient-title font-extrabold text-4xl xs:text-5xl sm:text-7xl text-center pb-8 leading-tight">
        {user.unsafeMetadata?.role === "recruiter"
          ? "My Jobs"
          : "My Applications"}
      </h1>
      {isLoaded &&
        (user.unsafeMetadata?.role === "candidate" ? (
          <Suspense fallback={<BarLoader color="#36d7b7" width={"100%"} />}>
            <CreatedApplications />
          </Suspense>
        ) : (
          <Suspense fallback={<BarLoader color="#36d7b7" width={"100%"} />}>
            <CreatedJobs />
          </Suspense>
        ))}
    </div>
  );
};

export default MyJobs;
