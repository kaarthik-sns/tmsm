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
    <>
    <Header/>
    <main> {children}</main>
    <Footer/>
    </>
  );
}
