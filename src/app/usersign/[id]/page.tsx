"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Card } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';
import Test from '@/app/components/Test';

interface DocumentPayload {
    email: string | null | undefined;
    document: string;
}
const DocumentEditorPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id;
    const { data: session } = useSession();
    const [documentDetails, setDocumentDetails] = useState<any>({});
    const [content, setContent] = useState(''); // To hold the HTML content
    const [editorContent, setEditorContent] = useState(''); // To hold the TinyMCE editor content   
    const [isSubmitting, setIsSubmitting] = useState(false);
    const editorRef = useRef<any>(null);

    useEffect(() => {
        const getDocumentDetails = async () => {
            try {
                const res = await axios.get(`/api/documents/${id}`);
                const data = res.data;

                if (!data) {
                    console.log("Document not found");
                } else {
                    setDocumentDetails(data.data);
                    setContent(data.data.document); // Extract HTML content
                    console.log(data);
                }
            } catch (error) {
                console.log("Error fetching data", error);
            }
        };

        getDocumentDetails();
    }, [id]);

    const onSubmit = async () => {
        if (!editorContent) {
            toast.error("Please add some content to the document");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: DocumentPayload = {
                email: session?.user?.email,
                document: editorContent,
            }
            await axios.patch(`/api/documents/${id}`, payload);
            toast.success("Document sent successfully!");
            router.push("/admin");
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMessage =
                (axiosError.response?.data as { message?: string })?.message ||
                "Failed to send document";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

   

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Side - Recipients */}
            <div className="w-1/4 p-6 border-r border-gray-200">
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Sent By:</h2>
                    <form>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email
                                </label>
                                <label htmlFor="sent">
                                    {documentDetails.email}
                                </label>
                            </div>
                            <Button onClick={onSubmit} className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Submit"}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>

            {/* Right Side - Editor */}
            <div className="flex-1 p-6">
                <div className="bg-white rounded-lg shadow">
                    <div className="border-b border-gray-200 p-4">
                        <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-gray-100 rounded">←</button>
                            <button className="p-1 hover:bg-gray-100 rounded">→</button>
                            <div className="h-4 border-r border-gray-300 mx-2"></div>
                            <select className="px-2 py-1 border rounded text-sm">
                                <option>Paragraph</option>
                            </select>
                            <select className="px-2 py-1 border rounded text-sm">
                                <option>sans-serif</option>
                            </select>
                            <select className="px-2 py-1 border rounded text-sm">
                                <option>12pt</option>
                            </select>
                            <div className="flex items-center space-x-1">
                                <button className="p-1 hover:bg-gray-100 rounded font-bold">B</button>
                                <button className="p-1 hover:bg-gray-100 rounded italic">I</button>
                                <button className="p-1 hover:bg-gray-100 rounded underline">U</button>
                                <button className="p-1 hover:bg-gray-100 rounded line-through">S</button>
                            </div>
                        </div>
                    </div>

                    {/* TinyMCE Editor */}
                    <div className="p-4 min-h-[500px]">
                        <Test setEditorContent={setEditorContent} value={content}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentEditorPage;
