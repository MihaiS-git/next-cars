"use client";

import { User } from "@/lib/definitions";
import DriverCard from "@/components/ui/drivers/DriverCard";
import { getAllDriversPaginated } from "@/app/actions/drivers/actions";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "../button";
import { X } from "lucide-react";
import { redirect } from "next/navigation";

export default function DriversGrid({
    initialDrivers,
    totalCount,
}: {
    initialDrivers: User[];
    totalCount: number;
}) {
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, error } = useQuery({
        queryKey: ["drivers", currentPage],
        queryFn: async () => {
            const { drivers } = await getAllDriversPaginated(
                currentPage,
                10
            );
            return drivers;
        },
        initialData: currentPage === 1 ? initialDrivers : undefined,
        placeholderData: (previousData) => previousData, // Maintain previous data while fetching
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    const totalPages = Math.ceil(totalCount / 10);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    const handleClose = () => {
        redirect("/");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-40">
                <p className="text-gray-500">Loading drivers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>Failed to load drivers. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {data?.map((driver: User) => (
                    <li key={driver._id}>
                        <DriverCard driver={driver} slug={driver._id!.toString()} />
                    </li>
                ))}
            </ul>
            {/* Pagination Controls */}
            <Pagination className="pt-8 text-red-600">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={`hover:text-zinc-900 hover:bg-red-600 ${
                                currentPage === 1 ? "hidden disabled" : ""
                            }`}
                        />
                    </PaginationItem>
                    {currentPage > 2 && (
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                className="hover:text-zinc-900 hover:bg-red-600 active:border-red-600 active:rounded-sm"
                                onClick={() => setCurrentPage(1)}
                            >
                                1
                            </PaginationLink>
                        </PaginationItem>
                    )}
                    {currentPage > 3 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}
                    {currentPage > 1 && (
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                className="hover:text-zinc-900 hover:bg-red-600"
                            >
                                {currentPage - 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    <PaginationItem className="">
                        <PaginationLink
                            href="#"
                            className="hover:text-zinc-900 hover:bg-red-600 border border-red-600 rounded-sm"
                        >
                            {currentPage}
                        </PaginationLink>
                    </PaginationItem>

                    {currentPage < totalPages && (
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                className="hover:text-zinc-900 hover:bg-red-600"
                            >
                                {currentPage + 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    {currentPage < totalPages - 2 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    {currentPage < totalPages - 2 && (
                        <PaginationItem className="">
                            <PaginationLink
                                href="#"
                                className="hover:text-zinc-900 hover:bg-red-600 active:border-red-600 active:rounded-sm"
                                onClick={() => setCurrentPage(totalPages)}
                            >
                                {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={`hover:text-zinc-900 hover:bg-red-600 ${
                                currentPage === totalPages
                                    ? "hidden disabled"
                                    : ""
                            }`}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            <div className="flex flex-row justify-end">
                <Button variant="destructive" size="icon" onClick={handleClose}>
                    <X />
                </Button>
            </div>
        </div>
    );
}
