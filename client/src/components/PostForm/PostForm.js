import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import UserContext from "../../UserContext";

export default function PostForm({ post, onSubmit }) {
  const { user } = useContext(UserContext);
  const [status, setStatus] = useState("write");
  const [title, setTitle] = useState(post?.title || "");
  const [description, setDescription] = useState(post?.description || "");
  const [published, setPublished] = useState(post?.published ? true : false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const currentPost = {
      title,
      published,
    };

    if (description !== "") {
      currentPost.description = description;
    }

    if (post?.id) {
      currentPost.id = post.id;
    }

    onSubmit(setErrors, user, currentPost, navigate);
  }

  return (
    <section className="flex-grow-1 d-flex justify-content-center align-items-center">
      <form
        className="w-50"
        style={{ minWidth: "20rem" }}
        onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            minLength="1"
            maxLength="100"
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="description"
            className="form-label"
            aria-describedby="description-help">
            Description
          </label>
          <ul id="description-help" className="form-text">
            <li>Github flavoured markdown(GFM) is supported.</li>
            <li>
              The content before the first newline will be shown in post cards
            </li>
          </ul>
          <ul className="nav nav-pills mt-3 mb-2">
            <li className="nav-item">
              <button
                type="button"
                className={
                  "nav-link " +
                  (status === "write" ? "text-white active" : "text-black")
                }
                onClick={() => {
                  setStatus("write");
                }}>
                Write
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link text-black ${
                  "nav-link " +
                  (status === "preview" ? "text-white active" : "text-black")
                } && "active"`}
                onClick={() => {
                  setStatus("preview");
                }}>
                Preview
              </button>
            </li>
          </ul>
          {status === "write" ? (
            <textarea
              className="form-control"
              style={{ height: "20rem" }}
              id="description"
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              value={description}></textarea>
          ) : (
            <div
              style={{
                height: "20rem",
                backgroundColor: "#fff",
                backgroundClip: "padding-box",
                padding: "0.375rem 0.75rem",
                border: "1px solid #ced4da",
                overflow: "auto",
              }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {description}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <div className="mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="published"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
            />
            <label className="form-check-label" htmlFor="published">
              public
            </label>
          </div>
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
