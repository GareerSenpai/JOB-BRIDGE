import { lazy, Suspense, useState } from "react";
import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import AppLayout from "./layouts/AppLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { BarLoader } from "react-spinners";

const JobListing = lazy(() => import("./pages/JobListing"));
const SingleJobPage = lazy(() => import("./pages/SingleJobPage"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const PostJob = lazy(() => import("./pages/PostJob"));
const SavedJobs = lazy(() => import("./pages/SavedJobs"));
const MyJobs = lazy(() => import("./pages/MyJobs"));

<Suspense fallback={<BarLoader color="#36d7b7" widt h={"100%"} />}></Suspense>;
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/jobs",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<h1>Loading...</h1>}>
              <JobListing />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/job/:id",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<h1>Loading...</h1>}>
              <SingleJobPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/onboarding",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<h1>Loading...</h1>}>
              <Onboarding />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/post-job",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<h1>Loading...</h1>}>
              <PostJob />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/saved-jobs",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<h1>Loading...</h1>}>
              <SavedJobs />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-jobs",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<h1>Loading...</h1>}>
              <MyJobs />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
