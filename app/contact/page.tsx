"use client";

import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { redirect } from "next/navigation";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/ui/map"), { ssr: false });

export default function ContactPage() {
    const handleClose = () => {
        redirect("/");
    };
    return (
        <div className="flex flex-col">
            <div className="mx-auto">
                <h3 className="my-8 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                    <em>Contact</em>
                </h3>
                <Map />
                <div className="flex flex-col text-center mt-2 text-red-600">
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
                <Button variant="destructive" size="icon" onClick={handleClose}>
                    <X />
                </Button>
            </div>
        </div>
    );
}
