import AutoCarousel from "@/components/ui/welcome/AutoCarousel";
import { getCarsImagesForWelcomeCarousel } from "../actions/cars/actions";

export default async function WelcomePage() {
    const carImages = await getCarsImagesForWelcomeCarousel();
    
    return (
        <>
            <AutoCarousel carImages={carImages} />
        </>
    );
}
