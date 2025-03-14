import React, { useState } from "react";

const ViewPdf = () => {
  const [email, setEmail] = useState("ashim00@gmail.com");


  return (
    <div className="min-h-screen flex  px-4">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Submit Email
          </h2>
          <form  className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-60 border border-gray-300 rounded-lg p-2 "
                required
              />
            </div>
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
            >
              Submit
            </button>
          </form>
        </div>

        <div>
          
         
          <div className="border border-gray-300 rounded-lg p-4 ">
            <p className="text-gray-500">PDF content will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPdf;