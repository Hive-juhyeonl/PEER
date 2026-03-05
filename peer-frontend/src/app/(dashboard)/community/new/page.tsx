"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Post, PostRequest } from "@/types";

export default function NewPostPage() {
  const router = useRouter();
  const [form, setForm] = useState<PostRequest>({
    title: "",
    content: "",
    tag: "FREE",
  });

  const handleSubmit = async () => {
    if (!form.title || !form.content) return;
    const post = await api.post<Post>("/api/posts", form);
    router.push(`/community/${post.id}`);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-6">New Post</h1>

      <div className="bg-gray-900 rounded-xl p-6 space-y-4">
        <select
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
          className="bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
        >
          <option value="FREE">Free</option>
          <option value="ALGORITHM">Algorithm</option>
          <option value="DEVELOPMENT">Development</option>
          <option value="HOBBY">Hobby</option>
          <option value="IT_NEWS">IT News</option>
          <option value="JOB_INFO">Job Info</option>
          <option value="LEARNING">Learning</option>
          <option value="QNA">Q&A</option>
        </select>

        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 text-lg"
        />

        <textarea
          placeholder="Write your post content..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 resize-none"
          rows={15}
        />

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Publish
          </button>
          <button
            onClick={() => router.back()}
            className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
