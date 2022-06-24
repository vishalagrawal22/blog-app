export async function createComment(
  setErrors,
  user,
  postId,
  comment,
  navigate
) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (user) {
    headers.Authorization = `Bearer ${user.accessToken}`;
  }

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/posts/${postId}/comments`,
      {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify(comment),
      }
    );

    if (response.ok) {
      navigate(0);
    } else {
      const { errors } = await response.json();
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

export async function updateComment(setErrors, user, comment, navigate) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (user) {
    headers.Authorization = `Bearer ${user.accessToken}`;
  }

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/comments/${comment.id}`,
      {
        method: "PUT",
        credentials: "include",
        headers,
        body: JSON.stringify(comment),
      }
    );

    if (response.ok) {
      navigate(0);
    } else {
      const { errors } = await response.json();
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

export async function deleteComment(setError, user, comment, navigate) {
  const headers = {};

  if (user) {
    headers.Authorization = `Bearer ${user.accessToken}`;
  }

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/comments/${comment.id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers,
      }
    );

    if (response.ok) {
      navigate(0);
    } else {
      const err = await response.json();
      setError(err);
    }
  } catch (err) {
    setError(err);
  }
}
