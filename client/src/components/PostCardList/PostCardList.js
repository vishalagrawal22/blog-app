import PostCard from "../PostCard/PostCard";

export default function PostCardList({ posts }) {
  return (
    <div className="d-flex m-3 flex-wrap justify-content-around">
      {posts.length === 0 && <p>There are no posts.</p>}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
