// page.tsx - Server Component
import { Suspense } from 'react';
import DocumentViewer from '@/app/components/ViewDocument';
import DocumentLoading from '@/app/components/DocumentLoading';
import axios from 'axios';
interface DocumentData {
    document: string;
}

// This is the main server component
async function DocumentPage({ params }: { params: { id: string } }) {
    // Fetch document data server-side
    const documentData = await getDocumentData(params.id);

    return (
        <div>


            {/* TinyMCE Editor wrapped in Suspense */}
            <Suspense fallback={<DocumentLoading />}>
                <DocumentViewer initialContent={documentData?.document || ''} documentId={params.id} />
            </Suspense>

        </div>
    );
}

// Server-side data fetching function
async function getDocumentData(id: string): Promise<DocumentData | null> {
    try {
        // Use absolute URL for server-side API calls
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await axios.get(`${baseUrl}/api/documents/${id}`);

        // Check if response has the expected structure
        if (!response.data) {
            throw new Error('Failed to fetch document');
        }

        // Return data directly if it's already in the expected format, or data.data if nested
        return response.data.data || response.data;
    } catch (error) {
        console.error('Error fetching document:', error);
        return { document: '' }; // Return empty document instead of null to avoid errors
    }
}

export default DocumentPage;