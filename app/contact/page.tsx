"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { redirect } from "next/navigation";
import Map from "@/components/ui/map";

export default function ContactPage() {
    const handleClose = () => {
        redirect("/");
    };
    return (
        <div className="flex flex-col items-center bg-zinc-900 text-red-600 w-full md:w-10/12 lg:w-8/12 xl:w-6/12 2xl:w-4/12 rounded-lg border border-red-600 mt-4">
            <h3 className="my-8 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                <em>Contact</em>
            </h3>
            <Map />
            <div className="flex flex-col  mt-2 text-red-600">
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
            <div className="w-full flex flex-row justify-end pb-4 pe-4">
                <Button variant="destructive" size="icon" onClick={handleClose}>
                    <X />
                </Button>
            </div>
        </div>
    );
}
