import { Lock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
}

export default function LockScreen({ isLocked, onUnlock }: LockScreenProps) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
      );
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          data-ocid="lockscreen.panel"
          className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer select-none"
          style={{ zIndex: 9999 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onUnlock}
        >
          {/* Blurred wallpaper backdrop */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url('/assets/generated/ubuntu-wallpaper.dim_1920x1080.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(24px) brightness(0.35) saturate(0.6)",
              transform: "scale(1.05)",
            }}
          />
          {/* Dark overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(5, 2, 15, 0.55)" }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            {/* Ubuntu logo circle */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
              style={{
                background: "rgba(233,84,32,0.15)",
                border: "1.5px solid rgba(233,84,32,0.4)",
                boxShadow: "0 0 40px rgba(233,84,32,0.18)",
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" fill="#E95420" />
                <circle cx="12" cy="4.5" r="2" fill="white" />
                <circle cx="19.5" cy="16" r="2" fill="white" />
                <circle cx="4.5" cy="16" r="2" fill="white" />
                <path
                  d="M12 6.5L18 16.5H6L12 6.5Z"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Time */}
            <div
              className="tabular-nums font-light tracking-tight"
              style={{
                fontSize: "clamp(72px, 12vw, 112px)",
                color: "rgba(255,255,255,0.95)",
                lineHeight: 1,
                textShadow: "0 4px 32px rgba(0,0,0,0.6)",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {time}
            </div>

            {/* Date */}
            <div
              style={{
                fontSize: "20px",
                color: "rgba(255,255,255,0.65)",
                letterSpacing: "0.04em",
                textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              }}
            >
              {date}
            </div>

            {/* Lock hint */}
            <motion.div
              className="flex flex-col items-center gap-2 mt-8"
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2.8,
                ease: "easeInOut",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <Lock size={18} style={{ color: "rgba(255,255,255,0.7)" }} />
              </div>
              <span
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.45)",
                  letterSpacing: "0.08em",
                }}
              >
                Click anywhere to unlock
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
