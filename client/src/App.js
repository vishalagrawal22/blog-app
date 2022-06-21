import { Outlet } from "react-router-dom";

import UserContext from "./UserContext";
import { useUser } from "./hooks/auth";
import Header from "./components/Header";

function App() {
  const { user, isLoading, addAccessToken, clearAccessToken } = useUser();
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
