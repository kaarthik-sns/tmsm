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

 
  return (
    <>
      <Head>
        <title>About - TMSM</title>
        <meta name="description" content="This is the about page for TMSM" />
      </Head>

      <FrontendLayouts>
        <InnerBanner />
        <Member/>
      </FrontendLayouts>
    </>
  );
}
