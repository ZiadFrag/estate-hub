import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/properties" element={<MainLayout><Properties /></MainLayout>} />
          <Route path="/clients" element={<MainLayout><Clients /></MainLayout>} />
          <Route path="/agents" element={<MainLayout><Agents /></MainLayout>} />
          <Route path="/contracts" element={<MainLayout><Contracts /></MainLayout>} />
          <Route path="/payments" element={<MainLayout><Payments /></MainLayout>} />
          <Route path="/owners" element={<MainLayout><Owners /></MainLayout>} />
          <Route path="/departments" element={<MainLayout><Departments /></MainLayout>} />
          <Route path="/branches" element={<MainLayout><Branches /></MainLayout>} />
          <Route path="/visits" element={<MainLayout><PropertyVisits /></MainLayout>} />
          <Route path="/listings" element={<MainLayout><Listings /></MainLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;