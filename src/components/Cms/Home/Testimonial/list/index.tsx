'use client';
import { useEffect, useState } from "react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbCustom";
import Image from "next/image";
import Swal from 'sweetalert2';
import { toast } from "sonner";

const Table = () => {
    const [pages, setPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [tableItems, setTableItems] = useState([]);
    const [modalData, setModalData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const lang = localStorage.getItem('lang') || 'en';

    useEffect(() => {
        fetchTableItems();
    }, [currentPage]);

    const handleView = (item) => {
        setModalData(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalData(null);
    };

    const fetchTableItems = async () => {
        try {
            const response = await fetch(`/api/cms/home/testimonial/list?page=${currentPage}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setTableItems(data.data);
            setPages(data.pagination.totalPages);

        } catch (error) {
            console.error("Error fetching testimonials:", error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to Delete this testimonial?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!',
            cancelButtonText: 'No',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const response = await fetch(`/api/cms/home/testimonial`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                toast.success('Testimonial deleted successfully!', {
                    className: "sonner-toast-success",
                    cancel: {
                        label: 'Close',
                        onClick: () => console.log('Close'),
                    },
                });
                fetchTableItems();
            } else {
                toast.error('Failed to delete testimonial!', {
                    className: "sonner-toast-error",
                    cancel: {
                        label: 'Close',
                        onClick: () => console.log('Close'),
                    },
                });
            }
        } catch (error) {
            console.error("Error deleting:", error);
            toast.error('Failed to delete testimonial!', {
                className: "sonner-toast-error",
                cancel: {
                    label: 'Close',
                    onClick: () => console.log('Close'),
                },
            });
        }
    };

    const handleEdit = (id) => {
        router.push(`/admin/cms/home/testimonial/edit?id=${id}`);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= pages) {
            setCurrentPage(page);
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    return (
        <>
            <Breadcrumb
                breadcrumbs={[
                    { name: "Dashboard", href: "/admin/dashboard" },
                    { name: "Testimonials List" },
                ]}
            />

            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-11">
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href="/admin/cms/home/testimonial/add"
                        className="inline-flex items-center px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm bg-color-custom dark-text"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Testimonial
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tableItems.length === 0 ? (
                        <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="mt-4 text-gray-600">No testimonials found</p>
                        </div>
                    ) : (
                        tableItems.map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-boxdark rounded-xl shadow-sm border border-gray-200 dark:border-strokedark hover:shadow-md transition-shadow duration-200">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative w-16 h-16 rounded-full overflow-hidden">
                                                <Image
                                                    src={item.image ? `/api${item.image}` : '/images/user/user-placeholder.png'}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{lang === 'ta' ? item.name_ta : item.name}</h3>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{item.designation}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleView(item)}
                                                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                                                title="View Details"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleEdit(item._id)}
                                                className="p-2 text-gray-500 hover:text-green-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                                                title="Edit"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                                                title="Delete"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{lang === 'ta' ? item.description_ta : item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {pages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex items-center gap-2">
                            <button
                                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg border ${currentPage === 1 ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: pages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`px-4 py-2 rounded-lg ${currentPage === i + 1
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => currentPage < pages && handlePageChange(currentPage + 1)}
                                disabled={currentPage === pages}
                                className={`p-2 rounded-lg border ${currentPage === pages ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && modalData && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white dark:bg-boxdark rounded-xl shadow-xl max-w-2xl w-full mx-4 transform transition-all">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Testimonial Details</h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                                        <Image
                                            src={modalData.image ? `/api${modalData.image}` : '/images/user/user-placeholder.png'}
                                            alt={modalData.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">{lang === 'ta' ? modalData.name_ta : modalData.name}</h4>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">{modalData.designation}</div>
                                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap text-center">{lang === 'ta' ? modalData.description_ta : modalData.description}</p>
                                </div>
                            </div>
                            <div className="flex justify-end px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-b-xl">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Table;
