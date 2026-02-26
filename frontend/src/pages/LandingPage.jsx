import Navbar from "../components/Navbar";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      <Navbar />

      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        {/* Hero Content Here */}
      </section>
    </div>
  );
};

export default LandingPage;