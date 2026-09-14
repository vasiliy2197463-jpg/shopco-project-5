'use client';

import Image from '@/components/common/BaseImage';
import { IoTrashOutline } from 'react-icons/io5';
import { useCart } from '@/context/CartContext';

export default function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  return (
    <div className="flex flex-row gap-4 py-5 border-b border-border last:border-b-0 last:pb-0 first:pt-0">
      <div className="relative w-[100px] h-[100px] md:w-[124px] md:h-[124px] rounded-[12px] bg-gray-bg overflow-hidden shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-base md:text-lg text-primary">{item.name}</h3>
            <button
              onClick={() => removeFromCart(item.id, item.size, item.color)}
              className="text-red-discount hover:opacity-70 transition-opacity p-1"
              aria-label="Remove item"
            >
              <IoTrashOutline size={20} />
            </button>
          </div>
          {item.size && (
            <p className="text-sm text-gray-600">Size: <span className="text-primary">{item.size}</span></p>
          )}
          {item.color && (
            <p className="text-sm text-gray-600 mt-1">Color: <span className="text-primary">{item.color}</span></p>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <p className="font-bold text-xl md:text-2xl text-primary">${item.price}</p>
          <div className="bg-gray-bg rounded-pill flex items-center">
            <button
              onClick={() => decreaseQuantity(item.id, item.size, item.color)}
              className="px-3 py-1.5 text-base hover:opacity-70 text-primary"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-3 text-sm font-medium text-primary">{item.quantity}</span>
            <button
              onClick={() => increaseQuantity(item.id, item.size, item.color)}
              className="px-3 py-1.5 text-base hover:opacity-70 text-primary"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
