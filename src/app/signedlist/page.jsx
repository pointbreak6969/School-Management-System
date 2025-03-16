"use server";

import Sidebar from "../../components/adminComponents/Sidebar";
import SignedList from "@/components/adminComponents/SignedList";

const Page = () => {
  

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <SignedList/>
    </div>
  );
};

export default Page;