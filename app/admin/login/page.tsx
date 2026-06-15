"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/admin");
      } else {
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      router.push("/admin");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Невірний email або пароль");
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#D9C1A6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#0d5087]" />
          <span className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
            Перевірка авторизації...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D9C1A6] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#F6D8AE] border-4 border-black p-6 sm:p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="absolute -top-4 -left-4 bg-white border-2 border-black p-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
          title="На головну"
        >
          <ArrowLeft className="h-4 w-4 text-black stroke-[3]" />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            Вхід в адмінку
          </h1>
          <div className="mt-1.5 h-1.5 w-16 bg-[#0d5087] rounded-full mx-auto" />
          <p className="mt-3 text-xs font-bold text-slate-600 uppercase tracking-wider">
            GeniusLand
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border-2 border-black bg-rose-100 p-4 text-xs font-black text-rose-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            ⚠️ {error === "Invalid login credentials" ? "Невірний email або пароль" : error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">
              Email Адреса
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                placeholder="admin@geniusland.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border-2 border-black bg-white pl-10 pr-4 py-3.5 text-xs font-bold text-slate-950 placeholder-slate-400 focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2">
              Пароль
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border-2 border-black bg-white pl-10 pr-4 py-3.5 text-xs font-bold text-slate-950 placeholder-slate-400 focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-[#facc15] py-4 text-xs font-black uppercase tracking-wider text-slate-900 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:scale-[0.98] transition-all duration-75 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Вхід...</span>
                </>
              ) : (
                <span>Увійти в адмінку</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
