"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { ChangeEvent, useState } from "react";

export default function RegisterPage() {
  const GoogleSvg = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M23.64 12.204c0-.638-.057-1.252-.164-1.845H12v3.481h6.844a5.884 5.884 0 01-2.555 3.87v3.225h4.134c2.42-2.234 3.815-5.52 3.815-9.731z"
      ></path>
      <path
        fill="#4285F4"
        d="M12 24c3.3 0 6.066-1.092 8.096-2.958l-4.134-3.225c-1.1.732-2.503 1.168-3.962 1.168-3.047 0-5.627-2.065-6.54-4.844H1.347v3.043A11.99 11.99 0 0012 24z"
      ></path>
      <path
        fill="#FBBC05"
        d="M5.46 14.545a7.088 7.088 0 010-5.09V6.412H1.347a11.99 11.99 0 000 10.776l4.113-3.043z"
      ></path>
      <path
        fill="#34A853"
        d="M12 4.958c1.732 0 3.285.595 4.505 1.777l3.377-3.377C17.965 1.093 15.3 0 12 0 7.41 0 3.433 3.229 1.347 7.412l4.113 3.133c.913-2.778 3.493-4.843 6.54-4.843z"
      ></path>
    </svg>
  );
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormValues({ name: "", email: "", password: "" });

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setLoading(false);
      if (!res.ok) {
        setError((await res.json()).message);
        return;
      }

      signIn(undefined, { callbackUrl: "/" });
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Create an Account</h1>
      {error && (
        <p className="text-center bg-red-300 py-4 mb-6 rounded">{error}</p>
      )}
      <p className="text-s mb-12"></p>
      <div className="w-full max-w-xs p-8 border border-gray-700 rounded-lg">
        <form className="flex flex-col space-y-6" onSubmit={onSubmit}>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Name
            </label>
            <Input
              required
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              className="bg-gray-800 border-none text-white"
              id="name"
              placeholder="Enter your Full Name"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              required
              type="email"
              value={formValues.email}
              onChange={handleChange}
              name="email"
              className="bg-gray-800 border-none text-white"
              id="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Input
              className="bg-gray-800 border-none text-white"
              id="password"
              placeholder="Enter your password"
              required
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
            />
          </div>
          <Button
            type="submit"
            style={{ backgroundColor: `${loading ? "#ccc" : null}` }}
            disabled={loading}
            className="bg-white text-black"
          >
            {loading ? "loading..." : "Sign Up"}
          </Button>
        </form>
      </div>
    </div>
  );
}
