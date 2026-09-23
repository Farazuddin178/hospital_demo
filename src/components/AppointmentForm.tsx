"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema, type AppointmentInput } from "@/lib/schemas";
import { specialties } from "@/lib/site-data";

export default function AppointmentForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentInput>({ resolver: zodResolver(appointmentSchema) });

  async function onSubmit(data: AppointmentInput) {
    setStatus("sending");
    try {
      const res = await fetch("/api/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-4" aria-describedby="appointment-form-status">
      <div>
        <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-ink">Full Name</label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          className="form-input"
          {...register("fullName")}
        />
        {errors.fullName && <p id="fullName-error" role="alert" className="mt-1 text-sm text-accent-700">{errors.fullName.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink">Email Address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="form-input"
            {...register("email")}
          />
          {errors.email && <p id="email-error" role="alert" className="mt-1 text-sm text-accent-700">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-ink">Phone Number</label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className="form-input"
            {...register("phone")}
          />
          {errors.phone && <p id="phone-error" role="alert" className="mt-1 text-sm text-accent-700">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="department" className="mb-1 block text-sm font-medium text-ink">Department</label>
          <select
            id="department"
            aria-invalid={!!errors.department}
            aria-describedby={errors.department ? "department-error" : undefined}
            className="form-input"
            defaultValue=""
            {...register("department")}
          >
            <option value="" disabled>Select a department</option>
            {specialties.map((s) => (
              <option key={s.slug} value={s.name}>{s.name}</option>
            ))}
          </select>
          {errors.department && <p id="department-error" role="alert" className="mt-1 text-sm text-accent-700">{errors.department.message}</p>}
        </div>
        <div>
          <label htmlFor="preferredDate" className="mb-1 block text-sm font-medium text-ink">Preferred Date</label>
          <input
            id="preferredDate"
            type="date"
            aria-invalid={!!errors.preferredDate}
            aria-describedby={errors.preferredDate ? "preferredDate-error" : undefined}
            className="form-input"
            {...register("preferredDate")}
          />
          {errors.preferredDate && <p id="preferredDate-error" role="alert" className="mt-1 text-sm text-accent-700">{errors.preferredDate.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-ink">Additional Notes (optional)</label>
        <textarea
          id="notes"
          rows={4}
          aria-invalid={!!errors.notes}
          aria-describedby={errors.notes ? "notes-error" : undefined}
          className="form-input"
          {...register("notes")}
        />
        {errors.notes && <p id="notes-error" role="alert" className="mt-1 text-sm text-accent-700">{errors.notes.message}</p>}
      </div>

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? "Submitting…" : "Request Appointment"}
      </button>

      <p id="appointment-form-status" role="status" aria-live="polite" className="text-sm">
        {status === "sent" && <span className="text-teal-700 dark:text-teal-300">Thank you — we&apos;ll contact you shortly to confirm.</span>}
        {status === "error" && <span className="text-accent-700">Something went wrong. Please try again.</span>}
      </p>
    </form>
  );
}
