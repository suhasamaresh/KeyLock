import React, { useState, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ReactNode } from "react";

const MovingBorder = ({
  children,
  duration = 4000,
  ...otherProps
}: {
  children: ReactNode;
  duration?: number;
  [key: string]: any;
}) => {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val) => {
    const point = pathRef.current?.getPointAtLength(val);
    return point ? point.x : 0;
  });
  const y = useTransform(progress, (val) => {
    const point = pathRef.current?.getPointAtLength(val);
    return point ? point.y : 0;
  });

  const rotation = useTransform(progress, (val) => {
    if (!pathRef.current) return 0;
    const length = pathRef.current.getTotalLength();
    const step = Math.max(5, length * 0.02);
    const prevPoint = pathRef.current.getPointAtLength(
      Math.max(0, val - step / 2)
    );
    const nextPoint = pathRef.current.getPointAtLength(
      Math.min(length, val + step / 2)
    );

    if (!prevPoint || !nextPoint) return 0;

    const dx = nextPoint.x - prevPoint.x;
    const dy = nextPoint.y - prevPoint.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  });

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%) rotate(${rotation}deg)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx="28"
          ry="28"
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          // other CSS properties here
          // transform will be merged below
          ...{ transform },
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

interface ShareLinkModalProps {
  url: string;
  onClose: () => void;
}

const ShareLinkModal: React.FC<ShareLinkModalProps> = ({ url, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative overflow-hidden p-[1px]"
            style={{ borderRadius: "1.5rem" }}
          >
            <div
              className="absolute inset-0"
              style={{ borderRadius: "calc(1.5rem * 0.96)" }}
            >
              <MovingBorder duration={3000}>
                <div
                  style={{
                    width: "150px",
                    height: "6px",
                    background:
                      "linear-gradient(90deg, rgba(249,225,22,0) 0%, rgba(249,225,22,0.3) 30%, rgba(249,225,22,0.8) 70%, #F97316 90%, #ffffff 100%)",
                    filter: "drop-shadow(0 0 8px #F97316) blur(0.3px)",
                    borderRadius: "0px",
                    opacity: 0.9,
                    boxShadow: "0 0 20px #F97316",
                    clipPath: "polygon(0% 50%, 30% 20%, 70% 10%, 100% 0%, 100% 100%, 70% 90%, 30% 80%)",
                    transformOrigin: "center",
                  }}
                />
              </MovingBorder>
            </div>

            <div
              className="relative backdrop-blur-sm p-6 shadow-2xl border border-gray-700"
              style={{
                backgroundColor: "rgba(255, 255, 254, 0.08)",
                borderRadius: "calc(1.5rem * 0.96)",
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
                style={{ 
                  backgroundColor: "rgba(255, 255, 254, 0.1)",
                  color: "#94a1b2"
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="space-y-4">
                <div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "#fffffe" }}
                  >
                    🔗 Shareable Link Created!
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "#94a1b2" }}
                  >
                    Your secret has been securely encrypted. Share this link to allow others to access it:
                  </p>
                </div>

                <div className="space-y-3">
                  <div
                    className="p-3 rounded-lg border border-opacity-20 border-gray-600 break-all text-sm font-mono"
                    style={{ 
                      backgroundColor: "rgba(255, 255, 254, 0.05)",
                      color: "#fffffe"
                    }}
                  >
                    {url}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50"
                      style={{
                        backgroundColor: "#F97316",
                        color: "#fffffe",
                      }}
                    >
                      {copied ? "✓ Copied!" : "📋 Copy Link"}
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 border border-opacity-20 border-gray-600"
                      style={{
                        backgroundColor: "rgba(255, 255, 254, 0.05)",
                        color: "#94a1b2",
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>

                <div
                  className="text-xs text-center pt-2 border-t border-opacity-10 border-gray-600"
                  style={{ color: "#94a1b2" }}
                >
                  This link will expire based on your settings. Save it securely!
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShareLinkModal;