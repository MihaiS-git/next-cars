import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { User } from "@/lib/definitions";
import Link from "next/link";

export default function DriverCard({
    driver,
    slug,
}: {
    driver: User;
    slug: string;
}) {
    return (
        <Link href={`/drivers/${slug}`} className="hover:animate-pulse">
            <Card className="bg-zinc-900 text-red-500 border border-red-600 shadow-lg shadow-red-200/50 py-4">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        {driver.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                    <Image
                        src={
                            `${driver.pictureUrl}` ||
                            "/drivers/nc_default_user.png"
                        }
                        alt={`${driver.name}`}
                        width={335}
                        height={190}
                        className="w-full"
                        priority
                    />
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                    <h5 className="font-semibold text-lg underline">Contact</h5>
                    <p>Email: {driver.email}</p>
                    <p>Phone: {driver.phone}</p>
                    <p>Address: {driver.address}</p>
                </CardFooter>
            </Card>
        </Link>
    );
}
