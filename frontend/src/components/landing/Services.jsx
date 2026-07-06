import { Card } from "@/components/ui/card";
import {
  Sparkles,
  Smile,
  Stethoscope,
  ShieldPlus,
  Baby,
  Zap,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    id: "general",
    icon: Stethoscope,
    title: "General Dentistry",
    desc: "Comprehensive checkups, cleanings and preventive care that keep your smile healthy for life.",
  },
  {
    id: "cosmetic",
    icon: Sparkles,
    title: "Cosmetic Dentistry",
    desc: "Veneers, whitening, and smile makeovers designed to give you effortless confidence.",
  },
  {
    id: "orthodontics",
    icon: Smile,
    title: "Orthodontics",
    desc: "Modern braces and clear aligners tailored to your bite, lifestyle, and budget.",
  },
  {
    id: "implants",
    icon: ShieldPlus,
    title: "Dental Implants",
    desc: "Durable, natural-looking implants restored by specialists — same-day options available.",
  },
  {
    id: "pediatric",
    icon: Baby,
    title: "Pediatric Care",
    desc: "Gentle, playful visits for kids in a calming environment they actually look forward to.",
  },
  {
    id: "emergency",
    icon: Zap,
    title: "Emergency Care",
    desc: "Same-day emergency slots for pain, chips, or trauma — because dental issues don't wait.",
  },
];

export default function Services({ onBookService }) {
  return (
    <section id="services" className="relative py-20 md:py-28 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-blue-600 font-semibold">
            What we do
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight">
            Complete care under one calm roof.
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            From your first cleaning to a full smile transformation, our team
            delivers precise, gentle dentistry tailored to every stage of life.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Card
                key={s.id}
                data-testid={`service-card-${s.id}`}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => onBookService(s.title)}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 grid place-items-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display font-semibold text-xl text-slate-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-blue-600 text-sm font-medium group-hover:gap-2.5 transition-all">
                  Book this service
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
