import { useState, useEffect } from "react";
import { useUser } from "./auth";

export function usePosts(url) {
  const { user } = useUser();
  const [posts, setPosts] = useState(null);
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
          const { posts } = data;
          setPosts(posts);
        } else {
          setError(data);
        }
      } catch (err) {
        console.error("Network error: ", err);
        setError(err);
      }
      setIsLoading(false);
    }

    fetchData();
  }, [url, user]);

  return {
    posts,
    error,
    isLoading,
  };
}
