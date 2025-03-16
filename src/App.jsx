import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import DashboardNew from "./pages/DashboardNew";
import Buy from "./pages/Buy";
import BrowseDapp from "./pages/BrowseDapp";
import Analytics from "./pages/Analytics";
import FastTransaction from "./pages/FastTransaction";
import Settings from "./pages/Settings";
import Send from "./pages/Send";
import Receive from "./pages/Receive";
import Solana from "./pages/Solana";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <main className="relative min-h-screen w-screen overflow-x-hidden">
            <NavBar />
            <Hero />
            <About />
            <Features />
            <Story />
            <Contact />
            <Footer />
          </main>
        } />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<DashboardNew />} />
        <Route path="/pages/send" element={<Send />} />
        <Route path="/pages/receive" element={<Receive />} />
        <Route path="/pages/buy" element={<Buy />} />
        <Route path="/pages/browsedapps" element={<BrowseDapp />} />
        <Route path="/pages/analytics" element={<Analytics />} />
        <Route path="/pages/fasttransaction" element={<FastTransaction />} />
        <Route path="/pages/solana" element={<Solana />} />
        <Route path="/pages/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
