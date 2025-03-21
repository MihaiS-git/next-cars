import { getDriverBySlug } from "@/lib/db/drivers";
import DriverDetails from "@/app/drivers/[driverSlug]/DriverDetails";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ driverSlug: string }>;
}): Promise<Metadata> {
  const { driverSlug } = await params;
  const driver = await getDriverBySlug(driverSlug);

  if (!driver) {
    return {
      title: "Driver not found",
      description: "The requested driver could not be found.",
    };
  }

  return {
    title: `Next Cars - ${driver.name}`,
    description: `View details of the driver ${driver.name} available at Next Cars.`,
    keywords: `Next Cars, ${driver.name}`,
    authors: [{ name: "Next Cars Team" }],
    robots: "index, follow",
  };
}

export default async function DriverSlug({
  params,
  searchParams,
}: {
  params: Promise<{ driverSlug: string }>;
  searchParams: Promise<{ page: string }>;
}) {
  const { driverSlug } = await params;
  const { page } = await searchParams;
  const driver = await getDriverBySlug(driverSlug);

  if (!driver) {
    return (
      <div className="text-center text-red-500">
        <p>Failed to load driver details. Please try again.</p>
      </div>
    );
  }

  return <DriverDetails driver={driver} page={page || "1"}/>;
}
