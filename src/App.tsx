import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import IndividualClients from "@/pages/clients/IndividualClients";
import BusinessClients from "@/pages/clients/BusinessClients";
import AddClient from "@/pages/clients/AddClient";
import KYCDashboard from "@/pages/clients/KYCDashboard";
import ClientDetail from "@/pages/clients/ClientDetail";
import Tasks from "@/pages/Tasks";
import Workload from "@/pages/Workload";
import Communications from "@/pages/Communications";
import Documents from "@/pages/Documents";
import TimeTracking from "@/pages/billing/TimeTracking";
import Invoices from "@/pages/billing/Invoices";
import Payments from "@/pages/billing/Payments";
import Reports from "@/pages/Reports";
import Templates from "@/pages/Templates";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Navigate to="/clients/individual" replace />} />
            <Route path="/clients/individual" element={<IndividualClients />} />
            <Route path="/clients/business" element={<BusinessClients />} />
            <Route path="/clients/new" element={<AddClient />} />
            <Route path="/clients/kyc" element={<KYCDashboard />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/workload" element={<Workload />} />
            <Route path="/communications" element={<Communications />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/billing" element={<Navigate to="/billing/time" replace />} />
            <Route path="/billing/time" element={<TimeTracking />} />
            <Route path="/billing/invoices" element={<Invoices />} />
            <Route path="/billing/payments" element={<Payments />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
