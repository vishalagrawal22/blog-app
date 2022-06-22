import PostCard from "../PostCard/PostCard";

export default function PostCardList({ posts }) {
  return (
    <div className="d-flex m-3 flex-wrap">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
