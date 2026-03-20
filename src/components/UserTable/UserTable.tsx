'use client';
import { useEffect, useState } from "react"
import axios from "axios";
import SwitcherFour from "@/components/Switchers/SwitcherFour";
import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For page navigation
import NextImage from "next/image"; // Rename the import to avoid conflict
import { toast } from "sonner";
import Swal from 'sweetalert2';
import Loader from "@/components/common/Loader";
import Pagination from "@/components/Pagination";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const UserTable = () => {

    const [pages, setPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [tableItems, setTableItems] = useState([]);
    const [switchStates, setSwitchStates] = useState<boolean[]>([]);
    const [switchStates2, setSwitchStates2] = useState<boolean[]>([]);
    const router = useRouter(); // Initialize Next.js router
    const [isLoading, setIsLoading] = useState(false);
    const [triggerFetch, setTriggerFetch] = useState(false);
    const lang = localStorage.getItem('lang') || 'en';
    const isTamil = lang === 'ta';

    const [formState, setFormState] = useState({
        name: "",
        email: "",
        selectOne: "",
        selectTwo: "",
    });

    useEffect(() => {
        fetchTableItems();
    }, [currentPage]);

    useEffect(() => {
        if (tableItems.length > 0) {
            setSwitchStates(tableItems.map((item) => item.is_active));
            setSwitchStates2(tableItems.map((item) => item.is_approve));

        }
    }, [tableItems]);

    const handleInputChange = (field, value) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (currentPage !== 1) {
            setCurrentPage(1); // Reset page to 1; useEffect will trigger fetchTableItems
        } else {
            fetchTableItems(); // Directly fetch items if already on page 1
        }
        setTriggerFetch(false); // Reset trigger
    };

    const handleReset = () => {
        setFormState({
            name: "",
            email: "",
            selectOne: "",
            selectTwo: "",
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
            const response = await axios.get("/api/user-list", {
                params: {
                    page: currentPage,
                    name: formState.name,
                    email: formState.email,
                    is_active: formState.selectOne,
                    is_approve: formState.selectTwo,
                },
            });

            setTableItems(response.data.data);
            setPages(response.data.pagination.totalPages);


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


    const handleVerify = async (userId: string) => {
        try {
            const response = await fetch('/api/resend-verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Verification email sent successfully.', {
                    className: "sonner-toast-success",
                    cancel: {
                        label: 'Close',
                        onClick: () => console.log('Close'),
                    },
                });
            } else {
                toast.error('Failed to send verification email.', {
                    className: "sonner-toast-error",
                    cancel: {
                        label: 'Close',
                        onClick: () => console.log('Close'),
                    },
                });
            }
        } catch (error) {
            console.error("Error sending verification email:", error);
            toast.error('Something went wrong. Please try again.', {
                className: "sonner-toast-error",
                cancel: {
                    label: 'Close',
                    onClick: () => console.log('Close'),
                },
            });
        }
    }

    const handleDelete = async (userId) => {

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
            return; // Stop submission if the user cancels
        }

        try {
            const response = await axios.get(`/api/delete-user?userId=${userId}`, {
            });

            if (response.status === 200) {

                toast.success('User deleted successfully!', {
                    className: "sonner-toast-success",
                    cancel: {
                        label: 'Close',
                        onClick: () => console.log('Close'),
                    },
                });

                fetchTableItems();
            } else {

                toast.error('Failed to delete user!', {
                    className: "sonner-toast-error",
                    cancel: {
                        label: 'Close',
                        onClick: () => console.log('Close'),
                    },
                });

            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error(error.response?.data?.message || "An error occurred while deleting the user. Please try again.", {
                className: "sonner-toast-error",
                cancel: {
                    label: 'Close',
                    onClick: () => console.log('Close'),
                },
            });
        }
    };


    const handleToggle = async (index: number, key: "is_active" | "is_approve") => {
        const updatedValue = !tableItems[index][key];

        let reactivate_reason = "";
        let reason = "";

        // Prompt for reason when activating OR deactivating a user
        if (key === "is_active") {
            const { value } = await Swal.fire({
                icon: "warning",
                title: updatedValue ? "Reason for Reactivation" : "Reason for Deactivation",
                input: "textarea",
                inputPlaceholder: "Enter the reason...",
                showCancelButton: true,
                confirmButtonText: "Submit",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                inputValidator: (value) => {
                    if (!value) return "Reason is required!";
                },
            });

            if (!value) return; // Stop if no reason is provided

            if (updatedValue) {
                reactivate_reason = value; // Store reason in reactivate_reason when activating
            } else {
                reason = value; // Store reason in reason when deactivating
            }
        }

        // Show confirmation alert
        const result = await Swal.fire({
            title: "Are you sure?",
            text: key === "is_active"
                ? `Do you want to ${updatedValue ? "activate" : "deactivate"} this user?`
                : `Do you want to ${updatedValue ? "approve" : "disapprove"} this user?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, proceed!",
            cancelButtonText: "No",
        });

        if (!result.isConfirmed) return;

        // Optimistically update the UI
        setTableItems((prevItems) =>
            prevItems.map((item, idx) =>
                idx === index ? { ...item, [key]: updatedValue } : item
            )
        );

        try {
            // Call the API to update the status
            const response = await axios.patch(`/api/update-user-status`, {
                id: tableItems[index]._id,
                [key]: updatedValue,
                ...(updatedValue ? { reactivate_reason } : { reason }), // Send the appropriate field
            });

            if (response.status !== 200) {
                throw new Error("Failed to update status");
            }

            toast.success(
                key === "is_active"
                    ? `User ${updatedValue ? "activated" : "deactivated"} successfully!`
                    : `User ${updatedValue ? "approved" : "disapproved"} successfully!`,
                {
                    className: "sonner-toast-success",
                    cancel: {
                        label: 'Close',
                        onClick: () => console.log('Close'),
                    }
                }
            );

        } catch (error) {
            console.error("Error updating status:", error);

            // Revert the optimistic UI update if the API call fails
            setTableItems((prevItems) =>
                prevItems.map((item, idx) =>
                    idx === index ? { ...item, [key]: !updatedValue } : item
                )
            );

            toast.error(
                key === "is_active"
                    ? "Failed to update activation status."
                    : "Failed to update approval status.",
                {
                    className: "sonner-toast-error",
                    cancel: {
                        label: 'Close',
                        onClick: () => console.log('Close'),
                    }
                }
            );

        }
    };


    const handleEdit = (userId) => {
        // Navigate to the edit page with the user ID as a query parameter
        router.push(`/admin/users/useredit?userId=${userId}`);
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

    // First, let's define the arrow SVG components at the top of the component
    const PrevArrowIcon = () => (
        <svg
            className="fill-current"
            width="8"
            height="16"
            viewBox="0 0 8 16"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M7.17578 15.1156C7.00703 15.1156 6.83828 15.0593 6.72578 14.9187L0.369531 8.44995C0.116406 8.19683 0.116406 7.80308 0.369531 7.54995L6.72578 1.0812C6.97891 0.828076 7.37266 0.828076 7.62578 1.0812C7.87891 1.33433 7.87891 1.72808 7.62578 1.9812L1.71953 7.99995L7.65391 14.0187C7.90703 14.2718 7.90703 14.6656 7.65391 14.9187C7.48516 15.0312 7.34453 15.1156 7.17578 15.1156Z" />
        </svg>
    );

    const NextArrowIcon = () => (
        <svg
            className="fill-current"
            width="8"
            height="16"
            viewBox="0 0 8 16"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M0.819531 15.1156C0.650781 15.1156 0.510156 15.0593 0.369531 14.9468C0.116406 14.6937 0.116406 14.3 0.369531 14.0468L6.27578 7.99995L0.369531 1.9812C0.116406 1.72808 0.116406 1.33433 0.369531 1.0812C0.622656 0.828076 1.01641 0.828076 1.26953 1.0812L7.62578 7.54995C7.87891 7.80308 7.87891 8.19683 7.62578 8.44995L1.26953 14.9187C1.15703 15.0312 0.988281 15.1156 0.819531 15.1156Z" />
        </svg>
    );

    // Add this utility function at the top
    const capitalizeFirstLetter = (str: string) => {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    };

    return (
        <>
            <Breadcrumb pageName={isTamil ? 'உறுப்பினர் பட்டியல்' : 'List Users'} />
            <div className="rounded-sm border border-stroke bg-white px-2 sm:px-4 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:pb-11 max-w-full">
                {/* Add member button */}
                <div className="flex justify-end mb-4">
                    <Link
                        href="/admin/users/useradd"
                        className="inline-flex items-center px-3 sm:px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 text-sm bg-color-custom dark-text"
                    >
                        <span className="hidden sm:inline">{isTamil ? 'உறுப்பினரைச் சேர்க்கவும்' : 'Add User'}</span>
                        <span className="sm:hidden">{isTamil ? 'உறுப்பினரைச் சேர்' : 'Add'}</span>
                    </Link>
                </div>

                {/* Search form */}
                <div className="mb-6 overflow-hidden">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-boxdark rounded-lg shadow-sm">
                        <div className="flex flex-col md:flex-row gap-4 p-4">
                            {/* Name Input */}
                            <div className="w-full md:w-64">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white dark-text">
                                    {isTamil ? 'பெயர்' : 'Name'}
                                </label>
                                <input
                                    type="text"
                                    placeholder={isTamil ? 'பெயரை உள்ளிடவும்' : 'Enter Name'}
                                    value={formState.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    className="w-full md:w-64 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary md:text-sm"
                                />
                            </div>

                            {/* Email Input */}
                            <div className="w-full md:w-64">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white dark-text">
                                    {isTamil ? 'மின்னஞ்சல்' : 'Email'}
                                </label>
                                <input
                                    type="text"
                                    placeholder={isTamil ? 'மின்னஞ்சலை உள்ளிடவும்' : 'Enter Email'}
                                    value={formState.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    className="w-full md:w-64 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary md:text-sm"
                                />
                            </div>

                            {/* User Status Dropdown */}
                            <div className="w-full md:w-64">
                                <SelectGroupTwo
                                    value={formState.selectOne}
                                    onChange={(value) => handleInputChange("selectOne", value)}
                                />
                            </div>

                            {/* Account Status Dropdown */}
                            <div className="w-full md:w-64">
                                <SelectGroupOne
                                    value={formState.selectTwo}
                                    onChange={(value) => handleInputChange("selectTwo", value)}
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 md:self-end">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-3 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 text-sm bg-color-custom dark-text h-[38px]"
                                >
                                    {isTamil ? 'தேடு' : 'Search'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="inline-flex items-center px-3 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 text-sm bg-color-custom dark-text h-[38px]"
                                >
                                    {isTamil ? 'மீட்டமை' : 'Reset'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Table section */}
                <div className="w-full overflow-hidden rounded-lg border border-stroke shadow-sm">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <div className="min-w-[800px]">
                            <table className="w-full table-auto text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-boxdark text-gray-600 font-medium border-b">
                                    <tr>
                                        <th className="py-3 px-6 dark-text">#</th>
                                        <th className="py-3 px-6 dark-text">{isTamil ? 'பெயர்' : 'Name'}</th>
                                        <th className="py-3 px-6 dark-text">{isTamil ? 'மின்னஞ்சல்' : 'Email'}</th>
                                        <th className="py-3 px-6 dark-text">{isTamil ? 'தொலைபேசி எண்' : 'Phone Number'}</th>
                                        <th className="py-3 px-6 dark-text">{isTamil ? 'உறுப்பினர் நிலை' : 'User Status'}</th>
                                        <th className="py-3 px-6 dark-text">{isTamil ? 'கணக்கின் நிலை' : 'Account Status'}</th>
                                        <th className="py-3 px-6 dark-text">{isTamil ? 'செயல்பாடுகள்' : 'Action'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tableItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center px-6 py-4 whitespace-nowrap">
                                                {isTamil ? 'தரவு எதுவும் கிடைக்கவில்லை' : 'No data found'}
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
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1 max-w-[150px] lg:max-w-[200px]" title={`${capitalizeFirstLetter(item.name)} ${capitalizeFirstLetter(item.lastname)}`}>
                                                        <span className="truncate">{capitalizeFirstLetter(item.name)}</span>
                                                        <span className="text-gray-500 truncate">{capitalizeFirstLetter(item.lastname)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="max-w-[150px] lg:max-w-[250px] truncate" title={item.email}>
                                                        {item.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{item.phonenumber}</td>
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
                                                        <button
                                                            onClick={() => handleEdit(item._id)}
                                                            title="Edit"
                                                            className="py-2 px-3 font-medium  hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg "
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                                className="w-6 h-6"
                                                            >
                                                                <path d="M4 20h4l10-10-4-4L4 16v4zm15.656-15.656a2 2 0 010 2.828l-1.828 1.828-4-4 1.828-1.828a2 2 0 012.828 0l1.172 1.172z" />
                                                            </svg>


                                                        </button>

                                                        <Link
                                                            href={{
                                                                pathname: "/admin/users/userview",
                                                                query: { userId: item._id },
                                                            }}

                                                            className="inline-block px-4 py-2 text-white duration-150 font-medium  md:text-sm dark-text"
                                                        >
                                                            <svg
                                                                className="fill-current"
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 18 18"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                                                    fill=""
                                                                />
                                                                <path
                                                                    d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                                                    fill=""
                                                                />
                                                            </svg>
                                                        </Link>

                                                        {(!switchStates[idx] || !switchStates2[idx]) && (
                                                            <button
                                                                onClick={() => handleDelete(item._id)}
                                                                title="Delete"
                                                                className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                                                            >

                                                                <svg
                                                                    className="fill-current"
                                                                    width="18"
                                                                    height="18"
                                                                    viewBox="0 0 18 18"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                                        fill=""
                                                                    />
                                                                    <path
                                                                        d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                                                        fill=""
                                                                    />
                                                                    <path
                                                                        d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                                                        fill=""
                                                                    />
                                                                    <path
                                                                        d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                                                        fill=""
                                                                    />
                                                                </svg>

                                                            </button>

                                                        )}
                                                        {(!item.is_verify) && (
                                                            <button
                                                                onClick={() => handleVerify(item._id)}
                                                                title="Verify"
                                                                className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                                                            >

                                                                <svg
                                                                    className="fill-current"
                                                                    width="18"
                                                                    height="18"
                                                                    viewBox="0 0 18 18"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M2.25 3.375C1.55964 3.375 1 3.93464 1 4.625V13.375C1 14.0654 1.55964 14.625 2.25 14.625H15.75C16.4404 14.625 17 14.0654 17 13.375V4.625C17 3.93464 16.4404 3.375 15.75 3.375H2.25ZM3.0625 4.75H14.9375L9 9.125L3.0625 4.75ZM2.25 5.90625L9 10.875L15.75 5.90625V13.375H2.25V5.90625Z"
                                                                        fill=""
                                                                    />
                                                                </svg>


                                                            </button>

                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>

                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block md:hidden w-full">
                        {tableItems.length === 0 ? (
                            <div className="text-center px-4 py-6 bg-gray-50 rounded-lg">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="mt-2 text-sm text-gray-500">No data found</p>
                            </div>
                        ) : (
                            <div className="space-y-4 px-2 pb-4">
                                {tableItems.map((item, idx) => (
                                    <div key={idx} className="bg-white dark:bg-boxdark rounded-xl shadow-sm overflow-hidden">
                                        {/* Header with Profile */}
                                        <div className="p-3 bg-color-custom-top from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-md ring-2 ring-white flex-shrink-0">
                                                    {item.profile_photo ? (
                                                        <NextImage
                                                            src={`/api${item.profile_photo}`}
                                                            alt="Profile"
                                                            width={40}
                                                            height={40}
                                                            quality={100}
                                                            unoptimized={true}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 overflow-hidden">
                                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                        {capitalizeFirstLetter(item.name)} {capitalizeFirstLetter(item.lastname)}
                                                    </h3>
                                                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{item.email}</p>
                                                    <p className="text-xs font-medium mt-0.5 dark:text-white truncate">{item.phonenumber}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info Cards */}
                                        <div className="p-2 grid grid-cols-2 gap-2">
                                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{isTamil ? 'உறுப்பினர் நிலை' : 'User Status'}</p>
                                                <div className="mt-1">
                                                    <SwitcherFour
                                                        isEnabled={switchStates[idx]}
                                                        onToggle={() => handleToggle(idx, "is_active")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{isTamil ? 'கணக்கின் நிலை' : 'Account Status'}</p>
                                                <div className="mt-1">
                                                    <SwitcherFour
                                                        isEnabled={switchStates2[idx]}
                                                        onToggle={() => handleToggle(idx, "is_approve")}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="p-2 flex flex-wrap items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700">
                                            <button
                                                onClick={() => handleEdit(item._id)}
                                                title="Edit"
                                                className="p-1.5 text-gray-600 hover:text-indigo-500 duration-150 hover:bg-gray-100 rounded-lg"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="w-5 h-5"
                                                >
                                                    <path d="M4 20h4l10-10-4-4L4 16v4zm15.656-15.656a2 2 0 010 2.828l-1.828 1.828-4-4 1.828-1.828a2 2 0 012.828 0l1.172 1.172z" />
                                                </svg>
                                            </button>

                                            <Link
                                                href={{
                                                    pathname: "/admin/users/userview",
                                                    query: { userId: item._id },
                                                }}

                                                className="inline-block px-4 py-2 text-white duration-150 font-medium  md:text-sm dark-text"
                                            >
                                                <svg
                                                    className="fill-current"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                                        fill=""
                                                    />
                                                </svg>
                                            </Link>

                                            {(!switchStates[idx] || !switchStates2[idx]) && (
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    title="Delete"
                                                    className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                                                >

                                                    <svg
                                                        className="fill-current"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 18 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                                            fill=""
                                                        />
                                                    </svg>

                                                </button>

                                            )}
                                            {(!item.is_verify) && (
                                                <button
                                                    onClick={() => handleVerify(item._id)}
                                                    title="Verify"
                                                    className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                                                >

                                                    <svg
                                                        className="fill-current"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 18 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M2.25 3.375C1.55964 3.375 1 3.93464 1 4.625V13.375C1 14.0654 1.55964 14.625 2.25 14.625H15.75C16.4404 14.625 17 14.0654 17 13.375V4.625C17 3.93464 16.4404 3.375 15.75 3.375H2.25ZM3.0625 4.75H14.9375L9 9.125L3.0625 4.75ZM2.25 5.90625L9 10.875L15.75 5.90625V13.375H2.25V5.90625Z"
                                                            fill=""
                                                        />
                                                    </svg>


                                                </button>

                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                    < Pagination
                        currentPage={currentPage}
                        totalPages={pages}
                        changePage={handlePageChange}
                        getPaginationNumbers={getPaginationNumbers}
                    />
                )}
            </div>
        </>
    );
};

export default UserTable;
