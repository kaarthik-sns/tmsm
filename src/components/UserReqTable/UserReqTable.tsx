'use client';

import { useEffect, useState } from "react"
import StatusFilter from "@/components/UserReqTable/Select/StatusFilter";
import UpdateStatus from "@/components/UserReqTable/Select/UpdateStatus";
import { toast } from "sonner";
import Swal from 'sweetalert2';
import Loader from "@/components/common/Loader";
import Pagination from "@/components/Pagination";

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

    // Generate pagination numbers (show only a few around current page)
    const getPaginationNumbers = () => {
        const pageNumbers = [];
        const maxVisible = 2; // Show 2 pages before and after current page
        const start = Math.max(1, currentPage - maxVisible);
        const end = Math.min(pages, currentPage + maxVisible);

        if (start > 1) pageNumbers.push(1);
        if (start > 2) pageNumbers.push("...");

        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }

        if (end < pages - 1) pageNumbers.push("...");
        if (end < pages) pageNumbers.push(pages);

        return pageNumbers;
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
                < Pagination
                    currentPage={currentPage}
                    totalPages={pages}
                    changePage={handlePageChange}
                    getPaginationNumbers={getPaginationNumbers}
                />
            )}
        </div>
    );
};

export default UserTable;
