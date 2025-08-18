import { motion } from "framer-motion";

export function AnimatedAuroraBackground({ children }) {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-stone-950">
      {/* This creates the moving aurora effect */}
      <div className="absolute inset-0 z-0 opacity-40">
        <motion.div
          initial={{ backgroundPosition: "0% 50%" }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          style={{
            backgroundImage: `radial-gradient(ellipse at 20% 40%, hsla(142, 76%, 36%, 0.3) 0%, transparent 50%),
                             radial-gradient(ellipse at 80% 50%, hsla(240, 6%, 96%, 0.2) 0%, transparent 50%)`,
          }}
          className="absolute inset-0"
        />
        <motion.div
          initial={{ backgroundPosition: "100% 50%" }}
          animate={{ backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"] }}
          transition={{ duration: 50, ease: "linear", repeat: Infinity, delay: 5 }}
          style={{
            backgroundImage: `radial-gradient(ellipse at 10% 90%, hsla(142, 76%, 36%, 0.2) 0%, transparent 50%),
                             radial-gradient(ellipse at 90% 10%, hsla(240, 5%, 50%, 0.2) 0%, transparent 50%)`,
          }}
          className="absolute inset-0"
        />
      </div>

      {/* This is where your main content will go, on top of the background */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}