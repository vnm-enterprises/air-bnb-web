import InfoPageLayout from "@/components/common/InfoPageLayout";

export default function HostResourcesPage() {
  return (
    <InfoPageLayout
      eyebrow="Hosting"
      title="Resources that help hosts keep listings accurate and bookings organized."
      description="This page highlights the essentials hosts need to run listings smoothly and deliver a strong guest experience."
      sections={[
        {
          title: "Listing quality",
          body: [
            "Keep pricing, amenities, photos, and availability updated so guests can make confident booking decisions.",
            "Accurate listing details reduce support requests and improve guest trust before arrival.",
          ],
        },
        {
          title: "Operational basics",
          body: [
            "Review bookings frequently, respond to guest questions quickly, and keep house rules clear and specific.",
            "Use the host dashboard to track activity, manage reservations, and stay on top of property performance.",
          ],
        },
      ]}
    />
  );
}