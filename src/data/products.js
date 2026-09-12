export const products = [
  {
    id: 1,
    name: "Gradient Graphic T-shirt",
    slug: "gradient-graphic-t-shirt",
    category: "t-shirts",
    description: "This gradient graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
    price: 145,
    originalPrice: null,
    discount: null,
    rating: 3.5,
    reviewCount: 45,
    availableColors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000", image: "/images/products/variants/product-1-black.png" },
      { name: "Gray", hex: "#808080", image: "/images/products/variants/product-1-gray.png" },
      { name: "Purple", hex: "#7D06F5", image: "/images/products/variants/product-1-purple.png" }
    ],
    availableSizes: ["Small", "Medium", "Large", "X-Large"],
    stock: 100,
    images: [`/images/products/product-${1}.png`, `/images/products/product-${1}-back.png`, `/images/products/product-${1}-model.png`],
    dressStyle: "Casual"
  },
  {
    id: 2,
    name: "Polo with Tipping Details",
    slug: "polo-with-tipping-details",
    category: "t-shirts",
    description: "A classic polo shirt with tipped collar and cuffs. Comfortable and stylish for casual wear.",
    price: 180,
    originalPrice: null,
    discount: null,
    rating: 4.5,
    reviewCount: 60,
    availableColors: [
      { name: "Red", hex: "#F50606" },
      { name: "Black", hex: "#000000", image: "/images/products/variants/product-2-black.png" },
      { name: "White", hex: "#FFFFFF", image: "/images/products/variants/product-2-white.png" },
      { name: "Green", hex: "#00C12B", image: "/images/products/variants/product-2-green.png" }
    ],
    availableSizes: ["Small", "Medium", "Large", "X-Large"],
    stock: 80,
    images: [`/images/products/product-${2}.png`, `/images/products/product-${2}-back.png`, `/images/products/product-${2}-model.png`],
    dressStyle: "Casual"
  },
  {
    id: 3,
    name: "T-shirt with Tape Details",
    slug: "t-shirt-with-tape-details",
    category: "t-shirts",
    description: "Stay comfortable with this black striped t-shirt with tape details. A great addition to your everyday wardrobe.",
    price: 120,
    originalPrice: 150,
    discount: 30,
    rating: 4.5,
    reviewCount: 75,
    availableColors: [
      { name: "Black/White", hex: "#000000" },
      { name: "Red/White", hex: "#FF3333", image: "/images/products/variants/product-3-red-white.png" },
      { name: "Blue/White", hex: "#063AF5", image: "/images/products/variants/product-3-blue-white.png" },
      { name: "Yellow/White", hex: "#F5DD06", image: "/images/products/variants/product-3-yellow-white.png" }
    ],
    availableSizes: ["Small", "Medium", "Large", "X-Large"],
    stock: 120,
    images: [`/images/products/product-${3}.png`, `/images/products/product-${3}-back.png`, `/images/products/product-${3}-model.png`],
    dressStyle: "Casual"
  },
  {
    id: 4,
    name: "Skinny Fit Jeans",
    slug: "skinny-fit-jeans",
    category: "jeans",
    description: "Classic skinny fit jeans perfect for everyday styling. Made with premium stretch denim.",
    price: 240,
    originalPrice: 260,
    discount: 20,
    rating: 3.5,
    reviewCount: 90,
    availableColors: [
      { name: "Blue", hex: "#0000FF" },
      { name: "Black", hex: "#000000", image: "/images/products/variants/product-4-black.png" },
      { name: "White", hex: "#FFFFFF", image: "/images/products/variants/product-4-white.png" }
    ],
    availableSizes: ["Small", "Medium", "Large", "X-Large"],
    stock: 50,
    images: [`/images/products/product-${4}.png`, `/images/products/product-${4}-back.png`, `/images/products/product-${4}-model.png`],
    dressStyle: "Casual"
  },
  {
    id: 5,
    name: "Checkered Shirt",
    slug: "checkered-shirt",
    category: "shirts",
    description: "A bold checkered shirt that brings a pop of pattern to your outfit. Tailored fit.",
    price: 180,
    originalPrice: null,
    discount: null,
    rating: 4.5,
    reviewCount: 35,
    availableColors: [
      { name: "Red/Blue", hex: "#FF3333" },
      { name: "Blue/White", hex: "#0000FF", image: "/images/products/variants/product-5-blue-white.png" },
      { name: "Green/Blue", hex: "#01AB31", image: "/images/products/variants/product-5-green-white.png" },
      { name: "Yellow/Black", hex: "#F5DD06", image: "/images/products/variants/product-5-yellow-black.png" }
    ],
    availableSizes: ["Small", "Medium", "Large", "X-Large"],
    stock: 60,
    images: [`/images/products/product-${5}.png`, `/images/products/product-${5}-back.png`, `/images/products/product-${5}-model.png`],
    dressStyle: "Casual"
  },
  {
    id: 6,
    name: "Sleeve Striped T-shirt",
    slug: "sleeve-striped-t-shirt",
    category: "t-shirts",
    description: "Simple yet stylish sleeve striped t-shirt. Breathable cotton for maximum comfort.",
    price: 130,
    originalPrice: 160,
    discount: 30,
    rating: 4.5,
    reviewCount: 50,
    availableColors: [
      { name: "Orange", hex: "#FFA500" },
      { name: "Black", hex: "#000000", image: "/images/products/variants/product-6-black.png" },
      { name: "White", hex: "#FFFFFF", image: "/images/products/variants/product-6-white.png" },
      { name: "Pink", hex: "#F506A4", image: "/images/products/variants/product-6-pink.png" }
    ],
    availableSizes: ["Small", "Medium", "Large", "X-Large"],
    stock: 90,
    images: [`/images/products/product-${6}.png`, `/images/products/product-${6}-back.png`, `/images/products/product-${6}-model.png`],
    dressStyle: "Casual"
  },
  {
    id: 7,
    name: "Vertical Striped Shirt",
    slug: "vertical-striped-shirt",
    category: "shirts",
    description: "Elevate your look with this vertical striped shirt. Perfect for formal and casual settings.",
    price: 212,
    originalPrice: 232,
    discount: 20,
    rating: 5.0,
    reviewCount: 120,
    availableColors: [
      { name: "Green", hex: "#01AB31" },
      { name: "Blue", hex: "#0000FF", image: "/images/products/variants/product-7-blue.png" },
      { name: "Black", hex: "#000000", image: "/images/products/variants/product-7-black.png" },
      { name: "Purple", hex: "#7D06F5", image: "/images/products/variants/product-7-purple.png" }
    ],
    availableSizes: ["Small", "Medium", "Large", "X-Large"],
    stock: 75,
    images: [`/images/products/product-${7}.png`, `/images/products/product-${7}-back.png`, `/images/products/product-${7}-model.png`],
    dressStyle: "Formal"
  },
  {
    id: 8,
    name: "Courage Graphic T-shirt",
    slug: "courage-graphic-t-shirt",
    category: "t-shirts",
    description: "Show your brave side with this courage graphic t-shirt. Soft cotton feel.",
    price: 145,
    originalPrice: null,
    discount: null,
    rating: 4.0,
    reviewCount: 40,
    availableColors: [
      { name: "Orange", hex: "#F57906" },
      { name: "Black", hex: "#000000", image: "/images/products/variants/product-8-black.png" },
      { name: "White", hex: "#FFFFFF", image: "/images/products/variants/product-8-white.png" },
      { name: "Red", hex: "#F50606", image: "/images/products/variants/product-8-red.png" }
    ],
    availableSizes: ["Small", "Medium", "Large", "X-Large"],
    stock: 110,
    images: [`/images/products/product-${8}.png`, `/images/products/product-${8}-back.png`, `/images/products/product-${8}-model.png`],
    dressStyle: "Casual"
  },
  {
    id: 9,
    name: "Loose Fit Bermuda Shorts",
    slug: "loose-fit-bermuda-shorts",
    category: "shorts",
    description: "Relaxed loose fit bermuda shorts for those warm days. Comfortable and airy.",
    price: 80,
    originalPrice: null,
    discount: null,
    rating: 3.0,
    reviewCount: 20,
    availableColors: [
      { name: "Blue", hex: "#0000FF" },
      { name: "Black", hex: "#000000", image: "/images/products/variants/product-9-black.png" },
      { name: "White", hex: "#FFFFFF", image: "/images/products/variants/product-9-white.png" }
    ],
    availableSizes: ["Small", "Medium", "Large", "X-Large"],
    stock: 150,
    images: [`/images/products/product-${9}.png`, `/images/products/product-${9}-back.png`, `/images/products/product-${9}-model.png`],
    dressStyle: "Casual"
  },
  {
    id: 10,
    name: "One Life Graphic T-shirt",
    slug: "one-life-graphic-t-shirt",
    category: "t-shirts",
    description: "A trendy 'One Life' graphic t-shirt that brings a cool vibe to your everyday wear.",
    price: 260,
    originalPrice: 300,
    discount: 40,
    rating: 4.5,
    reviewCount: 65,
    availableColors: [
      { name: "Green", hex: "#00C12B" },
      { name: "Black", hex: "#000000", image: "/images/products/variants/product-10-black.png" },
      { name: "White", hex: "#FFFFFF", image: "/images/products/variants/product-10-white.png" },
      { name: "Yellow", hex: "#F5DD06", image: "/images/products/variants/product-10-yellow.png" }
    ],
    availableSizes: ["Small", "Medium", "Large", "X-Large"],
    stock: 45,
    images: [`/images/products/product-${10}.png`, `/images/products/product-${10}-back.png`, `/images/products/product-${10}-model.png`],
    dressStyle: "Casual"
  },
  {
    id: 11,
    name: "Polo with Contrast Trims",
    slug: "polo-with-contrast-trims",
    category: "t-shirts",
    description: "Upgrade your polo game with contrast trims. Perfect for a smart-casual appearance.",
    price: 212,
    originalPrice: 242,
    discount: 20,
    rating: 4.0,
    reviewCount: 80,
    availableColors: [
      { name: "Navy", hex: "#000080" },
      { name: "Black", hex: "#000000", image: "/images/products/variants/product-11-black.png" },
      { name: "White", hex: "#FFFFFF", image: "/images/products/variants/product-11-white.png" },
      { name: "Pink", hex: "#F506A4", image: "/images/products/variants/product-11-pink.png" }
    ],
    availableSizes: ["Small", "Medium", "Large", "X-Large"],
    stock: 85,
    images: [`/images/products/product-${11}.png`, `/images/products/product-${11}-back.png`, `/images/products/product-${11}-model.png`],
    dressStyle: "Casual"
  },
  {
    id: 12,
    name: "Faded Skinny Jeans",
    slug: "faded-skinny-jeans",
    category: "jeans",
    description: "Rock the worn-in look with these faded skinny jeans. Made for durability and flex.",
    price: 210,
    originalPrice: null,
    discount: null,
    rating: 4.5,
    reviewCount: 110,
    availableColors: [
      { name: "Blue", hex: "#063AF5" },
      { name: "Black", hex: "#000000", image: "/images/products/variants/product-12-black.png" },
      { name: "White", hex: "#FFFFFF", image: "/images/products/variants/product-12-white.png" }
    ],
    availableSizes: ["Small", "Medium", "Large", "X-Large"],
    stock: 65,
    images: [`/images/products/product-${12}.png`, `/images/products/product-${12}-back.png`, `/images/products/product-${12}-model.png`],
    dressStyle: "Casual"
  }
];

export const getProductById = (id) => products.find((product) => product.id === parseInt(id, 10));
export const getProductBySlug = (slug) => products.find((product) => product.slug === slug);
export const getProductsByCategory = (category) => products.filter((product) => product.category === category);
