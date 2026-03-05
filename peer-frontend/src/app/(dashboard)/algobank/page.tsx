"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Problem, ProblemRequest, Page } from "@/types";

const DIFFICULTY_COLORS = {
  EASY: "bg-green-600",
  MEDIUM: "bg-yellow-600",
  HARD: "bg-red-600",
};

export default function AlgoBankPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProblemRequest>({
    title: "",
    description: "",
    difficulty: "EASY",
    tags: "",
  });

  const fetchProblems = (p: number) => {
    api.get<Page<Problem>>(`/api/problems?page=${p}&size=10`).then((data) => {
      setProblems(data.content);
      setTotalPages(data.totalPages);
    });
  };

  useEffect(() => {
    fetchProblems(page);
  }, [page]);

  const handleCreate = async () => {
    if (!form.title || !form.description) return;
    await api.post("/api/problems", form);
    setForm({ title: "", description: "", difficulty: "EASY", tags: "" });
    setShowForm(false);
    fetchProblems(0);
    setPage(0);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">AlgoBank</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Problem
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Problem title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
            />
            <textarea
              placeholder="Problem description (supports markdown)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              rows={6}
            />
            <div className="flex gap-3">
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={form.tags || ""}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {problems.map((problem) => (
          <Link
            key={problem.id}
            href={`/algobank/${problem.id}`}
            className="block bg-gray-900 rounded-xl p-5 hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-xs px-2 py-1 rounded text-white font-medium ${
                  DIFFICULTY_COLORS[problem.difficulty]
                }`}
              >
                {problem.difficulty}
              </span>
              <h3 className="text-lg font-semibold text-white">{problem.title}</h3>
            </div>
            <p className="text-gray-400 text-sm mt-2 line-clamp-2">{problem.description}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span>by {problem.authorName}</span>
              <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
              {problem.tags && <span>{problem.tags}</span>}
            </div>
          </Link>
        ))}

        {problems.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No problems yet. Be the first to create one!
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
