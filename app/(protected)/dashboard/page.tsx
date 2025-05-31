"use client";

import { signOut, useSession } from "next-auth/react";
import { useScroll, motion } from "framer-motion";
import { useRef } from "react";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";

export default function DashboardPage() {
  const { data: session } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);

  const pathRefs = Array.from({ length: 5 }).map(() =>
    useScroll({
      target: containerRef,
      offset: ["start end", "end end"],
    })
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-black relative">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 p-4 z-50 bg-black/30 backdrop-blur-sm border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.h2
            className="text-white/90 text-xl font-bold tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            NoteFusion
          </motion.h2>
          <div className="flex items-center gap-6">
            <p className="text-white/80 font-medium">
              Welcome, {session?.user?.name || session?.user?.email}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut()}
              className="px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/20 font-semibold"
            >
              Sign Out
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-32 relative z-10">
        <GoogleGeminiEffect
          pathLengths={pathRefs.map((ref) => ref.scrollYProgress)}
          title="Welcome to NoteFusion"
          description="Your AI-powered notebook assistant"
          className="relative z-20 font-semibold"
        />
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />
    </div>
  );
}
