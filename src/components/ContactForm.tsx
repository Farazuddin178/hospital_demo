"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/schemas";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactInput) {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-4" aria-describedby="contact-form-status">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-ink">First Name</label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            className="form-input"
            {...register("firstName")}
          />
          {errors.firstName && <p id="firstName-error" role="alert" className="mt-1 text-sm text-accent-700">{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-ink">Last Name</label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            className="form-input"
            {...register("lastName")}
          />
          {errors.lastName && <p id="lastName-error" role="alert" className="mt-1 text-sm text-accent-700">{errors.lastName.message}</p>}
        </div>
      </div>

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
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-ink">Phone Number (optional)</label>
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

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink">Message</label>
        <textarea
          id="message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="form-input"
          {...register("message")}
        />
        {errors.message && <p id="message-error" role="alert" className="mt-1 text-sm text-accent-700">{errors.message.message}</p>}
      </div>

      {/* Honeypot: hidden from sighted/assistive users, catches naive bots that fill every field */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? "Sending…" : "Send Message"}
      </button>

      <p id="contact-form-status" role="status" aria-live="polite" className="text-sm">
        {status === "sent" && <span className="text-teal-700 dark:text-teal-300">Thank you — your message has been sent.</span>}
        {status === "error" && <span className="text-accent-700">Something went wrong. Please try again.</span>}
      </p>
    </form>
  );
}
