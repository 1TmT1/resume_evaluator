import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { setUserFileCID } from "../../../../data/user";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const session = await auth();
        const cid = data.cid;
        const userEmail = session?.user?.email;

        if (cid && userEmail) {
            const isCIDSet = await setUserFileCID(userEmail, cid);
            
            if (isCIDSet) return NextResponse.json({ message: "Successfully changed cid." }, { status: 200 }); 
        }

        return NextResponse.json({ message: "Error occurred..." }, { status: 500 });
    } catch(err) {
        console.log(err);
        return NextResponse.json({ message: "Error occurred..." }, { status: 500 });
    }
}