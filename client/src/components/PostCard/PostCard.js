import { useContext } from "react";
import UserContext from "../../UserContext";

import updatePostImageSrc from "../../images/update.svg";
import deletePostImageSrc from "../../images/delete.svg";
import { useNavigate } from "react-router-dom";
import { deletePost } from "../../utils/posts";

function getShortDescription(description) {
  let spaceIndex = description.indexOf(" ", 100);
  if (description.length <= 100 || spaceIndex === -1) {
    return description;
  } else {
    const shortDescription = description.substr(0, spaceIndex);
    if (shortDescription.endsWith(".")) {
      return shortDescription + "..";
    } else {
      return shortDescription + "...";
    }
  }
}

function PostActionButtons({ post }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <div
      className="mb-1 d-flex justify-content-end"
      style={{ height: "1.5rem" }}>
      {user && user.id === post.author.id && (
        <>
          <img
            src={updatePostImageSrc}
            alt="update post"
            className="me-3 h-100"
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
                  window.location.reload();
                }
              );
            }}
          />
        </>
      )}
    </div>
  );
}

export default function PostCard({ post }) {
  return (
    <div className="card m-3 pb-4" style={{ width: "20rem", height: "22rem" }}>
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <PostActionButtons post={post} />
          <h5 className="card-title">{post.title}</h5>
          <div className="d-flex justify-content-between">
            <h6 className="card-subtitle mb-2 text-muted">
              {post.author.name}
            </h6>
            <h6 className="card-subtitle mb-2 text-muted">{post.createdAt}</h6>
          </div>
        </div>
        <p className="card-text mt-2">
          {getShortDescription(post.description)}
        </p>
        <div className="d-flex justify-content-center align-items-center">
          <a href={post.author.url} className="card-link">
            View author
          </a>
          <a href={post.url} className="card-link">
            View post
          </a>
        </div>
      </div>
    </div>
  );
}
