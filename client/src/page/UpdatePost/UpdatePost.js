import { useParams } from "react-router-dom";

import PostForm from "../../components/PostForm";
import { usePost } from "../../hooks/posts";
import { updatePost } from "../../utils/posts";

export default function UpdatePost() {
  const { postId } = useParams();
  const { post, isLoading, error } = usePost(postId);
  if (isLoading) {
    return <div className="m-3">loading...</div>;
  } else if (error) {
    return <div className="m-3">{error.message || error.msg}</div>;
  } else {
    return <PostForm post={post} onSubmit={updatePost} />;
  }
}
