import { useContext, useState } from "react";

import updatePostImageSrc from "../../images/update.svg";
import deletePostImageSrc from "../../images/delete.svg";
import UserContext from "../../UserContext";
import CommentForm from "../CommentForm";
import { deleteComment } from "../../utils/comments";

function CommentActionButtons({ comment, setEditMode }) {
  const { user } = useContext(UserContext);
  return (
    <div
      className="mb-1 d-flex justify-content-end"
      style={{ height: "1.5rem" }}>
      {user && user.id === comment.author.id && (
        <>
          <img
            src={updatePostImageSrc}
            alt="update post"
            className="me-3 h-100"
            onClick={() => {
              setEditMode(true);
            }}
          />
          <img
            src={deletePostImageSrc}
            alt="delete post"
            className="h-100"
            onClick={() => {
              deleteComment(
                (err) => {
                  alert(err);
                },
                user,
                comment
              );
            }}
          />
        </>
      )}
    </div>
  );
}

export default function CommentItem({ comment }) {
  const [editMode, setEditMode] = useState(false);

  if (editMode) {
    return (
      <CommentForm comment={comment} action="edit" setEditMode={setEditMode} />
    );
  } else {
    return (
      <div className="card my-3 w-100">
        <div className="card-header">
          <CommentActionButtons comment={comment} setEditMode={setEditMode} />
          <h5>
            {comment.post.title && (
              <a className="text-black" href={comment.post.url}>
                {comment.post.title}
              </a>
            )}
          </h5>
          <h5>
            {comment.author.name && (
              <a className="text-black" href={comment.author.url}>
                {comment.author.name}
              </a>
            )}
          </h5>
          <h6>{comment.createdAt}</h6>
        </div>
        <div className="card-body">
          <p>{comment.text}</p>
        </div>
      </div>
    );
  }
}
