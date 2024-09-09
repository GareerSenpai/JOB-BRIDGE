import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeartIcon, MapPinIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useUser } from "@clerk/clerk-react";
import useFetch from "@/hooks/useFetch";
import { deleteJob, saveJob } from "@/api/apiJobs";
import { ClipLoader } from "react-spinners";

const JobCard = ({
  job,
  isMyJob = false,
  savedInit = false,
  onJobAction = () => {},
}) => {
  const [saved, setSaved] = useState(savedInit);

  const { user } = useUser();

  const {
    fn: saveJobFn,
    data: saveJobData,
    loading: saveJobLoading,
  } = useFetch(saveJob, {
    alreadySaved: saved,
  });

  const {
    fn: fnDeleteJob,
    loading: loadingDeleteJob,
    error: errorDeleteJob,
  } = useFetch(deleteJob, { job_id: job.id });

  useEffect(() => {
    if (saveJobData !== undefined) {
      setSaved(saveJobData?.length > 0);
    }
  }, [saveJobData]);

  const handleSaveJob = async () => {
    await saveJobFn({
      user_id: user.id,
      job_id: job.id,
    });
    onJobAction();
  };

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };

  return (
    <Card className="flex flex-col gap-2">
      <CardHeader>
        <CardTitle className="flex justify-between items-center font-bold">
          {job.title}

          {isMyJob && !loadingDeleteJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
              onClick={handleDeleteJob}
            />
          )}
          {isMyJob && loadingDeleteJob && (
            <ClipLoader color="#36d7b7" size={25} />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between items-center">
          {job.company && (
            <img
              src={job.company.logo_url}
              alt="company-logo"
              className="h-6"
            />
          )}
          <div className="flex items-center gap-2">
            <MapPinIcon size={15} />
            {job.location}
          </div>
        </div>

        <hr />

        <div>
          {job.description.substring(0, 100)}
          {job.description.length > 100 ? "..." : ""}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            More Details
          </Button>
        </Link>
        <Button
          variant="outline"
          className=""
          onClick={handleSaveJob}
          disabled={saveJobLoading}
        >
          {saved ? (
            <HeartIcon size={20} fill="red" stroke="red" />
          ) : (
            <HeartIcon size={20} />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
