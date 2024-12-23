'use client';
import { useEffect, useState } from "react"

const tableItems = [
    {
        name: "Liam James",
        email: "liamjames@example.com",
        position: "Software engineer",
        salary: "$100K"
    },
    {
        name: "Olivia Emma",
        email: "oliviaemma@example.com",
        position: "Product designer",
        salary: "$90K"
    },
    {
        name: "William Benjamin",
        email: "william.benjamin@example.com",
        position: "Front-end developer",
        salary: "$80K"
    },
    {
        name: "Henry Theodore",
        email: "henrytheodore@example.com",
        position: "Laravel engineer",
        salary: "$120K"
    },
    {
        name: "Amelia Elijah",
        email: "amelia.elijah@example.com",
        position: "Open source manager",
        salary: "$75K"
    },
]

const UserTable = () => {

    const [areAllChecked, setAllChecked] = useState(false);
    let [checkboxItems, setCheckboxItem] = useState({});
    const [pages, setPages] = useState(["1", "2", "3", , "...", "8", "9", "10",]);
    const [currentPage, setCurrentPage] = useState("1");

    // set or unset all checkbox items
    const handleCheckboxItems = () => {
        setAllChecked(!areAllChecked)
        tableItems.forEach((item, idx) => {
            checkboxItems[`checkbox${idx}`] = !areAllChecked
            setCheckboxItem({ ...checkboxItems })
        })
    }

    // Update checked value
    const handleCheckboxChange = (e, idx) => {
        setAllChecked(false)
        setCheckboxItem({ ...checkboxItems, [`checkbox${idx}`]: e.target.checked })
    }

    useEffect(() => {
        // Set properties with false value
        tableItems.forEach((item, idx) => {
            checkboxItems[`checkbox${idx}`] = false
            setCheckboxItem({ ...checkboxItems })
        })
    }, [])

    useEffect(() => {
        // Check if all checkbox items are checked and update setAllChecked state
        const checkboxItemsVal = Object.values(checkboxItems)
        const checkedItems = checkboxItemsVal.filter(item => item == true)
        if (checkedItems.length == tableItems.length) setAllChecked(true)
    }, [checkboxItems]);
    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-11">
            <div className="items-start justify-between md:flex">
                <div className="mt-3 md:mt-0">
                    <a
                        href="javascript:void(0)"
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
                            <th className="py-3 px-6 flex items-center gap-x-4">
                                <div>
                                    <input type="checkbox" id="checkbox-all-items" className="checkbox-item peer hidden"
                                        checked={areAllChecked}
                                        onChange={handleCheckboxItems}
                                    />
                                    <label
                                        htmlFor="checkbox-all-items"
                                        className="relative flex w-5 h-5 bg-white peer-checked:bg-indigo-600 rounded-md border ring-offset-2 ring-indigo-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                                    >
                                    </label>
                                </div>
                                Username
                            </th>
                            <th className="py-3 px-6">Email</th>
                            <th className="py-3 px-6">Position</th>
                            <th className="py-3 px-6">Salary</th>
                            <th className="py-3 px-6"></th>

                        </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                        {
                            tableItems.map((item, idx) => (
                                <tr key={idx} className="odd:bg-gray-50 even:bg-white">
                                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-x-4">
                                        <div>
                                            <input type="checkbox" id={`checkbox-${idx}`} name={`checkbox-${idx}`} className="checkbox-item peer hidden"
                                                checked={checkboxItems[`checkbox${idx}`]}
                                                onChange={(e) => handleCheckboxChange(e, idx)}
                                            />
                                            <label
                                                htmlFor={`checkbox-${idx}`}
                                                className="relative flex w-5 h-5 bg-white peer-checked:bg-indigo-600 rounded-md border ring-offset-2 ring-indigo-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                                            >
                                            </label>
                                        </div>
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.position}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.salary}</td>
                                    <td className="text-right px-6 whitespace-nowrap">
                                        <a href="javascript:void()" className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg">
                                            Edit
                                        </a>
                                        <button href="javascript:void()" className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className="max-w-screen-xl mx-auto mt-12 px-4 text-gray-600 md:px-8">
                <div className="hidden justify-between text-sm md:flex">
                    <div>
                        SHOWING 1-10 OF 120
                    </div>
                    <div className="flex items-center gap-12" aria-label="Pagination">
                        <a href="javascript:void(0)" className="hover:text-indigo-600">
                            Previous
                        </a>
                        <ul className="flex items-center gap-1">
                            {
                                pages.map((item, idx) => (
                                    <li key={item}>
                                        {
                                            item == "..." ? (
                                                <div>
                                                    {item}
                                                </div>
                                            ) : (

                                                <a href="javascript:void(0)" aria-current={currentPage == item ? "page" : false} className={`px-3 py-2 rounded-lg duration-150 hover:text-white hover:bg-indigo-600 ${currentPage == item ? "bg-indigo-600 text-white font-medium" : ""}`}>
                                                    {item}
                                                </a>
                                            )
                                        }
                                    </li>
                                ))
                            }
                        </ul>
                        <a href="javascript:void(0)" className="hover:text-indigo-600">
                            Next
                        </a>
                    </div>
                </div>
                {/* On mobile version */}
                <div className="flex items-center justify-between text-sm text-gray-600 font-medium md:hidden">
                    <a href="javascript:void(0)" className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50">Previous</a>
                    <div className="font-medium">
                        SHOWING 1-10 OF 120
                    </div>
                    <a href="javascript:void(0)" className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50">Next</a>
                </div>
            </div>
        </div>

    )
}

export default UserTable;