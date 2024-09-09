import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Boxes,
  BriefcaseBusiness,
  Download,
  School,
} from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { updateApplicationStatus } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const ApplicantCard = ({ application, isCandidate = false }) => {
  const {
    fn: updateApplicationStatusFn,
    data: updateApplicationStatusData,
    loading: updateApplicationStatusLoading,
  } = useFetch(updateApplicationStatus, { job_id: application.job_id });

  const handleApplicationStatusUpdate = (status) => {
    updateApplicationStatusFn(status);
  };

  const handleDownloadClick = () => {
    const link = document.createElement("a");
    link.href = application.resume;
    link.target = "_blank";
    // link.download = "resume.pdf";
    link.click();
  };

  const statusColor = {
    applied: "text-yellow-500",
    interviewing: "text-blue-500",
    hired: "text-green-500",
    rejected: "text-red-500",
  };

  return (
    <>
      <Card>
        {updateApplicationStatusLoading && (
          <BarLoader color="#36d7b7" width={"100%"} />
        )}
        <CardHeader>
          <CardTitle className="flex justify-between items-center font-bold">
            {isCandidate
              ? `${application?.job?.title} at ${application?.job?.company?.name}`
              : application.name}
            {!isCandidate && (
              <Download
                className="text-black bg-white rounded-full h-8 w-8 p-1.5 cursor-pointer"
                size={18}
                onClick={handleDownloadClick}
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1">
          <div className="flex flex-col gap-2 lg:flex-row justify-between">
            <div className="flex gap-2 items-center">
              <BriefcaseBusiness size={15} /> {application?.experience} years of
              experience
            </div>
            <div className="flex gap-2 items-center capitalize">
              <School size={15} />
              {application?.education}
            </div>
            <div className="flex gap-2 items-center">
              <Boxes size={15} /> Skills: {application?.skills}
            </div>
          </div>
          <hr />
        </CardContent>
        <CardFooter className="flex justify-between gap-4">
          <span>{new Date(application?.created_at).toLocaleString()}</span>
          {isCandidate ? (
            <span className="capitalize font-semibold">
              Status:{" "}
              <span className={`${statusColor[application?.status]}`}>
                {application?.status}
              </span>
            </span>
          ) : (
            <Select
              onValueChange={(value) => handleApplicationStatusUpdate(value)}
              defaultValue={application.status}
            >
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Application Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default ApplicantCard;
