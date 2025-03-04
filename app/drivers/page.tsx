import DriversGrid from "@/components/ui/drivers/DriversGrid";
import { getAllDriversPaginated } from "@/app/actions/drivers/actions";

export default async function DriversPage() {
    const { drivers, totalCount } = await getAllDriversPaginated(1, 10);

    return (
        <div className="flex flex-col bg-zinc-800 text-zinc-50 w-full md:w-11/12 rounded-lg border border-red-600 mt-4">
            <h1 className="mb-4 mt-8 text-red-600 font-semibold text-2xl lg:font-bold lg:text-3xl text-center">
                <em>Drivers List</em>
            </h1>
            <DriversGrid initialDrivers={drivers} totalCount={totalCount} />
        </div>
    );
}
