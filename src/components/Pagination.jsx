import React from "react";

const Pagination = ({ currentPage, totalPages, changePage, getPaginationNumbers }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-center items-center gap-2 mt-4">
            {/* Prev Button */}
            <button
                type="button"
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
                    ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
            >
                Prev
            </button>

            {/* Page Numbers */}
            {getPaginationNumbers().map((num, index) =>
                num === "..." ? (
                    <span key={index} className="px-2 text-gray-500">...</span>
                ) : (
                    <button
                        type="button"
                        key={index}

                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
                            ${currentPage === num
                                ? 'z-10 bg-indigo-50 border border-indigo-500 text-indigo-600 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50'}`}

                        onClick={() => changePage(num)}
                    >
                        {num}
                    </button>
                )
            )}

            {/* Next Button */}
            <button
                type="button"
                className={`relative inline-flex items-center px-2 py-2 rounded-md border text-sm font-medium
                    ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                disabled={currentPage === totalPages}
                onClick={() => changePage(currentPage + 1)}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
