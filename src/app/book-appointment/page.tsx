import type { Metadata } from "next";
import AppointmentForm from "@/components/AppointmentForm";

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Book an appointment with our specialists online in minutes. Choose your department and preferred date.",
};

export default function BookAppointmentPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 lg:px-8">
      <span className="eyebrow">One Simple Step</span>
      <h1 className="mt-4 text-4xl sm:text-5xl">Book an Appointment</h1>
      <p className="mt-4 text-lg text-ink-muted">
        Fill out the form below and our team will confirm your appointment shortly.
        For emergencies, please call {" "}
        <a href="tel:+919100100812" className="font-semibold text-brand-700 dark:text-brand-300">+ (91) 9100-100812</a> directly.
      </p>
      <div className="mt-8">
        <AppointmentForm />
      </div>
    </div>
  );
}
