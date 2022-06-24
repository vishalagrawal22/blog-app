import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createComment, updateComment } from "../../utils/comments";
import UserContext from "../../UserContext";

export default function CommentForm({
  postId,
  comment,
  action = "add",
  setEditMode,
}) {
  const { user } = useContext(UserContext);
  const [text, setText] = useState(comment?.text || "");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    const currentComment = {
      text,
    };

    if (action === "add") {
      createComment(setErrors, user, postId, currentComment, navigate);
    } else {
      if (comment?.id) {
        currentComment.id = comment.id;
      }

      updateComment(setErrors, user, currentComment, navigate);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex flex-column align-items-center w-100 mb-3">
      <textarea
        className="form-control mb-3"
        id="comment"
        style={{ height: "120px" }}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
        }}
        required></textarea>
      <div>
        <button type="submit" className="btn btn-primary">
          {action === "add" ? "Add comment" : "Update comment"}
        </button>
        {action === "edit" && (
          <button
            className="btn btn-secondary ms-3"
            onClick={() => {
              setEditMode(false);
            }}>
            Cancel
          </button>
        )}
      </div>
      {errors.length > 0 && (
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error.message || error.msg}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
