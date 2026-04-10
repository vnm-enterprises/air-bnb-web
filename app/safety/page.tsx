import InfoPageLayout from "@/components/common/InfoPageLayout";

export default function SafetyPage() {
  return (
    <InfoPageLayout
      eyebrow="Safety"
      title="Safety information for guests, hosts, and every stay."
      description="Clear expectations and fast communication help keep the PropBnb experience secure and respectful for everyone involved."
      sections={[
        {
          title: "Before your trip",
          body: [
            "Review listing details carefully, confirm check-in instructions in advance, and communicate through the platform whenever possible.",
            "If something about a property seems inaccurate or unclear, contact support before arrival.",
          ],
        },
        {
          title: "During a stay",
          body: [
            "In urgent situations, contact local emergency services first. For property or booking concerns, contact the host and then escalate through support if needed.",
            "Respect house rules, occupancy limits, and local regulations to help maintain a safe environment for all parties.",
          ],
        },
      ]}
    />
  );
}