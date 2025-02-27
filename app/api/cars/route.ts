import { NextResponse } from "next/server";
import { connectToMongoose } from "@/lib/mongoose";
import Car from "@/lib/models/Car";

export async function GET() {
  try {
    await connectToMongoose();
    const cars = await Car.find().exec();

    return NextResponse.json(cars, { status: 200 });
  } catch (error: any) {
    console.error("API error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch cars" },
      { status: 500 }
    );
  }
}