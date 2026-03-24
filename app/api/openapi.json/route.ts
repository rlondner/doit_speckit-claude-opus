import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  const specPath = join(process.cwd(), "public", "openapi.json");
  const spec = JSON.parse(readFileSync(specPath, "utf-8"));
  return NextResponse.json(spec);
}
