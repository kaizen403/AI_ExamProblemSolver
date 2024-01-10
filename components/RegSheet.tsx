"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
export default function RegSheet() {
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
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Create an account</h1>
      <p className="text-s mb-12"></p>
      <div className="w-full max-w-xs p-8 border border-gray-700 rounded-lg">
        <form className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              className="bg-gray-800 border-none text-white"
              id="email"
              placeholder="Enter your email"
              type="email"
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
              type="password"
            />
          </div>

          <Button className="bg-white text-black">Signup</Button>
          <p className="text-center">or</p>

          <Button
            onClick={() => signIn("google")}
            className="bg-white text-black flex items-center justify-center space-x-2"
          >
            <GoogleSvg />
            <span>Signin with Google</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
