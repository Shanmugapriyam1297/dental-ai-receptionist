import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Amelia Carter",
    role: "Cosmetic patient",
    quote:
      "I used to hate the dentist. Dr. Reed's team changed that completely — my whitening result is unreal and I actually look forward to visits.",
    img: "https://images.unsplash.com/photo-1508002366005-75a695ee2d17?w=200&h=200&fit=crop&crop=faces",
  },
  {
    name: "Priya Sharma",
    role: "Invisalign patient",
    quote:
      "12 months on aligners, zero drama. They explained every step and the price never budged. My smile is finally straight.",
    img: "https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?w=200&h=200&fit=crop&crop=faces",
  },
  {
    name: "Marcus Bell",
    role: "Implant patient",
    quote:
      "Chipped a molar on a Sunday and they saw me Monday morning. Same-day crown, zero pain. Genuinely the best clinic I've been to.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-sky-50/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-blue-600 font-semibold">
            Patient stories
          </p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.1]">
            Real smiles, real reviews.
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            We&apos;re proud of the trust our patients place in us. Here&apos;s what a few
            of them have to say.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card
              key={i}
              data-testid={`testimonial-card-${i}`}
              className="relative bg-white rounded-2xl p-7 border border-slate-200/70 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
            >
              <Quote className="absolute -top-3 -left-2 h-9 w-9 text-blue-100" />
              <div className="flex items-center gap-1 text-blue-600">
                {[...Array(5)].map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-slate-700 text-[15px] leading-relaxed">
                “{t.quote}”
              </p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={t.img}
                  alt={t.name}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
