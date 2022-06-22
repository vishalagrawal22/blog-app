import { useState, useEffect } from "react";
import { useUser } from "./auth";

export function useComments(url) {
  const { user, isLoading: userLoading } = useUser();
  const [comments, setComments] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const headers = {};
      if (user) {
        headers.Authorization = `Bearer ${user.accessToken}`;
      }

      try {
        const response = await fetch(url, {
          credentials: "include",
          headers,
        });

        const data = await response.json();
        if (response.ok) {
          const { comments } = data;
          setComments(comments);
        } else {
          setError(data);
        }
      } catch (err) {
        console.error("Network error: ", err);
        setError(err);
      }
      setIsLoading(false);
    }

    if (!userLoading) {
      fetchData();
    }
  }, [url, user, userLoading]);

  return {
    comments,
    error,
    isLoading,
  };
}
