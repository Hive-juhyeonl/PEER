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

  useEffect(() => {
    api.get<Post>(`/api/posts/${id}`).then(setPost);
    api.get<Comment[]>(`/api/posts/${id}/comments`).then(setComments);
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
      // toggle state
    }
  };

  const handleReport = async () => {
    const reason = prompt("Report reason:");
    if (!reason) return;
    try {
      await api.post(`/api/posts/${id}/reports`, { reason });
      alert("Report submitted.");
    } catch {
      alert("Already reported or error.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    await api.delete(`/api/posts/${id}`);
    router.push("/community");
  };

  if (!post) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="max-w-3xl">
      <div className="bg-gray-900 rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span>{post.authorName}</span>
          <span>{new Date(post.createdAt).toLocaleString()}</span>
        </div>
        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-800">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
              liked
                ? "bg-red-600/20 text-red-400"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            &#9829; {post.likeCount}
          </button>
          <button
            onClick={handleReport}
            className="text-xs text-gray-500 hover:text-red-400"
          >
            Report
          </button>
          {user && user.id === post.authorId && (
            <button
              onClick={handleDelete}
              className="text-xs text-gray-500 hover:text-red-400 ml-auto"
            >
              Delete
            </button>
          )}
        </div>
      </div>

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
