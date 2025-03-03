import AutoCarousel from "@/components/ui/welcome/AutoCarousel";
import { getAllCarsWithPictures } from "../actions/cars/actions";

export default async function WelcomePage() {
    const cars = await getAllCarsWithPictures();

    return (
        <div className="flex flex-col bg-zinc-900 text-zinc-50 w-full md:w-11/12 md:h-100 rounded-lg border border-red-600 mt-4">
            <h3 className="mb-2 mt-8 text-red-600 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                <em>Welcome to Next Cars</em>
            </h3>
            <p className="mb-8 mt-2 text-red-600 font-semibold text-lg lg:font-bold lg:text-xl text-center">
                <em>Your car rental partner</em>
            </p>
            <AutoCarousel cars={cars} />
            <p className="pb-4 px-4 text-justify">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Dolores quisquam neque enim in expedita temporibus quo iste.
                Repellendus, neque corporis amet quos tempora impedit! Eos
                quisquam iste voluptatibus possimus earum.
            </p>
        </div>
    );
}
