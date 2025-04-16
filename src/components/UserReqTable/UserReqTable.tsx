'use client';

import { useEffect, useState } from "react"
import StatusFilter from "@/components/UserReqTable/Select/StatusFilter";
import UpdateStatus from "@/components/UserReqTable/Select/UpdateStatus";
import { toast } from "sonner";
import Swal from 'sweetalert2';
import Loader from "@/components/common/Loader";

const UserTable = () => {

    const [pages, setPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [tableItems, setTableItems] = useState([]);
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formState, setFormState] = useState({
        name: "",
        email: "",
        selectOne: "",
    });

    const handleInputChange = (field, value) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        fetchTableItems();
    }, [currentPage]);


    const handleSubmit = (event) => {
        event.preventDefault();
        if (currentPage !== 1) {
            setCurrentPage(1); // Reset page to 1; useEffect will trigger fetchTableItems
        } else {
            fetchTableItems(); // Directly fetch items if already on page 1
        }
    };

    // Handle form reset
    const handleReset = () => {
        setFormState({
            name: "",
            email: "",
            selectOne: "",
        });

        setTriggerFetch(true);

    };

    useEffect(() => {
        if (triggerFetch) {

            if (currentPage !== 1) {
                setCurrentPage(1); // Reset page to 1; useEffect will trigger fetchTableItems
            } else {
                fetchTableItems(); // Directly fetch items if already on page 1
            }

            setTriggerFetch(false); // Reset trigger
        }
    }, [triggerFetch]);

    // Fetch table items from API
    const fetchTableItems = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/requests/user-req-list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: currentPage,
                    name: formState.name.trim(),
                    email: formState.email.trim(),
                    status: formState.selectOne,
                }),
            });

            const data = await response.json();

            setTableItems(data.data);
            setPages(data.pagination.totalPages);
        } catch (error) {

            toast.error('Error fetching table items.', {
                className: "sonner-toast-error",
                cancel: {
                    label: 'Close',
                    onClick: () => console.log('Close'),
                }
            });

            console.error("Error fetching table items:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleStatusUpdate = async (id: string, newStatus: string) => {

        let confirmationMessage = "";
        let successMessage = "";
        let confirmButtonText = "";

        switch (newStatus) {
            case "accepted":
                confirmationMessage = "Do you want to accept this request?";
                successMessage = "Request accepted successfully.";
                confirmButtonText = "Yes, Accept";
                break;
            case "rejected":
                confirmationMessage = "Do you want to decline this request?";
                successMessage = "Request has been declined.";
                confirmButtonText = "Yes, Decline";
                break;
            case "cancel":
                confirmationMessage = "Do you want to cancel this request?";
                successMessage = "Request has been cancelled.";
                confirmButtonText = "Yes, Cancel";
                break;
            default:
                return;
        }

        const result = await Swal.fire({
            title: "Are you sure?",
            text: confirmationMessage,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: "No",
            customClass: {
                confirmButton: 'confirm-color',  // Custom class for confirm button (green)
                cancelButton: 'cancel-color'       // Custom class for cancel button (red)
            },

        });

        if (!result.isConfirmed) {
            return; // Stop execution if the user cancels
        }

        // Find the item being updated
        const updatedItem = tableItems.find((item) => item._id === id);

        if (!updatedItem) return;

        // Keep the previous status to revert in case of failure
        const previousStatus = updatedItem.status;

        // Optimistic update: change status in UI immediately
        setTableItems((prev) =>
            prev.map((item) =>
                item._id === id ? { ...item, status: newStatus } : item
            )
        );

        try {
            // API call to update the status on the server
            const response = await fetch(`/api/requests/update-request-status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id, status: newStatus }),
            });

            if (!response.ok) {
                throw new Error("Failed to update status");
            }

            // Success: Optionally handle the response here
            const data = await response.json();

            toast.success('Status updated successfully!', {
                className: "sonner-toast-success",
                cancel: {
                    label: 'Close',
                    onClick: () => console.log('Close'),
                },
            });

            fetchTableItems();

        } catch (error) {
            // Failure: revert to the previous status
            toast.error("Status failed to update", {
                className: "sonner-toast-error",
                cancel: {
                    label: 'Close',
                    onClick: () => console.log('Close'),
                },
            });
            console.error("Error updating status:", error);

            setTableItems((prev) =>
                prev.map((item) =>
                    item._id === id ? { ...item, status: previousStatus } : item
                )
            );
        }
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

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-2 sm:px-4 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:pb-11 max-w-full">
            <div className="mb-6 overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap items-center gap-5.5 p-6.5">
                        <div className="w-full md:w-auto">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white dark-text">
                                Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Name"
                                value={formState.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                className="w-full md:w-64 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary md:text-sm"
                            />
                        </div>

                        <div className="w-full md:w-auto">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white dark-text">
                                Email
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Email"
                                value={formState.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="w-full md:w-64 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary md:text-sm"
                            />
                        </div>

                        <div className="w-full md:w-auto">
                            <StatusFilter
                                value={formState.selectOne}
                                onChange={(value) => handleInputChange("selectOne", value)}
                            />
                        </div>

                        <div className="flex gap-2 md:self-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-3 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 text-sm bg-color-custom dark-text h-[38px]"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="inline-flex items-center px-3 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 text-sm bg-color-custom dark-text h-[38px]"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </form>

                {/* Desktop Table View */}
                <div className="hidden md:block min-w-[800px]">
                    <table className="w-full table-auto text-md text-left">
                        <thead className="text-gray-600 font-medium border-b">
                            <tr>
                                <th className="py-3 px-6 dark-text">#</th>
                                <th className="py-3 px-6 dark-text">Sender</th>
                                <th className="py-3 px-6 dark-text">Receiver</th>
                                <th className="py-3 px-6 dark-text">Status</th>
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
                                                {item.sender.name}
                                            </h5>
                                            <p className="text-sm">{item.sender.email}</p>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {item.receiver.name}
                                            </h5>
                                            <p className="text-sm">{item.receiver.email}</p>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">

                                            <UpdateStatus
                                                value={item.status}
                                                onChange={(newStatus) => handleStatusUpdate(item._id, newStatus)}
                                            />
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden">
                    {tableItems.length === 0 ? (
                        <div className="text-center px-4 py-6 bg-gray-50 rounded-lg">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-500">No data found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tableItems.map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-boxdark rounded-xl shadow-sm overflow-hidden">
                                    {/* Sender Info */}
                                    <div className="p-4 bg-color-custom-top from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
                                        <h3 className="font-bold text-black dark:text-white">Sender</h3>
                                        <div className="mt-1">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {item.sender.name}
                                            </h5>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{item.sender.email}</p>
                                        </div>
                                    </div>

                                    {/* Receiver Info */}
                                    <div className="p-4 border-t dark:border-gray-700">
                                        <h3 className="font-bold text-black dark:text-white">Receiver</h3>
                                        <div className="mt-1">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {item.receiver.name}
                                            </h5>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{item.receiver.email}</p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                                            <UpdateStatus
                                                value={item.status}
                                                onChange={(newStatus) => handleStatusUpdate(item._id, newStatus)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Updated Pagination */}
            {pages > 1 && (
                <div className="mt-4 px-2 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) handlePageChange(currentPage - 1);
                            }}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
                                ${currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < pages) handlePageChange(currentPage + 1);
                            }}
                            disabled={currentPage === pages}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
                                ${currentPage === pages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            {/* Previous Button */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage > 1) handlePageChange(currentPage - 1);
                                }}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium
                                    ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                            >
                                <svg
                                    className="fill-current"
                                    width="8"
                                    height="16"
                                    viewBox="0 0 8 16"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M7.17578 15.1156C7.00703 15.1156 6.83828 15.0593 6.72578 14.9187L0.369531 8.44995C0.116406 8.19683 0.116406 7.80308 0.369531 7.54995L6.72578 1.0812C6.97891 0.828076 7.37266 0.828076 7.62578 1.0812C7.87891 1.33433 7.87891 1.72808 7.62578 1.9812L1.71953 7.99995L7.65391 14.0187C7.90703 14.2718 7.90703 14.6656 7.65391 14.9187C7.48516 15.0312 7.34453 15.1156 7.17578 15.1156Z" />
                                </svg>
                            </button>

                            {/* Page Numbers */}
                            {Array.from({ length: pages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(i + 1);
                                    }}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                        ${currentPage === i + 1
                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            {/* Next Button */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage < pages) handlePageChange(currentPage + 1);
                                }}
                                disabled={currentPage === pages}
                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium
                                    ${currentPage === pages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                            >
                                <svg
                                    className="fill-current"
                                    width="8"
                                    height="16"
                                    viewBox="0 0 8 16"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M0.819531 15.1156C0.650781 15.1156 0.510156 15.0593 0.369531 14.9468C0.116406 14.6937 0.116406 14.3 0.369531 14.0468L6.27578 7.99995L0.369531 1.9812C0.116406 1.72808 0.116406 1.33433 0.369531 1.0812C0.622656 0.828076 1.01641 0.828076 1.26953 1.0812L7.62578 7.54995C7.87891 7.80308 7.87891 8.19683 7.62578 8.44995L1.26953 14.9187C1.15703 15.0312 0.988281 15.1156 0.819531 15.1156Z" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTable;
