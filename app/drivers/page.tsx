import CloseButton from "@/components/ui/CloseButton";
import DriversGrid from "@/app/drivers/DriversGrid";
import PaginationControls from "@/components/ui/navigation/PaginationControls";
import { getAllDriversPaginated } from "@/lib/db/drivers";
import { User } from "@/lib/definitions";
import { Metadata } from "next";
import { Suspense } from "react";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await searchParams;
  const pageNo = parseInt(page || "1", 10);
  const result = await getAllDriversPaginated(pageNo, 10);
  if (!result) return { keywords: "" };
  const { drivers } = result;

  const keywords = drivers.map((driver: User) => `${driver.name}`).join(", ");

  return { keywords };
}

export default async function DriversPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const { page } = await searchParams;
  const pageNo = parseInt(page || "1", 10);
  const result = await getAllDriversPaginated(pageNo, 10);
  if (!result) return null;
  const { drivers, totalCount } = result;

  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600 m-8 mx-auto mt-48 mb-8"></div>
          <div className="text-zinc-400 mb-48">Loading drivers list...</div>
        </div>
      }
    >
      <h1 className="mb-4 mt-8 text-zinc-200 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
        <em>Drivers List</em>
      </h1>
      <DriversGrid initialDrivers={drivers} currentPage={pageNo} />
      <PaginationControls searchParams={{ currentPage: pageNo, totalPages: Math.ceil(totalCount / 10)}} />
      <div className="flex flex-row justify-end w-full pe-4 pb-4">
        <CloseButton target="/" />
      </div>
    </Suspense>
  );
}
