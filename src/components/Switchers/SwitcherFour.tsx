const SwitcherFour = ({
  isEnabled,
  onToggle,
}: {
  isEnabled: boolean;
  onToggle: () => void;
}) => {
  return (
    <label className="flex cursor-pointer select-none items-center">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={isEnabled ? true : false}
          onChange={onToggle}
        />
        {/* Background changes dynamically based on `isEnabled` */}
        <div
          className={`block h-8 w-14 rounded-full transition-colors ${isEnabled ? "bg-green-500" : "bg-black"
            }`}
        ></div>
        <div
          className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition-all ${isEnabled && "!right-1 !translate-x-full"
            }`}
        ></div>
      </div>
    </label>
  );
};

export default SwitcherFour;
