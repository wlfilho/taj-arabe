import { NextResponse } from "next/server";
import { getMenuData } from "@/lib/menu-service";

export async function GET() {
  try {
    const data = await getMenuData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Failed to load menu data", error);
    return NextResponse.json(
      { message: "Não foi possível carregar o cardápio. Tente novamente." },
      { status: 500 },
    );
  }
}
