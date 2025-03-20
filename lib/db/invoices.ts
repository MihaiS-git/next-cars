'use server';

import { ObjectId } from "mongodb";
import { connectDB } from "../mongoDb";
import { IInvoice } from "../definitions";
import { cache } from "react";

export async function getInvoicesByIds(invoiceIds: string[]): Promise<IInvoice[]> {
    const mappedIds = invoiceIds.map((id) => new ObjectId(id));
    try {
        const db = await connectDB();
        const fetchedInvoices = await db.collection('invoices').find({ _id: { $in: mappedIds } }).toArray();
        if (!fetchedInvoices[0]) return [];
        const mappedInvoices = fetchedInvoices.map((invoice) => {
            return {
                _id: invoice._id.toString(),
                customer: invoice.customer.toString(),
                booking: invoice.booking.toString(),
                issueDate: invoice.issueDate.toISOString().split('T')[0],
                dueDate: invoice.dueDate.toISOString().split('T')[0],
                baseAmountDue: invoice.baseAmountDue,
                VAT: invoice.VAT,
                totalAmountDue: invoice.totalAmountDue,
                status: invoice.status,
                paymentMethod: invoice.paymentMethod,
                notes: invoice.notes
            }
        });
        return mappedInvoices;
    } catch (error) {
        throw new Error(`Failed to fetch invoices: ${error}`);
    }
}


export const getInvoicesByUser = cache(async (customerId: string): Promise<IInvoice[] | null> => {
    const db = await connectDB();
    const invoices = await db.collection('invoices').find({ customer: new ObjectId(customerId) }).toArray();
    if (invoices.length === 0) return null;

    const formattedInvoices: IInvoice[] = invoices.map((invoice) => ({
        _id: invoice._id.toString(),
        customer: invoice.customer.toString(),
        booking: invoice.booking.toString(),
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        baseAmountDue: invoice.baseAmountDue,
        VAT: invoice.VAT,
        totalAmountDue: invoice.totalAmountDue,
        status: invoice.status,
        paymentMethod: invoice.paymentMethod,
        notes: invoice.notes,
    }));

    return formattedInvoices;
});

export async function getInvoiceById(invoiceId: string): Promise<IInvoice | null> {
    const db = await connectDB();

    const invoice = await db.collection('invoices').findOne({ _id: new ObjectId(invoiceId) });
    if (!invoice) return null;

    const formattedInvoice: IInvoice = {
        _id: invoice._id.toString(),
        customer: invoice.customer.toString(),
        booking: invoice.booking.toString(),
        issueDate: invoice.issueDate.toISOString().split("T")[0],
        dueDate: invoice.dueDate.toISOString().split("T")[0],
        baseAmountDue: invoice.baseAmountDue,
        VAT: invoice.VAT,
        totalAmountDue: invoice.totalAmountDue,
        status: invoice.status,
        paymentMethod: invoice.paymentMethod,
        notes: invoice.notes,
    };

    return formattedInvoice;
}