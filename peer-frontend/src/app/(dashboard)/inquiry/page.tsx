"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Post, Page } from "@/types";

export default function InquiryPage() {
  const [inquiries, setInquiries] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchInquiries = (p: number) => {
    api.get<Page<Post>>(`/api/posts/inquiries?page=${p}&size=10`).then((data) => {
      setInquiries(data.content);
      setTotalPages(data.totalPages);
    });
  };

  useEffect(() => {
    fetchInquiries(page);
  }, [page]);

  const handleSubmit = async () => {
    if (!title || !content) return;
    await api.post("/api/posts", { title, content, tag: "INQUIRY" });
    setTitle("");
    setContent("");
    setShowForm(false);
    setPage(0);
    fetchInquiries(0);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Inquiry</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ New Inquiry"}
        </button>
      </div>

      <p className="text-gray-400 text-sm mb-6">
        Send a message to the admin team. Only you and admins can see your inquiries.
      </p>

      {showForm && (
        <div className="bg-gray-900 rounded-xl p-6 space-y-4 mb-6">
          <input
            type="text"
            placeholder="Subject"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
          />
          <textarea
            placeholder="Describe your inquiry..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            rows={8}
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      )}

      <div className="space-y-3">
        {inquiries.map((inquiry) => (
          <Link
            key={inquiry.id}
            href={`/community/${inquiry.id}`}
            className="block bg-gray-900 rounded-xl p-5 hover:bg-gray-800 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-1">{inquiry.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-2">{inquiry.content}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
              <span className="text-blue-400">
                {inquiry.likeCount > 0 ? "Replied" : "Pending"}
              </span>
            </div>
          </Link>
        ))}

        {inquiries.length === 0 && !showForm && (
          <div className="text-center text-gray-500 py-12">
            No inquiries yet. Send one to the admin team!
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-3 py-1 rounded ${
                i === page ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
