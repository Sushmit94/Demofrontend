import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import Artisan from "@/models/Artisan";

export async function POST(req: Request) {
  try {
    // connect to DB
    await connectDB();

    // parse request body
    const body = await req.json();
    const { name, email, password, bio, heritage } = body;

    // validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // check if email already exists
    const existing = await Artisan.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new artisan
    const newArtisan = new Artisan({
      name,
      email,
      password: hashedPassword,
      bio: bio || "",
      heritage: heritage || "",
    });

    await newArtisan.save();

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
