import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserContext from "../../UserContext";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addAccessToken } = useContext(UserContext);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (response.ok) {
        const { accessToken } = await response.json();
        addAccessToken(accessToken);
        navigate("/");
      } else {
        const err = await response.json();
        setError(err);
      }
    } catch (err) {
      setError(err);
    }
  }

  return (
    <section className="flex-grow-1 d-flex justify-content-center align-items-center">
      <form style={{ width: "20rem" }} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            required
          />
        </div>
        <button type="submit" className="mx-auto w-50 d-block btn btn-primary">
          Submit
        </button>
        {error && (
          <div className="d-flex justify-content-center pt-3 text-danger">
            {error.message}
          </div>
        )}
      </form>
    </section>
  );
}
