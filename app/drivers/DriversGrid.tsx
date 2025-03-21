import { User } from "@/lib/definitions";
import DriverCard from "@/app/drivers/DriverCard";

export default function DriversGrid({
  initialDrivers,
  currentPage,
}: {
  initialDrivers: User[];
  currentPage: number;
}) {
  return (
    <div className="p-4">
      <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {initialDrivers?.map((driver: User) => (
          <li key={driver._id}>
            <DriverCard
              driver={driver}
              slug={driver._id!.toString()}
              currentPage={currentPage}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
