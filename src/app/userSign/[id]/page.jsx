// "use server";
// import { notFound } from 'next/navigation';
// import DocumentViewer from "@/components/DocumentViewer";

// async function Page({ params }) {
//   const { id } = params;
//   try {
//     // Use native fetch instead of axios in server components
//     const response = await fetch(`/api/document/${id}`);
    
//     if (!response.ok) {
//       if (response.status === 404) {
//         notFound(); // Better handling for 404 cases
//       }
//       throw new Error(`Failed to fetch document: ${response.statusText}`);
//     }
    
//     const documentData = await response.json();
    
//     return (
//       <div className="p-6 max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold mb-4">Document ID: {id}</h1>
//         <DocumentViewer documentData={documentData} />
//       </div>
//     );
//   } catch (error) {
//     console.error("Error fetching document:", error);
    
//     // Return error state
//     return (
//       <div className="p-6 max-w-4xl mx-auto text-center">
//         <h1 className="text-2xl font-bold mb-4">Document ID: {id}</h1>
//         <div className="bg-red-50 border border-red-200 p-4 rounded-md">
//           <h2 className="text-xl font-semibold text-red-600">Error loading document</h2>
//           <p className="text-gray-700 mt-2">
//             {error.message || "Unable to retrieve the requested document. Please try again later."}
//           </p>
//         </div>
//       </div>
//     );
//   }
// }

// export default Page;
"use server" 

import React from 'react'

const page = async ({params}) => {
  const {id} = await params
  const data = await fetch(`http://localhost:3000/api/document/${paramsId}`)	
  const documentData = await data.json()
  console.log(documentData.data)
  return (
    <div>params is : </div>
  )
}

export default page