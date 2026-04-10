import InfoPageLayout from "@/components/common/InfoPageLayout";

export default function HelpCenterPage() {
  return (
    <InfoPageLayout
      eyebrow="Help Center"
      title="Support for bookings, payments, hosting, and account access."
      description="Use this page as the starting point for common questions before reaching the support team directly."
      sections={[
        {
          title: "Popular help topics",
          body: [
            "Booking help includes reservation changes, guest details, cancellations, and confirmation issues.",
            "Account help covers login access, password recovery, profile updates, and email verification.",
          ],
        },
        {
          title: "Need personal assistance?",
          body: [
            "If your situation needs direct attention, visit the support page and send a message with your booking ID, dates, and a short explanation.",
            "Providing clear details helps the team resolve your request faster.",
          ],
        },
      ]}
    />
  );
}