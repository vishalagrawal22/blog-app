import { useState, useEffect } from "react";

export function useUser(userId) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/${userId}`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const user = await response.json();
          setUser(user);
        } else {
          const err = await response.json();
          setError(err);
        }
      } catch (err) {
        console.error("Network error: ", err);
        setError(err);
      }
      setIsLoading(false);
    }

    fetchData();
  }, [userId]);

  return {
    user,
    error,
    isLoading,
  };
}
