"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Post, Comment, CommentRequest } from "@/types";

export default function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [liked, setLiked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    api.get<Post>(`/api/posts/${id}`).then(setPost);
    api.get<Comment[]>(`/api/posts/${id}/comments`).then(setComments);
    // Check if already liked
    api.get<boolean>(`/api/posts/${id}/likes/check`).then(setLiked).catch(() => {});
  }, [id]);

  const handleComment = async () => {
    if (!commentText.trim()) return;
    await api.post(`/api/posts/${id}/comments`, { content: commentText });
    setCommentText("");
    api.get<Comment[]>(`/api/posts/${id}/comments`).then(setComments);
  };

  const handleReply = async (parentId: number) => {
    if (!replyText.trim()) return;
    await api.post(`/api/posts/${id}/comments`, {
      content: replyText,
      parentId,
    } as CommentRequest);
    setReplyText("");
    setReplyTo(null);
    api.get<Comment[]>(`/api/posts/${id}/comments`).then(setComments);
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/api/posts/${id}/likes`);
        setLiked(false);
        setPost((prev) => prev && { ...prev, likeCount: prev.likeCount - 1 });
      } else {
        await api.post(`/api/posts/${id}/likes`);
        setLiked(true);
        setPost((prev) => prev && { ...prev, likeCount: prev.likeCount + 1 });
      }
    } catch {
      // If already liked, try to unlike
      if (!liked) {
        try {
          await api.delete(`/api/posts/${id}/likes`);
          setLiked(false);
          setPost((prev) => prev && { ...prev, likeCount: prev.likeCount - 1 });
        } catch {
          // ignore
        }
      }
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    try {
      await api.post(`/api/posts/${id}/reports`, { reason: reportReason });
      setShowReportModal(false);
      setReportReason("");
    } catch {
      setShowReportModal(false);
      setReportReason("");
    }
  };

  const startEditing = () => {
    if (!post) return;
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditing(true);
  };

  const handleEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    const updated = await api.put<Post>(`/api/posts/${id}`, {
      title: editTitle,
      content: editContent,
      tag: post?.tag,
    });
    setPost(updated);
    setEditing(false);
  };

  const handleDelete = async () => {
    await api.delete(`/api/posts/${id}`);
    router.push("/community");
  };

  if (!post) return <div className="text-gray-400">Loading...</div>;

  const isAuthor = user && user.id === post.authorId;

  return (
    <div className="max-w-3xl">
      <div className="bg-gray-900 rounded-xl p-6 mb-6">
        {editing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-gray-800 text-white text-2xl font-bold rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-gray-800 text-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              rows={8}
            />
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span>{post.authorName}</span>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </div>
          </>
        )}
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-800">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              liked
                ? "bg-red-600/20 text-red-400"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            &#9829; {post.likeCount}
          </button>
          {!isAuthor && (
            <button
              onClick={() => setShowReportModal(true)}
              className="text-xs text-gray-500 hover:text-red-400"
            >
              Report
            </button>
          )}
          {isAuthor && !editing && (
            <button
              onClick={startEditing}
              className="text-xs text-gray-500 hover:text-blue-400 ml-auto"
            >
              Edit
            </button>
          )}
          {isAuthor && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className={`text-xs text-gray-500 hover:text-red-400 ${!editing ? "" : "ml-auto"}`}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-3">Delete Post</h3>
            <p className="text-gray-400 text-sm mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-3">Report Post</h3>
            <textarea
              placeholder="Reason for reporting..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-red-600 resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleReport}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Submit Report
              </button>
              <button
                onClick={() => { setShowReportModal(false); setReportReason(""); }}
                className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-4">
          Comments ({comments.length})
        </h2>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleComment()}
            className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleComment}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Post
          </button>
        </div>

        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-900 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-white">{comment.authorName}</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{comment.content}</p>
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="text-xs text-gray-500 hover:text-blue-400 mt-2"
              >
                Reply
              </button>

              {comment.replies?.length > 0 && (
                <div className="ml-6 mt-3 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-medium text-gray-300">
                          {reply.authorName}
                        </span>
                        <span className="text-xs text-gray-600">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {replyTo === comment.id && (
                <div className="ml-6 mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleReply(comment.id)}
                    className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                    autoFocus
                  />
                  <button
                    onClick={() => handleReply(comment.id)}
                    className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
