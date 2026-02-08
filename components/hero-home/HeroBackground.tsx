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
          url("/hero-image.jpg")
        `,
      }}
    />
  );
}

//hero-image.jpg