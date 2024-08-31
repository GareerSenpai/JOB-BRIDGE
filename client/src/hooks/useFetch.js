import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { session } = useSession();

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const supabaseAccessToken = await session.getToken({
        template: "supabase",
      });

      const response = await cb(supabaseAccessToken, options, ...args);
      setData(response);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);

      console.log("Error while fetching data: ", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { fn, data, error, loading };
};

export default useFetch;
