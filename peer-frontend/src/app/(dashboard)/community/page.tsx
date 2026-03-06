"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Post, Page } from "@/types";

const TAG_COLORS: Record<string, string> = {
  ALGORITHM: "bg-purple-600",
  DEVELOPMENT: "bg-blue-600",
  HOBBY: "bg-pink-600",
  IT_NEWS: "bg-cyan-600",
  JOB_INFO: "bg-amber-600",
  LEARNING: "bg-green-600",
  FREE: "bg-gray-600",
  QNA: "bg-orange-600",
};

const TAG_LABELS: Record<string, string> = {
  ALGORITHM: "Algorithm",
  DEVELOPMENT: "Development",
  HOBBY: "Hobby",
  IT_NEWS: "IT News",
  JOB_INFO: "Job Info",
  LEARNING: "Learning",
  FREE: "Free",
  QNA: "Q&A",
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const fetchPosts = (p: number, tag?: string | null) => {
    let url = `/api/posts?page=${p}&size=10`;
    if (tag) url += `&tag=${tag}`;
    api.get<Page<Post>>(url).then((data) => {
      setPosts(data.content);
      setTotalPages(data.totalPages);
    });
  };

  useEffect(() => {
    fetchPosts(page, selectedTag);
  }, [page, selectedTag]);

  const handleTagFilter = (tag: string | null) => {
    setSelectedTag(tag);
    setPage(0);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Community</h1>
        <Link
          href="/community/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Post
        </Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => handleTagFilter(null)}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            !selectedTag ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          All
        </button>
        {Object.keys(TAG_LABELS).map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagFilter(tag)}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              selectedTag === tag
                ? `${TAG_COLORS[tag]} text-white`
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {TAG_LABELS[tag]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/community/${post.id}`}
            className="block bg-gray-900 rounded-xl p-5 hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`text-xs px-2 py-0.5 rounded text-white ${TAG_COLORS[post.tag]}`}
              >
                {TAG_LABELS[post.tag]}
              </span>
              <h3 className="text-lg font-semibold text-white">{post.title}</h3>
            </div>
            <p className="text-gray-400 text-sm line-clamp-2">{post.content}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span>{post.authorName}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>&#9829; {post.likeCount}</span>
              <span>Views {post.viewCount}</span>
            </div>
          </Link>
        ))}

        {posts.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No posts yet. Start the conversation!
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
