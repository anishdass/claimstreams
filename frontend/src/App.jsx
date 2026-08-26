import { ToastContainer } from "react-toastify";
import "./App.css";
import AdjusterDashboard from "./components/AdjusterDashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import Login from "./components/Login";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";

function MainContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='bg-slate-950 min-h-screen text-white'>
        Restoring session...
      </div>
    );
  }

  return (
    <div className='bg-slate-950 min-h-screen'>
      {!user ? (
        <Login />
      ) : ["ROLE_ADJUSTER", "ROLE_SENIOR_ADJUSTER"].includes(user.role) ? (
        <AdjusterDashboard />
      ) : user.role === "ROLE_CUSTOMER" ? (
        <CustomerDashboard user={user} />
      ) : (
        <Login />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainContent />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
