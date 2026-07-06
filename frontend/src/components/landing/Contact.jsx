import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";

const infoBlocks = [
  {
    icon: MapPin,
    title: "Visit us",
    lines: ["221 Bayview Avenue", "San Francisco, CA 94103"],
  },
  {
    icon: Phone,
    title: "Call us",
    lines: ["+1 (555) 123-4567", "24/7 emergency line"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["care@smiledental.com"],
  },
  {
    icon: Clock,
    title: "Hours",
    lines: ["Mon–Fri  ·  9:00 AM – 7:00 PM", "Sat  ·  9:00 AM – 2:00 PM"],
  },
];

export default function Contact({ onBook }) {
  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-blue-600 text-white p-8 md:p-14 shadow-xl shadow-blue-900/20">
          <div className="absolute inset-0 opacity-20 pointer-events-none"
               style={{
                 backgroundImage:
                   "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.25) 0, transparent 40%)",
               }}
          />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-blue-100 font-semibold">
                Get in touch
              </p>
              <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.1]">
                Ready when you are.
              </h2>
              <p className="mt-4 text-blue-50/90 text-base sm:text-lg max-w-md leading-relaxed">
                Book online in under a minute, or reach out — we&apos;ll help you
                pick the perfect time and service.
              </p>

              <div className="mt-8">
                <Button
                  data-testid="contact-book-appointment-button"
                  onClick={onBook}
                  className="rounded-full bg-white text-blue-700 hover:bg-blue-50 h-12 px-7 shadow-lg shadow-blue-900/20"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {infoBlocks.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div
                    key={i}
                    data-testid={`contact-info-${b.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-5"
                  >
                    <div className="h-9 w-9 rounded-lg bg-white/20 grid place-items-center">
                      <Icon className="h-4.5 w-4.5 text-white" />
                    </div>
                    <p className="mt-3 text-sm font-semibold">{b.title}</p>
                    {b.lines.map((l, k) => (
                      <p key={k} className="text-sm text-blue-50/85 mt-0.5">
                        {l}
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
