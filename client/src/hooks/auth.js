import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function addAccessToken(accessToken) {
    const { userName, userId } = jwtDecode(accessToken);
    setUser({
      id: userId,
      name: userName,
      accessToken,
    });
  }

  function clearAccessToken() {
    setUser(null);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const url = `${process.env.REACT_APP_API_BASE_URL}/token`;
        const response = await fetch(url, {
          method: "POST",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          const { accessToken } = data;
          addAccessToken(accessToken);
        }
      } catch (err) {
        console.error("Network error: ", err);
      }
      setIsLoading(false);
    }

    fetchData();
  }, []);

  return {
    user,
    isLoading,
    addAccessToken,
    clearAccessToken,
  };
}
