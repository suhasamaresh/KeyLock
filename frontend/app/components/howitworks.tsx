"use client";

import React, { useState, useEffect } from "react";
import {
  Cog6ToothIcon,
  EyeIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArchiveBoxIcon,
  ArrowTrendingUpIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import motion from "framer-motion"

export default function BentoGrid() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= 1000) {
          clearInterval(timer);
          return 1000;
        }
        return prev + 10;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  const titleStyle = {
    fontFamily: "Oxanium, sans-serif",
    fontSize: "30px",
    color: "#F5F5F4",
    fontWeight: "700",
  };

  const descStyle = {
    fontFamily: "Oxanium, sans-serif",
    fontSize: "14px",
    color: "#A8A29E",
  };

  const highlightStyle = {
    fontFamily: "Oxanium, sans-serif",
    fontSize: "36px",
    color: "#F5F5F4",
    fontWeight: "700",
  };

  return (
    <div style={{ background: "#1C1917" }}>
    <div
      className="min-h-screen p-4 md:p-8 flex items-center justify-center "
    >
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8 md:mb-12">
          <h1 style={highlightStyle} className="mb-4">
            Built for Security
          </h1>
          <p
            className="max-w-2xl mx-auto px-4 font-merriweather"
            style={{
              fontSize: "16px",
              color: "#A8A29E",
            }}
          >
            secret sharing with modern architecture and
            uncompromising security
          </p>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 
                        lg:grid-rows-[auto_minmax(0,0.66fr)] gap-6 auto-rows-auto"
        >
          <div
            className="md:col-span-2 lg:col-span-2 lg:row-span-1 bg-[#292524] 
                          border border-[#44403C] rounded-2xl p-8 flex flex-col justify-between 
                          hover:border-[#F97316] transition-all duration-300 hover:shadow-lg hover:shadow-[#0EA5E9]/10 relative overflow-hidden group"
          >
            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
              <div
                className="p-4 rounded-xl bg-[#1C1917] border border-[#44403C] 
                              hover:border-[#F97316] transition-all duration-300"
              >
                <Cog6ToothIcon className="w-14 h-14 text-[#F5F5F4]" />
              </div>
              <div style={highlightStyle}>Rust Backend</div>
              <p style={descStyle} className="leading-relaxed max-w-lg">
                Built with modern Rust, our backend ensures lightning-fast
                performance while maintaining uncompromising safety.
                <span className="block mt-2">
                  Reliability and speed go hand-in-hand with:
                </span>
              </p>
              <div className="grid grid-cols-2 gap-4 w-full max-w-lg mt-2">
                <div
                  className="bg-[#1C1917] p-3 rounded-lg border border-[#44403C] 
                                hover:border-[#F97316] transition"
                >
                  <h4 style={titleStyle} className="text-lg mb-1">
                    Async Runtime
                  </h4>
                  <p style={descStyle}>High-concurrency processing</p>
                </div>
                <div
                  className="bg-[#1C1917] p-3 rounded-lg border border-[#44403C] 
                                hover:border-[#F97316] transition"
                >
                  <h4 style={titleStyle} className="text-lg mb-1">
                    Memory Safe
                  </h4>
                  <p style={descStyle}>No null pointers or data races</p>
                </div>
                <div
                  className="bg-[#1C1917] p-3 rounded-lg border border-[#44403C] 
                                hover:border-[#F97316] transition"
                >
                  <h4 style={titleStyle} className="text-lg mb-1">
                    Crypto Optimized
                  </h4>
                  <p style={descStyle}>Faster secure operations</p>
                </div>
                <div
                  className="bg-[#1C1917] p-3 rounded-lg border border-[#44403C] 
                                hover:border-[#F97316] transition"
                >
                  <h4 style={titleStyle} className="text-lg mb-1">
                    Scalable
                  </h4>
                  <p style={descStyle}>Handles millions of secrets</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block absolute inset-0 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity duration-300">
              <div className="absolute top-0 left-0 w-full h-full">
                <svg width="100%" height="100%" className="absolute inset-0">
                  <defs>
                    <pattern
                      id="crab"
                      patternUnits="userSpaceOnUse"
                      width="120"
                      height="80"
                    >
                      <path
                        d="M94.894,61.967c0.489-0.77,0.913-1.561,1.254-2.373l15.101-2.649L127.5,63.82l-15.75-15.75l-14.236,2.847  c-0.137-0.747-0.339-1.481-0.599-2.202l11.882-4.582l9.256-12.477l-0.01,0c3.918-5.304,0.148-15.461-8.671-23.044  c-5.68-4.887-12.118-7.54-17.212-7.555l11.714,23.453l-19.909-10.085c1.471,4.302,4.7,8.963,9.307,12.92  c3.7,3.183,7.717,5.417,11.477,6.595l-2.841,6.256l-7.808,3.66c-3.78-4.615-10.235-8.232-18.095-10.044  c0.498-0.612,0.797-1.393,0.797-2.243c0-1.966-1.594-3.561-3.561-3.561c-1.966,0-3.561,1.594-3.561,3.561  c0,0.438,0.083,0.855,0.227,1.242c-1.759-0.18-3.562-0.277-5.403-0.277c-1.84,0-3.644,0.097-5.403,0.277  c0.144-0.387,0.227-0.805,0.227-1.242c0-1.966-1.594-3.561-3.561-3.561s-3.561,1.594-3.561,3.561c0,0.851,0.299,1.631,0.797,2.243  c-7.86,1.812-14.315,5.429-18.096,10.045l-7.81-3.661l-2.842-6.256c3.759-1.177,7.774-3.409,11.472-6.589  c4.607-3.957,7.836-8.623,9.312-12.93l-19.914,10.085L36.335,1.059C31.235,1.079,24.807,3.727,19.122,8.62  c-8.819,7.582-12.588,17.746-8.665,23.047l9.246,12.464l11.884,4.583c-0.26,0.721-0.462,1.455-0.599,2.202l-14.238-2.847  L1,63.82l15.75-7.875l15.104,2.65c0.341,0.812,0.764,1.602,1.253,2.372l-16.358,2.853l-7.875,12.797l13.308-8.456l15.734-1.362  l2.125,2.404l-6.557,1.508L24.625,79.57l9.825,7.86c0.001,0.001,0.002,0.003,0.004,0.005c0-0.001,0-0.001,0-0.001l0.014,0.011  l-0.006-0.026c0.472-0.849,0.745-1.824,0.745-2.865c0-2.079-1.076-3.903-2.7-4.956l-0.007-0.027l4.43-3.937h8.794l1.127,1.276  c0.811,0.918,1.977,1.443,3.202,1.443h27.722c1.225,0,2.391-0.525,3.202-1.443l1.127-1.276h8.963l4.43,3.937l-0.007,0.027  c-1.623,1.052-2.7,2.877-2.7,4.956c0,1.04,0.272,2.016,0.745,2.865l-0.006,0.026l0.014-0.011c0,0,0,0,0,0.001  c0.001-0.001,0.002-0.003,0.004-0.005l9.825-7.86l-8.859-8.859l-6.697-1.54l2.108-2.385l15.891,1.376l13.308,8.456l-7.875-12.797  L94.894,61.967z"
                        fill="#44403C"
                        className="group-hover:stroke-[#F97316] transition-all duration-300"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill="url(#crab)"
                    opacity="0.8"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div
            className="md:col-span-2 lg:col-span-2 lg:row-span-1 lg:row-start-2 
                          bg-[#292524] border border-[#44403C] rounded-2xl p-6 
                          flex flex-col md:flex-row items-center hover:border-[#F97316] 
                          transition-all duration-300 hover:shadow-lg hover:shadow-[#0EA5E9]/10 min-h-[110px]"
          >
            <div
              className="p-4 rounded-xl bg-[#1C1917] border border-[#44403C] 
                            mb-4 md:mb-0 md:mr-6 flex items-center justify-center"
            >
              <EyeIcon className="w-12 h-12 text-[#F5F5F4]" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 style={titleStyle} className="mb-2">
                View Limits
              </h3>
              <p style={descStyle}>
                Set how many times your secret can be accessed before deletion.
              </p>
            </div>
          </div>
          <div
            className="bg-[#292524] border border-[#44403C] rounded-2xl p-6 
                          flex flex-col items-center text-center hover:border-[#F97316] 
                          transition-all duration-300 hover:shadow-lg hover:shadow-[#0EA5E9]/10 relative overflow-hidden group"
          >
            <ArrowTrendingUpIcon className="w-10 h-10 text-[#F97316] mb-2 relative z-10" />
            <span style={highlightStyle} className="relative z-10">
              {count}
            </span>
            <p style={descStyle} className="mt-2 relative z-10">
              Shared securely across the globe
            </p>

            <div className="grid grid-cols-2 gap-3 w-full mt-4 relative z-10">
              <div className="bg-[#1C1917] p-2 rounded-lg border border-[#44403C]">
                <GlobeAltIcon className="w-6 h-6 text-[#F97316] mb-1" />
                <p style={descStyle}>50+ Countries</p>
              </div>
              <div className="bg-[#1C1917] p-2 rounded-lg border border-[#44403C]">
                <ClockIcon className="w-6 h-6 text-[#F97316] mb-1" />
                <p style={descStyle}>200ms Speed</p>
              </div>
              <div className="bg-[#1C1917] p-2 rounded-lg border border-[#44403C]">
                <ShieldCheckIcon className="w-6 h-6 text-[#F97316] mb-1" />
                <p style={descStyle}>AES-256</p>
              </div>
              <div className="bg-[#1C1917] p-2 rounded-lg border border-[#44403C]">
                <ArchiveBoxIcon className="w-6 h-6 text-[#F97316] mb-1" />
                <p style={descStyle}>Zero Logs</p>
              </div>
            </div>

            <div className="hidden lg:block absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-300">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#57534E] to-transparent group-hover:via-[#F97316] transition-all duration-300"
                  style={{ top: `${(i + 1) * 12.5}%` }}
                />
              ))}

              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#57534E] to-transparent group-hover:via-[#F97316] transition-all duration-300"
                  style={{ left: `${(i + 1) * 16.66}%` }}
                />
              ))}
            </div>
          </div>

          <div
            className="bg-[#292524] border border-[#44403C] rounded-2xl p-6 
                          flex flex-col items-center text-center hover:border-[#F97316] 
                          transition-all duration-300 hover:shadow-lg hover:shadow-[#0EA5E9]/10 relative overflow-hidden group"
          >
            <div className="p-3 rounded-xl bg-[#1C1917] border mb-4 relative z-10">
              <ShieldCheckIcon className="w-8 h-8 text-[#F5F5F4]" />
            </div>
            <h3 style={titleStyle} className="mb-3 relative z-10">
              End-to-End Encryption
            </h3>
            <p style={descStyle} className="relative z-10">
              AES-256 ensures your secrets remain yours.
              <span className="block mt-2">
                Zero knowledge storage, no tracking.
              </span>
            </p>

            <div className="grid grid-cols-2 gap-3 w-full mt-4 relative z-10">
              <div className="bg-[#1C1917] p-2 rounded-lg border border-[#44403C]">
                <GlobeAltIcon className="w-6 h-6 text-[#F97316] mb-1" />
                <p style={descStyle}>Works globally</p>
              </div>
              <div className="bg-[#1C1917] p-2 rounded-lg border border-[#44403C]">
                <ShieldCheckIcon className="w-6 h-6 text-[#F97316] mb-1" />
                <p style={descStyle}>Tamper-proof</p>
              </div>
            </div>

            <div className="hidden lg:block absolute inset-0 pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-300">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#57534E] to-transparent group-hover:via-[#F97316] transition-all duration-300"
                  style={{ top: `${(i + 1) * 12.5}%` }}
                />
              ))}

              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full w-px bg-gradient-to-b from-transparent via-[#57534E] to-transparent group-hover:via-[#F97316] transition-all duration-300"
                  style={{ left: `${(i + 1) * 16.66}%` }}
                />
              ))}
            </div>
          </div>
          <div
            className="bg-[#292524] border border-[#44403C] rounded-2xl p-8 
                          flex flex-col items-center justify-center text-center hover:border-[#F97316] 
                          transition-all duration-300 hover:shadow-lg hover:shadow-[#0EA5E9]/10 min-h-[110px]"
          >
            <h3 style={titleStyle} className="mb-6 mt-4">
              Auto-Expiration
            </h3>
          </div>

          <div
            className="bg-[#292524] border border-[#44403C] rounded-2xl p-8 
                          flex flex-col items-center justify-center text-center hover:border-[#F97316] 
                          transition-all duration-300 hover:shadow-lg hover:shadow-[#0EA5E9]/10 min-h-[110px]"
          >
            <h3 style={titleStyle} className="mb-6 mt-4">
              Automatic Deletion
            </h3>
          </div>
        </div>
      </div>
      </div><span className="absolute inset-x-0 bg-gradient-to-r from-transparent via-yellow-600 to-transparent h-px "> </span>
    </div>
  );
}
