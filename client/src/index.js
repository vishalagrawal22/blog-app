import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import Feed from "./page/Feed/Feed";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Feed />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="*"
            element={<div className="p-3">Route not found!</div>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
