import { IoRestaurantSharp } from "react-icons/io5";

export default function Loading({
  status,
  text = "Loading...",
  fullscreen = false,
}) {
  if (!status) return null;

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullscreen ? "fixed inset-0 bg-black/40 z-50" : ""
      }`}
    >
      <IoRestaurantSharp className="animate-spin h-10 w-10 text-primary z-50" />
      <p className="mt-2 text-white">{text}</p>
    </div>
  );
}
