'use client';

import { useEffect, useState } from "react"
import StatusFilter from "@/components/UserReqTable/Select/StatusFilter";
import UpdateStatus from "@/components/UserReqTable/Select/UpdateStatus";

import Link from "next/link";
import { useRouter } from "next/navigation"; // For page navigation

const UserTable = () => {

    const [pages, setPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [tableItems, setTableItems] = useState([]);
    const router = useRouter(); // Initialize Next.js router
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
                    name: formState.name,
                    email: formState.email,
                    status: formState.selectOne,
                }),
            });

            const data = await response.json();
            console.log(data);
            setTableItems(data.data);
            setPages(data.pagination.totalPages);
        } catch (error) {
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
            console.log("Status updated successfully", data);

        } catch (error) {
            // Failure: revert to the previous status
            console.error("Error updating status:", error);

            setTableItems((prev) =>
                prev.map((item) =>
                    item._id === id ? { ...item, status: previousStatus } : item
                )
            );
        }
    };


    // Handle Previous Page click
    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    // Handle Next Page click
    const handleNext = () => {
        if (currentPage < pages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };


    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-11">
            <div className="items-start justify-between md:flex">
                <div className="mt-3 md:mt-0">
                    <Link
                        href="/admin/users/useradd"
                        className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm bg-color-custom dark-text"
                    >
                        Add member
                    </Link>
                </div>
            </div>
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
                                <td colSpan="6" className="text-center px-6 py-4 whitespace-nowrap">
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
            <div className="max-w-screen-xl mx-auto mt-12 px-4 text-gray-600 md:px-8">
                <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                    <a href="#" onClick={handlePrevious} className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50 dark-text">
                        Previous
                    </a>
                    <div className="dark-text">
                        Page {currentPage} of {pages}
                    </div>
                    <a href="#" onClick={handleNext} className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50 dark-text">
                        Next
                    </a>
                </div>
            </div>
        </div >
    );
};

export default UserTable;
