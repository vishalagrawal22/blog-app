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

export default function PostCard({ post }) {
  return (
    <div className="card m-3" style={{ width: "18rem", height: "15rem" }}>
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="card-title">{post.title}</h5>
          <div className="d-flex justify-content-between">
            <h6 className="card-subtitle mb-2 text-muted">
              {post.author.name}
            </h6>
            <h6 className="card-subtitle mb-2 text-muted">{post.createdAt}</h6>
          </div>
        </div>
        <p className="card-text">{getShortDescription(post.description)}</p>
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
