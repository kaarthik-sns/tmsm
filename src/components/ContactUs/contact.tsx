'use client';

import { useEffect, useState } from "react"
import axios from "axios";
import { toast } from "sonner";
import Swal from 'sweetalert2';
import Loader from "@/components/common/Loader";


const UserTable = () => {

    const [tableItems, setTableItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [modalData, setModalData] = useState(null); // State for modal data

    const handleView = (faqItem) => {
        setModalData(faqItem); // Set the data for the modal
        setIsModalOpen(true);  // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
        setModalData(null);    // Clear modal data
    };

    // Fetch users from the API
    const fetchUsers = async (page: number) => {
        setIsLoading(true);
        try {
            const query = new URLSearchParams({
                page: String(page),
            }).toString();

            const res = await fetch(`/api/contact-us?${query}`);
            const data = await res.json();

            if (res.ok) {
                setTableItems(data.data);
                setCurrentPage(data.pagination.currentPage);
                setTotalPages(data.pagination.totalPages);
            } else {

                toast.error('Error fetching table items.', {
                    className: "sonner-toast-error",
                    cancel: {
                        label: 'Close',
                        onClick: () => console.log('Close'),
                    }
                });

                console.error('Error fetching users:', data.message);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    // Handle page navigation
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    };

    const handleDelete = async (Id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this data?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No",
        });

        if (!result.isConfirmed) {
            return; // Stop execution if the user cancels
        }

        const updatedStatus = { id: Id };

        try {
            const response = await axios.patch("/api/contact-us", updatedStatus, {
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                toast.success("Data deleted successfully!", {
                    className: "sonner-toast-success",
                    cancel: {
                        label: "Close",
                        onClick: () => console.log("Close"),
                    },
                });

                fetchUsers(currentPage);
            } else {
                toast.error("Failed to delete data!", {
                    className: "sonner-toast-error",
                    cancel: {
                        label: "Close",
                        onClick: () => console.log("Close"),
                    },
                });
            }
        } catch (error) {
            console.error("Error deleting data:", error);
            toast.error(
                error.response?.data?.message || "An error occurred while deleting the user. Please try again.",
                {
                    className: "sonner-toast-error",
                    cancel: {
                        label: "Close",
                        onClick: () => console.log("Close"),
                    },
                }
            );
        }
    };

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-11">

            <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">

                <table className="w-full table-auto text-md text-left">
                    <thead className="text-gray-600 font-medium border-b">
                        <tr>
                            <th className="py-3 px-6 dark-text">#</th>
                            <th className="py-3 px-6 dark-text">Name</th>
                            <th className="py-3 px-6 dark-text">Email</th>
                            <th className="py-3 px-6 dark-text">Phone</th>
                            <th className="py-3 px-6 dark-text">Message</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                        {tableItems.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center px-6 py-4 whitespace-nowrap">
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            tableItems.map((item, idx) => (
                                <tr key={idx} className="odd:bg-gray-50 even:bg-white">
                                    <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {item.name}
                                        </h5>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {item.email}
                                        </h5>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {item.phone}
                                        </h5>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {item.message.length > 50 ? item.message.substring(0, 50) + "..." : item.message}
                                        </h5>
                                    </td>

                                    <td className="text-right px-6 whitespace-nowrap">

                                        <button
                                            onClick={() => handleView(item)}
                                            className="py-2 leading-none px-3 font-medium text-blue-600 hover:text-blue-500 duration-150 hover:bg-gray-50 rounded-lg"
                                        >
                                            <svg
                                                className="fill-current"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 18 18"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                                    fill=""
                                                />
                                                <path
                                                    d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                                    fill=""
                                                />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                                        >

                                            <svg
                                                className="fill-current"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 18 18"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                    fill=""
                                                />
                                                <path
                                                    d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                                    fill=""
                                                />
                                                <path
                                                    d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                                    fill=""
                                                />
                                                <path
                                                    d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                                    fill=""
                                                />
                                            </svg>

                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
            {totalPages > 1 && (
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
                                        {Array.from({ length: totalPages }, (_, index) => (
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
                                        className={`flex h-8 w-8 items-center justify-center rounded-full bg-arrow text-white next-btn ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                                            }`}
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage < totalPages) handlePageChange(currentPage + 1);
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
            {isModalOpen && modalData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 red-color "
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
                                className="w-6 h-6"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Contact Us</h2>
                        <div className="grid grid-cols-3 gap-y-4 text-gray-700">
                            <p className="font-medium">Name:</p>
                            <p className="col-span-2">{modalData.name}</p>

                            <p className="font-medium">Email:</p>
                            <p className="col-span-2">{modalData.email}</p>

                            <p className="font-medium">Phone:</p>
                            <p className="col-span-2">{modalData.phone}</p>

                            <p className="font-medium">Message:</p>
                            <p className="col-span-2">{modalData.message}</p>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default UserTable;
