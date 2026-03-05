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
    explanation: "",
  });
  const [evalTarget, setEvalTarget] = useState<number | null>(null);
  const [evaluations, setEvaluations] = useState<Record<number, Evaluation[]>>({});
  const [evalForm, setEvalForm] = useState<EvaluationRequest>({
    correctness: 3,
    codeReadability: 3,
    commentsClarity: 3,
    conditionSatisfaction: 3,
    feedback: "",
  });
  const [expandedSolutions, setExpandedSolutions] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [editingProblem, setEditingProblem] = useState(false);
  const [editProblemForm, setEditProblemForm] = useState({ title: "", description: "", difficulty: "EASY" });

  useEffect(() => {
    api.get<Problem>(`/api/problems/${id}`).then(setProblem).catch(() => {});
    api.get<Solution[]>(`/api/problems/${id}/solutions`).then(setSolutions).catch(() => {});
  }, [id]);

  const startEditingProblem = () => {
    if (!problem) return;
    setEditProblemForm({ title: problem.title, description: problem.description, difficulty: problem.difficulty });
    setEditingProblem(true);
  };

  const handleEditProblem = async () => {
    if (!editProblemForm.title.trim() || !editProblemForm.description.trim()) return;
    try {
      const updated = await api.put<Problem>(`/api/problems/${id}`, editProblemForm);
      setProblem(updated);
      setEditingProblem(false);
    } catch {
      setError("Failed to update problem.");
    }
  };

  const handleSubmitSolution = async () => {
    if (!solutionForm.code) return;
    setError(null);
    try {
      await api.post(`/api/problems/${id}/solutions`, solutionForm);
      setSolutionForm({ code: "", language: "java", explanation: "" });
      setShowSolutionForm(false);
      api.get<Solution[]>(`/api/problems/${id}/solutions`).then(setSolutions);
    } catch (e) {
      if (e instanceof Error && e.message.includes("DUPLICATE_SOLUTION")) {
        setError("You have already submitted a solution for this problem.");
      } else {
        setError("Failed to submit solution. Please try again.");
      }
    }
  };

  const loadEvaluations = async (solutionId: number) => {
    const evals = await api.get<Evaluation[]>(`/api/solutions/${solutionId}/evaluations`);
    setEvaluations((prev) => ({ ...prev, [solutionId]: evals }));
  };

  const handleSubmitEvaluation = async (solutionId: number) => {
    setError(null);
    try {
      await api.post(`/api/solutions/${solutionId}/evaluations`, evalForm);
      setEvalForm({ correctness: 3, codeReadability: 3, commentsClarity: 3, conditionSatisfaction: 3, feedback: "" });
      setEvalTarget(null);
      loadEvaluations(solutionId);
      api.get<Solution[]>(`/api/problems/${id}/solutions`).then(setSolutions);
    } catch (e) {
      if (e instanceof Error && e.message.includes("DUPLICATE_EVALUATION")) {
        setError("You have already evaluated this solution.");
      } else if (e instanceof Error && e.message.includes("SELF_EVALUATION")) {
        setError("You cannot evaluate your own solution.");
      } else {
        setError("Failed to submit evaluation.");
      }
    }
  };

  const toggleExpand = (solId: number) => {
    setExpandedSolutions((prev) => {
      const next = new Set(prev);
      if (next.has(solId)) next.delete(solId);
      else next.add(solId);
      return next;
    });
  };

  if (!problem) return <div className="text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="bg-gray-900 rounded-xl p-6 mb-6">
        {editingProblem ? (
          <div className="space-y-3">
            <div className="flex gap-3">
              <select
                value={editProblemForm.difficulty}
                onChange={(e) => setEditProblemForm({ ...editProblemForm, difficulty: e.target.value })}
                className="bg-gray-800 text-white rounded-lg px-3 py-2 outline-none"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
              <input
                type="text"
                value={editProblemForm.title}
                onChange={(e) => setEditProblemForm({ ...editProblemForm, title: e.target.value })}
                className="flex-1 bg-gray-800 text-white text-xl font-bold rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <textarea
              value={editProblemForm.description}
              onChange={(e) => setEditProblemForm({ ...editProblemForm, description: e.target.value })}
              className="w-full bg-gray-800 text-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 resize-none font-mono text-sm"
              rows={10}
            />
            <div className="flex gap-2">
              <button onClick={handleEditProblem} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">Save</button>
              <button onClick={() => setEditingProblem(false)} className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <>
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
              {user && user.id === problem.authorId && (
                <button onClick={startEditingProblem} className="text-gray-500 hover:text-blue-400 ml-auto">
                  Edit
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="bg-red-600/20 text-red-400 rounded-lg px-4 py-3 mb-4 text-sm">
          {error}
        </div>
      )}

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
              placeholder="Explanation (optional)"
              value={solutionForm.explanation || ""}
              onChange={(e) =>
                setSolutionForm({ ...solutionForm, explanation: e.target.value })
              }
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSubmitSolution}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Submit
              </button>
              <button
                onClick={() => { setShowSolutionForm(false); setSolutionForm({ code: "", language: "java", explanation: "" }); setError(null); }}
                className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {solutions.map((sol) => {
          const codeLines = sol.code.split("\n").length;
          const isLong = codeLines > 10;
          const isExpanded = expandedSolutions.has(sol.id);

          return (
            <div key={sol.id} className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white">{sol.authorName}</span>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                    {sol.language}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (evaluations[sol.id]) {
                        setEvaluations((prev) => { const next = { ...prev }; delete next[sol.id]; return next; });
                      } else {
                        loadEvaluations(sol.id);
                      }
                    }}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Reviews {evaluations[sol.id] ? "▲" : "▼"}
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
              <div className="relative">
                <pre
                  className={`bg-gray-800 rounded-lg p-4 text-sm text-green-400 font-mono overflow-x-auto ${
                    isLong && !isExpanded ? "max-h-[360px] overflow-hidden" : ""
                  }`}
                >
                  {sol.code}
                </pre>
                {isLong && !isExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-800 to-transparent rounded-b-lg pointer-events-none" />
                )}
                {isLong && (
                  <button
                    onClick={() => toggleExpand(sol.id)}
                    className="w-full mt-1 text-xs text-blue-400 hover:text-blue-300 py-1"
                  >
                    {isExpanded ? "Collapse" : `Show all (${codeLines} lines)`}
                  </button>
                )}
              </div>
              {sol.explanation && (
                <p className="text-gray-400 text-sm mt-2">{sol.explanation}</p>
              )}

              {evalTarget === sol.id && (
                <div className="mt-4 bg-gray-800 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-white mb-3">Peer Evaluation</h4>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {([
                      ["correctness", "Correctness"],
                      ["codeReadability", "Code Readability"],
                      ["commentsClarity", "Comments Clarity"],
                      ["conditionSatisfaction", "Condition Satisfaction"],
                    ] as const).map(([key, label]) => (
                      <div key={key}>
                        <label className="text-xs text-gray-400">{label}</label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={evalForm[key]}
                          onChange={(e) =>
                            setEvalForm({ ...evalForm, [key]: Number(e.target.value) })
                          }
                          className="w-full"
                        />
                        <span className="text-xs text-white">{evalForm[key]}/5</span>
                      </div>
                    ))}
                  </div>
                  <textarea
                    placeholder="Feedback (optional)"
                    value={evalForm.feedback || ""}
                    onChange={(e) => setEvalForm({ ...evalForm, feedback: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleSubmitEvaluation(sol.id)}
                      className="bg-purple-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-purple-700"
                    >
                      Submit Evaluation
                    </button>
                    <button
                      onClick={() => setEvalTarget(null)}
                      className="bg-gray-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {evaluations[sol.id] && evaluations[sol.id].length === 0 && (
                <div className="mt-4 text-sm text-gray-500 italic">
                  No reviews yet — be the first to evaluate!
                </div>
              )}

              {evaluations[sol.id] && evaluations[sol.id].length > 0 && (
                <div className="mt-4 space-y-2">
                  {evaluations[sol.id].map((ev) => (
                    <div key={ev.id} className="bg-gray-800 rounded-lg p-3 text-sm">
                      <div className="flex items-center gap-4 text-gray-300">
                        <span className="font-medium">{ev.evaluatorName}</span>
                        <span className="text-xs text-gray-500">
                          Correctness:{ev.correctness} Readability:{ev.codeReadability} Clarity:{ev.commentsClarity} Condition:{ev.conditionSatisfaction}
                        </span>
                        <span className="text-xs text-blue-400 ml-auto">Avg: {ev.averageScore}</span>
                      </div>
                      {ev.feedback && <p className="text-gray-400 mt-1">{ev.feedback}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
