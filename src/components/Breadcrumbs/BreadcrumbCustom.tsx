import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  href?: string; // Optional to handle the current page without a link
}

interface BreadcrumbProps {
  breadcrumbs: BreadcrumbItem[];
}

const Breadcrumb = ({ breadcrumbs }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {breadcrumbs[breadcrumbs.length - 1]?.name || ""}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className="flex items-center">
              {breadcrumb.href ? (
                <Link className="font-medium" href={breadcrumb.href}>
                   {breadcrumb.name}&nbsp;
                </Link>
              ) : (
                <span className="font-medium dark-text">{breadcrumb.name}</span>
              )}
              {index < breadcrumbs.length - 1 && <span> / </span>}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
