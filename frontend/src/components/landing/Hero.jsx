import { Button } from "@/components/ui/button";
import { Calendar, ShieldCheck, Star } from "lucide-react";

export default function Hero({ onBook }) {
  return (
    <section id="top" className="relative overflow-hidden pt-28 md:pt-36 pb-20 md:pb-28">
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute inset-0 grid-lines opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700 font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            Trusted by 12,000+ smiles
          </div>

          <h1 className="mt-5 font-display font-bold tracking-tight text-slate-900 text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            Modern dental care
            <br />
            for a <span className="text-blue-600">brighter smile.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            At Smile Dental Clinic, we blend state-of-the-art technology with a
            gentle, human touch — so every visit leaves you healthier and more
            confident.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              data-testid="hero-book-appointment-button"
              onClick={onBook}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white h-12 px-7 text-base shadow-lg shadow-blue-600/25"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
            <a
              href="#services"
              data-testid="hero-explore-services-link"
              className="inline-flex items-center justify-center rounded-full h-12 px-6 border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors text-sm font-medium"
            >
              Explore Services
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1508002366005-75a695ee2d17?w=80&h=80&fit=crop&crop=faces",
                "https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?w=80&h=80&fit=crop&crop=faces",
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="patient"
                  className="h-10 w-10 rounded-full ring-2 ring-white object-cover"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-blue-600">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                <span className="ml-2 text-slate-900 font-semibold text-sm">4.9</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                From 2,300+ verified reviews
              </p>
            </div>
          </div>
        </div>

        <div className="relative animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-blue-100 via-sky-100 to-white blur-2xl opacity-70" />
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10 ring-1 ring-white/60">
            <img
              src="https://images.pexels.com/photos/9062527/pexels-photo-9062527.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt="Modern dental clinic"
              className="w-full h-[420px] md:h-[520px] object-cover"
            />
          </div>

          <div className="absolute -left-4 md:-left-8 bottom-6 md:bottom-10 bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-slate-100 p-4 w-56 animate-fade-in-up" style={{ animationDelay: "350ms" }}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 grid place-items-center">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Next available</p>
                <p className="text-sm font-semibold text-slate-900">Today · 3:30 PM</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-2 md:-right-6 top-8 bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-slate-100 p-4 w-52 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
            <p className="text-xs text-slate-500">Painless procedures</p>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">
              98% patient comfort rating
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-[98%] bg-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
