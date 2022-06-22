import { useState, useEffect, useContext } from "react";
import UserContext from "../UserContext";

export function usePosts(url) {
  const { user, isLoading: userLoading } = useContext(UserContext);
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

    if (!userLoading) {
      fetchData();
    }
  }, [url, user, userLoading]);

  return {
    posts,
    error,
    isLoading,
  };
}

export function usePost(postId) {
  const { user, isLoading: userLoading } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const headers = {};
      if (user) {
        headers.Authorization = `Bearer ${user.accessToken}`;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/posts/${postId}`,
          {
            credentials: "include",
            headers,
          }
        );

        const data = await response.json();
        if (response.ok) {
          const { post } = data;
          setPost(post);
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
  }, [postId, user, userLoading]);

  return {
    post,
    error,
    isLoading,
  };
}
