import InfoPageLayout from "@/components/common/InfoPageLayout";

export default function AboutPage() {
  return (
    <InfoPageLayout
      eyebrow="About"
      title="PropBnb connects thoughtful travelers with memorable stays."
      description="We build a simpler way to discover properties, manage bookings, and support hosts with tools that feel clear and dependable."
      sections={[
        {
          title: "What we do",
          body: [
            "PropBnb brings guests and hosts together through a platform designed for reliable booking, transparent communication, and smooth property management.",
            "From browsing listings to confirming stays, the experience is shaped to reduce friction and keep important details easy to find.",
          ],
        },
        {
          title: "For guests and hosts",
          body: [
            "Guests can explore properties, save favorites, and manage upcoming trips from one place.",
            "Hosts get access to listing tools, booking visibility, and a focused dashboard for everyday operations.",
          ],
        },
      ]}
    />
  );
}