export default function PostItem({ post }) {
  return (
    <div className="flex-grow-1 p-3 d-flex flex-column align-items-center">
      <h2 className="mb-3">{post.title}</h2>
      <h5 className="text-secondary mb-5">
        By {post.author.name} (Posted on {post.createdAt})
      </h5>
      <div style={{ whiteSpace: "pre-wrap" }}>{post.description}</div>
    </div>
  );
}
