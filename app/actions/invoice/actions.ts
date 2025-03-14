"use server";

import { connectDB } from "@/lib/mongoDb";
import { ObjectId } from "mongodb";

export async function createInvoice(customerId: string, bookingId: string, totalAmount: number): Promise<string> {
  const invoice = {
    customer: new ObjectId(customerId),
    booking: new ObjectId(bookingId),
    issueDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    baseAmountDue: parseFloat((totalAmount * 0.81).toFixed(2)),
    VAT: parseFloat((totalAmount * 0.19).toFixed(2)),
    totalAmountDue: parseFloat(totalAmount.toFixed(2)),
    status: "Unpaid",
    paymentMethod: 'Bank Transfer',
    notes: 'Please pay within 30 days.',
  };

  const db = await connectDB();
  // Save the invoice to the database
  const savedInvoiceResult = await db.collection("invoices").insertOne(invoice);
  if (!savedInvoiceResult.acknowledged) {
    throw new Error("Failed to create invoice.");
  }
  const savedInvoiceId = savedInvoiceResult.insertedId;
  
  // Save the invoice ID in the related customer document
  const customerData = await db.collection('users').findOne({ _id: new ObjectId(customerId) });
  if(!customerData) {
    throw new Error("Customer not found.");
  }
  const customerInvoices = customerData.invoices ? [...customerData.invoices, savedInvoiceId] : [savedInvoiceId];
  const result = await db.collection('users').updateOne({ _id: new ObjectId(customerId.toString()) }, { $set: { invoices: customerInvoices } });  
  if(!result.acknowledged) {
    throw new Error("Failed to save the invoice in the related document.");
  }

  const insertedId = savedInvoiceResult.insertedId.toString();
  return insertedId;
}