import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import UserContext from "../../UserContext";

import updatePostImageSrc from "../../images/update.svg";
import deletePostImageSrc from "../../images/delete.svg";

import { deletePost } from "../../utils/posts";

function getShortDescription(description) {
  let newLineIndex = description.indexOf("\n");
  if (newLineIndex === -1) {
    return description;
  } else {
    const shortDescription = description.substr(0, newLineIndex);
    return shortDescription;
  }
}

function PostActionButtons({ post }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <>
      {user && user.id === (post.author.id || post.author) && (
        <>
          <img
            src={updatePostImageSrc}
            alt="update post"
            className="me-3 h-100 ms-auto"
            onClick={() => {
              navigate(`/posts/${post.id}/update`);
            }}
          />
          <img
            src={deletePostImageSrc}
            alt="delete post"
            className="h-100"
            onClick={() => {
              deletePost(
                (err) => {
                  alert(err.message || err.msg);
                },
                user,
                post,
                () => {
                  navigate(0);
                }
              );
            }}
          />
        </>
      )}
    </>
  );
}

export default function PostCard({ post }) {
  return (
    <div className="card m-3 pb-4" style={{ width: "25rem" }}>
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <div className="mb-1 d-flex" style={{ height: "1.5rem" }}>
            {!post.published && <h5 className="text-info">Private post</h5>}
            <PostActionButtons post={post} />
          </div>
          <h5 className="card-title">{post.title}</h5>
          <div className="d-flex justify-content-between">
            {post.author.name && (
              <h6 className="card-subtitle mb-2 text-muted">
                {post.author.name}
              </h6>
            )}
            <h6 className="card-subtitle mb-2 text-muted">{post.createdAt}</h6>
          </div>
        </div>
        <div
          className="card-text mt-2"
          style={{ height: "10rem", overflow: "auto" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {getShortDescription(post.description)}
          </ReactMarkdown>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-3">
          {post.author.name && (
            <Link to={post.author.url} className="card-link">
              View author
            </Link>
          )}
          <Link to={post.url} className="card-link">
            View post
          </Link>
        </div>
      </div>
    </div>
  );
}
