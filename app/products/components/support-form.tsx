// components/support-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SupportFormProps {
  artistId: string;
  type: "one-time" | "monthly";
  presetAmounts: number[];
  buttonText: string;
  description: string;
  showBenefits?: boolean;
}

export function SupportForm({
  artistId,
  type,
  presetAmounts,
  buttonText,
  description,
  showBenefits = false,
}: SupportFormProps) {
  const [amount, setAmount] = useState("");

  const handlePresetClick = (presetAmount: number) => {
    setAmount(presetAmount.toString());
  };

  const handleCustomClick = () => {
    setAmount("");
  };

  return (
    <form action={`/api/artists/${artistId}/support`} method="POST" className="space-y-4">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="artistId" value={artistId} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {type === "one-time" ? "Amount (ETB)" : "Monthly Amount (ETB)"}
        </label>
        <div className={`grid ${presetAmounts.length === 5 ? 'grid-cols-3' : 'grid-cols-2'} gap-3 mb-4`}>
          {presetAmounts.map((presetAmount) => (
            <button
              key={presetAmount}
              type="button"
              className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${amount === presetAmount.toString()
                ? "border-purple-500 text-purple-600 bg-purple-50"
                : "border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600"
                }`}
              onClick={() => handlePresetClick(presetAmount)}
            >
              {type === "one-time" ? `ETB ${presetAmount}` : `ETB ${presetAmount}/month`}
            </button>
          ))}
          <button
            type="button"
            className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${amount && !presetAmounts.includes(Number(amount))
              ? "border-purple-500 text-purple-600 bg-purple-50"
              : "border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600"
              }`}
            onClick={handleCustomClick}
          >
            Custom
          </button>
        </div>
        <Input
          name="amount"
          type="number"
          placeholder={`Enter custom ${type === "one-time" ? "amount" : "monthly amount"}`}
          min={type === "one-time" ? "100" : "500"}
          step="100"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {type === "one-time" && (
        <>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <Textarea
              id="message"
              name="message"
              rows={3}
              placeholder="Add an encouraging message for the artist..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="anonymous"
              name="anonymous"
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-600">
              Support anonymously
            </label>
          </div>
        </>
      )}

      {showBenefits && (
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">Patron Benefits</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Exclusive updates on new projects</li>
            <li>• Behind-the-scenes content</li>
            <li>• Early access to new products</li>
            <li>• Special thank you message</li>
          </ul>
        </div>
      )}

      <Button type="submit" className="w-full" variant={type === "monthly" ? "outline" : "default"}>
        {buttonText} {amount ? `ETB ${amount}` : ""}
      </Button>
    </form>
  );
}