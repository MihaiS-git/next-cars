import { getCarsWithPictures } from "@/lib/queries/cars-queries";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cars = await getCarsWithPictures();

        return NextResponse.json(cars, { status: 200 });
    } catch (error: any) {
        console.error("API error:", error.message);
        return NextResponse.json(
            { error: error.message || "Failed to fetch cars" },
            { status: 500 }
        );
    }
}