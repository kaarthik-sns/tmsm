'use client';
import { useEffect, useState } from "react"
import axios from "axios";
import SwitcherFour from "@/components/Switchers/SwitcherFour";
import { BsPencilSquare } from "react-icons/bs";
import { BsFillTrash3Fill } from "react-icons/bs";

const UserTable = () => {

    const [pages, setPages] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [tableItems, setTableItems] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [status, setStatus] = useState("");
    const [switchStates, setSwitchStates] = useState<boolean[]>([]);
    const [switchStates2, setSwitchStates2] = useState<boolean[]>([]);

    useEffect(() => {
        if (tableItems.length > 0) {
            setSwitchStates(tableItems.map((item) => item.is_active));
            setSwitchStates2(tableItems.map((item) => item.is_approve));

        }
    }, [tableItems]);

    const handleToggle = async (index: number, key: "is_active" | "is_approve") => {
        const updatedValue = !tableItems[index][key];

        // Optimistically update the UI
        setTableItems((prevItems) =>
            prevItems.map((item, idx) =>
                idx === index ? { ...item, [key]: updatedValue } : item
            )
        );

        try {
            // Call the API to update the status
            const response = await axios.patch(`/api/update-user-status`, {
                id: tableItems[index]._id, // Assuming each item has a unique `id`
                [key]: updatedValue,
            });

            if (response.status !== 200) {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);

            // Revert the optimistic UI update if the API call fails
            setTableItems((prevItems) =>
                prevItems.map((item, idx) =>
                    idx === index ? { ...item, [key]: !updatedValue } : item
                )
            );
        }
    };


    useEffect(() => {

        // Fetch table items from API
        const fetchTableItems = async () => {
            try {
                const response = await axios.get("/api/user-list", {
                    params: {
                        page: currentPage,
                        keyword: searchKeyword,
                        status,
                    },
                });

                setTableItems(response.data.data);
                setPages(response.data.pagination.totalPages);


            } catch (error) {
                console.error("Error fetching table items:", error);
            }
        };

        fetchTableItems();
    }, [currentPage, searchKeyword, status]);

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
                    <a
                        href="#"
                        className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
                    >
                        Add member
                    </a>
                </div>
            </div>
            <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
                <table className="w-full table-auto text-sm text-left">
                    <thead className="text-gray-600 font-medium border-b">
                        <tr>
                            <th className="py-3 px-6">#</th>
                            <th className="py-3 px-6">Name</th>
                            <th className="py-3 px-6">Email</th>
                            <th className="py-3 px-6">Status</th>
                            <th className="py-3 px-6">Approved Status</th>

                            <th className="py-3 px-6"></th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                        {tableItems.map((item, idx) => (
                            <tr key={idx} className="odd:bg-gray-50 even:bg-white">
                                <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <SwitcherFour
                                        isEnabled={switchStates[idx]}
                                        onToggle={() => handleToggle(idx, "is_active")}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <SwitcherFour
                                        isEnabled={switchStates2[idx]}
                                        onToggle={() => handleToggle(idx, "is_approve")}
                                    />
                                </td>
                                <td className="text-right px-6 whitespace-nowrap">
                                    <div className="flex items-center space-x-3.5">

                                        <a
                                            href="#"
                                            className="py-2 px-3 cursor-pointer font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                                        >
                                            <BsPencilSquare className="text-xl"/>
                                        </a>
                                        <a
                                            href="#"
                                            className="py-2 px-3 cursor-pointer font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                                        >
                                            <BsFillTrash3Fill className="text-xl"/>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="max-w-screen-xl mx-auto mt-12 px-4 text-gray-600 md:px-8">
                <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                    <a href="#" onClick={handlePrevious} className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50">
                        Previous
                    </a>
                    <div>
                        Page {currentPage} of {pages}
                    </div>
                    <a href="#" onClick={handleNext} className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50">
                        Next
                    </a>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
