import React, { useEffect, useState } from "react";
import { getJobs } from "../api/apiJobs.js";
import { useUser } from "@clerk/clerk-react";
import { Input } from "../components/ui/input.jsx";
import { Button } from "../components/ui/button.jsx";
import { BarLoader, ClipLoader } from "react-spinners";
import JobCard from "@/components/JobCard.jsx";
import useFetch from "@/hooks/useFetch.js";
import { getCompanies } from "@/api/apiCompanies.js";
import { State } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label.jsx";
import { Link } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce.js";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [activePage, setActivePage] = useState(1);

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
  }, [isLoaded, debouncedSearchQuery, location, company_id]);

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

  const totalJobs = jobs?.length;
  const jobsPerPage = 6;
  const totalPages = totalJobs ? Math.ceil(totalJobs / jobsPerPage) : 0;
  const firstJobIndex = (activePage - 1) * jobsPerPage;
  const lastJobIndex = activePage * jobsPerPage - 1;

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
        <div
          onSubmit={handleSearch}
          className="flex items-center gap-2 w-full h-14 mb-3"
          id="SEARCH_AND_FILTER"
        >
          <Input
            type="text"
            placeholder="Search Jobs By Title..."
            name="search-query"
            className="flex-1 h-full text-1xl px-4"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* <Button type="submit" variant="blue" className="h-full sm:w-28">
            Search
          </Button> */}
        </div>
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

      {!jobLoading && totalJobs === 0 && <div>No results found</div>}

      <section
        id="jobs"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        {jobs?.slice(firstJobIndex, lastJobIndex + 1).map((job) => (
          <JobCard key={job.id} job={job} savedInit={job?.saved?.length > 0} />
        ))}
      </section>

      {/* pagination */}
      {!jobLoading && totalJobs > 0 && (
        <Pagination className={"mb-8"}>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#SEARCH_AND_FILTER"
                onClick={() => setActivePage(Math.max(activePage - 1, 1))}
                className={
                  activePage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => setActivePage(1)}
                isActive={activePage === 1}
                href="#SEARCH_AND_FILTER"
              >
                1
              </PaginationLink>
            </PaginationItem>

            {activePage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {[...Array(3)].map((_, index) => {
              const page = activePage + (index - 1);
              return (
                page > 1 &&
                page < totalPages && (
                  <PaginationItem>
                    <PaginationLink
                      key={page}
                      onClick={() => setActivePage(page)}
                      isActive={activePage === page}
                      href="#SEARCH_AND_FILTER"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              );
            })}

            {activePage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink
                onClick={() => setActivePage(totalPages)}
                isActive={activePage === totalPages}
                href="#SEARCH_AND_FILTER"
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#SEARCH_AND_FILTER"
                onClick={() =>
                  setActivePage(Math.min(activePage + 1, totalPages))
                }
                className={
                  activePage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      {!jobLoading && totalJobs > 0 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const page = parseInt(formData.get("jump-to-page"));

            if (!isNaN(page)) {
              setActivePage(Math.min(Math.max(page, 1), totalPages));
              document
                .getElementById("SEARCH_AND_FILTER")
                .scrollIntoView({ behavior: "smooth" });
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
