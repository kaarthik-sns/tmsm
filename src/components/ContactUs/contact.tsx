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
            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-11">

                <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">

                    <table className="w-full table-auto text-md text-left">
                        <thead className="text-gray-600 font-medium border-b">
                            <tr>
                                <th className="py-3 px-4 sm:px-6 dark-text">#</th>
                                <th className="py-3 px-4 sm:px-6 dark-text">{isTamil ? 'பெயர்' : 'Name'}</th>
                                <th className="hidden sm:table-cell py-3 px-4 sm:px-6 dark-text">{isTamil ? 'மின்னஞ்சல்' : 'Email'}</th>
                                <th className="hidden sm:table-cell py-3 px-4 sm:px-6 dark-text">{isTamil ? 'தொலைபேசி எண்' : 'Phone Number'}</th>
                                <th className="hidden sm:table-cell py-3 px-4 sm:px-6 dark-text">{isTamil ? 'செய்தி' : 'Message'}</th>
                                <th className="py-3 px-4 sm:px-6 dark-text">{isTamil ? 'செயல்பாடுகள்' : 'Action'}</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 divide-y">
                            {tableItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center px-6 py-4 whitespace-nowrap">
                                        {isTamil ? 'தரவு எதுவும் கிடைக்கவில்லை' : 'No data found'}
                                    </td>
                                </tr>
                            ) : (
                                tableItems.map((item, idx) => (
                                    <tr key={idx} className="odd:bg-gray-50 even:bg-white hover:bg-gray-100">
                                        <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm">
                                            <span className="font-medium text-black dark:text-white">
                                                {idx + 1}
                                            </span>
                                        </td>

                                        <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                                            <h5 className="font-medium text-black dark:text-white text-sm">
                                                {item.name}
                                            </h5>
                                        </td>

                                        <td className="hidden sm:table-cell px-4 sm:px-6 py-3 whitespace-nowrap">
                                            <h5 className="font-medium text-black dark:text-white text-sm">
                                                {item.email}
                                            </h5>
                                        </td>

                                        <td className="hidden sm:table-cell px-4 sm:px-6 py-3 whitespace-nowrap">
                                            <h5 className="font-medium text-black dark:text-white text-sm">
                                                {item.phone}
                                            </h5>
                                        </td>

                                        <td className="hidden sm:table-cell px-4 sm:px-6 py-3 whitespace-nowrap">
                                            <h5 className="font-medium text-black dark:text-white text-sm">
                                                {item.message.length > 50 ? item.message.substring(0, 50) + "..." : item.message}
                                            </h5>
                                        </td>

                                        <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
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
                {totalPages > 1 && (
                    < Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        changePage={handlePageChange}
                        getPaginationNumbers={getPaginationNumbers}
                    />
                )}
                {isModalOpen && modalData && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl relative">
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
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

                            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{isTamil ? 'தொடர்பு கொண்டவர்' : 'Contact Us'}</h2>

                            <div className="grid gap-x-4 gap-y-4 text-gray-700 items-start" style={{ gridTemplateColumns: 'auto 1fr' }}>
                                <p className="font-bold">{isTamil ? 'பெயர்' : 'Name'}:</p>
                                <p>{modalData.name}</p>

                                <p className="font-bold">{isTamil ? 'மின்னஞ்சல்' : 'Email'}:</p>
                                <p>{modalData.email}</p>

                                <p className="font-bold">{isTamil ? 'தொலைபேசி எண்' : 'Phone Number'}:</p>
                                <p>{modalData.phone}</p>

                                <p className="font-bold">{isTamil ? 'செய்தி' : 'Message'}:</p>
                                <p>{modalData.message}</p>

                                <p className="font-bold">{isTamil ? 'மொழி' : 'Language'}:</p>
                                <select
                                    className="w-1/3 border border-gray-300 rounded px-3 py-1"
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                >
                                    <option value="en">English</option>
                                    <option value="ta">{isTamil ? 'தமிழ்' : 'Tamil'}</option>
                                </select>

                                <p className="font-bold mt-2">{isTamil ? 'பதில்' : 'Reply'}:</p>
                                <div className="w-full">
                                    <ReactQuill
                                        theme="snow"
                                        value={selectedLanguage === 'en' ? message : message_ta}
                                        onChange={(val) => {
                                            selectedLanguage === 'en' ? setMessage(val) : setMessageTa(val);
                                        }}
                                        placeholder=""
                                        modules={{ toolbar: toolbarOptions }}
                                        className="w-full min-h-[200px]"
                                    />
                                </div>
                            </div>


                            {/* Send Reply Button */}
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() =>
                                        sendReply({
                                            ...modalData,
                                            language: selectedLanguage,
                                            reply_message: selectedLanguage === 'en' ? message : message_ta,
                                        })
                                    }
                                    disabled={modalData.mail_status === true}
                                    className={`inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-center font-medium text-white lg:px-5 xl:px-6 text-custom 
                                    ${modalData.mail_status === true
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary hover:bg-opacity-90'
                                        }`}
                                >
                                    {modalData?.mail_status
                                        ? (isTamil ? 'முந்தைய பதில் அனுப்பப்பட்டுள்ளது' : 'Reply Already Sent')
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
