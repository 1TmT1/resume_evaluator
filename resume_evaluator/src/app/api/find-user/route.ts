import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "../../../../data/user";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const isMiddleware = req.headers.get("x-custom-middleware-check-w-header") === "middleware-check";
        if (isMiddleware) {      
            const reqEmail = req.nextUrl.searchParams.get('email');
            if (reqEmail) {
                const existingUser = await getUserByEmail(reqEmail);
                if (existingUser) {
                    return NextResponse.json({ message: "User exists" }, { status: 200 });
                }
                
                return NextResponse.json({ message: "Error occurred" }, { status: 500 });
            }
            return NextResponse.json({ message: "Error occurred" }, { status: 500 });
        }

        const session = await auth();
        const email = session?.user?.email;
        if (email) {
            const existingUser = await getUserByEmail(email);
            if (existingUser) {
                return NextResponse.json({ message: existingUser.fileCID }, { status: 200 });
            }
                
            return NextResponse.json({ message: "Error occurred" }, { status: 500 });
        }

        return NextResponse.json({ message: "Error occurred" }, { status: 500 });
    } catch (err){
        console.log(err);
        return NextResponse.json({ message: "Error occurred" }, { status: 500 });
    }
}