"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { User, Post, Comment, Page } from "@/types";

type Tab = "users" | "inquiries" | "reported" | "blinded";
type InquiryFilter = "open" | "resolved" | "all";

interface ReportItem {
  id: number;
  reporterName: string;
  reason: string;
  createdAt: string;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [reportedPosts, setReportedPosts] = useState<Post[]>([]);
  const [blindedPosts, setBlindedPosts] = useState<Post[]>([]);
  const [userPage, setUserPage] = useState(0);
  const [userTotalPages, setUserTotalPages] = useState(0);
  const [reportedPage, setReportedPage] = useState(0);
  const [reportedTotalPages, setReportedTotalPages] = useState(0);
  const [blindedPage, setBlindedPage] = useState(0);
  const [blindedTotalPages, setBlindedTotalPages] = useState(0);
  const [inquiries, setInquiries] = useState<Post[]>([]);
  const [inquiryPage, setInquiryPage] = useState(0);
  const [inquiryTotalPages, setInquiryTotalPages] = useState(0);
  const [inquiryFilter, setInquiryFilter] = useState<InquiryFilter>("open");

  // Modal state
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalType, setModalType] = useState<"inquiry" | "reported" | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyText, setReplyText] = useState("");
  const [reports, setReports] = useState<ReportItem[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.replace("/scheduler");
    }
  }, [user, loading, router]);

  const fetchUsers = (p: number) => {
    api.get<Page<User>>(`/api/admin/users?page=${p}&size=20`).then((data) => {
      setUsers(data.content);
      setUserTotalPages(data.totalPages);
    });
  };

  const fetchReported = (p: number) => {
    api.get<Page<Post>>(`/api/admin/posts/reported?page=${p}&size=20`).then((data) => {
      setReportedPosts(data.content);
      setReportedTotalPages(data.totalPages);
    });
  };

  const fetchInquiries = (p: number, filter: InquiryFilter = inquiryFilter) => {
    const resolvedParam = filter === "open" ? "&resolved=false" : filter === "resolved" ? "&resolved=true" : "";
    api.get<Page<Post>>(`/api/admin/posts/inquiries?page=${p}&size=20${resolvedParam}`).then((data) => {
      setInquiries(data.content);
      setInquiryTotalPages(data.totalPages);
    });
  };

  const fetchBlinded = (p: number) => {
    api.get<Page<Post>>(`/api/admin/posts/blinded?page=${p}&size=20`).then((data) => {
      setBlindedPosts(data.content);
      setBlindedTotalPages(data.totalPages);
    });
  };

  useEffect(() => {
    if (user?.role === "ADMIN") fetchUsers(userPage);
  }, [userPage, user]);

  useEffect(() => {
    if (user?.role === "ADMIN") fetchReported(reportedPage);
  }, [reportedPage, user]);

  useEffect(() => {
    if (user?.role === "ADMIN") fetchInquiries(inquiryPage, inquiryFilter);
  }, [inquiryPage, inquiryFilter, user]);

  useEffect(() => {
    if (user?.role === "ADMIN") fetchBlinded(blindedPage);
  }, [blindedPage, user]);

  const handlePromote = async (userId: number) => {
    await api.patch(`/api/admin/users/${userId}/promote`);
    fetchUsers(userPage);
  };

  const handleDemote = async (userId: number) => {
    await api.patch(`/api/admin/users/${userId}/demote`);
    fetchUsers(userPage);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user? All their data will be permanently removed.")) return;
    await api.delete(`/api/admin/users/${userId}`);
    fetchUsers(userPage);
  };

  const handleUnblind = async (postId: number) => {
    await api.patch(`/api/admin/posts/${postId}/unblind`);
    fetchReported(reportedPage);
    fetchBlinded(blindedPage);
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await api.delete(`/api/admin/posts/${postId}`);
    fetchReported(reportedPage);
    fetchBlinded(blindedPage);
    fetchInquiries(inquiryPage);
    closeModal();
  };

  const handleResolve = async (postId: number) => {
    await api.patch(`/api/admin/posts/${postId}/resolve`);
    fetchInquiries(inquiryPage);
    if (selectedPost) {
      setSelectedPost({ ...selectedPost, resolved: true });
    }
  };

  const handleUnresolve = async (postId: number) => {
    await api.patch(`/api/admin/posts/${postId}/unresolve`);
    fetchInquiries(inquiryPage);
    if (selectedPost) {
      setSelectedPost({ ...selectedPost, resolved: false });
    }
  };

  const openInquiryModal = async (post: Post) => {
    setSelectedPost(post);
    setModalType("inquiry");
    setReplyText("");
    const data = await api.get<Comment[]>(`/api/posts/${post.id}/comments`);
    setComments(data);
  };

  const openReportedModal = async (post: Post) => {
    setSelectedPost(post);
    setModalType("reported");
    const data = await api.get<ReportItem[]>(`/api/admin/posts/${post.id}/reports`);
    setReports(data);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setModalType(null);
    setComments([]);
    setReports([]);
    setReplyText("");
  };

  const handleReply = async () => {
    if (!selectedPost || !replyText.trim()) return;
    await api.post(`/api/posts/${selectedPost.id}/comments`, { content: replyText });
    setReplyText("");
    const data = await api.get<Comment[]>(`/api/posts/${selectedPost.id}/comments`);
    setComments(data);
  };

  if (loading || !user || user.role !== "ADMIN") {
    return null;
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "users", label: "Users" },
    { key: "inquiries", label: "Inquiries" },
    { key: "reported", label: "Reported Posts" },
    { key: "blinded", label: "Blinded Posts" },
  ];

  const inquiryFilters: { key: InquiryFilter; label: string }[] = [
    { key: "open", label: "Open" },
    { key: "resolved", label: "Resolved" },
    { key: "all", label: "All" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div>
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-xs text-gray-400 font-medium">ID</th>
                  <th className="px-4 py-3 text-xs text-gray-400 font-medium">Name</th>
                  <th className="px-4 py-3 text-xs text-gray-400 font-medium">Email</th>
                  <th className="px-4 py-3 text-xs text-gray-400 font-medium">Role</th>
                  <th className="px-4 py-3 text-xs text-gray-400 font-medium">Level</th>
                  <th className="px-4 py-3 text-xs text-gray-400 font-medium">Joined</th>
                  <th className="px-4 py-3 text-xs text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm text-gray-300">{u.id}</td>
                    <td className="px-4 py-3 text-sm text-white">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          u.role === "ADMIN"
                            ? "bg-red-600/20 text-red-400"
                            : "bg-blue-600/20 text-blue-400"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">Lv.{u.level}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {u.id !== user.id && (
                        <div className="flex gap-2">
                          {u.role === "USER" ? (
                            <button
                              onClick={() => handlePromote(u.id)}
                              className="text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded hover:bg-red-600/30"
                            >
                              Promote
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDemote(u.id)}
                              className="text-xs bg-gray-600/20 text-gray-400 px-2 py-1 rounded hover:bg-gray-600/30"
                            >
                              Demote
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded hover:bg-red-600/30"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={userPage} totalPages={userTotalPages} onPageChange={setUserPage} />
        </div>
      )}

      {tab === "inquiries" && (
        <div>
          <div className="flex gap-2 mb-4">
            {inquiryFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => { setInquiryFilter(f.key); setInquiryPage(0); }}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  inquiryFilter === f.key
                    ? "bg-blue-600/30 text-blue-400"
                    : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {inquiries.map((post) => (
              <div
                key={post.id}
                onClick={() => openInquiryModal(post)}
                className="bg-gray-900 rounded-xl p-5 cursor-pointer hover:bg-gray-800/80 transition-colors"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-600/20 text-blue-400">
                    {post.authorName}
                  </span>
                  <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                  {post.resolved && (
                    <span className="text-xs px-2 py-0.5 rounded bg-green-600/20 text-green-400">
                      Resolved
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm line-clamp-2">{post.content}</p>
                <div className="text-xs text-gray-500 mt-3">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            {inquiries.length === 0 && (
              <div className="text-center text-gray-500 py-12">No inquiries.</div>
            )}
          </div>
          <Pagination page={inquiryPage} totalPages={inquiryTotalPages} onPageChange={setInquiryPage} />
        </div>
      )}

      {tab === "reported" && (
        <div>
          <div className="space-y-3">
            {reportedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onUnblind={handleUnblind}
                onDelete={handleDelete}
                onClick={() => openReportedModal(post)}
                showReportCount
              />
            ))}
            {reportedPosts.length === 0 && (
              <div className="text-center text-gray-500 py-12">No reported posts.</div>
            )}
          </div>
          <Pagination page={reportedPage} totalPages={reportedTotalPages} onPageChange={setReportedPage} />
        </div>
      )}

      {tab === "blinded" && (
        <div>
          <div className="space-y-3">
            {blindedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onUnblind={handleUnblind}
                onDelete={handleDelete}
              />
            ))}
            {blindedPosts.length === 0 && (
              <div className="text-center text-gray-500 py-12">No blinded posts.</div>
            )}
          </div>
          <Pagination page={blindedPage} totalPages={blindedTotalPages} onPageChange={setBlindedPage} />
        </div>
      )}

      {/* Modal */}
      {selectedPost && modalType && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-600/20 text-blue-400">
                      {selectedPost.authorName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(selectedPost.createdAt).toLocaleString()}
                    </span>
                    {modalType === "inquiry" && selectedPost.resolved && (
                      <span className="text-xs px-2 py-0.5 rounded bg-green-600/20 text-green-400">
                        Resolved
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedPost.title}</h2>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white ml-4 text-2xl leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Content */}
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{selectedPost.content}</p>
              </div>

              {/* Inquiry: Comments & Reply */}
              {modalType === "inquiry" && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">
                    Replies ({comments.length})
                  </h3>
                  {comments.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {comments.map((c) => (
                        <div key={c.id} className="bg-gray-800/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-blue-400">{c.authorName}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(c.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm mb-4">No replies yet.</p>
                  )}
                  <div className="flex gap-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={2}
                    />
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim()}
                      className="self-end bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}

              {/* Reported: Report Reasons */}
              {modalType === "reported" && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-400">
                      Report Reasons ({reports.length})
                    </h3>
                    <div className="flex gap-2">
                      {selectedPost.blinded && (
                        <button
                          onClick={() => {
                            handleUnblind(selectedPost.id);
                            closeModal();
                          }}
                          className="text-xs bg-green-600/20 text-green-400 px-3 py-1.5 rounded hover:bg-green-600/30"
                        >
                          Unblind
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(selectedPost.id)}
                        className="text-xs bg-red-600/20 text-red-400 px-3 py-1.5 rounded hover:bg-red-600/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {reports.length > 0 ? (
                    <div className="space-y-2">
                      {reports.map((r) => (
                        <div key={r.id} className="bg-gray-800/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-red-400">{r.reporterName}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(r.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">{r.reason}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No report details available.</p>
                  )}
                </div>
              )}

              {/* Footer actions for inquiries */}
              {modalType === "inquiry" && (
                <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between">
                  <div>
                    {selectedPost.resolved ? (
                      <button
                        onClick={() => handleUnresolve(selectedPost.id)}
                        className="text-xs bg-yellow-600/20 text-yellow-400 px-3 py-1.5 rounded hover:bg-yellow-600/30"
                      >
                        Reopen
                      </button>
                    ) : (
                      <button
                        onClick={() => handleResolve(selectedPost.id)}
                        className="text-xs bg-green-600/20 text-green-400 px-3 py-1.5 rounded hover:bg-green-600/30"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(selectedPost.id)}
                    className="text-xs bg-red-600/20 text-red-400 px-3 py-1.5 rounded hover:bg-red-600/30"
                  >
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PostCard({
  post,
  onUnblind,
  onDelete,
  onClick,
  showReportCount,
}: {
  post: Post;
  onUnblind: (id: number) => void;
  onDelete: (id: number) => void;
  onClick?: () => void;
  showReportCount?: boolean;
}) {
  return (
    <div
      className={`bg-gray-900 rounded-xl p-5 ${onClick ? "cursor-pointer hover:bg-gray-800/80 transition-colors" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
              {post.tag}
            </span>
            <h3 className="text-lg font-semibold text-white truncate">{post.title}</h3>
          </div>
          <p className="text-gray-400 text-sm line-clamp-2 mb-2">{post.content}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{post.authorName}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            {showReportCount && (
              <span className="text-red-400">Reports: {post.reportCount}</span>
            )}
            {post.blinded && (
              <span className="text-yellow-400">Blinded</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4 shrink-0" onClick={(e) => e.stopPropagation()}>
          {post.blinded && (
            <button
              onClick={() => onUnblind(post.id)}
              className="text-xs bg-green-600/20 text-green-400 px-3 py-1.5 rounded hover:bg-green-600/30"
            >
              Unblind
            </button>
          )}
          <button
            onClick={() => onDelete(post.id)}
            className="text-xs bg-red-600/20 text-red-400 px-3 py-1.5 rounded hover:bg-red-600/30"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center gap-2 mt-6">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded ${
            i === page ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
