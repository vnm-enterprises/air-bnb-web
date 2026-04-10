import InfoPageLayout from "@/components/common/InfoPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <InfoPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      description="This overview explains the kinds of information PropBnb uses to operate the platform and support bookings."
      sections={[
        {
          title: "Information we use",
          body: [
            "PropBnb may use account details, booking information, communication records, and payment-related metadata to provide core platform services.",
            "This information helps with reservations, support requests, account security, and service improvement.",
          ],
        },
        {
          title: "How information supports the service",
          body: [
            "We use information to confirm bookings, support hosts and guests, prevent misuse, and maintain a reliable product experience.",
            "Questions about data handling or account concerns can be directed through the support page.",
          ],
        },
      ]}
    />
  );
}