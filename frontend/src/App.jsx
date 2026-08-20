import "./App.css";
import AdjusterDashboard from "./components/AdjusterDashboard";
import CustomerDashboard from "./components/CustomerDashboard";
import Login from "./components/Login";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";

function MainContent() {
  const { user } = useAuth();

  return (
    <div className='bg-slate-950 min-h-screen'>
      {!user ? (
        <Login />
      ) : ["ADJUSTER", "SENIOR_ADJUSTER"].includes(user.role) ? (
        <AdjusterDashboard />
      ) : user.role === "CUSTOMER" ? (
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
    </AuthProvider>
  );
}

export default App;
