"use client";

export default function Button({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-3 rounded-xl font-bold text-[#0A2342] ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#9FE870] hover:bg-[#b4ff8c]"
      }`}
    >
      {label}
    </button>
  );
}
