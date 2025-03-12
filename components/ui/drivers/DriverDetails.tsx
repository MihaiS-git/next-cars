import Image from "next/image";
import { User } from "@/lib/definitions";
import Link from "next/link";

export default function CarDetails({ driver }: { driver: User }) {
    return (
        <div>
            <div>
                <Image
                    src={driver.pictureUrl || "/drivers/nc_default_user.png"}
                    alt={driver!.name || "Driver picture"}
                    width={845}
                    height={475}
                    sizes="(max-width: 1024px) 335px, 845px"
                    quality={80}
                    className="mx-auto mt-8 overflow-hidden"
                    priority
                />
            </div>
            <h1 className="mb-4 mt-4 text-red-600 font-semibold text-2xl lg:font-bold lg:text-3xl text-center">
                <em>{driver!.name}</em>
            </h1>

            <div className="flex flex-col md:flex-row justify-evenly align-top items-center md:items-start text-left gap-4 p-4 lg:p-8">
                <div>
                    <h2 className="text-left font-bold pb-2">Driver details</h2>
                    <p>
                        DOB:{" "}
                        {driver!.dob
                            ? new Date(driver!.dob).getFullYear()
                            : "N/A"}
                    </p>
                    <p>
                        Driving since:{" "}
                        {driver!.drivingSince
                            ? new Date(driver!.drivingSince).getFullYear()
                            : "N/A"}
                    </p>
                </div>
                <div className="flex flex-col text-left">
                    <h2 className="text-left font-bold pb-2">Contact</h2>
                    <p>Email: {driver!.email}</p>
                    <p>Phone: {driver!.phone}</p>
                    <p>Address: {driver!.address}</p>
                </div>
            </div>
            <div className="w-full flex flex-row justify-end p-4">
                <Link href="/drivers">
                    <button
                        type="button"
                        className="bg-red-600 text-zinc-50 px-2 rounded-sm"
                    >
                        Close
                    </button>
                </Link>
            </div>
        </div>
    );
}
