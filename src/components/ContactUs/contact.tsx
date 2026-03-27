'use client';

import { useEffect, useState } from "react"
import axios from "axios";
import { toast } from "sonner";
import Swal from 'sweetalert2';
import Loader from "@/components/common/Loader";
import Pagination from "@/components/Pagination";
import dynamic from "next/dynamic";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const UserTable = () => {

    const [tableItems, setTableItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [modalData, setModalData] = useState(null); // State for modal data
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [message, setMessage] = useState(null); // State for modal data
    const [message_ta, setMessageTa] = useState(null); // State for modal data

    const lang = localStorage.getItem('lang') || 'en';
    const isTamil = lang === 'ta';

    const toolbarOptions = [
        // Text formatting options
        ["bold", "italic", "underline", "strike"], // Bold, italic, underline, strikethrough
        ["blockquote", "code-block"], // Blockquote, code block

        // Embeds
        ["link", "image", "video", "formula"], // Link, image, video, formula

        // Headers
        [{ header: 1 }, { header: 2 }], // Header 1 and 2
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headers 1-6 and normal text

        // Lists
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }], // Ordered, bullet, and checklist

        // Scripts
        [{ script: "sub" }, { script: "super" }], // Subscript, superscript

        // Indentation
        [{ indent: "-1" }, { indent: "+1" }], // Outdent, indent

        // Text direction
        [{ direction: "rtl" }], // Right-to-left

        // Font size
        [{ size: ["small", false, "large", "huge"] }], // Font size options

        // Text color and background color
        [{ color: [] }, { background: [] }], // Text color, background color

        // Font family
        [{ font: [] }], // Font family dropdown

        // Text alignment
        [{ align: [] }], // Text alignment options

        // Inline formulas
        ["formula"], // Formula support for inline math

        // Clean formatting
        ["clean"], // Remove formatting button
    ];

    const formatDate = (dateString: string | undefined | null) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "-";

        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;

        return `${day}-${month}-${year} ${hours}:${minutesStr}${ampm}`;
    };

    const handleView = (contactItem) => {
        setModalData(contactItem); // Set the data for the modal
        setIsModalOpen(true);  // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
        setModalData(null);    // Clear modal data
    };

    const sendReply = async (contactItem) => {

        try {
            const res = await fetch('/api/send-reply-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactItem)
            });

            const result = await res.json();

            if (result.success) {
                toast.success("Reply email sent successfully!", {
                    className: "sonner-toast-success",
                    cancel: {
                        label: "Close",
                        onClick: () => console.log("Close"),
                    },
                });
                closeModal();
                fetchUsers(currentPage);
            } else {
                toast.error('Failed to send reply', {
                    className: "sonner-toast-error",
                    cancel: {
                        label: 'Close',
                        onClick: () => console.log('Close'),
                    },
                });
            }
        } catch (err) {
            console.error(err);
            toast.error('Error sending reply', {
                className: "sonner-toast-error",
                cancel: {
                    label: 'Close',
                    onClick: () => console.log('Close'),
                },
            });
        }
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

            const ressult = await fetch(`/api/cms/contact-us/view`);
            const data2 = await ressult.json();

            setMessageTa(data2.data.description_ta);
            setMessage(data2.data.description);

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

    // Handle background scroll lock
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function to ensure scroll is restored
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

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

    // Generate pagination numbers (show only a few around current page)
    const getPaginationNumbers = () => {
        const pageNumbers = [];
        const maxVisible = 2; // Show 2 pages before and after current page
        const start = Math.max(1, currentPage - maxVisible);
        const end = Math.min(totalPages, currentPage + maxVisible);

        if (start > 1) pageNumbers.push(1);
        if (start > 2) pageNumbers.push("...");

        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }

        if (end < totalPages - 1) pageNumbers.push("...");
        if (end < totalPages) pageNumbers.push(totalPages);

        return pageNumbers;
    };

    const handleDelete = async (Id) => {

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
        <>
            <Breadcrumb pageName={isTamil ? 'தொடர்பு கொண்டவர்கள் பட்டியல்' : 'List Contact Us'} />
            <div className="md:rounded-sm md:border md:border-stroke md:bg-white md:px-5 md:pb-2.5 md:pt-6 md:shadow-default dark:border-strokedark dark:bg-boxdark xl:pb-11">

                <div className="mt-12 w-full">

                    {/* Desktop Table View */}
                    <div className="hidden lg:block border rounded-lg shadow-sm overflow-x-auto">
                        <table className="w-full table-auto text-md text-left min-w-max">
                            <thead className="text-gray-600 font-medium border-b bg-gray-50 dark:bg-meta-4 dark:text-white">
                                <tr>
                                    <th className="py-3 px-2">{isTamil ? '#' : '#'}</th>
                                    <th className="py-3 px-2">{isTamil ? 'பெயர் / மின்னஞ்சல்' : 'Name / Email'}</th>
                                    <th className="py-3 px-2">{isTamil ? 'தொலைபேசி எண்' : 'Phone Number'}</th>
                                    <th className="py-3 px-2">{isTamil ? 'செய்தி' : 'Message'}</th>
                                    <th className="py-3 px-2">{isTamil ? 'தேதி' : 'Date'}</th>
                                    <th className="py-3 px-2">{isTamil ? 'செயல்பாடுகள்' : 'Action'}</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 divide-y">
                                {tableItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center px-2 py-4 whitespace-nowrap">
                                            {isTamil ? 'தரவு எதுவும் கிடைக்கவில்லை' : 'No data found'}
                                        </td>
                                    </tr>
                                ) : (
                                    tableItems.map((item, idx) => (
                                        <tr key={idx} className="odd:bg-gray-50 even:bg-white hover:bg-gray-100">
                                            <td className="px-2 py-3 whitespace-nowrap text-sm">
                                                <span className="font-medium text-black dark:text-white">
                                                    {idx + 1}
                                                </span>
                                            </td>

                                            <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <h5 className="font-medium text-black dark:text-white text-sm">
                                                        {item.name}
                                                    </h5>
                                                    <p className="text-xs text-gray-500 truncate mt-0.5" title={item.email}>{item.email}</p>
                                                </div>
                                            </td>

                                            <td className="px-2 py-3 whitespace-nowrap">
                                                <h5 className="font-medium text-black dark:text-white text-sm">
                                                    {item.phone}
                                                </h5>
                                            </td>

                                            <td className="px-2 py-3 whitespace-nowrap">
                                                <h5 className="font-medium text-black dark:text-white text-sm">
                                                    {item.message?.length > 50 ? item.message.substring(0, 50) + "..." : item.message}
                                                </h5>
                                            </td>

                                            <td className="px-2 py-3 whitespace-nowrap">
                                                <h5 className="font-medium text-black dark:text-white text-sm">
                                                    {formatDate(item.created_at)}
                                                </h5>
                                            </td>

                                            <td className="px-2 py-3 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleView(item)}
                                                        className="p-2 text-blue-600 hover:text-blue-500 hover:bg-blue-50 rounded-full transition duration-150"
                                                        aria-label="View"
                                                    >
                                                        <svg
                                                            className="w-5 h-5 fill-current"
                                                            viewBox="0 0 18 18"
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
                                                        className="p-2 text-red-600 hover:text-red-500 hover:bg-red-50 rounded-full transition duration-150"
                                                        aria-label="Delete"
                                                    >
                                                        <svg
                                                            className="w-5 h-5 fill-current"
                                                            viewBox="0 0 18 18"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                            />
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

                    {/* Mobile/Tablet Card View */}
                    <div className="block lg:hidden mt-4 space-y-4">
                        {tableItems.length === 0 ? (
                            <div className="text-center bg-gray-50 dark:bg-meta-4 rounded-xl px-6 py-8 border border-gray-100 dark:border-gray-700">
                                <p className="text-gray-500 dark:text-gray-400 font-medium">{isTamil ? 'தரவு எதுவும் கிடைக்கவில்லை' : 'No data found'}</p>
                            </div>
                        ) : (
                            tableItems.map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-boxdark rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition-all duration-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-graydark/10 text-graydark font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                                                    {item.name}
                                                </h5>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    {formatDate(item.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center gap-2">
                                            <button
                                                onClick={() => handleView(item)}
                                                className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-full transition duration-150 shadow-sm"
                                                aria-label="View"
                                            >
                                                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z" />
                                                    <path d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full transition duration-150 shadow-sm"
                                                aria-label="Delete"
                                            >
                                                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 uppercase tracking-wider mb-1">{isTamil ? 'மின்னஞ்சல்' : 'Email'}</p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 break-all bg-gray-50 dark:bg-meta-4 py-1.5 px-3 rounded-md">{item.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 uppercase tracking-wider mb-1">{isTamil ? 'தொலைபேசி' : 'Phone'}</p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-meta-4 py-1.5 px-3 rounded-md">{item.phone}</p>
                                            </div>
                                            <div className="sm:col-span-2 mt-1">
                                                <p className="text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 uppercase tracking-wider mb-1">{isTamil ? 'செய்தி' : 'Message'}</p>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-meta-4 py-2.5 px-4 rounded-lg leading-relaxed shadow-inner">
                                                    {item.message?.length > 100 ? item.message.substring(0, 100) + "..." : item.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {totalPages > 1 && (
                    < Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        changePage={handlePageChange}
                        getPaginationNumbers={getPaginationNumbers}
                    />
                )}
                {isModalOpen && modalData && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/65 backdrop-blur-sm z-[9999] px-4 py-10 sm:p-6 overflow-y-auto transition-all duration-300">
                        <div className="bg-white dark:bg-boxdark rounded-2xl shadow-2xl w-full max-w-4xl relative max-h-[95vh] flex flex-col overflow-hidden border border-stroke dark:border-strokedark">

                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-stroke dark:border-strokedark bg-white dark:bg-boxdark">
                                <h2 className="text-xl sm:text-title-sm font-bold text-black dark:text-white flex items-center">
                                    <span className="w-1.5 h-6 bg-graydark rounded-full mr-3"></span>
                                    {isTamil ? 'தொடர்பு கொண்டவர் விவரங்கள்' : 'Contact Details'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-1.5 text-bodydark2 hover:text-black dark:hover:text-white bg-gray-2 dark:bg-meta-4 shadow-sm border border-stroke dark:border-strokedark rounded-lg transition-all duration-200"
                                    aria-label="Close"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                                    {/* Name Field */}
                                    <div className="space-y-1 p-4 rounded-xl bg-whiter dark:bg-meta-4/30 border border-stroke dark:border-strokedark/50">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-graydark">{isTamil ? 'பெயர்' : 'FullName'}</label>
                                        <p className="text-base font-medium text-black dark:text-white">{modalData.name}</p>
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-1 p-4 rounded-xl bg-whiter dark:bg-meta-4/30 border border-stroke dark:border-strokedark/50">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-graydark">{isTamil ? 'மின்னஞ்சல்' : 'Email Address'}</label>
                                        <p className="text-base font-medium text-black dark:text-white break-all">{modalData.email}</p>
                                    </div>

                                    {/* Phone Field */}
                                    <div className="space-y-1 p-4 rounded-xl bg-whiter dark:bg-meta-4/30 border border-stroke dark:border-strokedark/50">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-graydark">{isTamil ? 'தொலைபேசி எண்' : 'Phone Number'}</label>
                                        <p className="text-base font-medium text-black dark:text-white">{modalData.phone}</p>
                                    </div>

                                    {/* Date Field */}
                                    <div className="space-y-1 p-4 rounded-xl bg-whiter dark:bg-meta-4/30 border border-stroke dark:border-strokedark/50">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-graydark">{isTamil ? 'தேதி' : 'Received Date'}</label>
                                        <p className="text-base font-medium text-black dark:text-white">{formatDate(modalData.created_at)}</p>
                                    </div>

                                    {/* Message Field (Full Width) */}
                                    <div className="md:col-span-2 space-y-2 p-4 rounded-xl bg-graydark/5 dark:bg-graydark/10 border border-primary/20">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-graydark">{isTamil ? 'செய்தி' : 'Client Message'}</label>
                                        <div className="text-sm font-medium text-black dark:text-bodydark1 bg-white/50 dark:bg-boxdark/50 p-4 rounded-lg leading-relaxed shadow-inner max-h-[160px] overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                                            {modalData.message}
                                        </div>
                                    </div>
                                </div>

                                {/* Reply Section */}
                                <div className="space-y-4 pt-6 border-t border-stroke dark:border-strokedark">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-title-xsm font-bold text-black dark:text-white flex items-center">
                                            <svg className="w-5 h-5 mr-3 text-graydark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                            {modalData.mail_status ? (isTamil ? 'அனுப்பப்பட்ட பதில்' : 'Sent Reply') : (isTamil ? 'பதில் அளிக்கவும்' : 'Send a Reply')}
                                        </h3>
                                        {!modalData.mail_status && (
                                            <div className="flex items-center space-x-1.5 bg-whiter dark:bg-meta-4 p-1 rounded-lg">
                                                <button
                                                    onClick={() => setSelectedLanguage('en')}
                                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${selectedLanguage === 'en' ? 'bg-graydark text-white shadow-sm' : 'text-bodydark2 hover:text-black dark:hover:text-white'}`}
                                                >
                                                    EN
                                                </button>
                                                <button
                                                    onClick={() => setSelectedLanguage('ta')}
                                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${selectedLanguage === 'ta' ? 'bg-graydark text-white shadow-sm' : 'text-bodydark2 hover:text-black dark:hover:text-white'}`}
                                                >
                                                    TA
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-full rounded-xl overflow-hidden border border-stroke dark:border-strokedark shadow-sm focus-within:border-primary transition-colors">
                                        {modalData.mail_status ? (
                                            <div
                                                className="w-full h-auto min-h-[220px] bg-white dark:bg-boxdark p-5 overflow-y-auto custom-scrollbar text-black dark:text-bodydark1 content-html"
                                                dangerouslySetInnerHTML={{ __html: modalData.reply_message || '<p>No reply message saved.</p>' }}
                                            />
                                        ) : (
                                            <ReactQuill
                                                key={selectedLanguage}
                                                theme="snow"
                                                value={selectedLanguage === 'en' ? message : message_ta}
                                                onChange={(val) => {
                                                    selectedLanguage === 'en' ? setMessage(val) : setMessageTa(val);
                                                }}
                                                placeholder={isTamil ? "உங்கள் பதிலை இங்கே தட்டச்சு செய்க..." : "Type your reply here..."}
                                                modules={{ toolbar: toolbarOptions }}
                                                className="w-full h-auto min-h-[220px] bg-white dark:bg-boxdark"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 bg-white dark:bg-boxdark border-t border-stroke dark:border-strokedark flex flex-col sm:flex-row items-center justify-end gap-3">
                                <button
                                    onClick={closeModal}
                                    className="w-full sm:w-auto px-8 py-2.5 rounded-xl border border-stroke dark:border-strokedark text-black dark:text-white font-bold hover:bg-whiter dark:hover:bg-meta-4 transition-all"
                                >
                                    {isTamil ? 'ரத்துசெய்' : 'Cancel'}
                                </button>
                                <button
                                    onClick={() =>
                                        sendReply({
                                            ...modalData,
                                            language: selectedLanguage,
                                            reply_message: selectedLanguage === 'en' ? message : message_ta,
                                        })
                                    }
                                    disabled={modalData.mail_status === true}
                                    className={`w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-10 py-2.5 text-center font-bold text-white transition-all shadow-md shadow-primary/25
                                    ${modalData.mail_status === true
                                            ? 'bg-bodydark text-white cursor-not-allowed shadow-none'
                                            : 'bg-graydark hover:bg-opacity-90 active:scale-95'
                                        }`}
                                >
                                    {modalData?.mail_status
                                        ? (isTamil ? 'பதில் அனுப்பபட்டது' : 'Reply Sent')
                                        : (isTamil ? 'பதில் அனுப்பு' : 'Send Reply')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}



            </div >
        </>
    );
};

export default UserTable;
