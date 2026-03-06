"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const xpForNextLevel = (user.level + 1) * (user.level + 1) * 10;
  const xpForCurrentLevel = user.level * user.level * 10;
  const progress =
    ((user.totalXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  const startEditing = () => {
    setName(user.name);
    setProfileImageUrl(user.profileImageUrl || "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await api.put("/api/users/me", { name: name.trim(), profileImageUrl: profileImageUrl.trim() || null });
      refreshUser();
      setEditing(false);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

      <div className="bg-gray-900 rounded-xl p-8">
        <div className="flex items-center gap-6 mb-8">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.name}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white">
              {user.name[0]}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-gray-400">{user.email}</p>
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded mt-1 inline-block">
              {user.role}
            </span>
          </div>
          {!editing && (
            <button
              onClick={startEditing}
              className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {editing && (
          <div className="bg-gray-800 rounded-xl p-6 mb-6 space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Profile Image URL</label>
              <input
                type="text"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-white">Level {user.level}</span>
            <span className="text-sm text-gray-400">
              {user.totalXp} / {xpForNextLevel} XP
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {xpForNextLevel - user.totalXp} XP to next level
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{user.totalXp}</p>
            <p className="text-xs text-gray-500 mt-1">Total XP</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">{user.level}</p>
            <p className="text-xs text-gray-500 mt-1">Current Level</p>
          </div>
        </div>

        {user.createdAt && (
          <div className="mt-6 text-xs text-gray-600">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
