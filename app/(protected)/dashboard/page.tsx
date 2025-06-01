"use client";

import { signOut, useSession } from "next-auth/react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    title: "AI Assistant",
    description:
      "Get intelligent suggestions and autocompletions powered by advanced AI",
    icon: "🤖",
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "Real-time Sync",
    description: "Your notes sync instantly across all your devices",
    icon: "⚡",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Smart Organization",
    description: "Automatically categorize and tag your notes",
    icon: "🎯",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Secure & Private",
    description: "End-to-end encryption keeps your data safe",
    icon: "🔒",
    color: "from-orange-500 to-yellow-500",
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 0 };
  const spring = useSpring(scrollYProgress, springConfig);
  const scale = useTransform(spring, [0, 1], [1, 0.8]);
  const y = useTransform(spring, [0, 1], [0, -100]);

  return (
    <div
      ref={targetRef}
      className="min-h-screen bg-gradient-to-b from-black to-zinc-900"
    >
     
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", ...springConfig }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl"
        >
          ✨
        </motion.span>
        <h1 className="text-white font-bold">NoteFusion</h1>
        <div className="h-4 w-px bg-white/20 mx-2" />
        <p className="text-white/70">Welcome, {session?.user?.name}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => signOut()}
          className="ml-2 px-4 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/90 text-sm font-medium transition-colors"
        >
          Sign Out
        </motion.button>
      </motion.nav>

  
      <motion.div
        style={{ scale, y }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute -inset-20 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 text-center"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white/50 pb-4">
              NoteFusion
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto">
              Transform your ideas into reality with AI-powered note-taking
            </p>
          </motion.div>
        </div>
      </motion.div>


      <div className="relative z-10 px-4 pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl bg-zinc-900/50 backdrop-blur-sm p-8 hover:bg-zinc-800/50 border border-zinc-800 transition-all duration-500 shadow-2xl"
            >
          
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

     
              <div className="relative z-10 flex items-start space-x-4">
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-10`}
                >
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

           
              <motion.div
                initial={false}
                className="mt-6 flex items-center space-x-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
              >
                <span className="text-sm font-medium text-white/70">
                  Learn more
                </span>
                <svg
                  className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.div>

   
              <div
                className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
