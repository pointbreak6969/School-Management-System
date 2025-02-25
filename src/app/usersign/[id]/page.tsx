"use client";
import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import axios from "axios";

const DocumentEditorPage = () => {
    const params = useParams();
    const id = params.id;
    const [document, setDocumentDetails] = useState({});
    const [content, setContent] = useState(''); // To hold the HTML content

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

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Side - Recipients */}
            <div className="w-1/4 p-6 border-r border-gray-200">
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Selected Recipients</h2>
                    <form>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="hello@gmail.com"
                                    className="w-full"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                Submit
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
                                plugins: [
                                    'advlist autolink lists link image charmap preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table code help wordcount'
                                ],
                                toolbar:
                                    'undo redo | formatselect | bold italic backcolor | ' +
                                    'alignleft aligncenter alignright alignjustify | ' +
                                    'bullist numlist outdent indent | removeformat | help',
                            }}
                            onEditorChange={(newContent) => setContent(newContent)} // Update content on change
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentEditorPage;
