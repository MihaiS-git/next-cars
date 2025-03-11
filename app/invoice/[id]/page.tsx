"use client";

import { getBookingById } from "@/app/actions/booking/actions";
import { getInvoiceById } from "@/app/actions/invoice/actions";
import { Button } from "@/components/ui/button";
import { IBooking, ICar, IInvoice, User } from "@/lib/definitions";
import { getUserById } from "@/lib/queries/users-queries";
import { formatCurrency } from "@/lib/util/format-currency";
import { use, useEffect, useState } from "react";

export default function InvoicePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const [invoice, setInvoice] = useState<IInvoice | null>(null);
    const [customer, setCustomer] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [car, setCar] = useState<ICar | null>(null);
    const [driver, setDriver] = useState<User | null>(null);
    const [booking, setBooking] = useState<IBooking | null>(null);

    const { id } = use(params);

    useEffect(() => {
        if (!id) return;
        async function fetchInvoiceData() {
            const invoiceData = await getInvoiceById(id as string);
            if (!invoiceData) return;
            setInvoice(invoiceData);

            const customerData = await getUserById(
                invoiceData!.customer!.toString()
            );
            if (!customerData) return;

            const bookingData = await getBookingById(
                invoiceData.booking!.toString()
            );
            if (!bookingData) return;

            setBooking({
                ...bookingData,
                timeInterval: {
                    start: new Date(bookingData.timeInterval.start),
                    end: new Date(bookingData.timeInterval.end),
                },
            });
            setCustomer(customerData);
            setCar(bookingData.car);
            setDriver(bookingData.driver);

            setLoading(false);
        }
        fetchInvoiceData();
    }, [params]);

    if (loading) {
        return <p>Loading...</p>;
    }

    const printInvoice = () => {
        const printContents = document.getElementById("invoice")!.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;

        window.print();

        document.body.innerHTML = originalContents;
    };

    return (
        <div className="bg-zinc-800 w-full md:w-8/12 rounded-lg border border-red-600 mt-4 mx-auto">
            <div
                className="border border-black w-full text-black p-8 lg:p-24"
                id="invoice"
                style={{ backgroundColor: "white" }}
            >
                <h1 className="text-center text-xl font-bold">
                    Next Cars Invoice
                </h1>
                <hr className="mt-2 mb-2 border-zinc-400" />
                <div className="grid grid-cols-4 gap-2">
                    <p className="text-left col-span-2 overflow-hidden">
                        <strong>Invoice No:</strong>
                        <br />
                        {invoice!._id?.toString()}
                    </p>
                    <p className="overflow-hidden">
                        <strong>Issue Date:</strong>
                        <br />
                        {invoice!.issueDate as string}
                    </p>
                    <p className="overflow-hidden">
                        <strong>Due Date:</strong>
                        <br />
                        {invoice!.dueDate as string}
                    </p>
                </div>
                <hr className="my-2 border-zinc-400" />
                <div className="grid grid-cols-2">
                    <div>
                        <p className="overflow-hidden">
                            <strong>Company name: </strong> Next Cars
                        </p>
                        <p className="overflow-hidden">
                            <strong>Address: </strong> 1234 Main St, City,
                            Country
                        </p>
                        <p className="overflow-hidden">
                            <strong>Phone: </strong> 123-456-7890
                        </p>
                        <p className="overflow-hidden">
                            <strong>Email: </strong> office@nc.com
                        </p>
                        <p className="overflow-hidden">
                            <strong>Bank Account: </strong> 1234567890
                        </p>
                    </div>
                    <div>
                        <p className="overflow-hidden">
                            <strong>Customer:</strong> {customer?.name}
                        </p>
                        <p className="overflow-hidden">
                            <strong>Address:</strong> {customer?.address}
                        </p>
                        <p className="overflow-hidden">
                            <strong>Phone:</strong> {customer?.phone}
                        </p>
                        <p className="overflow-hidden">
                            <strong>Email:</strong> {customer?.email}
                        </p>
                        <p className="overflow-hidden">
                            <strong>Payment Method:</strong>{" "}
                            {invoice?.paymentMethod}
                        </p>
                    </div>
                </div>
                <hr className="my-2 border-zinc-400" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="w-full">
                        <strong>Services: </strong>
                        <br />
                        <p className="ps-4 overflow-hidden">Car rented with driver</p>
                        <strong>Booking ID:</strong> <br />
                        <p className="ps-4 overflow-hidden">{invoice?.booking!.toString()}</p>
                    </div>
                    <div className="w-full">
                        <strong>Invoice Details: </strong>
                        <div className="ps-4 overflow-hidden">
                            <p className="overflow-hidden">
                                Car: {car?.make} {car?.carModel} ({car?.year})
                            </p>
                            <p className="overflow-hidden">Mileage: {car?.mileage} km</p>
                            <p className="overflow-hidden">Driver: {driver?.name}</p>
                            <p className="overflow-hidden">
                                Starting date:{" "}
                                {booking
                                    ?.timeInterval!.start.toISOString()
                                    .split("T")[0] || "N/A"}
                            </p>
                            <p className="overflow-hidden">
                                Ending date:{" "}
                                {booking
                                    ?.timeInterval!.end.toISOString()
                                    .split("T")[0] || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-0 mt-2">
                    <p className="border border-zinc-400 p-2 text-left overflow-hidden">
                        <strong>Base Amount:</strong>{" "}
                        {formatCurrency(invoice?.baseAmountDue!)}
                    </p>
                    <p className="border border-zinc-400 p-2 text-center overflow-hidden">
                        <strong>VAT:</strong> {formatCurrency(invoice?.VAT!)}
                    </p>
                    <p className="border border-zinc-400 p-2 text-center overflow-hidden">
                        <strong>Total Amount:</strong>{" "}
                        {formatCurrency(invoice?.totalAmountDue!)}
                    </p>
                </div>
                <p className="text-center text-sm mt-64 overflow-hidden">
                    Thank you for renting from Next Cars!
                </p>
            </div>
            <div className="flex justify-center my-8">
                <Button
                    onClick={printInvoice}
                    className="bg-zinc-400 text-zinc-800 hover:bg-zinc-600 hover:text-zinc-400"
                >
                    Print Invoice
                </Button>
            </div>
        </div>
    );
}
