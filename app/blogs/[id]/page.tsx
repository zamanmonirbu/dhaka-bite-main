import axiosClient from "@/store/api/axiosClient";
import Image from "next/image";

interface BlogDetailProps {
  params: {
    id: string;
  };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { id } = params;

  const res = await axiosClient.get(`/blogs/${id}`);
  const blog = res.data.data;

  const formattedDate = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container-custom py-16">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-500 mb-2">Published on {formattedDate}</p>
      <Image
        src={blog.image || "/placeholder.svg"}
        alt={blog.title}
        width={1000}
        height={500}
        className="rounded-lg object-cover mb-6"
      />
      <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
        {blog.content}
      </p>
    </div>
  );
}
