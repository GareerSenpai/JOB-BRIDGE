import React, { useEffect, useState } from "react";
import { getJobs, saveJob } from "../api/apiJobs.js";
import { useSession, useUser } from "@clerk/clerk-react";
import { Input } from "../components/ui/input.jsx";
import { Button } from "../components/ui/button.jsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarLoader, ClipLoader } from "react-spinners";
import JobCard from "@/components/JobCard.jsx";
import useFetch from "@/hooks/useFetch.js";
import { getCompanies } from "@/api/apiCompanies.js";
import { State } from "country-state-city";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");

  const { isLoaded } = useUser();

  const {
    fn: jobFn,
    data: jobs,
    loading: jobLoading,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  const {
    fn: companyFn,
    data: companies,
    loading: companyLoading,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) jobFn();
  }, [isLoaded, searchQuery, location, company_id]);

  useEffect(() => {
    if (isLoaded) companyFn();
  }, [isLoaded]);

  const handleSearch = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    const query = formData.get("search-query");

    if (query != undefined) {
      setSearchQuery(query);
    }
  };

  const handleClearFilter = () => {
    setSearchQuery("");
    setLocation("");
    setCompany_id("");
  };

  if (!isLoaded) {
    return <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />;
  }

  console.log(jobs);
  return (
    <div>
      <h2 className="text-center text-6xl sm:text-7xl font-extrabold gradient gradient-title mb-8">
        Latest Jobs
      </h2>

      <section className="mb-8">
        {/* search and filter */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 w-full h-14 mb-3 "
        >
          <Input
            type="text"
            placeholder="Search Jobs By Title..."
            name="search-query"
            className="flex-1 h-full text-1xl px-4"
          />
          <Button type="submit" variant="blue" className="h-full sm:w-28">
            Search
          </Button>
        </form>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Select
            value={location}
            onValueChange={(value) => setLocation(value)}
          >
            <SelectTrigger className="px-4 select-none">
              <SelectValue placeholder="Filter By Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {State.getStatesOfCountry("IN").map((state) => (
                  <SelectItem
                    key={state.isoCode}
                    value={state.name}
                    className="hover:cursor-pointer"
                  >
                    {state.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={company_id}
            onValueChange={(value) => setCompany_id(value)}
          >
            <SelectTrigger className="px-4 select-none">
              <SelectValue placeholder="Filter By Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {companies?.map((company) => (
                  <SelectItem
                    key={company.id}
                    value={company.id}
                    className="hover:cursor-pointer"
                  >
                    {company.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant="destructive"
            className="w-full sm:w-1/2"
            onClick={handleClearFilter}
          >
            Clear Filters
          </Button>
        </div>
      </section>

      {/* display jobs */}
      {jobLoading && (
        <div className="flex justify-center items-center">
          <ClipLoader color="#36d7b7" className="mb-4" />
        </div>
      )}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {jobs?.map((job) => (
          <JobCard key={job.id} job={job} savedInit={job?.saved?.length > 0} />
        ))}
      </section>

      {/* pagination */}
    </div>
  );
};

export default JobListing;
