import InfoPageLayout from "@/components/common/InfoPageLayout";

export default function TermsOfServicePage() {
  return (
    <InfoPageLayout
      eyebrow="Legal"
      title="Terms of Service"
      description="These terms summarize the basic expectations for using PropBnb as a guest, host, or account holder."
      sections={[
        {
          title: "Using the platform",
          body: [
            "Users are expected to provide accurate information, protect their account access, and use the platform lawfully and respectfully.",
            "Hosts should maintain accurate listings and guests should follow booking terms, house rules, and payment requirements.",
          ],
        },
        {
          title: "Bookings and conduct",
          body: [
            "Reservations may be subject to availability, verification, pricing updates, and applicable cancellation rules.",
            "Abuse, fraud, or misuse of the platform can result in booking restrictions, account action, or support review.",
          ],
        },
      ]}
    />
  );
}