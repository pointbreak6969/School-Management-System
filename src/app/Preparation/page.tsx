"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Test from "../components/Test";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormData {
    recipientEmail: string;
}

interface DocumentPayload {
    email: string | null | undefined;
    document: string;
    emails: string[];
}

const Page = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [editorContent, setEditorContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: FormData) => {
        if (!editorContent) {
            toast.error("Please add some content to the document");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: DocumentPayload = {
                email: session?.user?.email,
                document: editorContent,
                emails: [data.recipientEmail],
            };

            await axios.post("/api/documents", payload);
            toast.success("Document sent successfully!");
            router.push("/admin");
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMessage = (axiosError.response?.data as { message?: string })?.message || "Failed to send document";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 p-6 gap-6">
            <Card className="w-1/3">
                <CardHeader>
                    <CardTitle>Send Document</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Recipient's Email:
                            </label>
                            <Input
                                type="email"
                                placeholder="Enter email"
                                {...register("recipientEmail", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                className="w-full"
                            />
                            {errors.recipientEmail && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.recipientEmail.message}
                                </p>
                            )}
                        </div>
                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Sending..." : "Submit"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            
            {/* Right Section */}
            <div className="w-2/3">
                <Test setEditorContent={setEditorContent} />
            </div>
        </div>
    );
};

export default Page;
