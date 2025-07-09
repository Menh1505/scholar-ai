import React from "react";
import Fieldset from "@/components/Fieldset";

function ProfilePage() {
  return (
    <div className="bg-[#DBD9FB] p-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Information */}
        <div className="lg:col-span-2">
          <Fieldset title="Basic Information" className="h-fit">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Fullname:</label>
                  <p className="text-gray-900">ngdakhoa1@gmail.com</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Gmail:</label>
                  <p className="text-gray-900">ngdakhoa1@gmail.com</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Phone:</label>
                  <p className="text-gray-900">1234567689</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Permanent Address:</label>
                  <p className="text-gray-900">Tan son, Go vap, HCM</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Religion:</label>
                  <p className="text-gray-900"></p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Date of Birth:</label>
                  <p className="text-gray-900">21/2/2003</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Sex:</label>
                  <p className="text-gray-900"></p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Passport Code:</label>
                  <p className="text-gray-900"></p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Passport Exprial Date:</label>
                  <p className="text-gray-900"></p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Nationality:</label>
                  <p className="text-gray-900">Vietnam</p>
                </div>
              </div>
            </div>
          </Fieldset>
        </div>

        {/* Right Column - Scholar Point */}
        <div>
          <div className="mt-4 rounded-2xl p-6 text-center border-2 border-black">
            <div className="text-6xl font-bold text-blue-600 mb-2">1231</div>
            <div className="text-xl font-semibold text-gray-800">Scholar Point</div>
          </div>
        </div>
      </div>

      {/* Second Row - Four Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <Fieldset title="Passport" className="min-h-48">
          <div className="text-gray-500 text-sm">Passport information will be displayed here</div>
        </Fieldset>

        <Fieldset title="Marital Sta." className="min-h-48">
          <div className="text-gray-500 text-sm">Marital status information will be displayed here</div>
        </Fieldset>

        <Fieldset title="Family" className="min-h-48">
          <div className="text-gray-500 text-sm">Family information will be displayed here</div>
        </Fieldset>

        <Fieldset title="Budget" className="min-h-48">
          <div className="text-gray-500 text-sm">Budget information will be displayed here</div>
        </Fieldset>
      </div>

      {/* Bottom - Your Roadmap */}
      <div className="mt-6">
        <Fieldset title="Your Roadmap" className="min-h-64">
          <div className="text-gray-500 text-sm">Your roadmap will be displayed here</div>
        </Fieldset>
      </div>
    </div>
  );
}

export default ProfilePage;
