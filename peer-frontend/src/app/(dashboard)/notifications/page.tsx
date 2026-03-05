"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Notification } from "@/types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    api.get<Notification[]>("/api/notifications").then(setNotifications);
  }, []);

  const markAsRead = async (id: number) => {
    await api.patch(`/api/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    await api.patch("/api/notifications/read-all");
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/api/notifications/${id}`);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-400 mt-1">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`bg-gray-900 rounded-xl p-4 flex items-start gap-4 ${
              !notif.read ? "border-l-4 border-blue-600" : ""
            }`}
          >
            <div className="flex-1">
              <h3
                className={`text-sm font-medium ${
                  notif.read ? "text-gray-400" : "text-white"
                }`}
              >
                {notif.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{notif.message}</p>
              <span className="text-xs text-gray-600 mt-2 block">
                {new Date(notif.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex gap-2">
              {!notif.read && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Read
                </button>
              )}
              <button
                onClick={() => handleDelete(notif.id)}
                className="text-xs text-gray-500 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No notifications
          </div>
        )}
      </div>
    </div>
  );
}
