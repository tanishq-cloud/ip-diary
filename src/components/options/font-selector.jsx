import React from "react";

const FontSelector = ({ font, setFont }) => {
  const fonts = [
    // Standard Fonts
    "Helvetica",
    "Times-Roman",
    "Courier",
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Font Selection</h3>
      <select
        data-testid="font-select"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={font}
        onChange={(e) => setFont(e.target.value)}
      >
        {fonts.map((fontOption, index) => (
          <option key={index} value={fontOption}>
            {fontOption}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontSelector;