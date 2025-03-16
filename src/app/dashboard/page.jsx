"use server";
import Dashboard from "@/components/adminComponents/Dashboard";
import Sidebar from "@/components/adminComponents/Sidebar";

const Page = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Dashboard/>
    </div>
  );
};

export default Page;