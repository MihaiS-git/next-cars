import DriversGrid from "@/components/ui/drivers/DriversGrid";
import { getAllDriversPaginated } from "@/app/actions/drivers/actions";

export default async function DriversPage() {
    const { drivers, totalCount } = await getAllDriversPaginated(1, 10);

    return (
        <>
            <h1 className="mb-4 mt-8 text-red-600 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                <em>Drivers List</em>
            </h1>
            <DriversGrid initialDrivers={drivers} totalCount={totalCount} />
        </>
    );
}
