import { useParams } from "react-router-dom";

import UserDetail from "../../components/UserDetail";
import PostCardList from "../../components/PostCardList";
import CommentList from "../../components/CommentList";

import { useUser } from "../../hooks/users";
import { usePosts } from "../../hooks/posts";
import { useComments } from "../../hooks/comments";

export default function User() {
  const { userId } = useParams();
  const { user, isLoading: userLoading, error: userError } = useUser(userId);
  const {
    posts,
    isLoading: postsLoading,
    error: postsError,
  } = usePosts(`${process.env.REACT_APP_API_URL}/users/${userId}/posts`);
  const {
    comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useComments(`${process.env.REACT_APP_API_URL}/users/${userId}/comments`);

  if (user && posts && comments) {
    return (
      <div className="d-flex flex-column align-items-center">
        <UserDetail user={user} />
        <h3>Posts</h3>
        <PostCardList posts={posts} />
        <h3>Comments</h3>
        <div className="w-75">
          <CommentList comments={comments} />
        </div>
      </div>
    );
  } else if (userLoading || postsLoading || commentsLoading) {
    return <div className="m-3">loading...</div>;
  } else {
    return (
      <div className="m-3">
        {userError.message ||
          userError.msg ||
          postsError.message ||
          postsError.msg ||
          commentsError.message ||
          commentsError.msg}
      </div>
    );
  }
}
