import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createAppointment } from "@/lib/api";
import { CalendarCheck2, Loader2 } from "lucide-react";

const SERVICES = [
  "General Dentistry",
  "Cosmetic Dentistry",
  "Orthodontics",
  "Dental Implants",
  "Pediatric Care",
  "Emergency Care",
];

const initial = {
  full_name: "",
  email: "",
  phone: "",
  service: "",
  preferred_date: "",
  message: "",
};

export default function AppointmentDialog({ open, onOpenChange, prefillService }) {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ ...initial, service: prefillService || "" });
      setSuccess(false);
    }
  }, [open, prefillService]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    if (form.full_name.trim().length < 2) return "Please enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email";
    if (form.phone.trim().length < 6) return "Please enter a valid phone number";
    if (!form.service) return "Please select a service";
    if (!form.preferred_date) return "Please select a preferred date";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setSubmitting(true);
    try {
      await createAppointment(form);
      setSuccess(true);
      toast.success("Appointment request received!");
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="appointment-dialog"
        className="sm:max-w-lg rounded-2xl p-0 overflow-hidden border-slate-200"
      >
        {success ? (
          <div className="p-8 text-center" data-testid="appointment-success">
            <div className="mx-auto h-14 w-14 rounded-full bg-blue-50 text-blue-600 grid place-items-center">
              <CalendarCheck2 className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-bold text-slate-900">
              You're on the calendar
            </h3>
            <p className="mt-2 text-slate-600 text-sm">
                We&apos;ve received your request for{" "}
              <span className="font-medium text-slate-900">{form.service}</span>{" "}
              on{" "}
              <span className="font-medium text-slate-900">
                {form.preferred_date}
              </span>
                . Our team will confirm shortly via email.
            </p>
            <div className="mt-6">
              <Button
                data-testid="appointment-close-button"
                onClick={() => onOpenChange(false)}
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                Great, thanks
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} data-testid="appointment-form">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle className="font-display text-2xl">
                Book an appointment
              </DialogTitle>
              <DialogDescription>
                Fill out a few details and we&apos;ll confirm your visit.
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-5 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input
                  id="full_name"
                  data-testid="appointment-input-name"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    data-testid="appointment-input-email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    data-testid="appointment-input-phone"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Service</Label>
                  <Select
                    value={form.service}
                    onValueChange={(v) => update("service", v)}
                  >
                    <SelectTrigger data-testid="appointment-select-service">
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="preferred_date">Preferred date</Label>
                  <Input
                    id="preferred_date"
                    type="date"
                    min={today}
                    data-testid="appointment-input-date"
                    value={form.preferred_date}
                    onChange={(e) => update("preferred_date", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea
                  id="message"
                  data-testid="appointment-input-message"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Any concerns or preferences we should know about?"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="px-6 pb-6 pt-2 gap-2 sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                data-testid="appointment-cancel-button"
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                data-testid="appointment-submit-button"
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 min-w-36"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Booking…
                  </>
                ) : (
                  "Confirm booking"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
