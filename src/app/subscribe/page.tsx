import { Metadata } from "next";
import Subscribe from "@/components/Frontend/Subscribe";

export const metadata: Metadata = {
    title: "Subscribe - TMSM",
    description: "",
};

export default function Home() {

    return (
        <Subscribe />
    );
}

