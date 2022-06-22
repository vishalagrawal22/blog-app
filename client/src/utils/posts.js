export async function createPost(setErrors, user, post, navigate) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (user) {
    headers.Authorization = `Bearer ${user.accessToken}`;
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify(post),
    });

    const data = await response.json();
    if (response.ok) {
      const { url } = data;
      navigate(url);
    } else {
      const { errors } = data;
      setErrors(errors);
    }
  } catch (err) {
    setErrors([
      {
        message: err.message,
      },
    ]);
  }
}

export async function deletePost(setError, user, post, onSuccess) {
  const headers = {};

  if (user) {
    headers.Authorization = `Bearer ${user.accessToken}`;
  }

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/posts/${post.id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers,
      }
    );

    if (response.ok) {
      if (onSuccess) {
        onSuccess();
      }
    } else {
      const err = await response.json();
      setError(err);
    }
  } catch (err) {
    setError(err);
  }
}

export async function updatePost(setErrors, user, post, navigate) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (user) {
    headers.Authorization = `Bearer ${user.accessToken}`;
  }

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/posts/${post.id}`,
      {
        method: "PUT",
        credentials: "include",
        headers,
        body: JSON.stringify(post),
      }
    );

    const data = await response.json();
    if (response.ok) {
      const { url } = data;
      navigate(url);
    } else {
      const { errors } = data;
      setErrors(errors);
    }
  } catch (err) {
    setErrors([
      {
        message: err.message,
      },
    ]);
  }
}
