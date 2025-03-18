import { connectDB } from "@/lib/mongoDb";

export async function GET(){
    try {
        const db = await connectDB();
        const bookingsCollection = db.collection('booking');
        const invoicesCollection = db.collection('invoices');
        
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
        
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
        yesterday.setDate(yesterday.getDate() - 1);
        const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
        const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));
        
        const bookingsEndedYesterday = await bookingsCollection.find({
            'timeInterval.end': { $gte: startOfYesterday, $lte: endOfYesterday },
            status: 'Confirmed'
        }).toArray();

        for (const booking of bookingsEndedYesterday) {
            await bookingsCollection.updateOne({ _id: booking._id }, { $set: { status: 'Completed' } });
        }
        
        // Fetch invoices due yesterday
        const dueDateInvoices = await invoicesCollection.find({ dueDate: endOfYesterday }).toArray();
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