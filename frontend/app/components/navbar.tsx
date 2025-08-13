"use client";
import React from "react";
import { Github } from "lucide-react";

const Navbar = () => {

  return (
    <nav
      className="w-full sticky top-0 z-50 "
      style={{ backgroundColor: "#1C1917" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a
              href="#"
              className="text-xl font-black tracking-tight hover:opacity-80 transition-opacity duration-200
                        "
              style={{ color: "#fffffe" }}
            >
              {" "}
              KEYLOCK
            </a>
          </div>
          <a
            href="https://github.com/suhasamaresh/KeyLock"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md hover:opacity-70 transition-opacity duration-200"
            style={{ color: "#F97316" }}
            aria-label="GitHub Repository"
          >
            <Github className="h-6 w-6" />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
