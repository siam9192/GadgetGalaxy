const variants = [
  {
    id: "v1",
    colorName: "Blue",
    attributes: [
      { name: "RAM", value: "4GB" },
      { name: "ROM", value: "64GB" },
      {
      name:"Origin",value:"China"
      }
    ],
  },
  {
    id: "v2",
    colorName: "Blue",
    attributes: [
      { name: "RAM", value: "6GB" },
      { name: "ROM", value: "128GB" },
      {
        name:"Origin",value:"Global"
        }
    ],
  },
  {
    id: "v3",
    colorName: "Gray",
    attributes: [
      { name: "RAM", value: "4GB" },
      { name: "ROM", value: "128GB" },

    ],
  },
];

/**
 * Filters available attributes based on selected color.
 * Uses HashMap for O(n) efficiency.
 */
function getAvailableAttributes(color) {
  const filteredVariants = variants.filter(v => v.colorName === color);

  const attributesMap = new Map();

  filteredVariants.forEach(variant => {
    variant.attributes.forEach(attr => {
      if (!attributesMap.has(attr.name)) {
        attributesMap.set(attr.name, new Set());
      }
      attributesMap.get(attr.name).add(attr.value);
    });
  });

  // Convert map to object with arrays
  const availableAttributes = {};
  attributesMap.forEach((values, key) => {
    availableAttributes[key] = Array.from(values);
  });

  return availableAttributes;
}


/**
 * Dynamically filters other attributes when one is selected.
 * Ensures only valid combinations are available.
 */
function filterAttributes(color, selectedAttributeName, selectedAttributeValue) {
  const filteredVariants = variants.filter(
    v =>
      v.colorName === color &&
      v.attributes.some(
        attr => attr.name === selectedAttributeName && attr.value === selectedAttributeValue
      )
  );

  const attributesMap = new Map();

  filteredVariants.forEach(variant => {
    variant.attributes.forEach(attr => {
      if (!attributesMap.has(attr.name)) {
        attributesMap.set(attr.name, new Set());
      }
      attributesMap.get(attr.name).add(attr.value);
    });
  });

  // Convert map to object with arrays
  const updatedAttributes = {};
  attributesMap.forEach((values, key) => {
    updatedAttributes[key] = Array.from(values);
  });

  return updatedAttributes;
}

// Example Usage
console.log("Available Attributes for Blue:", getAvailableAttributes("Gray"));
console.log("After Selecting RAM = 4GB:", filterAttributes("Gray", "ROM", "128GB"));
