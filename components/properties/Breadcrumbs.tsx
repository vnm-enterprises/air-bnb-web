"use client";

export default function Breadcrumbs({ destination }: { destination?: string }) {
  return (
    <div className="text-sm text-gray-500 mb-4">
      Home › Stays › {destination || "All locations"}
    </div>
  );
}
