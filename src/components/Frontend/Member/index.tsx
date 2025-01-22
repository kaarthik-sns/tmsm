'use client'
import { useState, useEffect } from 'react';
import Fillter from "@/components/Frontend/Fillter";
import { useRouter, useSearchParams } from "next/navigation";

const PaginatedUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const [filters, setFilters] = useState({ lookingfor: '', fromage: '', toage: '', subcaste: '' });
  const router = useRouter();

  const searchParams = useSearchParams();

  const [homefilters, setHomeFilters] = useState({
    lookingfor: searchParams.get("lookingfor") || "",
    fromage: searchParams.get("fromage") || "",
    toage: searchParams.get("toage") || "",
    subcaste: searchParams.get("subcaste") || "",
  });


  useEffect(() => {
    fetchUsers(1, homefilters);
    // router.replace("/frontend/member", undefined);
  }, [homefilters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters); // Update filters when the form changes
  };


  // Fetch users from the API
  const fetchUsers = async (page: number, filters: any) => {
    setIsLoading(true);
    try {

      const query = new URLSearchParams({
        page: String(page),
        lookingfor: filters.lookingfor,
        fromage: filters.fromage,
        toage: filters.toage,
        subcaste: filters.subcaste,
      }).toString();

      const res = await fetch(`/api/member-list?${query}`);
      const data = await res.json();
      console.log("data-----", String(page));
      if (res.ok) {
        setUsers(data.data);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalUsers);
      } else {
        console.error('Error fetching users:', data.message);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };


  // useEffect(() => {

  //   fetchUsers(currentPage, filters);
  // }, [currentPage, filters]);


  // Handle page navigation
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <Fillter onFilterChange={handleFilterChange} />
      <div className="container mx-auto px-6 py-12 member-container">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="title">
            <span>You have found {totalCount}</span> search results
          </h2>

        </div>
        <>
          <div className='grid grid-cols-1 gap-7.5 sm:grid-cols-1 xl:grid-cols-2 '>
            {users.map((user: any) => (
              <div className="rounded-sm px-6 py-5" key={user._id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="">
                    <div className='h-25 w-25 mb-3'>

                      <img src={user.profile_photo ? user.profile_photo : '/uploads/photos/1736513579879-03b4dbf6fad6.jpg'} alt="Profile Picture" className="rounded-full w-full h-full object-cover" />

                    </div>
                    <h4 className="member-title">
                      {user.name}
                    </h4>
                  </div>
                  <div>
                    <a href="#" className="block w-full rounded-md bg-primary text-center text-white transition hover:bg-opacity-90 member-btn">
                      View Details
                    </a>

                  </div>
                </div>
                <div className="rounded-[10px] bg-[#fdf4e7] p-4 mb-5 mt-5 member-info">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm text-black dark:text-white">
                    {/* Left Column */}
                    <div>
                      <p className="flex pb-4">
                        <span className="label w-26 text-black flex-shrink-0">Age:</span>
                        <span className="value">{user.age ? user.age : '-'}</span>
                      </p>
                      <p className="flex pb-4">
                        <span className="label w-26 text-black flex-shrink-0">Religion:</span>
                        <span className="value">{user.mother_religion ? user.mother_religion : '-'}</span>
                      </p>
                      <p className="flex pb-4">
                        <span className="label w-26 text-black flex-shrink-0">Caste:</span>
                        <span className="value">{user.caste ? user.caste : '-'}</span>
                      </p>
                      <p className="flex">
                        <span className="label w-26 text-black flex-shrink-0">SubCaste:</span>
                        <span className="value">{user.subcaste ? user.subcaste : '-'}</span>
                      </p>
                    </div>
                    {/* Right Column */}
                    <div>
                      <p className="flex pb-4">
                        <span className="label text-black w-26 flex-shrink-0">Education:</span>
                        <span className="value">{user.education ? user.education : '-'}</span>
                      </p>
                      <p className="flex pb-4">
                        <span className="label text-black w-26 flex-shrink-0">Profession:</span>
                        <span className="value">{user.job ? user.job : '-'}</span>
                      </p>
                      <p className="flex">
                        <span className="label text-black w-26 flex-shrink-0">Address:</span>
                        <span className="value">
                          {user.address ? user.address : '-'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            ))}

          </div>
          {totalPages > 1 && (
            <div className='rounded-sm dark:bg-boxdark'>
              <div className="p-4 sm:p-6 xl:p-7.5 pagination-div">
                <nav>
                  <ul className="flex items-center justify-center space-x-2">
                    {/* Previous Button */}
                    <li>
                      <a
                        className={`flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white prev-btn ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                          }`}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        aria-label="Previous Page"
                      >
                        <svg
                          className="fill-white"
                          width="8"
                          height="16"
                          viewBox="0 0 8 16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M7.17578 15.1156C7.00703 15.1156 6.83828 15.0593 6.72578 14.9187L0.369531 8.44995C0.116406 8.19683 0.116406 7.80308 0.369531 7.54995L6.72578 1.0812C6.97891 0.828076 7.37266 0.828076 7.62578 1.0812C7.87891 1.33433 7.87891 1.72808 7.62578 1.9812L1.71953 7.99995L7.65391 14.0187C7.90703 14.2718 7.90703 14.6656 7.65391 14.9187C7.48516 15.0312 7.34453 15.1156 7.17578 15.1156Z" />
                        </svg>
                      </a>
                    </li>

                    {/* Page Numbers */}
                    <li className="text-white p-2 page-number">
                      <div className="flex items-center justify-center space-x-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                          <a
                            key={index}
                            className={`flex items-center justify-center rounded-full text-white mr-5 ml-5 ${currentPage === index + 1 ? 'bg-yellow text-black active-page-number' : ''
                              }`}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(index + 1);
                            }}
                          >
                            {index + 1}
                          </a>
                        ))}
                      </div>
                    </li>

                    {/* Next Button */}
                    <li>
                      <a
                        className={`flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white next-btn ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                          }`}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        aria-label="Next Page"
                      >
                        <svg
                          className="fill-white"
                          width="8"
                          height="16"
                          viewBox="0 0 8 16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M0.819531 15.1156C0.650781 15.1156 0.510156 15.0593 0.369531 14.9468C0.116406 14.6937 0.116406 14.3 0.369531 14.0468L6.27578 7.99995L0.369531 1.9812C0.116406 1.72808 0.116406 1.33433 0.369531 1.0812C0.622656 0.828076 1.01641 0.828076 1.26953 1.0812L7.62578 7.54995C7.87891 7.80308 7.87891 8.19683 7.62578 8.44995L1.26953 14.9187C1.15703 15.0312 0.988281 15.1156 0.819531 15.1156Z" />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </nav>

              </div>
            </div>
          )}
        </>

        {/* <h1>Paginated Users</h1> */}

      </div>
    </>
  );
};

export default PaginatedUsers;
