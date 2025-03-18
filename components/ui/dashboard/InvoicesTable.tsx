import { IInvoice } from "@/lib/definitions";
import { Button } from "../button";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/util/format-currency";

interface DashboardInvoicesTableProps {
    invoicesData: IInvoice[];
}

export default function DashboardInvoicesTable({
    invoicesData,
}: DashboardInvoicesTableProps) {
    const router = useRouter();

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full mt-4 table-fixed">
                <thead>
                    <tr className="bg-zinc-800 text-zinc-50">
                        <th className="table-header border border-red-600 overflow-hidden">
                            Invoice No.
                        </th>
                        <th className="table-header border border-red-600 overflow-hidden">
                            Date
                        </th>
                        <th className="table-header border border-red-600 overflow-hidden">
                            Due Date
                        </th>
                        <th className="table-header border border-red-600 overflow-hidden">
                            Status
                        </th>
                        <th className="table-header border border-red-600 overflow-hidden">
                            Total Amount
                        </th>
                        <th className="table-header border border-red-600 overflow-hidden py-2">
                            Operations
                        </th>
                    </tr>
                </thead>
                {invoicesData && invoicesData.length > 0 ? (
                    <tbody>
                        {invoicesData.map(
                            (invoice: IInvoice, index: number) => (
                                <tr key={index}>
                                    <td className="border border-zinc-600 ps-2 overflow-hidden text-center">
                                        {index + 1}
                                    </td>
                                    <td className="text-center border border-zinc-600 overflow-hidden">
                                        {typeof invoice.issueDate === "string"
                                            ? invoice.issueDate
                                            : invoice.issueDate
                                                  .toISOString()
                                                  .split("T")[0]}
                                    </td>
                                    <td className="text-center border border-zinc-600 overflow-hidden">
                                        {typeof invoice.dueDate === "string"
                                            ? invoice.dueDate
                                            : invoice.dueDate
                                                  .toISOString()
                                                  .split("T")[0]}
                                    </td>
                                    <td className="text-center border border-zinc-600 overflow-hidden">
                                        {invoice.status}
                                    </td>
                                    <td className="text-center border border-zinc-600 overflow-hidden">
                                        {formatCurrency(invoice.totalAmountDue)}
                                    </td>
                                    <td className="text-center border border-zinc-600 overflow-auto flex flex-col lg:flex-row justify-center text-sm gap-1">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="text-sm"
                                            onClick={() =>
                                                router.push(
                                                    `/invoice/${invoice._id}`
                                                )
                                            }
                                        >
                                            View
                                        </Button>
                                        {invoice.status === "Unpaid" && (
                                            <form
                                                action="/api/checkout_sessions"
                                                method="POST"
                                            >
                                                <input
                                                    type="hidden"
                                                    name="totalAmountDue"
                                                    value={
                                                        invoice.totalAmountDue
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name="invoiceId"
                                                    value={invoice._id!.toString()}
                                                />
                                                <section>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="text-sm"
                                                        type="submit"
                                                        role="link"
                                                    >
                                                        Checkout
                                                    </Button>
                                                </section>
                                            </form>
                                        )}
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                ) : (
                    <p>No invoices found.</p>
                )}
            </table>
        </div>
    );
}
