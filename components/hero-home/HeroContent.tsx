import HeroSearchBar from "./HeroSearchBar";

export default function HeroContent() {
  return (
    <div className="relative z-10 h-full flex items-center">
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8">

        <div className="max-w-3xl">

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-6">
            Experience the extraordinary
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-10">
            Find unique spaces and connect with local hosts worldwide.
          </p>

          <HeroSearchBar />

        </div>
      </div>
    </div>
  );
}
