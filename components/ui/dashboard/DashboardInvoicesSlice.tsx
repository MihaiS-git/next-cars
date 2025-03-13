import { IInvoice } from "@/lib/definitions";
import DashboardInvoicesTable from "./InvoicesTable";

export default function DashboardInvoicesSlice({isLoading, invoices}: {isLoading: boolean; invoices: IInvoice[] | null}) {
    return (
        <div className="bg-zinc-700 text-zinc-50 rounded-md p-4 border border-red-600 xl:col-span-2">
            <h2 className="font-semibold text-base lg:font-bold lg:text-lg">
                Payment & Invoices
            </h2>
            {isLoading ? (
                <div className="text-center h-80 flex items-center justify-center">
                    <p>Loading invoices...</p>
                </div>
            ) : invoices && invoices.length > 0 ? (
                <DashboardInvoicesTable invoicesData={invoices} />
            ) : (
                <div className="text-center h-80 flex items-center justify-center">
                    <p>No invoices found.</p>
                </div>
            )}
        </div>
    );
}
