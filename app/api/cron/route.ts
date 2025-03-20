import { connectDB } from "@/lib/mongoDb";

export async function GET() {
    console.log('Cron job started.');
    try {
        const db = await connectDB();
        const bookingsCollection = db.collection('bookings');
        const invoicesCollection = db.collection('invoices');

        const currentDate = new Date();
        const startOfDay = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 0, 0, 0));
        const endOfDay = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 23, 59, 59, 999));

        // Fetch bookings starting today
        const bookingsStartingToday = await bookingsCollection.find({
            'timeInterval.start': { $gte: startOfDay, $lte: endOfDay }
        }).toArray();

        for (const booking of bookingsStartingToday) {
            if (booking.status === 'Pending') {
                await bookingsCollection.updateOne({ _id: booking._id }, { $set: { status: 'Cancelled' } });
            }
        }

        // Fetch bookings that ended yesterday
        const yesterday = new Date();
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);

        const startOfYesterday = new Date(Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate(), 0, 0, 0));
        const endOfYesterday = new Date(Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate(), 23, 59, 59, 999));

        const bookingsEndedYesterday = await bookingsCollection.find({
            'timeInterval.end': { $gte: startOfYesterday, $lte: endOfYesterday },
            status: 'Confirmed'
        }).toArray();

        console.log("Bookings ended yesterday:", bookingsEndedYesterday);
        

        for (const booking of bookingsEndedYesterday) {
            await bookingsCollection.updateOne({ _id: booking._id }, { $set: { status: 'Completed' } });
        }

        // Fetch invoices due yesterday
        const dueDateInvoices = await invoicesCollection.find({ dueDate: { $lte: endOfYesterday } }).toArray();
        console.log("Due date invoices:", dueDateInvoices);
        
        for (const invoice of dueDateInvoices) {
            if (invoice.status === 'Unpaid') {
                await invoicesCollection.updateOne({ _id: invoice._id }, { $set: { status: 'Overdue' } });
            }
        }

        return new Response('Cron job executed successfully.', { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error. Cron job failed.', { status: 500 });
    }
}