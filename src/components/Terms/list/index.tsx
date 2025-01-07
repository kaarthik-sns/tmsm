'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/FaqBreadcrumb";

const TermTable = () => {

    const [tableItems, setTableItems] = useState([]);
    const router = useRouter();

    const [formState, setFormState] = useState({
        description: "",
    });

    useEffect(() => {
        fetchTableItems();
    });

    const fetchTableItems = async () => {
        try {
            const response = await axios.get("/api/terms/list", {
                params: {
                    page: 1,
                    description: formState.description,
                },
            });

            setTableItems(response.data.data || []);
           
        } catch (error) {
            console.error("Error fetching table items:", error);
        }
    };


    const handleEdit = (TermId) => {
        router.push(`/admin/cms/terms_conditions/edit?termId=${TermId}`);
    };

    return (
        <>
        <Breadcrumb pageName="List Terms & Conditions" />
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-11">
            <div className="">
                {tableItems.length > 0 ? (
                    tableItems.map((item, idx) => (

                        <div key={idx}>
                            <div className="mt-3 md:mt-0">
                                <button onClick={() => handleEdit(item._id)}
                                    className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm bg-color-custom dark-text"
                                >
                                    Edit Terms & Conditions
                                </button>
                            </div>

                        </div>
                    ))
                ) : (
                    <p className="text-center py-4"></p>
                )}
            </div>

            <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
                {tableItems.length > 0 ? (
                    tableItems.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-1 gap-9 sm:grid-cols-1 mb-6">
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="p-6.5">
                                    <div className="mb-4.5">
                                        <h3 className="mb-3 bold">
                                            Terms & Conditions:
                                        </h3>
                                        <div dangerouslySetInnerHTML={{ __html: item.description }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center py-4">No data available.</p>
                )}
            </div>

        </div>
        </>
    );
};

export default TermTable;
