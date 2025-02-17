'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import SelectAge from "@/components/Frontend/HomeFilter/SelectGroup/SelectAge";
import SelectBrideGroom from "@/components/Frontend/HomeFilter/SelectGroup/SelectBrideGroom";
import { useSession } from "next-auth/react";
import Swal from 'sweetalert2'; // Import SweetAlert2
import Loader from "@/components/common/Loader";

const PaginatedUsers = () => {

  type RequestData = {
    receiver_id: string;
    [key: string]: any;
  };

  const [users, setUsers] = useState([]);
  const [reqSentData, setReqSentData] = useState<Record<string, RequestData>>({});
  const [reqRecData, setReqRecData] = useState<Record<string, RequestData>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [homeFilterPage, setHomeFilterPage] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  // Example data array of subcastes
  const subcastes = [
    "Karaikkal Mudaliyar",
    "Chidambaram Mudaliyar",
    "Nadar Mudaliyar",
    "Maravapalayam Mudaliyar",
    "Sengunthar Mudaliyar",
    "Pillai Mudaliyar",
    "Vanniyar Mudaliyar",
    "Tirunelveli Mudaliyar",
    "Muthuraja Mudaliyar",
    "Thuluva Vellalar Mudaliyar",
    "Sri Lankan Mudaliyar",
    "Vellalar Mudaliyar",
    "Kallar Mudaliyar",
    "Agamudayar Mudaliyar",
    "Pallai Mudaliyar",
    "Vanniyan Mudaliyar",
    "Muthuraja",
    "Muthurayar",
    "Sivakami Mudaliyar",
    "Kongu Mudaliyar",
    "Vadugan Mudaliyar",
    "Yadavar Mudaliyar",
    "Kaikolar Mudaliyar",
    "Vellalar"
  ];
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

      let query = '';

      if (filters) {
        query = new URLSearchParams({
          page: String(page),
          lookingfor: filters.lookingfor,
          fromage: filters.fromage,
          toage: filters.toage,
          subcaste: filters.subcaste,
        }).toString();
      }

      const res = await fetch(`/api/member-list?${query}`);
      const data = await res.json();


      if (res.ok) {


        const req_sent_data = data.req_sent_data;
        const req_rec_data = data.req_rec_data;

        const indexedByReceiverId: Record<string, RequestData> = req_sent_data.reduce((acc, item) => {
          acc[item.receiver_id] = item;
          return acc;
        }, {});

        setReqSentData(indexedByReceiverId);

        const indexedBySenderId: Record<string, RequestData> = req_rec_data.reduce((acc, item) => {
          acc[item.sender_id] = item;
          return acc;
        }, {});

        setReqRecData(indexedBySenderId);

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


  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setFilters({ ...filters, subcaste: suggestion });
    setFilteredSuggestions([]); // Clear suggestions after selection
  };

  // Handle page navigation
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({
        behavior: 'smooth',
      });
    }
  };

  // Handle input change and filter suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters({ ...filters, subcaste: value });

    if (value.length > 0) {
      // Filter the suggestions based on the user's input
      const filtered = subcastes.filter((subcaste) =>
        subcaste.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]); // Clear suggestions if input is empty
    }
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
    router.replace('/member', undefined);
    fetchUsers(1, filters);
  };

  const handleViewDetails = (id: string) => {
    if (id) {
      router.push(`/view-profile?id=${id}`); // Call the server-side redirect handler
    }
  };

  const handleReset = () => {
    setFilters({
      lookingfor: "",
      fromage: "",
      toage: "",
      subcaste: "",
      homefilter: "",
    });

    fetchUsers(1, null);

  };


  const handleRequestClick = async (id) => {

    // Check if user is logged in
    if (!session) {
      router.push(`/login`);
      return;
    }

    if (session.user.is_admin) {
      router.push(`/login`);
      return;
    }
    // Show confirmation popup using SweetAlert2
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to send a request to view this person\'s profile?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Request Access',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'confirm-color',  // Custom class for confirm button (green)
        cancelButton: 'cancel-color'       // Custom class for cancel button (red)
      },
    });

    // If the user clicks "Yes", proceed with the request
    if (result.isConfirmed) {
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

        // Close the current modal before showing the success message
        Swal.close();

        // Show success message
        Swal.fire({
          title: 'Success!',
          text: 'Request sent. Once approved, you wll be notified via email. You can cancel your request at anytime.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'confirm-color',  // Custom class for confirm button (green)
          },
        });

      } catch (err) {
        // Close the current modal before showing the error message
        Swal.close();

        // Show error message
        Swal.fire({
          title: 'Error!',
          text: 'Failed to send request. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } else {
      // If user clicks "No", close SweetAlert
      console.log('Request was not sent.');
    }
  };


  if (isLoading) {
    return <Loader />
  }

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
                  {filteredSuggestions.length > 0 && filters.subcaste.length > 0 && (
                    <ul className="absolute w-full bg-white border shadow-md z-30 max-h-60 overflow-y-auto">
                      {filteredSuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>


              <div className="w-full md:w-auto flex justify-between gap-4 mt-5 md:mt-5">
                <button
                  className="inline-block px-10 py-4 text-white duration-150 rounded-full  md:text-sm ftext-custom"
                  type="submit"
                >
                  Search
                </button>
                <button
                  className="inline-block px-10 py-4 text-white duration-150 rounded-full  md:text-sm ftext-custom"
                  type="button"
                  onClick={handleReset} // Add onClick event

                > Reset
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 member-container">

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="title"><span>You have found {totalCount} </span> search results</h2>
          <span className="text-lg font-semibold sm:ml-auto text-sm welcome">Welcome, {session?.user?.name || 'Guest'}
          </span>
        </div>

        <>
          <div className='grid grid-cols-1 gap-7.5 sm:grid-cols-1 xl:grid-cols-2 '>
            {users.map((user: any) => (
              <div className="rounded-sm px-6 py-5" key={user._id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 py-2 bg-member">
                  <div className="">
                    <div className='h-25 w-25 mb-3'>
                      <img src={user.profile_photo ? user.profile_photo : '/images/user/dummy.png'} alt="Profile Picture" className="rounded-full w-full h-full object-cover" />
                    </div>
                    <h4 className="member-title">
                      {user.name}
                    </h4>
                  </div>
                  <div>

                    {
                      reqSentData?.[user._id] || reqRecData?.[user._id] ? (
                        reqSentData?.[user._id]?.status === "accepted" || reqRecData?.[user._id]?.status === "accepted" ? (
                          // If status is "accepted", show "View Details" button
                          <button
                            key={user._id}
                            onClick={() => handleViewDetails(user._id)} // Define handleViewDetails function
                            className="inline-block px-10 py-4 text-white duration-150 rounded-full  md:text-sm ftext-custom"
                          >
                            View Details
                          </button>
                        ) : reqSentData?.[user._id]?.status === "rejected" || reqRecData?.[user._id]?.status === "rejected" ? (
                          // If status is "rejected", show "Rejected" disabled button
                          <button
                            key={user._id}
                            className="inline-block px-10 py-4 text-white duration-150 rounded-full  md:text-sm ftext-custom-rej cursor-not-allowed"
                            disabled
                          >
                            Rejected
                          </button>
                        ) : (

                          // If user._id exists but status is not "accepted", show "Request Sent" buttonclass="bg-green-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-green-600 mb-6"
                          <button
                            key={user._id}
                            className="inline-block px-10 py-4 text-white duration-150 rounded-full md:text-sm bg-green-500 cursor-not-allowed"
                            disabled
                          >
                            {reqSentData?.[user._id]
                              ? 'Request Sent' // If user sent request
                              : 'Request Received' // If user received request

                            }
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
                <div className="rounded-member bg-[#fdf4e7] p-4 mb-5  member-info">
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
