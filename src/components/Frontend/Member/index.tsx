'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import SelectAge from "@/components/Frontend/HomeFilter/SelectGroup/SelectAge";
import SelectBrideGroom from "@/components/Frontend/HomeFilter/SelectGroup/SelectBrideGroom";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const PaginatedUsers = () => {

  type RequestData = {
    receiver_id: string;
    [key: string]: any;
  };

  const [users, setUsers] = useState([]);
  const [reqData, setReqData] = useState<Record<string, RequestData>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [homeFilterPage, setHomeFilterPage] = useState(false);

  const [filters, setFilters] = useState({
    lookingfor: searchParams.get("lookingfor") || "",
    fromage: searchParams.get("fromage") || "",
    toage: searchParams.get("toage") || "",
    subcaste: searchParams.get("subcaste") || "",
    homefilter: searchParams.get("homefilter") || "",
  });


  useEffect(() => {
    if (filters.homefilter != '' && !homeFilterPage) {
      fetchUsers(1, filters);
      setHomeFilterPage(true);
    }

  }, [homeFilterPage]);

  // fetch data on paginate
  useEffect(() => {
    fetchUsers(currentPage, filters);
  }, [currentPage]);


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


      if (res.ok) {

        const req_data = data.req_data;

        if (session && !session.user.is_admin) {

          const indexedByReceiverId: Record<string, RequestData> = req_data.reduce((acc, item) => {
            acc[item.receiver_id] = item;
            return acc;
          }, {});

          setReqData(indexedByReceiverId);

        }

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

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleAgeChange = (e) => {
    setFilters({ ...filters, fromage: e.target.value });
  };
  const handleAgeChangesto = (e) => {
    setFilters({ ...filters, toage: e.target.value });
  };
  const handleBrideGroomChange = (e) => {
    setFilters({ ...filters, lookingfor: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.replace('/frontend/member', undefined);
    fetchUsers(1, filters);
  };

  const handleViewDetails = (e) => {
    alert('view');
  };


  const handleRequestClick = async (id) => {

    const userId = session.user.id;

    try {
      const formBody = new URLSearchParams({
        sender_id: userId,
        receiver_id: id,
      });

      const res = await fetch("/api/requests/send-profile-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (!res.ok) {
        throw new Error("Failed to send request");
      }

      const data = await res.json();
      fetchUsers(currentPage, filters);

      toast.success('Request sent successfully!', {
        className: "sonner-toast-success",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });


    } catch (err: any) {
      toast.error('Failed to send request', {
        className: "sonner-toast-error",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });
    }


  };

  return (
    <>

      <div className="dark-bg">
        <div className="container mx-auto flex items-center justify-center p-10">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap items-center gap-9 p-6.5 member-search-form">
              <div className="w-full md:w-auto">
                <label className="mb-3 block text-sm font-medium text-white">
                  Looking For
                </label>
                <SelectBrideGroom
                  name="lookingfor"
                  selectedBrideGroom={filters.lookingfor}
                  onBrideGroomChange={handleBrideGroomChange}
                />
              </div>

              <div className="w-full md:w-auto">
                <label className="mb-3 block text-sm font-medium text-white">
                  Age
                </label>
                <SelectAge
                  name="fromage"
                  selectedAge={filters.fromage}
                  onAgeChange={handleAgeChange}
                />
              </div>
              <div className="hidden w-full md:w-auto md:mt-4 md:block">
                <label className="mb-3 block text-sm font-medium text-white">
                  To
                </label>
              </div>
              <div className="w-full md:w-auto">
                <label className="mb-3 block text-sm font-medium text-white visibility">
                  To
                </label>
                <SelectAge
                  name="toage"
                  selectedAge={filters.toage}
                  onAgeChange={handleAgeChangesto}
                />
              </div>

              <div className="w-full md:w-auto relative">
                <label className="mb-3 block text-sm font-medium text-white">SubCaste</label>
                <div className="mb-4.5">
                  <input
                    type="text"
                    name="subcaste"
                    value={filters.subcaste}
                    onChange={handleInputChange}
                    className="relative z-20 md:w-64 w-full appearance-none rounded border border-stroke bg-white px-5 py-3 outline-none transition dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>


              <div className="w-full md:w-auto flex justify-between gap-4 mt-5 md:mt-5">
                <button
                  className="inline-block px-10 py-4 text-white duration-150 rounded-full  md:text-sm ftext-custom"
                  type="submit"
                >
                  Search
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

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

                      <img src={user.profile_photo ? user.profile_photo : '/uploads/photos/1735885953505-c97500831022.webp'} alt="Profile Picture" className="rounded-full w-full h-full object-cover" />

                    </div>
                    <h4 className="member-title">
                      {user.name}
                    </h4>
                  </div>
                  <div>

                    {
                      reqData[user._id] ? (
                        reqData[user._id].status == "accepted" ? (
                          // If status is "accepted", show "View Details" button
                          <button
                            key={user._id}
                            onClick={() => handleViewDetails(user._id)} // Define handleViewDetails function
                            className="inline-block px-10 py-4 text-white duration-150 rounded-full  md:text-sm ftext-custom"
                          >
                            View Details
                          </button>
                        ) : reqData[user._id].status === "rejected" ? (
                          // If status is "rejected", show "Rejected" disabled button
                          <button
                            key={user._id}
                            className="inline-block px-10 py-4 text-white duration-150 rounded-full  md:text-sm ftext-custom cursor-not-allowed"
                            disabled
                          >
                            Rejected
                          </button>
                        ) : (
                          // If user._id exists but status is not "accepted", show "Request Sent" button
                          <button
                            key={user._id}
                            className="inline-block px-10 py-4 text-white duration-150 rounded-full  md:text-sm ftext-custom cursor-not-allowed"
                            disabled
                          >
                            Request Sent
                          </button>
                        )
                      ) : (
                        // Else, show "Send Request" button
                        <button
                          key={user._id}
                          onClick={() => handleRequestClick(user._id)} // Define handleRequestClick function
                          className="inline-block px-10 py-4 text-white duration-150 rounded-full  md:text-sm ftext-custom"
                        >
                          Send Request
                        </button>
                      )
                    }

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
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-white prev-btn ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''
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
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-white next-btn ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
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
