import InfoPageLayout from "@/components/common/InfoPageLayout";

export default function CancellationOptionsPage() {
  return (
    <InfoPageLayout
      eyebrow="Cancellations"
      title="Understand your cancellation and booking change options."
      description="Cancellation outcomes can depend on reservation timing, host settings, and payment status."
      sections={[
        {
          title: "How to manage a booking",
          body: [
            "Open your booking details to review dates, property information, and any available cancellation or modification options.",
            "If the booking can be changed, you may be able to update dates or request cancellation from the reservation flow.",
          ],
        },
        {
          title: "Refund considerations",
          body: [
            "Refund timing and eligibility may vary depending on the property's cancellation policy and how close the request is to check-in.",
            "If the amount shown in your booking flow looks incorrect, contact support with the reservation details for review.",
          ],
        },
      ]}
    />
  );
}