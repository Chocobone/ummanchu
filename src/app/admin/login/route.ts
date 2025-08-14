import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.ADMIN_JWT_SECRET!; // .env에 설정

export async function POST(req: Request) {
  const { username, password } = await req.json();
// 만료시간 24시간
  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ username }, SECRET_KEY, {
      expiresIn: "24h",
    });
    return NextResponse.json({ token });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
