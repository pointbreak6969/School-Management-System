"use client";
import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Card } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';

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
                        <Editor
                            apiKey="bymsij3uljgasv6dt4zp6vo90nh1pdeo1pjpakx69osd1dh1"
                            value={content} // Pass the loaded HTML content
                            init={{
                                height: 500,
                                menubar: true,
                                // Match plugins with the sender's configuration
                                plugins: [
                                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists',
                                    'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                    'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed',
                                    'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable',
                                    'advcode', 'editimage', 'advtemplate', 'mentions',
                                    'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography',
                                    'inlinecss', 'markdown', 'importword'
                                ],
                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
                                    'link image media table mergetags | spellcheckdialog ' +
                                    'a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | ' +
                                    'emoticons charmap | removeformat | help',
                                // Add image upload handler
                                images_upload_handler: (blobInfo) =>
                                    new Promise<string>(resolve => {
                                        const reader = new FileReader();
                                        reader.readAsDataURL(blobInfo.blob());
                                        reader.onload = () => resolve(reader.result as string);
                                    }),
                                // Enhanced content_style to hide branding
                                content_style: `
            body { 
              margin: 0;
              padding: 16px;
              max-width: 100%;
              min-height: 100vh;
            }
            .tox-statusbar__branding {
              display: none !important;
            }
            .tox-statusbar__text-container {
              display: none !important;
            }
            .tox-statusbar__path-item {
              display: none;
            }
            img { 
              display: inline-block !important; 
              max-width: 100%; 
              height: auto;
              vertical-align: middle;
              margin: 2px;
            }
            .field-container {
              display: inline-block;
              vertical-align: top;
              margin: 10px;
            }
            .image-field { 
              vertical-align: text-top;
              margin-bottom: 5px;
            }
            figure.image { 
              display: inline-block !important;
              margin: 2px !important;
            }
            .signature-container {
              width: 150px;
              text-align: center;
            }
            .signature-line {
              width: 150px;
              height: 2px;
              background-color: black;
              margin: 0 auto;
            }
            .signature-text {
              font-size: 14px;
              color: #666;
              margin: 5px 0 0 0;
            }
          `,
                                // Add these settings to hide branding
                                statusbar: false,
                                branding: false,
                                promotion: false,
                                // Setup click handler for image fields
                                setup: (editor) => {
                                    editor.on('click', (e) => {
                                        const clickedEl = e.target;
                                        const container = clickedEl.closest('.image-field');
                                        if (container) {
                                            const existingImage = container.querySelector('img');
                                            if (!existingImage) {
                                                const input = document.createElement('input');
                                                input.type = 'file';
                                                input.accept = 'image/*';
                                                input.onchange = (ev: Event) => {
                                                    const target = ev.target as HTMLInputElement;
                                                    const file = target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = () => {
                                                            const img = window.document.createElement('img');
                                                            img.src = reader.result as string;
                                                            img.alt = "Uploaded Image";
                                                            img.style.width = "100%";
                                                            img.style.height = "100%";
                                                            img.style.objectFit = "contain";
                                                            container.querySelector('.upload-prompt')?.replaceWith(img);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                };
                                                input.click();
                                            }
                                        }
                                    });
                                },
                                // Add these settings to match sender's configuration
                                powerpaste_word_import: 'clean',
                                powerpaste_html_import: 'clean',
                                // Set readonly if you want to prevent editing at the receiver end
                                // readonly: true, // Uncomment if you want view-only
                            }}
                            onEditorChange={(content) => setEditorContent(content)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentEditorPage;
