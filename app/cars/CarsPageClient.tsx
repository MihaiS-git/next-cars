"use client";

import CarsGrid from "@/components/ui/cars/CarsGrid";
import CloseButton from "@/components/ui/CloseButton";
import PaginationControls from "@/components/ui/navigation/PaginationControls";
import { ICar } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function CarsPageClient({
    cars,
    totalCount,
    pageNo,
    filters,
}: {
    cars: ICar[];
    totalCount: number;
    pageNo: number;
    filters: { category: string; transmission: string };
}) {
    const router = useRouter();

    const handleFiltersChange = (filterName: string, value: string) => {
        const params = new URLSearchParams(window.location.search);
        params.set(filterName, value);
        params.set("page", "1");
        router.push(`/cars?${params.toString()}`);
    };

    return (
        <Suspense
            fallback={
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600 m-8 mx-auto mt-48 mb-8"></div>
                    <div className="text-zinc-400 mb-48">
                        Loading cars list...
                    </div>
                </div>
            }
        >
            <h1 className="mb-4 mt-8 text-zinc-200 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                <em>Cars List</em>
            </h1>
            {cars.length === 0 ? (
                <h1>No cars found</h1>
            ) : (
                <>
                    <form
                        action="get"
                        className="flex flex-row justify-start ps-4 gap-2"
                    >
                        <div>
                            <label htmlFor="category">Category: </label>
                            <select
                                className="mx-2 text-zinc-950"
                                name="category"
                                id="category"
                                defaultValue={filters.category || "All"}
                                onChange={(e) =>
                                    handleFiltersChange(
                                        "category",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="All">All</option>
                                <option value="Classic">Classic</option>
                                <option value="Sport">Sport</option>
                                <option value="Sedan">Sedan</option>
                                <option value="SUV">SUV</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="transmission">Transmission: </label>
                            <select
                                className="mx-2 text-zinc-950"
                                name="transmission"
                                id="transmission"
                                defaultValue={filters.transmission || "All"}
                                onChange={(e) =>
                                    handleFiltersChange(
                                        "transmission",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="All">All</option>
                                <option value="Automatic">Automatic</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                    </form>
                    <CarsGrid
                        initialCars={cars}
                        page={pageNo}
                        filters={filters}
                    />
                </>
            )}
            <PaginationControls
                searchParams={{
                    currentPage: pageNo,
                    totalPages: Math.ceil(totalCount / 10),
                    filters: filters,
                }}
            />
            <div className="flex flex-row justify-end w-full pe-4 pb-4">
                <CloseButton target="/" />
            </div>
        </Suspense>
    );
}
