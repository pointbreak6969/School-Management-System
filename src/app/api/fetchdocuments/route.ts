import connectDb from '@/lib/connectDb';
import { NextResponse } from 'next/server';
import PdfModel from '../../../../model/Pdf';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
  try {
    await connectDb();

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const email = session.user.email;

    const documents = await PdfModel.find({ emails: email }).sort({ createdAt: -1 }).exec();
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}