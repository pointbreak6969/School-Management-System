import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connectDb";
import PdfModel, { IPdf } from "../../../../model/Pdf"

export async function POST(request: Request) {
    await connectDb();
    try {
        const {email, document, emails} = await request.json();
        if (!email || !document || !emails) {
            return Response.json({
                success: false,
                message: 'Missing required fields',
              },
              { status: 400 });
        }
        const newDoc = await PdfModel.create({
            email, document, emails, xfdf: [], signedBy: [], signed: false
        })
        return Response.json({success: true})
    } catch (error) {
        
    }
}
