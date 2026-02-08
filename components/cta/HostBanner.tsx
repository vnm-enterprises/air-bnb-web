"use client";

import { useState } from "react";

// Custom Button Component
function Button({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline";
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses =
    variant === "outline"
      ? "border border-white text-white hover:bg-white/10 transition-colors"
      : "bg-white text-slate-900 hover:bg-slate-100 shadow-lg";

  return (
    <button
      onClick={onClick}
      className={`font-medium rounded-xl transition-all ${sizeClasses[size]} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
}

export default function HostBanner() {
  return (
    <section className="my-16 bg-slate-200  py-12">
      <div className="relative overflow-hidden rounded-lg">
        <div className="relative h-[520px] md:h-[600px] rounded-lg overflow-hidden max-w-7xl mx-auto">

          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/55 to-slate-800/30 " />

          <div className="absolute inset-y-0 left-0 w-full md:w-[60%] bg-gradient-to-r from-slate-900/80 to-transparent" />

          <div className="relative h-full flex flex-col justify-center px-6 sm:px-12 py-12 md:py-20 mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Unlock the potential of your space.
              </h2>
              <p className="text-lg text-slate-200 mb-8 max-w-2xl">
                Join a community of thousands who&apos;ve turned their properties into successful short-stay businesses. We handle the complexity, you keep the rewards.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="default">
                  Become a host
                </Button>
                <Button size="lg" variant="outline">
                  Learn how it works
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
