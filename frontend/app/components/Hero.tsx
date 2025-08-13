"use client";
import React, { useState, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ReactNode } from "react";
import ShareLinkModal from "./ShareLinkModal";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

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
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

async function shareSecret(
  secretText: string,
  expireMinutes: number,
  maxViews: number
) {
  try {
    console.log("Sending secret to backend:", {
      secret: secretText,
      expire_minutes: expireMinutes,
      max_views: maxViews,
    });

    console.log("Attempting to connect to backend...");
    const response = await fetch("https://keylock.onrender.com/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: secretText,
        expire_minutes: expireMinutes,
        max_views: maxViews,
      }),
    });

    console.debug("Received response:", response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend returned error:", response.status, errorText);
      throw new Error(
        `Failed to share secret: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();
    console.debug("Parsed response JSON:", data);

    if (!data.url) {
      console.error("No URL in response:", data);
      throw new Error("No URL returned from backend");
    }

    return data.url;
  } catch (err) {
    console.error("Error in shareSecret:", err);
    throw err;
  }
}

export default function Hero() {
  const [secretMessage, setSecretMessage] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shareableUrl, setShareableUrl] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleGetShareableLink = async () => {
    if (!secretMessage.trim()) {
      alert("Please enter a secret message");
      return;
    }

    const expiry = parseInt(expiryMinutes) || 10;
    const views = parseInt(maxViews) || 3;

    console.log("Inputs for secret:", {
      secretMessage,
      expiryMinutes,
      maxViews,
      expiry,
      views,
    });

    setIsLoading(true);
    try {
      const url = await shareSecret(secretMessage, expiry, views);
      console.log("Shareable URL received:", url);
      setShareableUrl(url);
      setShowModal(true);
    } catch (error) {
      alert("Failed to create shareable link");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setShareableUrl("");
  };

  const router = useRouter();

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: `
      linear-gradient(180deg, 
          #1C1917 0%, 
          #292524 25%, 
          #1C1917 50%, 
          #0C0A09 75%, 
          #000000 100%
        )`,
      }}
    >
      <div className="container mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="py-2 px-4 bg-[#57534E] text-[#F5F5F4] rounded-full inline-block border border-[#F97316]">
              <span className="bg-[#F97316] text-[#F5F5F4] rounded-full  inline-block mr-2">
                ✦
              </span>
              Transfer safely
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight"
              style={{ color: "#F5F5F4" }}
            >
              <span className="font-oxanium font-bold"> KeyLock</span>
              <span className="italic font-[var(--font-merriweather)] text-[#F97316]">
                {" "}
                Secret{" "}
              </span>
              <br />
              <span className="inline-flex items-center gap-2 font-bold">
                <span
                  style={{
                    color: "#F97316",
                  }}
                >
                  <Lock size={42} className="inline-block align-middle" />
                  <span>Retrieval</span>
                </span>
                <span>Flow</span>
              </span>
            </h1>

            <p
              className="text-lg md:text-xl leading-relaxed font-merriweather max-w-2xl"
              style={{ color: "#A8A29E" }}
            >
              Experience next-level security—KeyLock encrypts your data with the
              power and speed of Rust. No Authentication Required!
            </p>

            <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => router.push("/upload")}
            className="bg-[#F97316] text-[#F5F5F4] py-3 px-5 rounded-full hover:text-[#44403C]">
              Get Started
            </motion.button>
          </div>

          {/* Video Section - Right Side */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-lg">
              <div 
                className="relative aspect-video rounded-2xl overflow-hidden border border-[#44403C] shadow-2xl"
                style={{
                  backgroundColor: "rgba(255, 255, 254, 0.05)",
                }}
              >
                <video
                  src="/keylock.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(45deg, transparent 0%, rgba(249, 115, 22, 0.05) 100%)"
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500 rounded-full opacity-5 blur-3xl"></div>
        </div>
      </div>

      {showModal && <ShareLinkModal url={shareableUrl} onClose={closeModal} />}
    </div>
  );
}