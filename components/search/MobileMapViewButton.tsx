"use client";

export default function MobileMapViewButton({
  onOpen,
}: {
  onOpen: () => void;
}) {
  return (
    <div className="lg:hidden z-50 fixed bottom-6 left-1/2 -translate-x-1/2 ">
      <button
        onClick={onOpen}
        className="bg-[#2C5F5D] text-white px-8 py-3.5 rounded-full font-extrabold shadow-2xl"
      >
        Map View
      </button>
    </div>
  );
}
