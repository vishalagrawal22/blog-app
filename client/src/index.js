import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import LoginForm from "./components/LoginForm";
import PostForm from "./components/PostForm";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import Feed from "./page/Feed/Feed";
import UpdatePost from "./page/UpdatePost";
import { createPost } from "./utils/posts";

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
            path="/posts/create"
            element={<PostForm onSubmit={createPost} />}
          />
          <Route path="/posts/:postId/update" element={<UpdatePost />} />
          <Route
            path="*"
            element={<div className="p-3">Route not found!</div>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
