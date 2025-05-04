import React from "react";
import { useAuth } from "./context/authcontext";
import { AuthProvider } from "./context/authcontext";
import LoginPage from "./pages/auth/login";
import Main from "./pages/main/main";
import RegisterPage from "./pages/auth/register/register";
import Intro from "./components/intro/intro";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="relative mb-6">
          <div
            className="w-16 h-16 border-4 border-blue-500 rounded-lg 
            animate-[pulse_2s_ease-in-out_infinite]"
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-8 h-8 bg-blue-500/70 rounded-sm"
          ></div>
          <div
            className="absolute top-2 left-2 w-2 h-2 bg-primary rounded-full 
            animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"
          ></div>
          <div
            className="absolute bottom-2 right-2 w-2 h-2 bg-primary rounded-full 
            animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite_0.3s]"
          ></div>
        </div>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-25%); }
          }
        `}</style>
        <div className="flex gap-2">
          {[0, 0.1, 0.2].map(delay => (
            <div
              key={delay}
              className="w-3 h-3 bg-primary rounded-full"
              style={{
                animation: `bounce 1.5s infinite ${delay}s`,
              }}
            />
          ))}
        </div>

        <p className="mt-6 text-sm text-gray-500 font-mono">Loading</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
