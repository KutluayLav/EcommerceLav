"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const preventScript = (e: React.ClipboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
  if (
    ("clipboardData" in e && e.clipboardData?.getData("text/plain").toLowerCase().includes("<script")) ||
    ("key" in e && e.key.toLowerCase().includes("<script"))
  ) {
    e.preventDefault();
  }
};
const preventPaste = (e: React.ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); };
const preventCopy = (e: React.ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); };
const preventCut = (e: React.ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); };
const preventContextMenu = (e: React.MouseEvent<HTMLInputElement>) => { e.preventDefault(); };

const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5050/api/admin/login",
        { username, password },
        { withCredentials: false }
      );
      if (response.data && response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        router.push("/admin/dashboard");
      } else {
        setError("Geçersiz yanıt. Lütfen tekrar deneyin.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-2"
      style={{ background: "linear-gradient(135deg, var(--color-bgwhite) 0%, var(--color-primary) 100%)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl p-8 border backdrop-blur-md"
        style={{ background: "rgba(255,255,255,0.95)", borderColor: "var(--color-primary)" }}
      >
        <div className="flex flex-col items-center mb-6">
          <div
            className="rounded-full p-3 shadow-lg mb-2"
            style={{ background: "var(--color-primary)" }}
          >
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 2a7 7 0 0 1 7 7c0 2.5-1.5 4.5-3.5 5.5v1.5h2a2 2 0 0 1 2 2v2.5a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V18a2 2 0 0 1 2-2h2v-1.5C6.5 13.5 5 11.5 5 9A7 7 0 0 1 12 2Zm0 2a5 5 0 0 0-5 5c0 1.9 1.2 3.5 3 4.3V17h4v-5.7c1.8-.8 3-2.4 3-4.3a5 5 0 0 0-5-5Z"/></svg>
          </div>
          <h2
            className="text-2xl font-bold text-center"
            style={{ color: "var(--color-blackheading)" }}
          >
            Admin Girişi
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-darkgray)" }}>Kullanıcı Adı</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition shadow-sm bg-white/80 placeholder-gray-400"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="off"
              spellCheck={false}
              onPaste={preventPaste}
              onCopy={preventCopy}
              onCut={preventCut}
              onContextMenu={preventContextMenu}
              onKeyDown={preventScript}
              style={{ borderColor: "var(--color-darkgray)", color: "var(--color-darkgray)" }}
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-darkgray)" }}>Şifre</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition shadow-sm bg-white/80 placeholder-gray-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="off"
              spellCheck={false}
              onPaste={preventPaste}
              onCopy={preventCopy}
              onCut={preventCut}
              onContextMenu={preventContextMenu}
              onKeyDown={preventScript}
              style={{ borderColor: "var(--color-darkgray)", color: "var(--color-darkgray)" }}
              placeholder="Şifreniz"
            />
          </div>
          {error && <div className="text-red-600 text-sm text-center font-medium animate-pulse">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold shadow-md transition text-lg tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-bgwhite)",
              border: "none"
            }}
            disabled={loading}
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage; 