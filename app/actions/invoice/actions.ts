"use server";

import { connectDB } from "@/lib/mongoDb";
import { IInvoice } from "@/lib/definitions";
import { ObjectId } from "mongodb";

export async function createInvoice(customerId: string, bookingId: string, totalAmount: number) {
  const invoice = {
    customer: customerId,
    booking: bookingId,
    issueDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    baseAmountDue: totalAmount * 0.81,
    VAT: totalAmount * 0.19,
    totalAmountDue: totalAmount,
    status: "Unpaid",
    paymentMethod: 'Bank Transfer',
    notes: 'Please pay within 30 days.'
  };

  const db = await connectDB();
  const savedInvoice = await db.collection("invoices").insertOne(invoice);

  if (!savedInvoice.acknowledged) {
    throw new Error("Failed to create invoice.");
  }

  return savedInvoice.insertedId;
}


export async function getInvoicesByUser(customerId: string): Promise<IInvoice[] | []> {
  const db = await connectDB();

  const invoices = await db.collection('invoices').find({ customer: customerId }).toArray();
  if (invoices.length === 0) return [];

  const formattedInvoices = invoices.map((invoice) => {
    return {
      _id: invoice._id.toString(),
      customer: invoice.customer.toString(),
      booking: invoice.booking.toString(),
      issueDate: new Date(invoice.issueDate),
      dueDate: new Date(invoice.dueDate),
      baseAmountDue: invoice.baseAmountDue,
      VAT: invoice.VAT,
      totalAmountDue: invoice.totalAmountDue,
      status: invoice.status,
      paymentMethod: invoice.paymentMethod,
      notes: invoice.notes,
    };
  });

  return formattedInvoices;
}

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