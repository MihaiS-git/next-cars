"use client";

import "leaflet/dist/leaflet.css";
import Link from "next/link";

import dynamic from "next/dynamic";
import CloseButton from "@/components/ui/CloseButton";

const Map = dynamic(() => import("@/components/ui/map"), { ssr: false });

export default function ContactPage() {
    return (
        <div className="flex flex-col">
            <div className="mx-auto">
                <h1 className="my-8 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                    <em>Contact</em>
                </h1>
                <Map />
                <div className="flex flex-col text-center mt-2">
                    <p className="text-base pt-4">
                        <strong>Address: </strong>CJ, RO
                    </p>
                    <p className="text-base">
                        <strong>Phone: </strong>1234567890
                    </p>
                    <p className="text-base">
                        <strong>Email: </strong>nextcar@example.com
                    </p>
                </div>
            </div>
            <div className="w-full flex flex-row justify-end pb-4 pe-4">
                <CloseButton target="/" />
            </div>
        </div>
    );
}
