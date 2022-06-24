import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import UserContext from "../../UserContext";
import { deletePost } from "../../utils/posts";

export default function PostItem({ post }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="flex-grow-1 p-3 d-flex flex-column align-items-center">
      {!post.published && <h5 className="text-info">Private post</h5>}
      <h2 className="mb-3">{post.title}</h2>
      <h5 className="text-secondary mb-5">
        By{" "}
        <Link to={post.author.url} className="text-black">
          {post.author.name}
        </Link>
        (Posted on {post.createdAt})
      </h5>
      <div className="w-100 img-match-container">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.description}
        </ReactMarkdown>
      </div>
      {user && user.id === (post.author.id || post.author) && (
        <div className="d-flex mt-3">
          <button
            className="btn btn-primary me-3"
            onClick={() => {
              navigate(`/posts/${post.id}/update`);
            }}>
            Edit Post
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              deletePost(
                (err) => {
                  alert(err.message || err.msg);
                },
                user,
                post,
                () => {
                  navigate(`/users/${user.id}`);
                }
              );
            }}>
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
}
