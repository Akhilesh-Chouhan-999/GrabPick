import React from "react";

const LoginPage = () => {
  return (
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_60%)]">
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl">
          AI Powered Graphic Intelligence
        </h1>

        <p className="mt-6 text-gray-400 max-w-2xl text-lg">
          Generate, manage, and discover smart visuals using AI. Build stunning
          graphics in seconds with next-gen intelligence.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex gap-6">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition">
            Generate Now
          </button>

          <button className="px-8 py-3 border border-white/20 hover:border-white/40 rounded-xl text-white transition">
            Explore Features
          </button>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
