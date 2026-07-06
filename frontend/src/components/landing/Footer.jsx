import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 text-white grid place-items-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-display font-semibold text-slate-900">
            Smile Dental Clinic
          </span>
        </div>
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Smile Dental Clinic. Crafted with care.
        </p>
      </div>
    </footer>
  );
}
