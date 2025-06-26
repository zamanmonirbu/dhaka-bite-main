"use client";

import { useEffect, useState } from "react";
import { Clock, Star, Tag } from "lucide-react";
import axiosClient from "@/store/api/axiosClient";

interface Offer {
  _id: string;
  title: string;
  description: string;
  image: string;
  currentPrice: number;
  oldPrice: number;
  discountPercentage: number;
  expiryDate: string;
  tag: string;
  rating: number;
  badge?: string;
}

export default function OffersGrid() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const offersPerPage = 6;

  const fetchOffers = async (page: number) => {
    try {
      const res = await axiosClient.get(`/offers?page=${page}&limit=${offersPerPage}`);
      setOffers(res.data.data.offers);
      setTotalPages(res.data.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to load offers:", error);
    }
  };

  useEffect(() => {
    fetchOffers(currentPage);
  }, [currentPage]);

  const handleClaimOffer = (offerId: string) => {
    console.log(`Claiming offer ${offerId}`);
  };

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Current Offers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these amazing deals! Limited time offers on your favorite meals.
          </p>
        </div>

        {/* Offers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={offer.image || "/placeholder.svg"}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Discount */}
                <div className="absolute top-4 left-4 bg-secondary text-white px-3 py-1 rounded-full font-bold text-sm">
                  {offer.discountPercentage}% OFF
                </div>

                {/* Popular */}
                {offer.badge === "Popular" && (
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
                    <Star size={14} fill="currentColor" />
                    Popular
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-primary text-sm font-medium bg-primary/10 px-2 py-1 rounded-full">
                    {offer.tag}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    <span className="text-gray-600 text-sm">{offer.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{offer.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{offer.description}</p>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-primary">৳{offer.currentPrice}</span>
                  <span className="text-gray-400 line-through">৳{offer.oldPrice}</span>
                  <span className="text-green-600 text-sm font-medium">
                    Save ৳{offer.oldPrice - offer.currentPrice}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Clock size={16} />
                  <span>Valid until {formatDate(offer.expiryDate)}</span>
                </div>

                <button
                  onClick={() => handleClaimOffer(offer._id)}
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Tag size={18} />
                  Claim Offer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
