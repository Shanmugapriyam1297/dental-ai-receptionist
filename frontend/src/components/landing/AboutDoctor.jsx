import { Button } from "@/components/ui/button";
import { Award, GraduationCap, HeartHandshake, Calendar } from "lucide-react";

const highlights = [
  { icon: GraduationCap, label: "DDS, Harvard School of Dental Medicine" },
  { icon: Award, label: "Board-certified prosthodontist" },
  { icon: HeartHandshake, label: "15+ years of gentle, patient-first care" },
];

export default function AboutDoctor({ onBook }) {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-sky-100 to-blue-50 blur-xl opacity-80" />
          <div className="relative rounded-[1.75rem] overflow-hidden shadow-xl shadow-blue-900/10 ring-1 ring-white/60">
            <img
              src="https://images.pexels.com/photos/17792882/pexels-photo-17792882.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Dr. Ethan Reed"
              className="w-full h-[460px] md:h-[560px] object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 md:right-6 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-blue-900/10 px-5 py-4">
            <p className="text-[11px] uppercase tracking-widest text-blue-600 font-semibold">
              Verified
            </p>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">
              ADA Member · 2010
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-600 font-semibold">
            About the doctor
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.1]">
            Meet Dr. Ethan Reed, DDS
          </h2>
          <p className="mt-5 text-slate-600 text-base sm:text-lg leading-relaxed">
            Dr. Reed founded Smile Dental Clinic with a simple belief: great
            dentistry should feel calm, transparent, and genuinely kind. Over
            fifteen years he&apos;s helped thousands of patients — from anxious
            first-timers to full-mouth reconstructions — leave the chair
            smiling wider than when they walked in.
          </p>
          <p className="mt-4 text-slate-600 text-base leading-relaxed">
            His clinic combines precision digital tools (intraoral scanning,
            same-day crowns, laser dentistry) with a chair-side manner that
            puts comfort first.
          </p>

          <ul className="mt-8 space-y-3">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <li key={i} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 grid place-items-center">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm text-slate-700 font-medium">
                    {h.label}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            <Button
              data-testid="about-book-appointment-button"
              onClick={onBook}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white h-12 px-7 shadow-md shadow-blue-600/20"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book with Dr. Reed
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
