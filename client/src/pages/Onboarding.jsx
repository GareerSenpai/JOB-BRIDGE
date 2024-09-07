import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate(
        user?.unsafeMetadata?.role === "recruiter" ? "/post-job" : "/jobs"
      );
    }
  }, [user]);

  if (!isLoaded) {
    return <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />;
  }

  const handleRoleSelection = async (role) => {
    await user
      ?.update({
        unsafeMetadata: {
          role,
        },
      })
      .then(() => {
        navigate(role === "recruiter" ? "/post-job" : "/jobs");
      })
      .catch((error) => {
        console.log("Error updating role: ", error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center mt-32">
      <h2 className="gradient-title gradient font-extrabold text-7xl sm:text-8xl tracking-tighter">
        I'm a...
      </h2>
      <div className="mt-16 grid sm:grid-cols-2 gap-4 w-full mb-8">
        <Button
          variant="blue"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>
        <Button
          variant="destructive"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
