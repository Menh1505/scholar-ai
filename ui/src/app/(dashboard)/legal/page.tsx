"use client";
import React, { useState } from "react";

function LegalPage() {
  const [expandedSections, setExpandedSections] = useState({
    document: true,
    tax: false,
    working: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="p-6 w-full mx-auto">
      <div className="space-y-6 w-full">
        {/* Document Requirement */}
        <div className="w-full border-2 border-black rounded-2xl">
          <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => toggleSection("document")}>
            <h2 className="text-xl font-semibold text-gray-900">Document Requirement</h2>
            <svg
              className={`w-6 h-6 transition-transform duration-200 ${expandedSections.document ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {expandedSections.document && (
            <div className="px-6 pb-6">
              <div className="min-h-64 rounded-lg p-4">
                <div className="text-gray-600 text-sm">
                  <p className="mb-4">Required documents for your legal process:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Valid passport with at least 6 months validity</li>
                    <li>Birth certificate (certified translation required)</li>
                    <li>Educational transcripts and diplomas</li>
                    <li>Police clearance certificate</li>
                    <li>Medical examination results</li>
                    <li>Financial statements and bank records</li>
                    <li>Employment verification letter</li>
                    <li>Immigration application forms</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tax & Insurance */}
        <div className="border-2 border-black rounded-2xl">
          <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => toggleSection("tax")}>
            <h2 className="text-xl font-semibold text-gray-900">Tax & Insurance</h2>
            <svg
              className={`w-6 h-6 transition-transform duration-200 ${expandedSections.tax ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {expandedSections.tax && (
            <div className="px-6 pb-6">
              <div className="min-h-32 rounded-lg p-4">
                <div className="text-gray-600 text-sm">
                  <p className="mb-4">Tax and insurance requirements:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Tax Obligations:</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Income tax registration</li>
                        <li>Social security contributions</li>
                        <li>Provincial tax requirements</li>
                        <li>Tax identification number</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Insurance Coverage:</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Health insurance enrollment</li>
                        <li>Workers compensation</li>
                        <li>Employment insurance</li>
                        <li>Professional liability insurance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Working Policy */}
        <div className="border-2 border-black rounded-2xl">
          <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => toggleSection("working")}>
            <h2 className="text-xl font-semibold text-gray-900">Working Policy</h2>
            <svg
              className={`w-6 h-6 transition-transform duration-200 ${expandedSections.working ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {expandedSections.working && (
            <div className="px-6 pb-6">
              <div className="min-h-32 rounded-lg p-4">
                <div className="text-gray-600 text-sm">
                  <p className="mb-4">Working policies and regulations:</p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Work Permit Requirements:</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Valid work permit or visa</li>
                        <li>Labor market impact assessment (LMIA)</li>
                        <li>Job offer from approved employer</li>
                        <li>Proof of qualifications and experience</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Employment Standards:</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Minimum wage compliance</li>
                        <li>Working hours and overtime regulations</li>
                        <li>Vacation and sick leave entitlements</li>
                        <li>Workplace safety standards</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LegalPage;
