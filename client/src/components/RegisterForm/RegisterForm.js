import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserContext from "../../UserContext";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const { addAccessToken } = useContext(UserContext);

  async function handleSubmit(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      return setErrors([
        {
          message: "password and confirmation password should match",
        },
      ]);
    }

    const userData = {
      username,
      password,
    };

    if (email !== "") {
      userData.email = email;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/register`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        const { accessToken } = await response.json();
        addAccessToken(accessToken);
        navigate("/");
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
          <label htmlFor="email" className="form-label">
            Email (optional)
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
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
        <div className="mb-3">
          <label htmlFor="confirm-password" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirm-password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
            required
          />
        </div>
        <button type="submit" className="mx-auto w-50 d-block btn btn-primary">
          Submit
        </button>
        {errors.length > 0 && (
          <ul className="pt-3">
            {errors.map((error, index) => (
              <li key={index} className="text-danger">
                {error.message || error.msg}
              </li>
            ))}
          </ul>
        )}
      </form>
    </section>
  );
}
