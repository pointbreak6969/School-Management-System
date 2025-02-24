"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Test from "../components/Test";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Assignee {
    id: number;
    name: string;
    email: string;
}

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
    const [editorContent, setEditorContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [assignees, setAssignees] = useState<Assignee[]>([]);

    useEffect(() => {
        const savedAssignees = localStorage.getItem("assignees");
        if (savedAssignees) {
            setAssignees(JSON.parse(savedAssignees));
        }
    }, []);

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
                emails: assignees.map(assignee => assignee.email),
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
                    <CardTitle>Selected Recipients</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignees.map((assignee) => (
                                    <TableRow key={assignee.id}>
                                        <TableCell>{assignee.name}</TableCell>
                                        <TableCell>{assignee.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Button 
                            onClick={onSubmit} 
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Sending..." : "Submit"}
                        </Button>
                    </div>
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