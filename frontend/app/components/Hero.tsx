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

  return (
    <div
      className="min-h-screen"
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
                <span style={{
                  color: "#F97316",
                }}>
                <Lock size={42} className="inline-block align-middle" />
                <span>Retrieval</span></span>
                <span>Flow</span>
              </span>
            </h1>

            <p
              className="text-lg md:text-xl leading-relaxed font-medium max-w-2xl"
              style={{ color: "#A8A29E" }}
            >
              Experience next-level security—KeyLock encrypts your data with the power and speed of Rust.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end cursor-none">
            <div className="w-full max-w-md">
              <div
                className="relative overflow-hidden p-[1px]"
                style={{ borderRadius: "1.75rem" }}
              >
                <div
                  className="absolute inset-0 bg-[#292524]"
                  style={{ borderRadius: "calc(1.75rem * 0.96)" }}
                >
                  <MovingBorder duration={4000}>
                    <div
                      style={{
                        width: "200px",
                        height: "8px",
                        background:
                          "linear-gradient(90deg, rgba(249,225,22,0) 0%, rgba(249,225,22,0.1) 20%, rgba(249,225,22,0.4) 40%, rgba(249,225#F97316,0.7) 60%, #F5F5F4 80%, #F5F5F4 90%, #F5F5F4 100%)",
                        filter:
                          "drop-shadow(0 0 12px #F97316) drop-shadow(0 0 20px #F97316) blur(0.5px)",
                        borderRadius: "0px",
                        opacity: 0.95,
                        boxShadow: "0 0 25px #F97316, 0 0 50px #F97316",
                        clipPath:
                          "polygon(0% 50%, 20% 20%, 80% 5%, 100% 0%, 100% 100%, 80% 95%, 20% 80%)",
                        transformOrigin: "center",
                      }}
                    />
                  </MovingBorder>
                </div>

                <div
                  className="relative backdrop-blur-sm p-8 shadow-2xl 
             h-full w-full border border-[#44403C] cursor-none"
                  style={{
                    backgroundColor: "rgba(255, 255, 254, 0.05)",
                    borderRadius: "calc(1.75rem * 0.96)",
                  }}
                >
                  <div className="space-y-6">
                    <div>
                      <input
                        type="text"
                        placeholder="Input the secret message here"
                        value={secretMessage}
                        onChange={(e) => setSecretMessage(e.target.value)}
                        className="w-full px-4 py-4 rounded-md border border-opacity-20 border-[#44403C] bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-opacity-50 focus:border-[#F97316] transition-all duration-300 text-lg"
                        style={{ backgroundColor: "rgba(255, 255, 254, 0.05)" }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="number"
                          placeholder="Expiry (minutes)"
                          value={expiryMinutes}
                          onChange={(e) => setExpiryMinutes(e.target.value)}
                          className="w-full px-4 py-4 rounded-md border border-opacity-20 border-[#44403C] bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-opacity-50 focus:border-[#F97316] transition-all duration-300 text-lg"
                          style={{
                            backgroundColor: "rgba(255, 255, 254, 0.05)",
                          }}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Max views"
                          value={maxViews}
                          onChange={(e) => setMaxViews(e.target.value)}
                          className="w-full px-4 py-4 rounded-md border border-opacity-20 border-[#44403C] bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-opacity-50 focus:border-[#F97316] transition-all duration-300 text-lg"
                          style={{
                            backgroundColor: "rgba(255, 255, 254, 0.05)",
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={handleGetShareableLink}
                        disabled={isLoading}
                        className="w-full py-4 px-6 rounded-md text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={{
                          backgroundColor: "#F97316",
                          color: "#F5F5F4",
                        }}
                      >
                        {isLoading ? "Creating Link... " : "Get Shareable Link"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500 rounded-full opacity-5 blur-3xl"></div>
        </div>
      </div>

      {showModal && <ShareLinkModal url={shareableUrl} onClose={closeModal} />}
    </div>
  );
}
