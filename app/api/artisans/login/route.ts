import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Artisan from "@/models/Artisan";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const artisan = await Artisan.findOne({ email });
    if (!artisan) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
    }

    const validPassword = await bcrypt.compare(password, artisan.password);
    if (!validPassword) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
    }

    // Issue JWT
    const token = jwt.sign(
      { id: artisan._id, email: artisan.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return NextResponse.json({ message: "Login successful", token }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
