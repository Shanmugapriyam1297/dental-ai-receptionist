import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Services from "@/components/landing/Services";
import AboutDoctor from "@/components/landing/AboutDoctor";
import Testimonials from "@/components/landing/Testimonials";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";
import AppointmentDialog from "@/components/landing/AppointmentDialog";
import ChatWidget from "@/components/landing/ChatWidget";

export default function Landing() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [prefillService, setPrefillService] = useState("");

  const openBooking = (service = "") => {
    setPrefillService(service);
    setBookingOpen(true);
  };

  useEffect(() => {
    document.title = "Smile Dental Clinic — Modern Care for a Brighter Smile";
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900" data-testid="landing-page">
      <Navbar onBook={() => openBooking()} />
      <main>
        <Hero onBook={() => openBooking()} />
        <Services onBookService={openBooking} />
        <AboutDoctor onBook={() => openBooking()} />
        <Testimonials />
        <Contact onBook={() => openBooking()} />
      </main>
      <Footer />

      <AppointmentDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        prefillService={prefillService}
      />

      <ChatWidget />
    </div>
  );
}
