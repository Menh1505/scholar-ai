"use client";
import React, { useState } from "react";
import Fieldset from "@/components/Fieldset";

function FinancePage() {
  const [studyFee, setStudyFee] = useState({
    budget: "",
    currency: "CAD",
    bankAccount: "",
    cash: "",
    scholarship: "",
    mainTuition: "",
    extracurricularTuition: "",
    studyInsurance: "",
    studyTools: "",
  });

  const [livingCost, setLivingCost] = useState({
    budget: "",
    currency: "CAD",
    bankAccount: "",
    cash: "",
    partTimeIncome: "",
    rent: "",
    foodDrinks: "",
    otherCost: "",
    insurance: "",
  });

  const calculateStudyTotal = () => {
    const values = [
      studyFee.bankAccount,
      studyFee.cash,
      studyFee.scholarship,
      studyFee.mainTuition,
      studyFee.extracurricularTuition,
      studyFee.studyInsurance,
      studyFee.studyTools,
    ];
    return values.reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  };

  const calculateLivingTotal = () => {
    const values = [
      livingCost.bankAccount,
      livingCost.cash,
      livingCost.partTimeIncome,
      livingCost.rent,
      livingCost.foodDrinks,
      livingCost.otherCost,
      livingCost.insurance,
    ];
    return values.reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  };

  const grandTotal = calculateStudyTotal() + calculateLivingTotal();

  return (
    <div className="p-6 w-full mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Study Fee Calculator */}
        <Fieldset title="Study Fee" className="min-h-96">
          {/* Budget Input */}
          <div className="mb-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 min-w-fit">Budget:</label>
              <div className="flex gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Enter your amount"
                  className="flex-1 px-3 py-2 border border-black rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={studyFee.budget}
                  onChange={(e) => setStudyFee({ ...studyFee, budget: e.target.value })}
                />
                <select
                  className="px-3 py-2 border border-black rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={studyFee.currency}
                  onChange={(e) => setStudyFee({ ...studyFee, currency: e.target.value })}>
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Started Section */}
          <div className="bg-[#605DEC] text-white px-4 py-2  mb-4">
            <h3 className="font-semibold">Started</h3>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Bank Account</span>
              <span className="text-sm text-gray-700">:</span>
              <input
                type="number"
                className="w-20 px-2 py-1 border border-black rounded text-right text-sm"
                value={studyFee.bankAccount}
                onChange={(e) => setStudyFee({ ...studyFee, bankAccount: e.target.value })}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Cash</span>
              <span className="text-sm text-gray-700">:</span>
              <input
                type="number"
                className="w-20 px-2 py-1 border border-black rounded text-right text-sm"
                value={studyFee.cash}
                onChange={(e) => setStudyFee({ ...studyFee, cash: e.target.value })}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Scholarship</span>
              <span className="text-sm text-gray-700">:</span>
              <input
                type="number"
                className="w-20 px-2 py-1 border border-black rounded text-right text-sm"
                value={studyFee.scholarship}
                onChange={(e) => setStudyFee({ ...studyFee, scholarship: e.target.value })}
              />
            </div>
          </div>

          {/* Monthly Tuition Fees */}
          <div className="bg-[#605DEC] text-white px-4 py-2  mb-4">
            <h3 className="font-semibold">Monthly Tuition Fees</h3>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Main Tuition</span>
              <span className="text-sm text-gray-700">:</span>
              <input
                type="number"
                className="w-20 px-2 py-1 border border-black rounded text-right text-sm"
                value={studyFee.mainTuition}
                onChange={(e) => setStudyFee({ ...studyFee, mainTuition: e.target.value })}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Extracurricular Tuition</span>
              <span className="text-sm text-gray-700">:</span>
              <input
                type="number"
                className="w-20 px-2 py-1 border border-black rounded text-right text-sm"
                value={studyFee.extracurricularTuition}
                onChange={(e) => setStudyFee({ ...studyFee, extracurricularTuition: e.target.value })}
              />
            </div>
          </div>

          {/* Monthly orders */}
          <div className="bg-[#605DEC] text-white px-4 py-2  mb-4">
            <h3 className="font-semibold">Monthly orders</h3>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Study Insurance</span>
              <span className="text-sm text-gray-700">:</span>
              <input
                type="number"
                className="w-20 px-2 py-1 border border-black rounded text-right text-sm"
                value={studyFee.studyInsurance}
                onChange={(e) => setStudyFee({ ...studyFee, studyInsurance: e.target.value })}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Study Tools</span>
              <span className="text-sm text-gray-700">:</span>
              <input
                type="number"
                className="w-20 px-2 py-1 border border-black rounded text-right text-sm"
                value={studyFee.studyTools}
                onChange={(e) => setStudyFee({ ...studyFee, studyTools: e.target.value })}
              />
            </div>
          </div>

          {/* Total */}
          <div className="bg-[#605DEC] text-white px-4 py-3 ">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total :</span>
              <span className="font-bold text-lg">{calculateStudyTotal().toFixed(0)}</span>
            </div>
          </div>
        </Fieldset>

        {/* Living Cost Calculator */}
        <Fieldset title="Living Cost" className="min-h-96">
          {/* Budget Input */}
          <div className="mb-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 min-w-fit">Budget:</label>
              <div className="flex gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Enter your amount"
                  className="flex-1 px-3 py-2 border border-black rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={livingCost.budget}
                  onChange={(e) => setLivingCost({ ...livingCost, budget: e.target.value })}
                />
                <select
                  className="px-3 py-2 border border-black rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={livingCost.currency}
                  onChange={(e) => setLivingCost({ ...livingCost, currency: e.target.value })}>
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Started Section */}
          <div className="bg-[#605DEC] text-white px-4 py-2  mb-4">
            <h3 className="font-semibold">Started</h3>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Bank Account</span>
              <span className="text-sm text-gray-700">:</span>
              <input
                type="number"
                className="w-20 px-2 py-1 border border-black rounded text-right text-sm"
                value={livingCost.bankAccount}
                onChange={(e) => setLivingCost({ ...livingCost, bankAccount: e.target.value })}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Cash</span>
              <span className="text-sm text-gray-700">:</span>
              <input
                type="number"
                className="w-20 px-2 py-1 border border-black rounded text-right text-sm"
                value={livingCost.cash}
                onChange={(e) => setLivingCost({ ...livingCost, cash: e.target.value })}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Part-time Job Income</span>
              <span className="text-sm text-gray-700">:</span>
              <input
                type="number"
                className="w-20 px-2 py-1 border border-black rounded text-right text-sm"
                value={livingCost.partTimeIncome}
                onChange={(e) => setLivingCost({ ...livingCost, partTimeIncome: e.target.value })}
              />
            </div>
          </div>

          {/* Cost Section */}
          <div className="bg-[#605DEC] text-white px-4 py-2  mb-4">
            <h3 className="font-semibold">Cost</h3>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Rent</span>
              <span className="text-sm text-gray-700">:</span>
              <input
                type="number"
                className="w-20 px-2 py-1 border border-black rounded text-right text-sm"
                value={livingCost.rent}
                onChange={(e) => setLivingCost({ ...livingCost, rent: e.target.value })}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Food & Drinks</span>
              <span className="text-sm text-gray-700">:</span>
              <input
                type="number"
                className="w-20 px-2 py-1 border border-black rounded text-right text-sm"
                value={livingCost.foodDrinks}
                onChange={(e) => setLivingCost({ ...livingCost, foodDrinks: e.target.value })}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Other Cost</span>
              <span className="text-sm text-gray-700">:</span>
              <input
                type="number"
                className="w-20 px-2 py-1 border border-black rounded text-right text-sm"
                value={livingCost.otherCost}
                onChange={(e) => setLivingCost({ ...livingCost, otherCost: e.target.value })}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Insurance</span>
              <span className="text-sm text-gray-700">:</span>
              <input
                type="number"
                className="w-20 px-2 py-1 border border-black rounded text-right text-sm"
                value={livingCost.insurance}
                onChange={(e) => setLivingCost({ ...livingCost, insurance: e.target.value })}
              />
            </div>
          </div>

          {/* Total */}
          <div className="bg-[#605DEC] text-white px-4 py-3 ">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total :</span>
              <span className="font-bold text-lg">{calculateLivingTotal().toFixed(0)}</span>
            </div>
          </div>
        </Fieldset>
      </div>

      {/* Grand Total */}
      <div className="bg-[#439F6E] text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-xl">Total</span>
          <span className="font-bold text-2xl">{grandTotal.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}

export default FinancePage;
