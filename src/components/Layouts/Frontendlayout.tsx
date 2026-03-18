"use client";
import React, { useState, ReactNode } from "react";
import Header from "@/components/Frontend/Header";
import Footer from "@/components/Frontend/Footer";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <main className="flex-grow"> {children}</main>
      <Footer/>
    </div>
  );
}
