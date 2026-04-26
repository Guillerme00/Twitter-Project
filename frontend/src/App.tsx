import type { JSX } from "react";
import { LoginPage } from "./pages/login_page";
import { RegisterPage } from "./pages/register_page";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/AuthStore";
import { Feed } from "./pages/feed";

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
          path="/homeProtect"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />
        <Route path="/home" element={<Feed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
