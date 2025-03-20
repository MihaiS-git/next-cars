import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '@/lib/stripe'
import { connectDB } from '@/lib/mongoDb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin');
    const bodyText = await request.text()
    const body = Object.fromEntries(new URLSearchParams(bodyText))
    const { totalAmountDue, invoiceId } = body

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Invoice Payment',
            },
            unit_amount: parseFloat(totalAmountDue) * 100, // Stripe expects the amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/dashboard`,
      cancel_url: `${origin}/dashboard`,
    });

    const db = await connectDB();
    const result = await db.collection('invoices').updateOne(
      { _id: new ObjectId(invoiceId) }, { $set: { status: 'Paid' } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Invoice not found." },
        { status: 404 }
      )
    }

    return NextResponse.redirect(session.url!, 303)
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message },
        { status: (err as { statusCode?: number }).statusCode || 500 }
      )
    }
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    )
  }
}