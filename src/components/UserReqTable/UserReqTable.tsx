'use client';

import { useEffect, useState } from "react"
import StatusFilter from "@/components/UserReqTable/Select/StatusFilter";
import UpdateStatus from "@/components/UserReqTable/Select/UpdateStatus";
import { toast } from "sonner";

const UserTable = () => {

    const [pages, setPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [tableItems, setTableItems] = useState([]);
    const [triggerFetch, setTriggerFetch] = useState(false);

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
            toast.error("Error fetching table items");

            console.error("Error fetching table items:", error);
        }
    };


    const handleStatusUpdate = async (id: string, newStatus: string) => {
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
            // API call to update the status on the server update-request-status
            const response = await fetch(`/api/requests/update-request-status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id, status: newStatus }), // Ensure the status is sent in the correct format
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

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-11">

            <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">

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

                        <div className="w-full md:w-auto flex justify-between gap-4 mt-5 md:mt-5">
                            <button
                                className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm bg-color-custom dark-text"
                                type="submit"
                            >
                                Search
                            </button>

                            <button
                                className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm bg-color-custom dark-text"
                                type="button"
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </form>

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
        </div >
    );
};

export default UserTable;
