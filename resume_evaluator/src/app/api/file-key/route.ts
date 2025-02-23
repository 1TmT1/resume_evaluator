import { NextResponse } from "next/server";
import { pinata } from "@/lib/pinata";
import { auth } from "@/auth";
import { getUserByEmail, setFileUploadKey } from "../../../../data/user";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();
        const email = session?.user?.email;
        if (email) {
            const existingUser = await getUserByEmail(email);
            if (existingUser?.fileUploadJWT) {
                const res = await pinata.keys.revoke([existingUser.fileUploadJWT]);

                if (!res[0]) {
                    return NextResponse.json({ text: "Error creating API key." }, { status: 500 });
                }
            }
        }
        
        const uuid = crypto.randomUUID();
        const keyData = await pinata.keys.create({
            keyName: uuid.toString(),
            permissions: {
                endpoints: {
                    pinning: {
                        pinFileToIPFS: true,
                    },
                },
            },
            maxUses: 1,
        });

        const isFileUploadKey = await setFileUploadKey(email as string, keyData.pinata_api_key);
        if (isFileUploadKey) return NextResponse.json(keyData, { status: 200 });
        return NextResponse.json({ text: "Error creating API key." }, { status: 500 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ text: "Error creating API key." }, { status: 500 });
    }
}