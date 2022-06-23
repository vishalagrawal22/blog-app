import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import UserContext from "../../UserContext";

import { usePosts } from "../../hooks/posts";
import PostCardList from "../../components/PostCardList";
import addPostImageSrc from "../../images/add.svg";

export default function Feed() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { posts, isLoading, error } = usePosts(
    `${process.env.REACT_APP_API_URL}/posts`
  );

  if (isLoading) {
    return <div className="m-3">loading...</div>;
  } else if (error) {
    return <div className="m-3">{error.message || error.msg}</div>;
  } else {
    return (
      <>
        <PostCardList posts={posts} />
        {user && (
          <img
            title="add post"
            style={{
              width: "60px",
              height: "60px",
              position: "fixed",
              right: 30,
              zIndex: 1,
              bottom: 25,
            }}
            src={addPostImageSrc}
            onClick={() => {
              navigate("/posts/create");
            }}
            alt="add post"
          />
        )}
      </>
    );
  }
}
