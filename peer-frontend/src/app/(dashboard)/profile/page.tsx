"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const xpForNextLevel = (user.level + 1) * (user.level + 1) * 10;
  const xpForCurrentLevel = user.level * user.level * 10;
  const progress =
    ((user.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

      <div className="bg-gray-900 rounded-xl p-8">
        <div className="flex items-center gap-6 mb-8">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white">
              {user.name[0]}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-gray-400">{user.email}</p>
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded mt-1 inline-block">
              {user.role}
            </span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-white">Level {user.level}</span>
            <span className="text-sm text-gray-400">
              {user.xp} / {xpForNextLevel} XP
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {xpForNextLevel - user.xp} XP to next level
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{user.xp}</p>
            <p className="text-xs text-gray-500 mt-1">Total XP</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">{user.level}</p>
            <p className="text-xs text-gray-500 mt-1">Current Level</p>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-600">
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
