"use client";

import { useState } from "react";

interface DebugDataProps {
  data: any;
  title?: string;
}

export default function DebugData({
  data,
  title = "Debug Data",
}: DebugDataProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-4 p-3 bg-gray-100 rounded-md">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        <button
          className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Hide" : "Show"}
        </button>
      </div>

      {isOpen && (
        <pre className="mt-2 p-2 bg-gray-800 text-green-400 rounded text-xs overflow-auto max-h-96">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
