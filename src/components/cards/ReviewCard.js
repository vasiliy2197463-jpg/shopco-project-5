import { IoCheckmarkCircle } from 'react-icons/io5';
import RatingStars from '@/components/common/RatingStars';

export default function ReviewCard({ review }) {
  return (
    <div className="border border-border rounded-[20px] p-6 md:p-8 bg-white h-full flex flex-col">
      <div className="mb-4">
        <RatingStars rating={review.rating} />
      </div>
      <div className="flex items-center gap-1 mb-3">
        <span className="font-bold text-base md:text-lg">{review.author}</span>
        {review.verified && (
          <IoCheckmarkCircle className="text-green-verified text-xl" />
        )}
      </div>
      <p className="text-gray-600 text-sm md:text-base mb-4 flex-grow">
        "{review.text || review.content}"
      </p>
      <p className="text-gray-500 text-sm mt-auto">
        Posted on {review.date}
      </p>
    </div>
  );
}
