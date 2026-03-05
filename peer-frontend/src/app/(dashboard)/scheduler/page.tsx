"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Event, EventRequest } from "@/types";

const COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

export default function SchedulerPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [form, setForm] = useState<EventRequest>({
    title: "",
    startTime: "",
    endTime: "",
    allDay: false,
    color: COLORS[0],
    repeatRule: "NONE",
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    const start = new Date(year, month, 1).toISOString();
    const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
    api
      .get<Event[]>(`/api/events?start=${start}&end=${end}`)
      .then(setEvents)
      .catch(() => {});
  }, [year, month]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    return events.filter((e) => {
      const d = new Date(e.startTime);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const openCreate = (day?: number) => {
    const date = day ? new Date(year, month, day) : new Date();
    const start = new Date(date);
    start.setHours(9, 0, 0, 0);
    const end = new Date(date);
    end.setHours(10, 0, 0, 0);
    setForm({
      title: "",
      startTime: toLocalDatetime(start),
      endTime: toLocalDatetime(end),
      allDay: false,
      color: COLORS[0],
      repeatRule: "NONE",
    });
    setEditingEvent(null);
    setShowModal(true);
  };

  const openEdit = (event: Event) => {
    setForm({
      title: event.title,
      description: event.description || "",
      startTime: toLocalDatetime(new Date(event.startTime)),
      endTime: toLocalDatetime(new Date(event.endTime)),
      allDay: event.allDay,
      color: event.color || COLORS[0],
      repeatRule: event.repeatRule,
    });
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.startTime || !form.endTime) return;
    if (new Date(form.startTime) >= new Date(form.endTime)) {
      const adjusted = new Date(new Date(form.startTime).getTime() + 60 * 60 * 1000);
      setForm({ ...form, endTime: toLocalDatetime(adjusted) });
      return;
    }
    const body = {
      ...form,
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
    };

    if (editingEvent) {
      const updated = await api.put<Event>(`/api/events/${editingEvent.id}`, body);
      setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    } else {
      const created = await api.post<Event>("/api/events", body);
      setEvents((prev) => [...prev, created]);
    }
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!editingEvent) return;
    await api.delete(`/api/events/${editingEvent.id}`);
    setEvents((prev) => prev.filter((e) => e.id !== editingEvent.id));
    setShowModal(false);
  };

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Calendar</h1>
        <button
          onClick={() => openCreate()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Event
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="text-gray-400 hover:text-white p-2">
            &#8592;
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-white">
              {currentDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-gray-600 hover:text-white"
            >
              Today
            </button>
          </div>
          <button onClick={nextMonth} className="text-gray-400 hover:text-white p-2">
            &#8594;
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-sm text-gray-500 py-2 font-medium">
              {d}
            </div>
          ))}
          {blanks.map((i) => (
            <div key={`b-${i}`} className="min-h-[100px] bg-gray-800/30 rounded-lg" />
          ))}
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={day}
                onClick={() => openCreate(day)}
                className="min-h-[100px] bg-gray-800/50 rounded-lg p-2 cursor-pointer hover:bg-gray-800 transition-colors"
              >
                <span
                  className={`text-sm font-medium ${
                    isToday(day)
                      ? "bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center"
                      : "text-gray-300"
                  }`}
                >
                  {day}
                </span>
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 3).map((e) => (
                    <div
                      key={e.id}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        openEdit(e);
                      }}
                      className="text-xs px-1.5 py-0.5 rounded truncate text-white"
                      style={{ backgroundColor: e.color || COLORS[0] }}
                    >
                      {e.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingEvent ? "Edit Event" : "New Event"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600"
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                rows={2}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400">Start</label>
                  <input
                    type="datetime-local"
                    value={form.startTime}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      const updates: Partial<EventRequest> = { startTime: newStart };
                      if (newStart && (!form.endTime || new Date(newStart) >= new Date(form.endTime))) {
                        const adjusted = new Date(new Date(newStart).getTime() + 60 * 60 * 1000);
                        updates.endTime = toLocalDatetime(adjusted);
                      }
                      setForm({ ...form, ...updates });
                    }}
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">End</label>
                  <input
                    type="datetime-local"
                    value={form.endTime}
                    min={form.startTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    className={`w-8 h-8 rounded-full ${form.color === c ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <select
                value={form.repeatRule}
                onChange={(e) => setForm({ ...form, repeatRule: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
              >
                <option value="NONE">No repeat</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="BIWEEKLY">Biweekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {editingEvent ? "Update" : "Create"}
              </button>
              {editingEvent && (
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function toLocalDatetime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
