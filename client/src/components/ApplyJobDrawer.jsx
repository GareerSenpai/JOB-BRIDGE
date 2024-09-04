import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BarLoader } from "react-spinners";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import useFetch from "@/hooks/useFetch";
import { applyForJob } from "@/api/apiApplications";
import FileInput from "./ui/file-input";

const ApplyJobDrawer = ({ job, hasApplied = false, user, fetchJob }) => {
  const schema = z.object({
    experience: z
      .number()
      .min(0, { message: "Experience must be atleast 0" })
      .int(),
    skills: z.string().min(1, { message: "Atleast one skill is required" }),
    education: z.enum(["intermediate", "graduate", "postgraduate"], {
      message: "Education is required",
    }),
    resume: z
      .any()
      .refine((file) => file, {
        message: "Resume is required",
      })
      .refine(
        (file) =>
          file &&
          file.type &&
          (file.type === "application/pdf" ||
            file.type === "application/msword"),
        {
          message: "Resume can only be of type PDF or DOC",
        }
      ),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    fn: applyForJobFn,
    data: applicationData,
    error: applyError,
    loading: applyLoading,
  } = useFetch(applyForJob);

  const onSubmit = (data) => {
    applyForJobFn({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      status: "applied",
      resume: data.resume[0],
    }).then(() => {
      fetchJob();
      reset();
    });
  };
  return (
    <>
      <Drawer open={hasApplied ? false : undefined}>
        <DrawerTrigger asChild>
          <Button
            variant={job.isOpen && !hasApplied ? "blue" : "destructive"}
            size="lg"
            disabled={!job?.isOpen || hasApplied}
            className="w-full"
          >
            {job.isOpen ? (hasApplied ? "Applied" : "Apply") : "Hiring Closed"}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Apply for {job.title} at {job.company?.name}
            </DrawerTitle>
            <DrawerDescription>Please fill the form below.</DrawerDescription>
          </DrawerHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 px-4"
          >
            <Input
              {...register("experience", {
                valueAsNumber: true,
              })}
              type="number"
              autoComplete="off"
              placeholder="Years of Experience"
            />
            {errors.experience && (
              <p className="text-red-500">{errors.experience.message}</p>
            )}

            <Input
              {...register("skills")}
              placeholder="Skills (comma separated)"
            />
            {errors.skills && (
              <p className="text-red-500">{errors.skills.message}</p>
            )}

            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} {...field}>
                  <Label htmlFor="education" className="mb-2">
                    Education:
                  </Label>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="r1" />
                    <Label htmlFor="r1">Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="graduate" id="r2" />
                    <Label htmlFor="r2">Graduate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="postgraduate" id="r3" />
                    <Label htmlFor="r3">Post Graduate</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.education && (
              <p className="text-red-500">{errors.education.message}</p>
            )}

            <Controller
              name="resume"
              control={control}
              render={({ field }) => (
                <FileInput
                  accept=".pdf, .doc, .docx"
                  placeholder="Upload Resume"
                  onChange={(file) => {
                    field.onChange(file);
                  }}
                  value={field.value}
                />
              )}
            />
            {errors.resume && (
              <p className="text-red-500">{errors.resume.message}</p>
            )}

            {applyError?.message && (
              <p className="text-red-500">{applyError.message}</p>
            )}

            {applyLoading && <BarLoader width={"100%"} color="#36d7b7" />}
            <Button
              type="submit"
              variant="blue"
              size="lg"
              className="w-full"
              disabled={applyLoading}
            >
              Apply
            </Button>
          </form>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="destructive" size="lg">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ApplyJobDrawer;
