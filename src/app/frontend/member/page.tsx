'use client';  

import { useState } from 'react';
import Head from 'next/head'; 
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Member from "@/components/Frontend/Member";
import Fillter from "@/components/Frontend/Fillter";
import InnerBanner from '@/components/Frontend/InnerPageBanner/member-innerbanner';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/css/member.css';

export default function Home() {
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({ lookingfor: '', fromage: '', toage: '', caste: '', subcaste: '' });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters); // Update filters when the form changes
  };

  return (
    <>
      <Head>
        <title>About - TMSM</title>
        <meta name="description" content="This is the about page for TMSM" />
      </Head>

      <FrontendLayouts>
        <InnerBanner />
        <Fillter onFilterChange={handleFilterChange} />
        <Member filters={filters} />
      </FrontendLayouts>
    </>
  );
}
