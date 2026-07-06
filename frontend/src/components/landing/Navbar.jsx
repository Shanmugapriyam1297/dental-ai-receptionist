import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";

const links = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar({ onBook }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white/85 backdrop-blur-xl border-b border-slate-200/70" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group" data-testid="nav-logo">
          <div className="h-9 w-9 rounded-xl bg-blue-600 text-white grid place-items-center shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-slate-900 text-lg">Smile</div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-blue-600 -mt-0.5">
              Dental Clinic
            </div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            data-testid="nav-book-appointment-button"
            onClick={onBook}
            className="hidden sm:inline-flex rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 h-10 shadow-md shadow-blue-600/20"
          >
            Book Appointment
          </Button>
          <button
            className="md:hidden h-10 w-10 grid place-items-center rounded-full border border-slate-200 text-slate-700"
            onClick={() => setOpen((v) => !v)}
            data-testid="nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-slate-700 text-sm py-1"
              >
                {l.label}
              </a>
            ))}
            <Button
              data-testid="nav-mobile-book-button"
              onClick={() => {
                setOpen(false);
                onBook();
              }}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
            >
              Book Appointment
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
