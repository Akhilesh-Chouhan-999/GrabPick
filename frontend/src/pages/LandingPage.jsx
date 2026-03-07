import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Camera,
  ScanFace,
  Image,
  Shield,
  Zap,
  Users,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

const features = [
  {
    icon: <ScanFace className="w-6 h-6" />,
    title: "AI Face Recognition",
    desc: "Upload a selfie and instantly find all your photos from any event using cutting-edge face matching.",
  },
  {
    icon: <Camera className="w-6 h-6" />,
    title: "Event Photo Management",
    desc: "Organizers can upload hundreds of event photos and let attendees find their own photos effortlessly.",
  },
  {
    icon: <Image className="w-6 h-6" />,
    title: "Smart Gallery",
    desc: "Browse, search, and download event photos organized by face recognition with high accuracy.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure & Private",
    desc: "Your photos and face data are encrypted and processed securely. Privacy is our top priority.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    desc: "Powered by optimized ML models that process and match faces in seconds, not minutes.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "For Everyone",
    desc: "Whether you're an event organizer or an attendee, GrabPick makes photo discovery seamless.",
  },
];

const steps = [
  {
    num: "01",
    title: "Create or Join an Event",
    desc: "Organizers create events and upload photos. Attendees browse available events.",
  },
  {
    num: "02",
    title: "Upload Your Selfie",
    desc: "Take a quick selfie and our AI instantly scans hundreds of event photos.",
  },
  {
    num: "03",
    title: "Get Your Photos",
    desc: "View all matched photos ranked by similarity. Download your favorites instantly.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_60%)]" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative z-10 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-8">
            <ScanFace className="w-4 h-4" />
            AI-Powered Face Recognition
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Find Your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Event Photos
            </span>
            <br />
            With a Single Selfie
          </h1>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg">
            GrabPick uses AI face recognition to help you discover every photo
            of yourself from events, weddings, conferences, and more.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium flex items-center gap-2 transition"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <a href="#features">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 border border-white/20 hover:border-white/40 rounded-xl text-white transition"
              >
                Learn More
              </motion.button>
            </a>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-16"
        >
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything You Need
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              Powerful features that make event photo discovery effortless
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="group p-6 bg-gray-900/50 border border-white/5 rounded-2xl hover:border-white/15 transition-all duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-blue-500/10 text-blue-400 rounded-xl mb-4 group-hover:bg-blue-500/20 transition">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-6 py-24 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-gray-400 mt-4">
              Three simple steps to find your photos
            </p>
          </motion.div>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-lg font-bold">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Photos?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join thousands of people who use GrabPick to discover their event
            photos.
          </p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-medium text-lg transition"
            >
              Start For Free
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            GrabPick
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} GrabPick. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
