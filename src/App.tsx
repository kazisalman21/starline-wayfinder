import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import SearchResults from "./pages/SearchResults.tsx";
import SeatSelection from "./pages/SeatSelection.tsx";
import Checkout from "./pages/Checkout.tsx";
import TicketConfirmation from "./pages/TicketConfirmation.tsx";
import ManageBooking from "./pages/ManageBooking.tsx";
import LiveTracking from "./pages/LiveTracking.tsx";
import RouteMap from "./pages/RouteMap.tsx";
import RoutesFleet from "./pages/RoutesFleet.tsx";
import Counters from "./pages/Counters.tsx";
import Support from "./pages/Support.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import PassengerDashboard from "./pages/PassengerDashboard.tsx";
import MyComplaints from "./pages/MyComplaints.tsx";
import TravelUpdates from "./pages/TravelUpdates.tsx";
import NotFound from "./pages/NotFound.tsx";
import AIChatWidget from "./components/support/AIChatWidget.tsx";
import StaffLogin from "./pages/staff/StaffLogin.tsx";
import StaffTripsToday from "./pages/staff/StaffTripsToday.tsx";
import StaffTripControl from "./pages/staff/StaffTripControl.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/seat-selection" element={<SeatSelection />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/ticket" element={<TicketConfirmation />} />
          <Route path="/manage-booking" element={<ManageBooking />} />
          <Route path="/live-tracking" element={<LiveTracking />} />
          <Route path="/route-map" element={<RouteMap />} />
          <Route path="/routes" element={<RoutesFleet />} />
          <Route path="/counters" element={<Counters />} />
          <Route path="/support" element={<Support />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/dashboard" element={<PassengerDashboard />} />
          <Route path="/my-complaints" element={<MyComplaints />} />
          <Route path="/notices" element={<TravelUpdates />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/staff/trips" element={<StaffTripsToday />} />
          <Route path="/staff/trip/:tripId" element={<StaffTripControl />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
