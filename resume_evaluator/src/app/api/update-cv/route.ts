import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { setUserFileCID } from "../../../../data/user";
import { pinata } from "@/lib/pinata";

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const file = data.get('file') as File;
        const session = await auth();
        if (session) {
            if (file) {
                const fileData = await pinata.upload.file(file);
                const cid = fileData.cid;
                const userEmail = session?.user?.email;
        
                if (cid && userEmail) {
                    const isCIDSet = await setUserFileCID(userEmail, cid);
                    
                    if (isCIDSet) return NextResponse.json({ message: "Successfully changed cid." }, { status: 200 }); 
                }
        
                return NextResponse.json({ message: "Error occurred..." }, { status: 500 });
            } else {
                return NextResponse.json({ message: "Error occurred..." }, { status: 500 });
            }
        } else {
            return NextResponse.json({ message: "Error occurred..." }, { status: 500 });
        }
    } catch(err) {
        console.log(err);
        return NextResponse.json({ message: "Error occurred..." }, { status: 500 });
    }
}