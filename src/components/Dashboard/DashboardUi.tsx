"use client";

import React, { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState('');
  const [waitingForApproval, setWaitingForApproval] = useState('');
  const [activeUsers, setActiveUsers] = useState('');

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await fetch('/api/count', {
          method: 'POST',
        });
        const data = await response.json();

        setTotalUsers(data.totalUsers);
        setWaitingForApproval(data.waitingForApproval);
        setActiveUsers(data.activeUsers);
      } catch (error) {
        console.error('Error fetching user counts:', error);
      }
    };

    fetchUserCounts();
  }, []);

  return (
    <>
      <section className="bg-gray-100 p-6">

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div>
              <FaUsers className="text-green-500 text-2xl" />
            </div>
            <h3 className="text-gray-600 mt-2">Active Users</h3>
            <p className="mb-4 text-title-lg font-bold text-black dark:text-white">{activeUsers}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div>
              <FaUsers className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-gray-600 mt-2">Waiting Approval</h3>
            <p className="mb-4 text-title-lg font-bold text-black dark:text-white">{waitingForApproval}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div>
              <FaUsers className="text-gray-500 text-2xl" />
            </div>
            <h3 className="text-gray-600 mt-2">Total Users</h3>
            <p className="mb-4 text-title-lg font-bold text-black dark:text-white">{totalUsers}</p>
          </div>

        </div>
      </section>
    </>
  );
};

export default Dashboard;
