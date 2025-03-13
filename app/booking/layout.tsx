export const metadata = {
    title: 'Next Cars - Book a Car',
    description: 'Book a car from Next Cars',
    keywords: 'Next Cars, Book, Book a Car, Book a Driver',
    author: 'Next Cars Team',
    robots: 'index, follow',
    charset: 'UTF-8',
};

import { getAllCarsWithOnePicture } from "../actions/cars/actions";
import { getAllDrivers } from "../actions/drivers/actions";
import BookingPage from "./page";

export default async function BookingPageLayout() {
    const cars = await getAllCarsWithOnePicture();
    const drivers = await getAllDrivers();

    return (
        <div className="flex flex-col bg-zinc-800 text-zinc-200 w-full md:w-8/12 rounded-lg border border-red-600 mt-4">
            <BookingPage cars={cars} drivers={drivers} />
        </div>
    );
}
