import { Outlet } from "react-router-dom";

import UserContext from "./UserContext";
import { useCurrentUser } from "./hooks/auth";
import Header from "./components/Header";

function App() {
  const { user, isLoading, addAccessToken, clearAccessToken } =
    useCurrentUser();
  return (
    <>
      <UserContext.Provider
        value={{ user, isLoading, addAccessToken, clearAccessToken }}>
        <Header />
        <Outlet />
      </UserContext.Provider>
    </>
  );
}

export default App;
