'use client';
import { useEffect, useState } from "react"
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For page navigation
import NextImage from "next/image"; // Rename the import to avoid conflict


const UserTable = () => {

    const [tableItems, setTableItems] = useState([]);
    const router = useRouter(); // Initialize Next.js router

    useEffect(() => {
        fetchTableItems();
    }, []);

    // Fetch table items from API
    const fetchTableItems = async () => {
        try {
            const response = await axios.get("/api/user-list", {
                params: {
                    page: 1
                },
            });

            setTableItems(response.data.data);

        } catch (error) {
            console.error("Error fetching table items:", error);
        }
    };

    const capitalizeFirstLetter = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return (
        <section className="bg-gray-100 p-3 sm:p-6">
            <div className="shadow-sm border rounded-lg overflow-x-auto mb-3">
                <div className="min-w-full">
                    {/* Desktop View */}
                    <table className="hidden sm:table w-full table-auto text-sm md:text-md text-left">
                        <thead className="text-gray-600 font-medium border-b">
                            <tr>
                                <th className="py-3 px-4 sm:px-6 dark-text">#</th>
                                <th className="py-3 px-4 sm:px-6 dark-text">Name</th>
                                <th className="py-3 px-4 sm:px-6 dark-text">Email</th>
                                <th className="py-3 px-4 sm:px-6 dark-text">Phone Number</th>
                                <th className="py-3 px-4 sm:px-6 dark-text">User Status</th>
                                <th className="py-3 px-4 sm:px-6 dark-text">Account Status</th>
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
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                                    {item.profile_photo && (
                                                        <NextImage
                                                            src={`/api${item.profile_photo}`}
                                                            alt="Profile Preview"
                                                            width={16}
                                                            height={16}
                                                            quality={100}
                                                            unoptimized={true}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            {capitalizeFirstLetter(item.name)} {capitalizeFirstLetter(item.lastname)}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{item.email}</td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{item.phonenumber}</td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <span className={`font-medium ${item.is_active ? 'text-green-500' : 'text-orange-500'}`}>
                                                {item.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                            <span className={`font-medium ${item.is_approve ? 'text-green-500' : 'text-orange-500'}`}>
                                                {item.is_approve ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Mobile View */}
                    <div className="sm:hidden">
                        {tableItems.length === 0 ? (
                            <div className="text-center px-4 py-4">
                                No data found
                            </div>
                        ) : (
                            tableItems.map((item, idx) => (
                                <div key={idx} className="rounded-lg mb-3 overflow-hidden">
                                    <div className="bg-[#fdf6e9] p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                                {item.profile_photo && (
                                                    <NextImage
                                                        src={`/api${item.profile_photo}`}
                                                        alt="Profile Preview"
                                                        width={40}
                                                        height={40}
                                                        quality={100}
                                                        unoptimized={true}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-800">
                                                    {capitalizeFirstLetter(item.name)} {capitalizeFirstLetter(item.lastname)}
                                                </h3>
                                                <p className="text-sm text-gray-600">{item.email}</p>
                                                <p className="text-sm text-gray-600">{item.phonenumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">User Status</p>
                                                <p className={`font-medium ${item.is_active ? 'text-green-500' : 'text-orange-500'}`}>
                                                    {item.is_active ? 'Active' : 'Inactive'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Account Status</p>
                                                <p className={`font-medium ${item.is_approve ? 'text-green-500' : 'text-orange-500'}`}>
                                                    {item.is_approve ? 'Approved' : 'Pending'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <Link
                    href="/admin/users/userlist"
                    className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 text-sm bg-color-custom dark-text"
                >
                    View more
                </Link>
            </div>
        </section>
    );
};

export default UserTable;
