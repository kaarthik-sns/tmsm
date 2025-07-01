import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  const lang = localStorage.getItem('lang') || 'en';
  const isTamil = lang === 'ta';

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-lg sm:text-title-md2 font-semibold text-black dark:text-white dark-text">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2 text-xs md:text-sm">
          <li>
            <Link className="font-medium" href="/admin/dashboard">
              {isTamil ? 'கட்டுப்பாட்டகம்' : 'Dashboard'} /
            </Link>
          </li>
          <li className="font-medium dark-text">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
