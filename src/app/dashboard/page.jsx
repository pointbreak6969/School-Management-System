"use server";
import Dashboard from "../../components/adminComponents/Dashboard";
import Sidebar from "../../components/adminComponents/Sidebar";

const Page = async () => {
  const response = await fetch(`${process.env.NEXT_URL}/api/getUnsignedDocuments`);
  const data = await response.json();
  console.log(data);
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Dashboard/>
    </div>
  );
};

export default Page;