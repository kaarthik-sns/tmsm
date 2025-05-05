import Link from "next/link";

const Terms = ({
  selected,
  setselected,
  label,
  linkText,
  linkHref,
}: {
  selected: boolean;
  setselected: (checked: boolean) => void;
  label: string;
  linkText: string; // Text for the link
  linkHref: string; // URL for the Terms and Conditions page
}) => (
  <div>
    <label
  htmlFor="checkboxLabelTwo"
  className="flex cursor-pointer select-none items-start flex-wrap gap-x-1"
>
  <div className="relative mt-1">
    <input
      type="checkbox"
      id="checkboxLabelTwo"
      className="sr-only"
      checked={selected}
      onChange={() => setselected(!selected)}
    />
    <div
      className={`mr-2 flex h-5 w-5 items-center justify-center rounded border border-primary bg-white dark:bg-transparent ${
        selected && "border-primary bg-gray dark:bg-transparent"
      }`}
    >
      <span className={`opacity-0 ${selected && "!opacity-100"}`}>
        <svg
          width="11"
          height="8"
          viewBox="0 0 11 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972Z"
            fill="#6b7280"
            stroke="#6b7280"
            strokeWidth="0.4"
          ></path>
        </svg>
      </span>
    </div>
  </div>

  <span className="text-sm leading-snug">
    {label}
    <Link href={linkHref} target="_blank" className="text-red-600 ml-1 underline">
      {linkText}
    </Link>
  </span>
</label>

  </div>
);

export default Terms;
