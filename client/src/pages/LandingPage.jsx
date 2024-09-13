import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button.jsx";
import companies from "../data/companies.json";
import faqs from "../data/faqs.json";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "@/components/ui/card.jsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 md:gap-20 py-10 sm:py-20">
      <section className="text-center">
        <h1 className="flex flex-col leading-tight justify-center items-center gradient gradient-title text-4xl font-extrabold sm:text-6xl lg:text-7xl tracking-tight py-4">
          Talent meets Opportunities{" "}
          <span className="flex gap-2 sm:gap-6 justify-center items-center md:mt-4">
            at{" "}
            <img
              src="/logo.png"
              alt="Job Bridge logo"
              className="h-14 sm:h-24 lg:h-32"
            />
          </span>
        </h1>

        <p className="text-gray-300 sm:mt-4 text sm:text-xl mt-4">
          Explore thousands of job listings or find a perfect candidate
        </p>
      </section>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
        <Link to="/jobs">
          <Button variant="blue" size="xl" className="w-[15rem] sm:w-auto">
            Find Jobs
          </Button>
        </Link>
        <Link to="/post-job">
          <Button
            variant="destructive"
            size="xl"
            className="w-[15rem] sm:w-auto"
          >
            Post Job
          </Button>
        </Link>
      </div>

      {/* {marquee} */}
      <div className="infinite-marquee whitespace-nowrap flex overflow-hidden">
        <div className="wrapper relative">
          <ul className="marquee-1 flex list-none">
            {companies.map(({ path, name, id }) => (
              <li key={id} className="mx-6 lg:mx-10">
                <img
                  src={path}
                  alt={name}
                  className="h-14 min-w-24 sm:h-40 sm:min-w-40 lg:min-w-56 object-contain"
                />
              </li>
            ))}
          </ul>
          <ul className="marquee-2 absolute top-0 flex list-none">
            {companies.map(({ path, name, id }) => (
              <li key={id} className="mx-6 lg:mx-10">
                <img
                  src={path}
                  alt={name}
                  className="h-14 min-w-24 sm:h-40 sm:min-w-40 lg:min-w-56 object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* {banner} */}
      <img src="/banner.png" alt="banner" className="w-full" />

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* {cards} */}
        <Card>
          <CardHeader>
            <CardTitle>For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Search and apply for jobs, track applications, and more.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>For Employeers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Post jobs, manage applications, and find the best candidates.</p>
          </CardContent>
        </Card>
      </section>

      {/* {accordion} */}
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index + 1}`} key={`item-${index + 1}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};

export default LandingPage;
