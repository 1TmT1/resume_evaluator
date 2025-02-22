import { NextResponse } from "next/server";
import { fileTypeFromBuffer } from 'file-type';

export async function POST(req: Request) {
    const allowedTypes = ['pdf', 'docx'];
    try {
        const data = await req.formData();
        const file = data.get('file');

        if (file && file instanceof File) {
            const buffer = Buffer.from(await file.arrayBuffer());            
            const type = file ? await fileTypeFromBuffer(buffer) : null;

            if (type && allowedTypes.includes(type.ext)) {
                return NextResponse.json({ message: "Valid file type" }, { status: 200 });
            }

            return NextResponse.json({ message: "Invalid file type" }, { status: 500 });
        } else {
            return NextResponse.json({ message: "Error processing file..." }, { status: 500 });
        }
    } catch {
        return NextResponse.json({ message: "Invalid file type" }, { status: 500 });
    }
}