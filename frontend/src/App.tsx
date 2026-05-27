import type { JSX } from "react";
import { MeProfile } from "./pages/me_page";
import { LoginPage } from "./pages/login_page";
import { RegisterPage } from "./pages/register_page";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/AuthStore";
import { Feed } from "./pages/feed";
import { PostPage } from "./pages/post_page";
import { SettingsPage } from "./pages/settings";
import { FollowingPage } from "./pages/following_page";
import { FollowersPage } from "./pages/followers_page";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((state) => state.accessToken);

  if (!token) {
    return <Navigate to="/signin" />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />
        <Route
          path="/post/:id"
          element={
            <PrivateRoute>
              <PostPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <PrivateRoute>
              <MeProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:id/following"
          element={
            <PrivateRoute>
              <FollowingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:id/followers"
          element={
            <PrivateRoute>
              <FollowersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
