import { motion } from "framer-motion";

export function GridMotionBackground({ children }) {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white">
      {/* This creates the moving grid effect */}
      <motion.div
        initial={{ backgroundPosition: "0% 0%" }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{
          duration: 40,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
        className="absolute inset-0 z-0 opacity-50"
      />
      {/* This adds the soft color glow */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white via-emerald-50 to-white" />
      
      <div className="relative z-10 flex h-full w-full items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}