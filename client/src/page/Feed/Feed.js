import { usePosts } from "../../hooks/posts";
import PostCardList from "../../components/PostCardList";

export default function Feed() {
  const { posts, isLoading, error } = usePosts(
    `${process.env.REACT_APP_API_URL}/posts`
  );

  if (isLoading) {
    return <div className="m-3">loading...</div>;
  } else if (error) {
    return <div className="m-3">{error.message || error.msg}</div>;
  } else {
    return <PostCardList posts={posts} />;
  }
}
