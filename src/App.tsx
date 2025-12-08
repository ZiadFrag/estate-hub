import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Clients from "./pages/Clients";
import Agents from "./pages/Agents";
import Contracts from "./pages/Contracts";
import Payments from "./pages/Payments";
import Owners from "./pages/Owners";
import Departments from "./pages/Departments";
import Branches from "./pages/Branches";
import PropertyVisits from "./pages/PropertyVisits";
import Listings from "./pages/Listings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
      <Route path="/properties" element={<ProtectedRoute><MainLayout><Properties /></MainLayout></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><MainLayout><Clients /></MainLayout></ProtectedRoute>} />
      <Route path="/agents" element={<ProtectedRoute><MainLayout><Agents /></MainLayout></ProtectedRoute>} />
      <Route path="/contracts" element={<ProtectedRoute><MainLayout><Contracts /></MainLayout></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute><MainLayout><Payments /></MainLayout></ProtectedRoute>} />
      <Route path="/owners" element={<ProtectedRoute><MainLayout><Owners /></MainLayout></ProtectedRoute>} />
      <Route path="/departments" element={<ProtectedRoute><MainLayout><Departments /></MainLayout></ProtectedRoute>} />
      <Route path="/branches" element={<ProtectedRoute><MainLayout><Branches /></MainLayout></ProtectedRoute>} />
      <Route path="/visits" element={<ProtectedRoute><MainLayout><PropertyVisits /></MainLayout></ProtectedRoute>} />
      <Route path="/listings" element={<ProtectedRoute><MainLayout><Listings /></MainLayout></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
