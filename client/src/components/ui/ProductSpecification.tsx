import React from "react";

const ProductSpecification = () => {
  const specifications: { name: string; value: string }[] = [
    { name: "Processor", value: "Intel Core i7" },
    { name: "RAM", value: "16GB DDR4" },
    { name: "Storage", value: "512GB SSD" },
    { name: "Graphics Card", value: "NVIDIA RTX 3060" },
    { name: "Display", value: "15.6-inch Full HD" },
    { name: "Battery Life", value: "Up to 10 hours" },
    { name: "Weight", value: "1.8 kg" },
    { name: "Operating System", value: "Windows 11" },
    { name: "Connectivity", value: "Wi-Fi 6, Bluetooth 5.2" },
    { name: "Ports", value: "USB-C, HDMI, 3.5mm Audio" },
  ];

  return (
    <div id="product-specification" className="p-5 bg-white">
      <h1 className="text-2xl  font-primary font-semibold  pb-2 border-b-4 pr-3 border-primary w-fit">
        Specification
      </h1>
      <table className="mt-3">
        <tbody>
          {specifications.map((spec, index) => (
            <tr key={index} className="border border-gray-700/20 w-full">
              <td className="border-r border-gray-700/20  p-5 w-fit font-medium text-gray-800/90">
                {spec.name}
              </td>
              <td className="p-5 w-full">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductSpecification;
