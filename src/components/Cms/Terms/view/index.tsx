'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/TermBreadcrumb";

const TermTable = () => {

    const [description, setDescription] = useState(null);
    const router = useRouter();


    const fetchTableItems = async () => {
        try {
            const response = await axios.post("/api/cms/terms/view");
            setDescription(response?.data?.data?.description || null);

        } catch (error) {
            console.error("Error fetching table items:", error);
        }
    };

    useEffect(() => {
        fetchTableItems();
    }, []);

    const handleEdit = () => {
        router.push(`/admin/cms/terms_conditions/edit`);
    };

    return (
        <>
            <Breadcrumb pageName="Terms & conditions" />
            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-11">
                <div className="">
                    <div>
                        <div className="mt-3 md:mt-0">
                            <button
                                onClick={() => handleEdit()}
                                className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm bg-color-custom dark-text"
                            >
                                Edit Terms & conditions
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
                    {description ? (
                        <div className="grid grid-cols-1 gap-9 sm:grid-cols-1 mb-6">
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="p-6.5">
                                    <div className="mb-4.5">
                                        <div dangerouslySetInnerHTML={{ __html: description }} className="cms-heading" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center py-4">No data available.</p>
                    )}
                </div>
            </div>
        </>
    );

};

export default TermTable;
