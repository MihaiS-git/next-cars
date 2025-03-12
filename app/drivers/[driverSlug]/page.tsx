import { getDriverBySlug } from "@/app/actions/drivers/actions";
import DriverDetails from "@/components/ui/drivers/DriverDetails";

export default async function DriverSlug({ params }: { params: Promise<{ driverSlug: string }> }) {
    const param = await params;
    const driverSlug = param.driverSlug;
    const driver = await getDriverBySlug(driverSlug);

    if(!driver) {
        return (
            <div className="text-center text-red-500">
                <p>Failed to load driver details. Please try again.</p>
            </div>
        );
    }

    return (
        <DriverDetails driver={driver}/>
    );
}
