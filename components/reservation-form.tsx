"use client";

import { useRef, useState } from "react";
import { format, parseISO, startOfToday } from "date-fns";
import { de } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CalendarDays, Check, Send } from "lucide-react";
import { generateClient } from "aws-amplify/data";

import type { Schema } from "@/amplify/data/resource";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TIME_SLOTS, reservationSchema } from "@/lib/validation/reservation";

interface ReservationFormData {
  name: string;
  email: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  message: string;
}

interface ReservationFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  guests?: string;
  date?: string;
  time?: string;
}

interface ReservationFormProps {
  title?: string;
  description?: string;
  containerClassName?: string;
  submitLabel?: string;
  onSuccess?: () => void;
}

function SuccessAnimation() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <Check className="h-10 w-10 text-green-500" />
      </motion.div>
      <h3 className="mb-2 text-2xl font-semibold text-foreground">
        Vielen Dank!
      </h3>
      <p className="max-w-sm text-center text-gray-text">
        Ihre Reservierungsanfrage wurde gesendet. Wir melden uns in Kürze bei
        Ihnen.
      </p>
    </motion.div>
  );
}

export function ReservationForm({
  title = "Tisch reservieren",
  description,
  containerClassName = "glass rounded-2xl p-6 md:p-8",
  submitLabel = "Tisch reservieren",
  onSuccess,
}: ReservationFormProps) {
  const [client] = useState(() => generateClient<Schema>());
  const submittingRef = useRef(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [formData, setFormData] = useState<ReservationFormData>({
    name: "",
    email: "",
    phone: "",
    guests: "",
    date: "",
    time: "",
    message: "",
  });
  const [errors, setErrors] = useState<ReservationFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const todayDate = startOfToday();

  const validate = () => {
    const result = reservationSchema.safeParse({
      ...formData,
      guests: formData.guests ? Number(formData.guests) : 0,
    });

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: ReservationFormErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof ReservationFormErrors;
      if (!fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    setErrors(fieldErrors);
    return false;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      guests: "",
      date: "",
      time: "",
      message: "",
    });
    setErrors({});
    setSubmitError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) {
      return;
    }

    setSubmitError("");
    if (!validate()) {
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      const { errors: gqlErrors } = await client.models.Reservation.create(
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          date: formData.date,
          time: formData.time,
          guests: Number(formData.guests),
          message: formData.message.trim() || undefined,
          status: "PENDING",
        },
        { authMode: "identityPool" },
      );

      if (gqlErrors?.length) {
        throw new Error(gqlErrors[0].message);
      }

      setIsSuccess(true);
      onSuccess?.();
      window.setTimeout(() => {
        setIsSuccess(false);
        resetForm();
      }, 5000);
    } catch (error) {
      console.error("Reservation error:", error);
      setSubmitError(
        "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
      );
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));

    if (errors[name as keyof ReservationFormErrors]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const inputClass = (field: keyof ReservationFormErrors) =>
    `w-full rounded-lg border bg-deep-green-dark px-4 py-3 text-foreground placeholder:text-gray-text transition-colors focus:outline-none ${
      errors[field] ? "border-red-500" : "border-border focus:border-gold"
    }`;
  const labelClass = "mb-2 block text-sm font-medium text-foreground";
  const helperTextClass = "mt-1 flex items-center gap-1 text-sm text-red-500";
  const selectedDate = formData.date ? parseISO(formData.date) : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    setFormData((current) => ({
      ...current,
      date: date ? format(date, "yyyy-MM-dd") : "",
    }));

    if (errors.date) {
      setErrors((current) => ({ ...current, date: undefined }));
    }

    if (submitError) {
      setSubmitError("");
    }

    setIsDatePickerOpen(false);
  };

  return (
    <div className={containerClassName}>
      {title ? (
        <h3 className="mb-2 font-serif text-2xl font-semibold text-foreground">
          {title}
        </h3>
      ) : null}
      {description ? (
        <p className="mb-6 text-sm text-gray-text">{description}</p>
      ) : null}

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <SuccessAnimation key="success" />
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div>
              <label htmlFor="name" className={labelClass}>
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass("name")}
                placeholder="Ihr vollständiger Name"
              />
              {errors.name ? (
                <p className={helperTextClass}>
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                E-Mail *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass("email")}
                placeholder="Ihre E-Mail-Adresse"
              />
              {errors.email ? (
                <p className={helperTextClass}>
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>
                Telefonnummer *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass("phone")}
                placeholder="Ihre Telefonnummer"
              />
              {errors.phone ? (
                <p className={helperTextClass}>
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="guests" className={labelClass}>
                Anzahl Personen *
              </label>
              <input
                type="number"
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                min="1"
                step="1"
                inputMode="numeric"
                className={inputClass("guests")}
                placeholder="Anzahl Personen"
              />
              {errors.guests ? (
                <p className={helperTextClass}>
                  <AlertCircle className="h-3 w-3" />
                  {errors.guests}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className={labelClass}>
                  Datum *
                </label>
                <Popover
                  open={isDatePickerOpen}
                  onOpenChange={setIsDatePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      id="date"
                      aria-label="Datum auswählen"
                      className={cn(
                        inputClass("date"),
                        "flex items-center justify-between text-left",
                        !formData.date && "text-gray-text",
                      )}
                    >
                      <span>
                        {selectedDate
                          ? format(selectedDate, "dd.MM.yyyy", { locale: de })
                          : "TT.MM.JJJJ"}
                      </span>
                      <CalendarDays className="h-4 w-4 shrink-0 text-gold" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-auto border-border bg-deep-green p-0 text-foreground"
                  >
                    <Calendar
                      mode="single"
                      locale={de}
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={{ before: todayDate }}
                      className="rounded-lg bg-deep-green-dark text-foreground"
                      classNames={{
                        day: "text-foreground",
                        weekday: "text-gray-text",
                        caption_label: "text-foreground",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.date ? (
                  <p className={helperTextClass}>
                    <AlertCircle className="h-3 w-3" />
                    {errors.date}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="time" className={labelClass}>
                  Uhrzeit *
                </label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={inputClass("time")}
                >
                  <option value="">Wählen</option>
                  {TIME_SLOTS.map((timeSlot) => (
                    <option key={timeSlot} value={timeSlot}>
                      {timeSlot}
                    </option>
                  ))}
                </select>
                {errors.time ? (
                  <p className={helperTextClass}>
                    <AlertCircle className="h-3 w-3" />
                    {errors.time}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <label htmlFor="message" className={labelClass}>
                Nachricht (optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-deep-green-dark px-4 py-3 text-foreground placeholder:text-gray-text focus:border-gold focus:outline-none"
                placeholder="Besondere Wünsche, Allergien, Anlass..."
              />
            </div>

            {submitError ? (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {submitError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-4 font-semibold text-deep-green transition-all hover:scale-[1.02] hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    className="h-5 w-5 rounded-full border-2 border-deep-green border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  Wird gesendet...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  {submitLabel}
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
