import UploadCard from "@/components/UploadCard";
import Link from "next/link";

export default function Home() {
  return (
    <section className="w-full h-full py-20 md:py-24 lg:py-32 xl:py-48 bg-black">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter wider sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                KazAI: Your Smart Study Companion
              </h1>
              <p className="max-w-[600px] text-zinc-200 md:text-xl dark:text-zinc-100 mx-auto">
                (Beta Version )
              </p>
              <p className="max-w-[600px] text-zinc-200 md:text-xl dark:text-zinc-100 mx-auto">
                Got a Problem? Just Upload and Watch AI Work Its Magic: Easy,
                Fast, Student-Approved
              </p>
              <p className="max-w-[600px] text-zinc-200 text-xs mx-auto">
                made with 🧡 by{" "}
                <Link
                  href="https://syncline.com/"
                  className="text-blue-500 hover:text-blue-300 underline font-bold"
                >
                  Rishi Vhavle
                </Link>
              </p>
            </div>
            <div className="w-full space-y-2 mx-auto">
              <UploadCard />
              <p className="text-xs text-zinc-200 dark:text-zinc-100">
                Get ready to be the next topper of your class : D
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
