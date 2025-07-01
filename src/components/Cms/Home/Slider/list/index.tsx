'use client';
import { useEffect, useState } from "react"
import Link from "next/link";
import { useRouter } from "next/navigation"; // For page navigation
import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbCustom";
import Image from "next/image";
import Swal from 'sweetalert2';
import { toast } from "sonner";

const Table = () => {

    const [pages, setPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [tableItems, setTableItems] = useState([]);
    const [modalData, setModalData] = useState(null); // State for modal data
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const router = useRouter(); // Initialize Next.js router

    const lang = localStorage.getItem('lang') || 'en';
    const isTamil = lang === 'ta';

    useEffect(() => {
        fetchTableItems();
    }, [currentPage]);

    const handleView = (item) => {
        setModalData(item); // Set the data for the modal
        setIsModalOpen(true);  // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
        setModalData(null);    // Clear modal data
    };

    const fetchTableItems = async () => {
        try {
            const response = await fetch(`/api/cms/home/slider/list?page=${currentPage}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setTableItems(data.data); // Replace with your state setter
            setPages(data.pagination.totalPages); // Replace with your state setter


        } catch (error) {
            console.error("Error fetching table items:", error);
        }
    };

    const handleDelete = async (id) => {

        const result = await Swal.fire({
            title: isTamil ? 'உறுதியாக இருக்கிறீர்களா?' : 'Are you sure?',
            text: isTamil ? 'இந்த தகவலை நீக்க விரும்புகிறீர்களா?' : 'Do you want to delete this data?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: isTamil ? 'ஆம், நீக்கவும்!' : 'Yes, delete it!',
            cancelButtonText: isTamil ? 'இல்லை' : 'No',
        });

        if (!result.isConfirmed) {
            return; // Stop submission if the user cancels
        }

        try {
            const response = await fetch(`/api/cms/home/slider`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }), // Send ID in the request body
            });

            if (response.ok) {
                toast.success('Data deleted successfully!', {
                    className: "sonner-toast-success",
                    cancel: {
                        label: 'Close',
                        onClick: () => console.log('Close'),
                    },
                });
                fetchTableItems(); // Refresh the table items after successful deletion
            } else {
                const data = await response.json();
                toast.error('Failed to delete Data!', {
                    className: "sonner-toast-error",
                    cancel: {
                        label: 'Close',
                        onClick: () => console.log('Close'),
                    },
                });
            }
        } catch (error) {
            console.error("Error deleting:", error);
            toast.error('Failed to delete Data!', {
                className: "sonner-toast-error",
                cancel: {
                    label: 'Close',
                    onClick: () => console.log('Close'),
                },
            });
        }
    };


    const handleEdit = (id) => {
        router.push(`/admin/cms/home/slider/edit?id=${id}`);
    };

    // Handle page navigation
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
                    {
                        name: isTamil ? "கட்டுப்பாட்டகம்" : "Dashboard",
                        href: "/admin/dashboard",
                    },
                    {
                        name: isTamil ? "ஸ்லைடர் பட்டியல்" : "List Slider",
                    },
                ]}
            />

            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-11">
                <div className="items-start justify-between md:flex">
                    <div className="mt-3 md:mt-0">
                        <Link
                            href="/admin/cms/home/slider/add"
                            className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm bg-color-custom dark-text"
                        >
                            {isTamil ? "புதிய ஸ்லைடரை சேர்க்கவும்" : "Add Slider"}
                        </Link>
                    </div>
                </div>
                <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
                    <table className="w-full table-auto text-sm md:text-md text-left">
                        <thead className="text-gray-600 font-medium border-b">
                            <tr>
                                <th className="py-3 px-2 md:px-6 dark-text">#</th>
                                <th className="py-3 px-2 md:px-6 dark-text">{isTamil ? "பெயர்" : "Name"}</th>
                                <th className="py-3 px-2 md:px-6 dark-text">{isTamil ? "செயல்பாடுகள்" : "Action"}</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 divide-y">
                            {tableItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center px-2 md:px-6 py-4 whitespace-nowrap">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                tableItems.map((item, idx) => (
                                    <tr key={idx} className="odd:bg-gray-50 even:bg-white">
                                        <td className="px-2 md:px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                                        <td className="px-2 md:px-6 py-4 whitespace-normal break-words">{lang === 'ta' ? item.title_ta : item.title}</td>
                                        <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2 md:space-x-3">
                                                <button
                                                    onClick={() => handleEdit(item._id)}
                                                    className="p-1.5 md:p-2 font-medium hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className="w-5 h-5 md:w-6 md:h-6"
                                                    >
                                                        <path d="M4 20h4l10-10-4-4L4 16v4zm15.656-15.656a2 2 0 010 2.828l-1.828 1.828-4-4 1.828-1.828a2 2 0 012.828 0l1.172 1.172z" />
                                                    </svg>
                                                </button>

                                                <button
                                                    onClick={() => handleView(item)}
                                                    className="p-1.5 md:p-2 text-blue-600 hover:text-blue-500"
                                                >
                                                    <svg
                                                        className="w-5 h-5 md:w-6 md:h-6 fill-current"
                                                        viewBox="0 0 18 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                                        />
                                                        <path
                                                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                                        />
                                                    </svg>
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-1.5 md:p-2 text-red-600 hover:text-red-500"
                                                >
                                                    <svg
                                                        className="w-5 h-5 md:w-6 md:h-6 fill-current"
                                                        viewBox="0 0 18 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {pages > 1 && (
                    <div className='rounded-sm dark:bg-boxdark'>
                        <div className="p-4 sm:p-6 xl:p-7.5 pagination-div">
                            <nav>
                                <ul className="flex items-center justify-center space-x-2">
                                    {/* Previous Button */}
                                    <li>
                                        <a
                                            className={`flex h-8 w-8 items-center justify-center rounded-full bg-arrow text-white prev-btn ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                                                }`}
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage > 1) handlePageChange(currentPage - 1);
                                            }}
                                            aria-label="Previous Page"
                                        >
                                            <svg
                                                className="fill-black"
                                                width="8"
                                                height="16"
                                                viewBox="0 0 8 16"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M7.17578 15.1156C7.00703 15.1156 6.83828 15.0593 6.72578 14.9187L0.369531 8.44995C0.116406 8.19683 0.116406 7.80308 0.369531 7.54995L6.72578 1.0812C6.97891 0.828076 7.37266 0.828076 7.62578 1.0812C7.87891 1.33433 7.87891 1.72808 7.62578 1.9812L1.71953 7.99995L7.65391 14.0187C7.90703 14.2718 7.90703 14.6656 7.65391 14.9187C7.48516 15.0312 7.34453 15.1156 7.17578 15.1156Z" />
                                            </svg>
                                        </a>
                                    </li>

                                    {/* Page Numbers */}
                                    <li className="text-white p-2 page-number">
                                        <div className="flex items-center justify-center">
                                            {Array.from({ length: pages }, (_, index) => (
                                                <a
                                                    key={index}
                                                    className={`flex items-center justify-center rounded-full text-black mr-5 ml-5 ${currentPage === index + 1 ? 'dark-text-active dark-text active-page-number' : ''
                                                        }`}
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handlePageChange(index + 1);
                                                    }}
                                                >
                                                    {index + 1}
                                                </a>
                                            ))}
                                        </div>
                                    </li>

                                    {/* Next Button */}
                                    <li>
                                        <a
                                            className={`flex h-8 w-8 items-center justify-center rounded-full bg-arrow text-white next-btn ${currentPage === pages ? 'pointer-events-none opacity-50' : ''
                                                }`}
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (currentPage < pages) handlePageChange(currentPage + 1);
                                            }}
                                            aria-label="Next Page"
                                        >
                                            <svg
                                                className="fill-black"
                                                width="8"
                                                height="16"
                                                viewBox="0 0 8 16"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M0.819531 15.1156C0.650781 15.1156 0.510156 15.0593 0.369531 14.9468C0.116406 14.6937 0.116406 14.3 0.369531 14.0468L6.27578 7.99995L0.369531 1.9812C0.116406 1.72808 0.116406 1.33433 0.369531 1.0812C0.622656 0.828076 1.01641 0.828076 1.26953 1.0812L7.62578 7.54995C7.87891 7.80308 7.87891 8.19683 7.62578 8.44995L1.26953 14.9187C1.15703 15.0312 0.988281 15.1156 0.819531 15.1156Z" />
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </nav>

                        </div>
                    </div>
                )}
                {/* Modal */}
                {isModalOpen && modalData && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-3xl relative">
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 red-color"
                                aria-label="Close"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-5 h-5 md:w-6 md:h-6"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                            <p className="mb-3 md:mb-4 cms-heading text-lg md:text-xl font-semibold">{lang === 'ta' ? modalData.title_ta : modalData.title}</p>
                            <p className="mb-3 md:mb-4 cms-description text-xs md:text-sm text-gray-600">{lang === 'ta' ? modalData.description_ta : modalData.description}</p>
                            <div className="overflow-hidden flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <Image
                                    src={`/api${modalData.image}`}
                                    alt="Profile Preview"
                                    width={400}
                                    height={200}
                                    quality={100}
                                    unoptimized={true}
                                    className="object-cover w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                )}

            </div >
        </>
    );
};

export default Table;
