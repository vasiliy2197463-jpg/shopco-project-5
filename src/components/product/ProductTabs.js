'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ReviewCard from '@/components/cards/ReviewCard';
import Button from '@/components/common/Button';
import { IoFilter, IoChevronDown } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function ProductTabs({ product, reviews = [], onSummaryChange }) {
  const [activeTab, setActiveTab] = useState('Product Details');
  const [liveReviews, setLiveReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const { user, profile } = useAuth();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const loadReviews = async () => {
    if (!supabase || !product?.id) return;
    const { data } = await supabase.from('product_reviews').select('*').eq('product_id', product.id).order('created_at', { ascending: false });
    if (data) setLiveReviews(data.map((item) => ({ id: item.id, author: item.author_name || 'SHOP.CO customer', rating: item.rating, verified: true, date: new Date(item.created_at).toLocaleDateString(), content: item.comment, userId: item.user_id })));
  };

  useEffect(() => { loadReviews(); }, [product?.id, supabase]);

  const displayedReviews = liveReviews.length ? liveReviews : reviews;
  const averageRating = liveReviews.length ? liveReviews.reduce((sum, item) => sum + item.rating, 0) / liveReviews.length : product?.rating || 0;

  useEffect(() => {
    onSummaryChange?.({ rating: averageRating, count: displayedReviews.length });
  }, [averageRating, displayedReviews.length, onSummaryChange]);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!user || !supabase || !rating || !comment.trim()) return;
    setSaving(true);
    const authorName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'SHOP.CO customer';
    const { error } = await supabase.from('product_reviews').upsert({ product_id: product.id, user_id: user.id, author_name: authorName, rating, comment: comment.trim() }, { onConflict: 'product_id,user_id' });
    setSaving(false);
    if (error) { setNotice(`Error: ${error.message}`); return; }
    setNotice('Your review has been published.');
    setComment('');
    setRating(0);
    setShowForm(false);
    await loadReviews();
  };

  const tabs = ['Product Details', 'Rating & Reviews', 'FAQs'];

  return (
    <div className="w-full">
      {/* Tab Bar */}
      <div className="flex border-b border-border overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-base font-medium cursor-pointer transition-colors whitespace-nowrap flex-1 -mb-[1px] ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="pt-8">
        {activeTab === 'Product Details' && (
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>{product?.description || 'This is a premium product built for comfort and style. Ideal for daily wear. Made with high-quality materials to ensure longevity and maximum satisfaction.'}</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Premium quality materials</li>
              <li>Comfortable fit for all-day wear</li>
              <li>Durable and long-lasting</li>
              <li>Machine washable</li>
            </ul>
          </div>
        )}

        {activeTab === 'Rating & Reviews' && (
          <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                All Reviews <span className="text-sm font-normal text-gray-500">({displayedReviews.length})</span>
              </h3>
              <div className="flex items-center gap-3">
                <button className="w-12 h-12 rounded-full bg-gray-bg flex items-center justify-center hover:bg-gray-300 transition" aria-label="Filter reviews">
                  <IoFilter size={20} />
                </button>
                <div className="hidden md:flex items-center gap-2 bg-gray-bg px-4 py-3 rounded-pill cursor-pointer hover:bg-gray-300 transition">
                  <span className="font-medium text-sm">Latest</span>
                  <IoChevronDown size={16} />
                </div>
                <Button variant="primary" onClick={() => setShowForm((value) => !value)} className="text-sm px-6 py-3">Write a Review</Button>
              </div>
            </div>

            {notice && <div className="mb-5 rounded-2xl bg-[#d7ff5f] px-5 py-3 font-medium">{notice}</div>}
            {showForm && (user ? <form onSubmit={submitReview} className="mb-7 rounded-3xl border border-black/10 p-5 md:p-7">
              <h4 className="text-xl font-bold">Rate this product</h4>
              <div className="mt-4 flex gap-2">{[1,2,3,4,5].map((value) => <button key={value} type="button" onClick={() => setRating(value)} className={`text-3xl transition-transform hover:scale-110 ${value <= rating ? 'text-[#FFC633]' : 'text-black/15'}`} aria-label={`${value} stars`}><FaStar /></button>)}</div>
              <textarea required value={comment} onChange={(event) => setComment(event.target.value)} rows="4" placeholder="Write your comment..." className="mt-5 w-full resize-none rounded-2xl bg-[#f2f2f2] p-4 outline-none focus:ring-2 focus:ring-black" />
              <button disabled={!rating || saving} className="mt-4 rounded-full bg-black px-7 py-3 font-semibold text-white disabled:opacity-40">{saving ? 'Publishing...' : 'Publish review'}</button>
            </form> : <div className="mb-7 rounded-3xl border border-black/10 p-6"><p className="font-medium">Sign in to rate this product and write a comment.</p><Link href="/signup" className="mt-4 inline-block rounded-full bg-black px-6 py-3 font-semibold text-white">Sign in</Link></div>)}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {displayedReviews.map((review, idx) => (
                <ReviewCard key={review.id || idx} review={review} />
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center">
              <Button variant="outline" className="w-full md:w-auto px-8 py-3">
                Load More Reviews
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'FAQs' && (
          <div className="space-y-6">
            <div className="border border-border rounded-xl p-5">
              <h4 className="font-bold mb-2">What is the return policy?</h4>
              <p className="text-gray-600">You can return any unworn items within 30 days of delivery for a full refund.</p>
            </div>
            <div className="border border-border rounded-xl p-5">
              <h4 className="font-bold mb-2">How do I track my order?</h4>
              <p className="text-gray-600">Once your order ships, you will receive a tracking link via email.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
