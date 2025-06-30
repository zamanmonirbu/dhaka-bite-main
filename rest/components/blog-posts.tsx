"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Calendar } from "lucide-react";
import axiosClient from "@/store/api/axiosClient";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  image: string;
  views: number;
  publishedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalData: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function BlogPosts() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchBlogs = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/blogs?page=${currentPage}&limit=6`);
      setBlogs(res.data.data.blogs || []);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  return (
    <section className="py-16">
      <div className="container-custom">
        {loading ? (
          <p>Loading...</p>
        ) : blogs.length === 0 ? (
          <p>No blog posts found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {blogs.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>

            {pagination && (
              <div className="flex justify-center gap-4 mt-8">
                <button
                  className="px-4 py-2 border rounded disabled:opacity-50"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  className="px-4 py-2 border rounded disabled:opacity-50"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

interface BlogCardProps {
  post: BlogPost;
}

function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
      <Link href={`/blogs/${post._id}`} className="block relative h-56 w-full overflow-hidden">
        <Image
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover hover:scale-105 transition-transform"
        />
      </Link>

      <div className="p-4">
        <div className="flex items-center justify-start gap-4 mb-3 text-gray-500 text-sm">
          <div className="flex items-center">
            <Eye size={16} className="mr-1" />
            <span>{post.views}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <Link href={`/blogs/${post._id}`}>
          <h2 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>

        <Link href={`/blogs/${post._id}`} className="text-primary font-medium hover:underline">
          Read more
        </Link>
      </div>
    </article>
  );
}
