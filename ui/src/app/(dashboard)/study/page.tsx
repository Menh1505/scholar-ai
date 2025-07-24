import React from "react";
import Image from "next/image";
import Fieldset from "@/components/Fieldset";

function StudyPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-black rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">From:</span>
            <select className="ml-2 bg-gray-100 border-2 border-black rounded px-3 py-1 text-sm">
              <option>Choose your country</option>
              <option>Vietnam</option>
              <option>USA</option>
              <option>Canada</option>
            </select>
          </div>
        </div>

        <div className="bg-white border-2 border-black rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">To:</span>
            <select className="ml-2 bg-gray-100 border-2 border-black rounded px-3 py-1 text-sm">
              <option>Choose your country</option>
              <option>Canada</option>
              <option>USA</option>
              <option>UK</option>
            </select>
          </div>
        </div>

        <div className="bg-white border-2 border-black rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Budget:</span>
            <select className="ml-2 bg-gray-100 border-2 border-black rounded px-3 py-1 text-sm">
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
            <select className="ml-2 bg-gray-100 border-2 border-black rounded px-3 py-1 text-sm">
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
        <div className="bg-white border-2 border-black rounded-3xl overflow-hidden">
          <div className="relative w-full h-32">
            <Image src="/schools/u-toronto.png" alt="University of Toronto" fill className="object-cover" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">University of Toronto</h3>
            <p className="text-sm text-gray-600 mb-1">Ontario State</p>
            <p className="text-sm text-gray-600 mb-2">Toronto City</p>
            <div className="flex justify-end">
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">#1</span>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-black rounded-3xl overflow-hidden">
          <div className="relative w-full h-32">
            <Image src="/schools/u-mcgill.png" alt="McGill University" fill className="object-cover" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">McGill University</h3>
            <p className="text-sm text-gray-600 mb-1">Montreal State</p>
            <p className="text-sm text-gray-600 mb-2">Quebec City</p>
            <div className="flex justify-end">
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">#2</span>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-black rounded-3xl overflow-hidden">
          <div className="relative w-full h-32">
            <Image src="/schools/u-carleton.png" alt="Carleton University" fill className="object-cover" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">Carleton University</h3>
            <p className="text-sm text-gray-600 mb-1">Ottawa State</p>
            <p className="text-sm text-gray-600 mb-2">Ontario City</p>
            <div className="flex justify-end">
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">#3</span>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-black rounded-3xl overflow-hidden">
          <div className="relative w-full h-32">
            <Image src="/schools/u-ottawa.png" alt="University of Ottawa" fill className="object-cover" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">University of Ottawa</h3>
            <p className="text-sm text-gray-600 mb-1">Ottawa State</p>
            <p className="text-sm text-gray-600 mb-2">Ontario City</p>
            <div className="flex justify-end">
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">#4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="space-y-6">
        {/* First Row - School Information and Strengths */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Fieldset title="School Information" className="h-fit">
              <div className="text-sm text-gray-700 leading-relaxed">
                <p className="mb-3">
                  The University of Toronto, established in 1827 in Ontario, Canada, is one of the world&apos;s top universities, ranked 21st by QS Rankings
                  2024. It features the third-largest library in North America and offers a diverse range of programs, including strengths in science,
                  engineering, and health fields.
                </p>
              </div>
            </Fieldset>
          </div>

          <div>
            <Fieldset title="Strengths" className="h-fit">
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="text-xs text-gray-600">Academic Excellence Top-ranked globally, 700+ programs, elite faculty.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="text-xs text-gray-600">Research & Innovation Pioneered insulin, AI, medical breakthroughs.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="text-xs text-gray-600">Diverse Community 160+ nationalities, strong international support.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="text-xs text-gray-600">Career & Alumni Network Ties with top firms, 650,000+ alumni worldwide.</p>
                  </div>
                </div>
              </div>
            </Fieldset>
          </div>
        </div>

        {/* Second Row - Ratio (2 parts) and Compatibility (8 parts) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <div className="lg:col-span-2">
            <Fieldset title="Ratio" className="h-fit">
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">98%</span>
                  </div>
                </div>
              </div>
            </Fieldset>
          </div>

          <div className="lg:col-span-8">
            <Fieldset title="Compatibility Result" className="min-h-32">
              <div className="text-gray-500 text-sm text-center">Compatibility analysis will be displayed here based on your profile and preferences.</div>
            </Fieldset>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyPage;
