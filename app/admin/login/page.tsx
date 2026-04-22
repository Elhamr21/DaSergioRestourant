"use client";

import "@/lib/amplify-configure";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut, confirmSignIn } from "aws-amplify/auth";
import { AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [needsNewPassword, setNeedsNewPassword] = useState(false);
  const [error, setError] = useState(
    params.get("error") === "unauthorized" ? "Kein Admin-Zugang" : "",
  );
  const [loading, setLoading] = useState(false);
  const labelClassName = "mb-2 block text-sm font-medium text-foreground";
  const inputClassName =
    "w-full rounded-lg border border-border bg-deep-green-dark px-4 py-3 text-foreground focus:border-gold focus:outline-none";
  const errorClassName = "flex items-center gap-1 text-sm text-red-500";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (needsNewPassword) {
        await confirmSignIn({ challengeResponse: newPassword });
        router.replace("/admin");
        return;
      }
      await signOut().catch(() => {});
      const result = await signIn({ username: email, password });
      if (
        result.nextStep?.signInStep ===
        "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        setNeedsNewPassword(true);
      } else if (result.isSignedIn) {
        router.replace("/admin");
      }
    } catch (err: any) {
      setError(err?.message || "Anmeldung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md">
        <h1 className="font-serif text-3xl font-bold text-gold text-center mb-2">
          Da Sergio
        </h1>
        <p className="text-gray-text text-center mb-8">Admin-Bereich</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!needsNewPassword ? (
            <>
              <div>
                <label className={labelClassName}>E-Mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClassName}
                />
              </div>
              <div>
                <label className={labelClassName}>Passwort</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClassName}
                />
              </div>
            </>
          ) : (
            <div>
              <label className={labelClassName}>Neues Passwort festlegen</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className={inputClassName}
              />
            </div>
          )}

          {error && (
            <p className={errorClassName}>
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-dark text-deep-green font-semibold px-6 py-3 rounded-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {needsNewPassword ? "Passwort ändern" : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}
