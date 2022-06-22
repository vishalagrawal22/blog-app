import { Outlet, useNavigate } from "react-router-dom";

import UserContext from "./UserContext";
import { useCurrentUser } from "./hooks/auth";
import Header from "./components/Header";
import addPostImageSrc from "./images/add.svg";

function App() {
  const { user, isLoading, addAccessToken, clearAccessToken } = useCurrentUser();
  const navigate = useNavigate();
  return (
    <>
      <UserContext.Provider
        value={{ user, isLoading, addAccessToken, clearAccessToken }}>
        <Header />
        <Outlet />
      </UserContext.Provider>
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

export default App;
