import DriversGrid from "@/components/ui/drivers/DriversGrid";
import { getAllDriversPaginated } from "@/app/actions/drivers/actions";

export default async function DriversPage({ searchParams }: { searchParams: { page?: string } }) {
    const params = await searchParams;
    const currentPage = parseInt(params.page || "1", 10);
    const { drivers, totalCount } = await getAllDriversPaginated(currentPage, 10);

    return (
        <>
            <h1 className="mb-4 mt-8 text-zinc-200 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                <em>Drivers List</em>
            </h1>
            <DriversGrid initialDrivers={drivers} totalCount={totalCount} currentPage={currentPage} />
        </>
    );
}
