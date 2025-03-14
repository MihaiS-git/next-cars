"use client";

import { Link } from "lucide-react";
import { Button } from "../button";
import { useState } from "react";

export default function BookingForm({
    formAction,
    formState,
    customerEmail,
    carId,
    driverId,
}: {
    formAction: (payload: FormData) => void;
    formState: { message: string };
    customerEmail: string;
    carId: string;
    driverId: string;
}) {
    const [startDate, setStartDate] = useState(
        (new Date()).toISOString().split("T")[0]
    );
    const [daysNo, setDaysNo] = useState(1);

    return (
        <>
            <form
                action={formAction}
                className="flex flex-col justify-between align-middle pb-4 w-full lg:w-7/12 mt-4"
            >
                <input
                    type="hidden"
                    name="customerEmail"
                    value={customerEmail || ""}
                />
                <input type="hidden" name="carId" value={carId} />
                <input type="hidden" name="driverId" value={driverId} />
                <p className="flex flex-row justify-between m-2">
                    <label
                        htmlFor="startDate"
                        className="w-3/12 xl:w-2/12 my-auto"
                    >
                        Start Date:{" "}
                    </label>
                    <input
                        className="text-zinc-950 w-9/12 p-1 ps-4 rounded-md"
                        id="startDate"
                        type="date"
                        name="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                    />
                </p>
                <p className="flex flex-row justify-between m-2">
                    <label htmlFor="daysNo">Days No.:</label>
                    <input
                        className="text-zinc-950 w-9/12 p-1 ps-4 rounded-md"
                        id="daysNo"
                        type="number"
                        name="daysNo"
                        value={daysNo}
                        onChange={(e) => setDaysNo(+e.target.value)}
                        min={1}
                    />
                </p>

                {formState?.message && (
                    <div
                        id="general-error"
                        className="text-center text-base text-red-600 py-4"
                    >
                        {formState.message.includes(
                            "Please fill in your details first"
                        ) ? (
                            <p>
                                Missing required fields.
                                <Link href="/account" className="underline">
                                    Please fill in your details first.
                                </Link>
                            </p>
                        ) : (
                            <p>{formState.message}</p>
                        )}
                    </div>
                )}
                <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    className="mx-auto w-1/2 md:w-1/3 px-2"
                >
                    Book Now
                </Button>
            </form>
        </>
    );
}
