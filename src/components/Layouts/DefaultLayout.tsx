"use client";
import React, { useState, ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import classNames from 'classnames';

export default function DefaultLayout({
  children,
  isSignupPage = false, // Default to false if not provided
}: {
  children: React.ReactNode;
  isSignupPage?: boolean; // Optional prop to determine if it's the signup page
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex">
        {/* Conditionally render Sidebar */}
        {!isSignupPage && (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        {/* <!-- ===== Content Area Start ===== --> */}

        <div
          className={classNames('relative flex flex-1 flex-col ', {
            'lg:ml-72.5': !isSignupPage,
            '': isSignupPage,
          })}
        >
          {/* <div className="relative flex flex-1 flex-col lg:ml-72.5"> */}
          {/* Conditionally render Header */}
          {!isSignupPage && (
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
