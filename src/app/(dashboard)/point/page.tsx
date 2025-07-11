import React from "react";
import Image from "next/image";
import Fieldset from "@/components/Fieldset";

function PointPage() {
  const courseOffers = [
    {
      id: 1,
      title: "AI Course",
      company: "SMURF Company",
      location: "HCM City",
      points: "500 SP",
      image: "/api/placeholder/200/120",
      bgColor: "bg-gradient-to-br from-purple-100 to-cyan-100",
    },
    {
      id: 2,
      title: "Finance Course",
      company: "Tumilab Company",
      location: "HCM City",
      points: "100 SP",
      image: "/api/placeholder/200/120",
      bgColor: "bg-gray-100",
    },
    {
      id: 3,
      title: "Blockchain Course",
      company: "VBA",
      location: "HCM City",
      points: "200 SP",
      image: "/api/placeholder/200/120",
      bgColor: "bg-gradient-to-br from-blue-900 to-cyan-600",
    },
  ];

  const scholarshipOffers = [
    {
      id: 1,
      title: "University of Toronto",
      state: "Ontario State",
      location: "Toronto City",
      points: "800 SP",
      image: "/api/placeholder/200/120",
    },
    {
      id: 2,
      title: "McGill University",
      state: "Montreal State",
      location: "Quebec City",
      points: "200 SP",
      image: "/api/placeholder/200/120",
    },
    {
      id: 3,
      title: "Carleton University",
      state: "Ottawa State",
      location: "Ontario City",
      points: "100 SP",
      image: "/api/placeholder/200/120",
    },
  ];

  return (
    <div className="p-6 w-full mx-auto">
      {/* Scholar Point Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-semibold text-gray-800">Scholar Point :</span>
          <span className="text-4xl font-bold text-blue-600">1231</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Course Offer */}
        <Fieldset title="Course Offer" className="min-h-64">
          <div className="overflow-x-auto">
            <div className="flex gap-6 pb-4" style={{ width: "max-content" }}>
              {courseOffers.map((course) => (
                <div key={course.id} className={`${course.bgColor} rounded-2xl p-4 w-64 flex-shrink-0 border border-gray-200`}>
                  <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                    <Image src={course.image} alt={course.title} fill className="object-cover" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.company}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{course.location}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">{course.points}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Fieldset>

        {/* Scholarship Offer */}
        <Fieldset title="Scholarship Offer" className="min-h-64">
          <div className="overflow-x-auto">
            <div className="flex gap-6 pb-4" style={{ width: "max-content" }}>
              {scholarshipOffers.map((scholarship) => (
                <div key={scholarship.id} className="bg-white rounded-2xl p-4 w-64 flex-shrink-0 border border-gray-200 shadow-sm">
                  <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                    <Image src={scholarship.image} alt={scholarship.title} fill className="object-cover" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-gray-900">{scholarship.title}</h3>
                    <p className="text-sm text-gray-600">{scholarship.state}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{scholarship.location}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">{scholarship.points}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Fieldset>
      </div>
    </div>
  );
}

export default PointPage;
