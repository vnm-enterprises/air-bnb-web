export default function HeroBackground() {
  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      aria-hidden="true"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(0,0,0,0.35),
            rgba(0,0,0,0.45)
          ),
          url("https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop")
        `,
      }}
    />
  );
}

//hero-image.jpg