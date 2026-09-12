'use client';

export default function QuantitySelector({ quantity = 1, onQuantityChange, max = 99 }) {
  const handleMinus = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handlePlus = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center bg-gray-bg rounded-pill">
      <button
        type="button"
        onClick={handleMinus}
        disabled={quantity <= 1}
        className={`px-3 sm:px-4 py-3 text-lg sm:text-xl font-medium transition ${
          quantity <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-300 hover:rounded-l-pill'
        }`}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <div className="px-3 sm:px-6 py-3 text-sm sm:text-base font-medium min-w-[40px] sm:min-w-[50px] text-center">
        {quantity}
      </div>
      <button
        type="button"
        onClick={handlePlus}
        disabled={quantity >= max}
        className={`px-3 sm:px-4 py-3 text-lg sm:text-xl font-medium transition ${
          quantity >= max ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-300 hover:rounded-r-pill'
        }`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
