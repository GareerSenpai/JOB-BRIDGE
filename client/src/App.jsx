import { lazy, Suspense } from "react";
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

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/jobs?",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<BarLoader color="#36d7b7" width={"100%"} />}>
              <JobListing />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/job/:id",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<BarLoader color="#36d7b7" width={"100%"} />}>
              <SingleJobPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/onboarding",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<BarLoader color="#36d7b7" width={"100%"} />}>
              <Onboarding />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/post-job",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<BarLoader color="#36d7b7" width={"100%"} />}>
              <PostJob />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/saved-jobs",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<BarLoader color="#36d7b7" width={"100%"} />}>
              <SavedJobs />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-jobs",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<BarLoader color="#36d7b7" width={"100%"} />}>
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
