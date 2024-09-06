import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/useFetch";
import { addCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import FileInput from "./ui/file-input";

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const [isOpen, setIsOpen] = useState(false);

  const schema = z.object({
    name: z.string().min(1, { message: "Company name is required" }),
    logo: z
      .any()
      .refine((file) => file && file.type, {
        message: "Logo is required",
      })
      .refine(
        (file) =>
          file &&
          file.type &&
          (file.type === "image/png" ||
            file.type === "image/jpeg" ||
            file.type === "image/webp" ||
            file.type === "image/svg+xml"),
        {
          message: "Logo can only be of type PNG, JPG, WEBP or SVG",
        }
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    fn: fnAddCompany,
    data: dataAddCompany,
    error: errorAddCompany,
    loading: loadingAddCompany,
  } = useFetch(addCompany);

  const onSubmit = (data) => {
    fnAddCompany({
      ...data,
      logo: data.logo[0],
    });

    reset();
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
      setIsOpen(false);
    }
  }, [loadingAddCompany]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="destructive" size="lg" className="w-full sm:w-1/4">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="px-2">Add a new company</DrawerTitle>
        </DrawerHeader>
        <form className="flex flex-col sm:flex-row gap-3 px-4">
          <div className="w-full">
            <Input placeholder="Company Name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 mt-2 px-2">{errors.name.message}</p>
            )}
          </div>
          <div className="w-full">
            <Controller
              control={control}
              name="logo"
              render={({ field }) => (
                <FileInput
                  accept={"image/*"}
                  placeholder="Upload Company Logo"
                  onChange={(file) => field.onChange(file)}
                  value={field.value}
                />
              )}
            />
            {errors.logo && (
              <p className="text-red-500 mt-2 px-2">{errors.logo.message}</p>
            )}
          </div>

          <Button
            type="button"
            variant="destructive"
            className="w-full sm:w-52"
            onClick={handleSubmit(onSubmit)}
          >
            Add
          </Button>
        </form>

        <DrawerFooter asChild>
          {loadingAddCompany && <BarLoader color="#36d7b7" width={"100%"} />}
          {errorAddCompany?.message && (
            <p className="text-red-500">{errorAddCompany.message}</p>
          )}
          <DrawerClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
