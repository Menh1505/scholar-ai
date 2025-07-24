"use client";
import React, { useState } from "react";
import Image from "next/image";
import Fieldset from "@/components/Fieldset";

// Mock data for universities
const universities = [
  {
    id: 1,
    name: "University of Toronto",
    state: "Ontario State",
    city: "Toronto City",
    rank: "#1",
    image: "/schools/u-toronto.png",
    info: "The University of Toronto, established in 1827 in Ontario, Canada, is one of the world's top universities, ranked 21st by QS Rankings 2024. It features the third-largest library in North America and offers a diverse range of programs, including strengths in science, engineering, and health fields.",
    strengths: [
      "Academic Excellence: Top-ranked globally, 700+ programs, elite faculty.",
      "Research & Innovation: Pioneered insulin, AI, medical breakthroughs.",
      "Diverse Community: 160+ nationalities, strong international support.",
      "Career & Alumni Network: Ties with top firms, 650,000+ alumni worldwide.",
    ],
    ratio: "98%",
  },
  {
    id: 2,
    name: "McGill University",
    state: "Quebec State",
    city: "Montreal City",
    rank: "#2",
    image: "/schools/u-mcgill.png",
    info: "McGill University, founded in 1821 in Montreal, Quebec, is renowned for its rigorous academic standards and international outlook. Consistently ranked among the top universities globally, McGill is known for its strong research programs and diverse student body from over 150 countries.",
    strengths: [
      "International Recognition: Ranked #31 globally by QS World University Rankings 2024.",
      "Research Excellence: Over $600M in annual research funding, breakthrough discoveries.",
      "Bilingual Environment: English instruction in francophone Quebec, unique cultural experience.",
      "Alumni Success: 12 Nobel Prize winners, leaders in politics, business, and science.",
    ],
    ratio: "95%",
  },
  {
    id: 3,
    name: "Carleton University",
    state: "Ontario State",
    city: "Ottawa City",
    rank: "#3",
    image: "/schools/u-carleton.png",
    info: "Carleton University, established in 1942 in Ottawa, Ontario, is known for its innovative programs and hands-on learning approach. Located in Canada's capital, it offers unique opportunities for internships and co-ops with government and tech companies.",
    strengths: [
      "Innovation Focus: Leading programs in engineering, journalism, and public policy.",
      "Capital Advantage: Located in Ottawa, access to government and tech sector opportunities.",
      "Co-op Programs: Extensive work-integrated learning with 3,000+ employer partners.",
      "Student Support: Comprehensive accessibility services and student success programs.",
    ],
    ratio: "92%",
  },
  {
    id: 4,
    name: "University of Ottawa",
    state: "Ontario State",
    city: "Ottawa City",
    rank: "#4",
    image: "/schools/u-ottawa.png",
    info: "The University of Ottawa, founded in 1848, is Canada's largest bilingual university. Located in the heart of the nation's capital, it offers unique programs in both English and French, with strong connections to government institutions and international organizations.",
    strengths: [
      "Bilingual Excellence: Canada's largest bilingual university, programs in English and French.",
      "Government Connections: Strategic location in capital city, internships with federal institutions.",
      "Research Impact: Member of U15 research universities, strong in health sciences and social sciences.",
      "International Reach: Partnerships with 280+ universities worldwide, diverse student population.",
    ],
    ratio: "90%",
  },
];

function StudyPage() {
  const [selectedUniversity, setSelectedUniversity] = useState(universities[0]);

  const handleUniversityClick = (university: (typeof universities)[0]) => {
    setSelectedUniversity(university);
  };
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-black rounded-3xl p-4 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">From:</span>
              <select className="ml-2 bg-gray-100 border-2 border-black rounded-3xl px-3 py-1 text-sm">
                <option>Choose your country</option>
                <option>Vietnam</option>
                <option>USA</option>
                <option>Canada</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">To:</span>
              <select className="ml-2 bg-gray-100 border-2 border-black rounded-3xl px-3 py-1 text-sm">
                <option>Choose your country</option>
                <option>Canada</option>
                <option>USA</option>
                <option>UK</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-black rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Budget:</span>
            <select className="ml-2 bg-gray-100 border-2 border-black rounded-3xl px-3 py-1 text-sm">
              <option>Choose Budget</option>
              <option>$0 - $20,000</option>
              <option>$20,000 - $50,000</option>
              <option>$50,000+</option>
            </select>
          </div>
        </div>

        <div className="bg-white border-2 border-black rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Major:</span>
            <select className="ml-2 bg-gray-100 border-2 border-black rounded-3xl px-3 py-1 text-sm">
              <option>Choose major</option>
              <option>Engineering</option>
              <option>Business</option>
              <option>Computer Science</option>
            </select>
          </div>
        </div>
      </div>

      {/* University Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {universities.map((university) => (
          <div
            key={university.id}
            onClick={() => handleUniversityClick(university)}
            className={`bg-white border-2 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedUniversity.id === university.id ? "border-blue-500 shadow-lg transform scale-105" : "border-black hover:border-gray-600"
            }`}>
            <div className="relative w-full h-32">
              <Image src={university.image} alt={university.name} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{university.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{university.state}</p>
              <p className="text-sm text-gray-600 mb-2">{university.city}</p>
              <div className="flex justify-end">
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    selectedUniversity.id === university.id ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                  }`}>
                  {university.rank}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Information Section */}
      <div className="space-y-6">
        {/* First Row - School Information and Strengths */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Fieldset title="School Information" className="h-fit">
              <div className="text-sm text-gray-700 leading-relaxed">
                <p className="mb-3">{selectedUniversity.info}</p>
              </div>
            </Fieldset>
          </div>

          <div>
            <Fieldset title="Strengths" className="h-fit">
              <div className="space-y-3">
                {selectedUniversity.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="text-xs text-gray-600">{strength}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Fieldset>
          </div>
        </div>

        {/* Second Row - Ratio (2 parts) and Compatibility (8 parts) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-2">
            <Fieldset title="Ratio" className="h-full">
              <div className="flex items-center justify-center h-full">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{selectedUniversity.ratio}</span>
                  </div>
                </div>
              </div>
            </Fieldset>
          </div>

          <div className="lg:col-span-8">
            <Fieldset title="Compatibility Result" className="h-full">
              <div className="text-gray-500 text-sm text-center h-full flex items-center justify-center">
                Compatibility analysis will be displayed here based on your profile and preferences.
              </div>
            </Fieldset>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyPage;
