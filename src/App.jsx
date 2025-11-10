import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Landing page publik */}
      <Route path="/" element={<div>Landing Page</div>} />
      
      {/* Admin routes - PROTECTED di level layout */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Auth routes - publik */}
      <Route path="/auth/*" element={<Auth />} />
      
     
      {/* 404 Catch-All Route - HARUS DI PALING BAWAH */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
