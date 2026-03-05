"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Problem, Solution, SolutionRequest, Evaluation, EvaluationRequest } from "@/types";

const DIFFICULTY_COLORS = {
  EASY: "bg-green-600",
  MEDIUM: "bg-yellow-600",
  HARD: "bg-red-600",
};

export default function ProblemDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [solutionForm, setSolutionForm] = useState<SolutionRequest>({
    code: "",
    language: "java",
    description: "",
  });
  const [evalTarget, setEvalTarget] = useState<number | null>(null);
  const [evaluations, setEvaluations] = useState<Record<number, Evaluation[]>>({});
  const [evalForm, setEvalForm] = useState<EvaluationRequest>({
    readability: 3,
    efficiency: 3,
    correctness: 3,
    style: 3,
    comment: "",
  });

  useEffect(() => {
    api.get<Problem>(`/api/problems/${id}`).then(setProblem);
    api.get<Solution[]>(`/api/problems/${id}/solutions`).then(setSolutions);
  }, [id]);

  const handleSubmitSolution = async () => {
    if (!solutionForm.code) return;
    await api.post(`/api/problems/${id}/solutions`, solutionForm);
    setSolutionForm({ code: "", language: "java", description: "" });
    setShowSolutionForm(false);
    api.get<Solution[]>(`/api/problems/${id}/solutions`).then(setSolutions);
  };

  const loadEvaluations = async (solutionId: number) => {
    const evals = await api.get<Evaluation[]>(`/api/solutions/${solutionId}/evaluations`);
    setEvaluations((prev) => ({ ...prev, [solutionId]: evals }));
  };

  const handleSubmitEvaluation = async (solutionId: number) => {
    await api.post(`/api/solutions/${solutionId}/evaluations`, evalForm);
    setEvalForm({ readability: 3, efficiency: 3, correctness: 3, style: 3, comment: "" });
    setEvalTarget(null);
    loadEvaluations(solutionId);
    api.get<Solution[]>(`/api/problems/${id}/solutions`).then(setSolutions);
  };

  if (!problem) return <div className="text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="bg-gray-900 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span
            className={`text-xs px-2 py-1 rounded text-white font-medium ${
              DIFFICULTY_COLORS[problem.difficulty]
            }`}
          >
            {problem.difficulty}
          </span>
          <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
        </div>
        <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
          {problem.description}
        </pre>
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <span>by {problem.authorName}</span>
          <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">
          Solutions ({solutions.length})
        </h2>
        <button
          onClick={() => setShowSolutionForm(!showSolutionForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + Submit Solution
        </button>
      </div>

      {showSolutionForm && (
        <div className="bg-gray-900 rounded-xl p-6 mb-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <select
                value={solutionForm.language}
                onChange={(e) =>
                  setSolutionForm({ ...solutionForm, language: e.target.value })
                }
                className="bg-gray-800 text-white rounded-lg px-3 py-2 outline-none"
              >
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
            <textarea
              placeholder="Paste your code here..."
              value={solutionForm.code}
              onChange={(e) => setSolutionForm({ ...solutionForm, code: e.target.value })}
              className="w-full bg-gray-800 text-green-400 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 resize-none font-mono text-sm"
              rows={12}
            />
            <textarea
              placeholder="Description (optional)"
              value={solutionForm.description || ""}
              onChange={(e) =>
                setSolutionForm({ ...solutionForm, description: e.target.value })
              }
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none resize-none"
              rows={2}
            />
            <button
              onClick={handleSubmitSolution}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {solutions.map((sol) => (
          <div key={sol.id} className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-white">{sol.authorName}</span>
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                  {sol.language}
                </span>
                {sol.averageScore !== null && (
                  <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-0.5 rounded">
                    Score: {sol.averageScore.toFixed(1)}/5.0
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => loadEvaluations(sol.id)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Reviews
                </button>
                {user && user.id !== sol.authorId && (
                  <button
                    onClick={() => setEvalTarget(evalTarget === sol.id ? null : sol.id)}
                    className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                  >
                    Evaluate
                  </button>
                )}
              </div>
            </div>
            <pre className="bg-gray-800 rounded-lg p-4 text-sm text-green-400 font-mono overflow-x-auto">
              {sol.code}
            </pre>
            {sol.description && (
              <p className="text-gray-400 text-sm mt-2">{sol.description}</p>
            )}

            {evalTarget === sol.id && (
              <div className="mt-4 bg-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-3">Peer Evaluation</h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {(["readability", "efficiency", "correctness", "style"] as const).map(
                    (criteria) => (
                      <div key={criteria}>
                        <label className="text-xs text-gray-400 capitalize">{criteria}</label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={evalForm[criteria]}
                          onChange={(e) =>
                            setEvalForm({ ...evalForm, [criteria]: Number(e.target.value) })
                          }
                          className="w-full"
                        />
                        <span className="text-xs text-white">{evalForm[criteria]}/5</span>
                      </div>
                    )
                  )}
                </div>
                <textarea
                  placeholder="Comment (optional)"
                  value={evalForm.comment || ""}
                  onChange={(e) => setEvalForm({ ...evalForm, comment: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  rows={2}
                />
                <button
                  onClick={() => handleSubmitEvaluation(sol.id)}
                  className="mt-2 bg-purple-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-purple-700"
                >
                  Submit Evaluation
                </button>
              </div>
            )}

            {evaluations[sol.id] && evaluations[sol.id].length > 0 && (
              <div className="mt-4 space-y-2">
                {evaluations[sol.id].map((ev) => (
                  <div key={ev.id} className="bg-gray-800 rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-4 text-gray-300">
                      <span className="font-medium">{ev.evaluatorName}</span>
                      <span className="text-xs text-gray-500">
                        R:{ev.readability} E:{ev.efficiency} C:{ev.correctness} S:{ev.style}
                      </span>
                    </div>
                    {ev.comment && <p className="text-gray-400 mt-1">{ev.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
