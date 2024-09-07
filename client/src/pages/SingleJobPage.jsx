import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ApplyJobDrawer from "@/components/ApplyJobDrawer";
import ApplicantCard from "@/components/ApplicantCard";
import MDEditor from "@uiw/react-md-editor";

const SingleJobPage = () => {
  const { id: job_id } = useParams();

  const { isLoaded, user } = useUser();

  const {
    fn: getSingleJobFn,
    data: singleJob,
    loading: singleJobLoading,
  } = useFetch(getSingleJob, { job_id });

  const {
    fn: updateHiringStatusFn,
    data: updateHiringStatusData,
    loading: updateHiringStatusLoading,
  } = useFetch(updateHiringStatus, { job_id });

  useEffect(() => {
    if (isLoaded) getSingleJobFn();
  }, [job_id, isLoaded]);

  if (isLoaded) console.log(singleJob);

  const handleHiringStatusUpdate = async () => {
    await updateHiringStatusFn(!singleJob?.isOpen);
    if (isLoaded) getSingleJobFn();
  };

  if (!isLoaded || singleJobLoading) {
    return <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />;
  }

  if (!singleJob) return <div>Job not found</div>; //TODO: implement a wait before doing this

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col-reverse gap-4 sm:flex-row justify-between items-center py-4">
        <h1 className="text-4xl sm:text-6xl text-center sm:text-start font-extrabold gradient gradient-title tracking-tighter">
          {singleJob.title}
        </h1>
        <img
          src={singleJob?.company?.logo_url}
          className="h-8 sm:h-12"
          alt="company logo"
        />
      </header>
      <section className="flex flex-col gap-4 sm:flex-row justify-around sm:justify-between sm:items-center">
        <div className="flex gap-2">
          <MapPinIcon className="" />
          {singleJob.location}
        </div>
        <div className="flex gap-2">
          <Briefcase />
          {singleJob?.applications.length} applicants
        </div>
        <div className="flex gap-2">
          {singleJob.isOpen ? (
            <>
              <DoorOpen /> {"Open"}
            </>
          ) : (
            <>
              <DoorClosed /> {"Closed"}
            </>
          )}
        </div>
      </section>

      {/* hiring status (can only be seen and updated by recruiters on the jobs they have posted) */}
      {updateHiringStatusLoading && (
        <BarLoader color="#36d7b7" width={"100%"} className="mb-2" />
      )}
      {user.id === singleJob.recruiter_id && (
        <Select onValueChange={handleHiringStatusUpdate}>
          <SelectTrigger
            className={`${singleJob.isOpen ? "bg-green-950" : "bg-red-950"}`}
          >
            <SelectValue
              placeholder={`Hiring Status ( ${
                singleJob.isOpen ? "Open" : "Closed"
              } )`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="close">Close</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      <content className="flex flex-col gap-8">
        <description>
          <h3 className="text-3xl font-bold mb-8">About the job</h3>
          <p className="text-lg">{singleJob.description}</p>
        </description>
        <section>
          <h3 className="text-3xl font-bold mb-8">
            What are we looking for...
          </h3>
          <MDEditor.Markdown
            source={singleJob.requirements}
            className="singleJobPageRequirements sm:text-lg"
          />
        </section>
      </content>
      <footer className="mb-8">
        {user.unsafeMetadata?.role !== "recruiter" && (
          <ApplyJobDrawer
            job={singleJob}
            user={user}
            fetchJob={getSingleJobFn}
            hasApplied={singleJob.applications?.find(
              (ap) => ap.candidate_id === user.id
            )}
          />
        )}
        {singleJob.applications?.length > 0 &&
          user.id === singleJob.recruiter_id && (
            <div className="flex flex-col gap-2">
              <h2 className="font-bold mb-4 text-xl ml-1">Applicants</h2>
              {singleJob.applications.map((application) => (
                <ApplicantCard key={application.id} application={application} />
              ))}
            </div>
          )}
      </footer>
    </div>
  );
};

export default SingleJobPage;
