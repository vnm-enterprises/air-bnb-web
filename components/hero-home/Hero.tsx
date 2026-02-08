import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";

export default function Hero() {
  return (
    <section className="relative w-full h-[720px]">
      <HeroBackground />
      <HeroContent />
    </section>
  );
}
