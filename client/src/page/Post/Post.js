import { useContext } from "react";
import { useParams } from "react-router-dom";

import CommentForm from "../../components/CommentForm";
import CommentList from "../../components/CommentList";

import PostItem from "../../components/PostItem";
import { useComments } from "../../hooks/comments";
import { usePost } from "../../hooks/posts";
import UserContext from "../../UserContext";

export default function Post() {
  const { user } = useContext(UserContext);
  const { postId } = useParams();
  const { post, isLoading: postLoading, error: postError } = usePost(postId);
  const {
    comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useComments(`${process.env.REACT_APP_API_URL}/posts/${postId}/comments`);
  if (postLoading || commentsLoading) {
    return <div className="m-3">loading...</div>;
  } else if (postError || commentsError) {
    return (
      <div className="m-3">
        {postError.message ||
          postError.msg ||
          commentsError.message ||
          commentsError.msg}
      </div>
    );
  } else {
    return (
      <div className="d-flex flex-column align-items-center">
        <div className="w-75">
          <PostItem post={post} />
        </div>
        <h3 className="d-inline-block mt-5">Comments</h3>
        {user && (
          <div className="w-75">
            <CommentForm postId={postId} />
          </div>
        )}
        <div className="w-75">
          <CommentList comments={comments} />
        </div>
      </div>
    );
  }
}
