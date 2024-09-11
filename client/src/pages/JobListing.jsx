import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { getJobs } from "../api/apiJobs.js";
import { useUser } from "@clerk/clerk-react";
import { Input } from "../components/ui/input.jsx";
import { Button } from "../components/ui/button.jsx";
import { BarLoader } from "react-spinners";

import useFetch from "@/hooks/useFetch.js";
import { getCompanies } from "@/api/apiCompanies.js";
import States from "../data/locations.json";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label.jsx";
import useDebounce from "@/hooks/useDebounce.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import PaginationComponent from "@/components/PaginationComponent.jsx";
import { useSearchParams } from "react-router-dom";

const JobCard = lazy(() => import("../components/JobCard.jsx"));

const JobListing = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    q: "",
    location: "",
    company_id: "",
  });

  const location = searchParams.get("location");
  const company_id = searchParams.get("company_id");
  const query = searchParams.get("q");
  const activePage = Math.floor(Number(searchParams.get("page"))) || 1;
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const searchAndFilterRef = useRef(null);

  const { isLoaded } = useUser();

  const {
    fn: jobFn,
    data: jobsData,
    loading: jobLoading,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
    page: activePage,
    limit: 1,
  });

  const {
    fn: companyFn,
    data: companies,
    loading: companyLoading,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) jobFn();
  }, [isLoaded, location, company_id, query, activePage]);

  useEffect(() => {
    if (isLoaded) companyFn();
  }, [isLoaded]);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        prev.set("page", 1);
        prev.set("q", debouncedSearchQuery);
        return prev;
      },
      {
        replace: true,
      }
    );
  }, [debouncedSearchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    const query = formData.get("search-query");

    if (query != undefined) {
      setSearchQuery(query);
    }
  };

  const handleLocationChange = (value) => {
    setSearchParams(
      (prev) => {
        prev.set("location", value);
        prev.set("page", 1);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  const handleCompanyChange = (value) => {
    setSearchParams(
      (prev) => {
        prev.set("company_id", value);
        prev.set("page", 1);
        return prev;
      },
      {
        replace: true,
      }
    );
  };

  const handleClearFilter = () => {
    setSearchQuery("");
    setSearchParams({ page: 1, q: "", location: "", company_id: "" });
  };

  const handlePageChange = (page) => {
    setSearchParams((prev) => {
      prev.set("page", page);
      return prev;
    });
  };

  const jobs = jobsData?.jobs;
  const totalJobs = jobsData?.totalCount;
  const jobsPerPage = 1;
  const totalPages = totalJobs ? Math.ceil(totalJobs / jobsPerPage) : 0;
  const firstJobIndex = (activePage - 1) * jobsPerPage;
  const lastJobIndex = activePage * jobsPerPage - 1;

  if (!isLoaded) {
    return <BarLoader color="#36d7b7" width={"100%"} className="mb-4" />;
  }

  // console.log(jobs);
  return (
    <div>
      <h2 className="text-center text-5xl xs:text-6xl sm:text-7xl font-extrabold gradient gradient-title mb-8 mt-4">
        Latest Jobs
      </h2>

      <section className="mb-8">
        {/* search and filter */}
        <div
          onSubmit={handleSearch}
          className="flex items-center gap-2 w-full h-14 mb-3"
          id="SEARCH_AND_FILTER"
          ref={searchAndFilterRef}
        >
          <Input
            type="text"
            placeholder="Search Jobs By Title..."
            name="search-query"
            className="flex-1 h-full text-1xl px-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* <Button type="submit" variant="blue" className="h-full sm:w-28">
            Search
          </Button> */}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Select
            value={location}
            onValueChange={(value) => handleLocationChange(value)}
          >
            <SelectTrigger className="px-4 select-none">
              <SelectValue placeholder="Filter By Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {States.map((state) => (
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
          <Select onValueChange={(value) => handleCompanyChange(value)}>
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

      {!jobLoading && totalJobs === 0 && <div>No results found</div>}

      <section
        id="jobs"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        {jobLoading && (
          <>
            {[...Array(jobsPerPage)].map((_, index) => (
              <Skeleton key={index} className="w-full h-[250px]" />
            ))}
          </>
        )}
        {!jobLoading &&
          jobs?.map((job) => (
            <Suspense
              key={job.id}
              fallback={<Skeleton className="w-full h-[250px]" />}
            >
              <JobCard
                key={job.id}
                job={job}
                savedInit={job?.saved?.length > 0}
              />
            </Suspense>
          ))}
      </section>

      {/* pagination */}
      {!jobLoading && totalJobs > 0 && (
        <PaginationComponent
          activePage={activePage}
          totalPages={totalPages}
          href="#SEARCH_AND_FILTER"
          onPageChange={handlePageChange}
        />
      )}
      {!jobLoading && totalJobs > 0 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const page = parseInt(formData.get("jump-to-page"));

            if (!isNaN(page)) {
              handlePageChange(Math.min(Math.max(page, 1), totalPages));
              searchAndFilterRef.current?.scrollIntoView({
                behavior: "smooth",
              });
            }
          }}
          className="flex justify-center items-center gap-4 mb-8"
        >
          <Label className="text-base">Go to Page: </Label>
          <Input
            type="number"
            name="jump-to-page"
            className="w-14 appearance-none"
            autoComplete="off"
          />
          <Button type="submit" variant="secondary">
            Go
          </Button>
        </form>
      )}
    </div>
  );
};

export default JobListing;
