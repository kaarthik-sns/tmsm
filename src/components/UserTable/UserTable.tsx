'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For page navigation

const UserTable = () => {
    const [areAllChecked, setAllChecked] = useState(false);
    const [checkboxItems, setCheckboxItem] = useState({});
    const [pages, setPages] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [tableItems, setTableItems] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [status, setStatus] = useState("");

    const router = useRouter(); // Initialize Next.js router

    const handleCheckboxItems = () => {
        setAllChecked(!areAllChecked);
        const updatedCheckboxItems = {};
        tableItems.forEach((item, idx) => {
            updatedCheckboxItems[`checkbox${idx}`] = !areAllChecked;
        });
        setCheckboxItem(updatedCheckboxItems);
    };

    const handleCheckboxChange = (e, idx) => {
        setAllChecked(false);
        setCheckboxItem((prevCheckboxItems) => ({
            ...prevCheckboxItems,
            [`checkbox${idx}`]: e.target.checked,
        }));
    };

    useEffect(() => {
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

                const initialCheckboxState = {};
                response.data.data.forEach((item, idx) => {
                    initialCheckboxState[`checkbox${idx}`] = false;
                });

                setCheckboxItem(initialCheckboxState);

            } catch (error) {
                console.error("Error fetching table items:", error);
            }
        };

        fetchTableItems();
    }, [currentPage, searchKeyword, status]);

    const handleEdit = (userId) => {
        // Navigate to the edit page with the user ID as a query parameter
        router.push(`/admin/users/useradd?userId=${userId}`);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < pages) {
            setCurrentPage((prevPage) => prevPage + 1);
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
                <table className="w-full table-auto text-sm text-left">
                    <thead className="text-gray-600 font-medium border-b">
                        <tr>
                            <th className="py-3 px-6 flex items-center gap-x-4">
                                <div>
                                    <input
                                        type="checkbox"
                                        id="checkbox-all-items"
                                        className="checkbox-item peer hidden"
                                        checked={areAllChecked}
                                        onChange={handleCheckboxItems}
                                    />
                                    <label
                                        htmlFor="checkbox-all-items"
                                        className="relative flex w-5 h-5 bg-white peer-checked:bg-indigo-600 rounded-md border ring-offset-2 ring-indigo-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                                    ></label>
                                </div>
                                Username
                            </th>
                            <th className="py-3 px-6">Email</th>
                            <th className="py-3 px-6">Name</th>
                            <th className="py-3 px-6"></th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                        {tableItems.map((item, idx) => (
                            <tr key={idx} className="odd:bg-gray-50 even:bg-white">
                                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-x-4">
                                    <div>
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${idx}`}
                                            name={`checkbox-${idx}`}
                                            className="checkbox-item peer hidden"
                                            checked={checkboxItems[`checkbox${idx}`]}
                                            onChange={(e) => handleCheckboxChange(e, idx)}
                                        />
                                        <label
                                            htmlFor={`checkbox-${idx}`}
                                            className="relative flex w-5 h-5 bg-white peer-checked:bg-indigo-600 rounded-md border ring-offset-2 ring-indigo-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                                        ></label>
                                    </div>
                                    {item.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                <td className="text-right px-6 whitespace-nowrap">
                                    <button
                                        onClick={() => handleEdit(item._id)}
                                        className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="max-w-screen-xl mx-auto mt-12 px-4 text-gray-600 md:px-8">
                <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                    <button onClick={handlePrevious} className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50">
                        Previous
                    </button>
                    <div>
                        Page {currentPage} of {pages}
                    </div>
                    <button onClick={handleNext} className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
