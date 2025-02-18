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


    return (
        <section className="bg-gray-100 p-6">
            <div className="shadow-sm border rounded-lg overflow-x-auto mb-3">
                <table className="w-full table-auto text-md text-left">
                    <thead className="text-gray-600 font-medium border-b">
                        <tr>
                            <th className="py-3 px-6 dark-text">#</th>
                            <th className="py-3 px-6 dark-text">Name</th>
                            <th className="py-3 px-6 dark-text">Email</th>
                            <th className="py-3 px-6 dark-text">Phone Number</th>
                            <th className="py-3 px-6 dark-text">User Status</th>
                            <th className="py-3 px-6 dark-text">Acccount Status</th>
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
                                    <td className="px-6 py-4 whitespace-nowrap">
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
                                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.phonenumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.is_active ? 'Active' : 'Inactive'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.is_approve ? 'Approved' : 'Pending'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
            <div className="flex justify-center">
                    <Link
                        href="/admin/users/userlist"
                        className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm bg-color-custom dark-text"
                    >
                        View more
                    </Link>
                </div>
        </section >
        
    );
};

export default UserTable;
