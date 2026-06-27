import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, AlignLeft, Clock, Repeat, Trash2, Tag } from 'lucide-react';
import { format, parseUTCtoLocal } from '../../utils/dateUtils';
import { useCalendar } from '../../context/CalendarContext';
import type { EventFormData, EventColor, RecurrenceType } from '../../types';

const COLORS: EventColor[] = [
  '#d50000', '#e67c73', '#f4511e', '#f6bf26',
  '#33b679', '#0b8043', '#039be5', '#3f51b5',
  '#7986cb', '#8e24aa', '#616161',
] as unknown as EventColor[];

const COLOR_NAMES: Record<string, string> = {
  '#d50000': 'Tomato',
  '#e67c73': 'Flamingo',
  '#f4511e': 'Tangerine',
  '#f6bf26': 'Banana',
  '#33b679': 'Sage',
  '#0b8043': 'Basil',
  '#039be5': 'Peacock',
  '#3f51b5': 'Blueberry',
  '#7986cb': 'Lavender',
  '#8e24aa': 'Grape',
  '#616161': 'Graphite',
  // Legacy color fallbacks
  '#4285f4': 'Blueberry',
  '#0f9d58': 'Basil',
  '#f4b400': 'Banana',
  '#db4437': 'Tomato',
  '#9c27b0': 'Grape',
  '#00bcd4': 'Peacock',
  '#ff5722': 'Tangerine',
  '#607d8b': 'Graphite',
};

const toLocalDatetimeInput = (isoString: string): string => {
  const d = parseUTCtoLocal(isoString);
  return format(d, "yyyy-MM-dd'T'HH:mm");
};

const toDefaultStart = (date?: Date, hour?: number): string => {
  const d = date ? new Date(date) : new Date();
  d.setHours(hour ?? new Date().getHours() + 1, 0, 0, 0);
  return format(d, "yyyy-MM-dd'T'HH:mm");
};

const toDefaultEnd = (date?: Date, hour?: number): string => {
  const d = date ? new Date(date) : new Date();
  d.setHours((hour ?? new Date().getHours()) + 2, 0, 0, 0);
  return format(d, "yyyy-MM-dd'T'HH:mm");
};

export default function EventModal() {
  const { modalState, closeModal, saveEvent, removeEvent } = useCalendar();
  const { isOpen, mode, event, defaultDate, defaultHour } = modalState;

  const [form, setForm] = useState<EventFormData>({
    title: '',
    description: '',
    startTime: toDefaultStart(defaultDate, defaultHour),
    endTime: toDefaultEnd(defaultDate, defaultHour),
    allDay: false,
    color: '#039be5' as EventColor,
    location: '',
    recurrence: 'none',
    recurrenceEnd: '',
  });

  const [error, setError] = useState('');
  const [overlapWarning, setOverlapWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMode, setDeleteMode] = useState<'this' | 'following' | 'all'>('this');
  const [editMode, setEditMode] = useState<'this' | 'following' | 'all'>('this');

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && event) {
      setForm({
        title: event.title,
        description: event.description || '',
        startTime: toLocalDatetimeInput(event.startTime),
        endTime: toLocalDatetimeInput(event.endTime),
        allDay: event.allDay,
        color: event.color || '#039be5',
        location: event.location || '',
        recurrence: event.recurrence,
        recurrenceEnd: event.recurrenceEnd ? toLocalDatetimeInput(event.recurrenceEnd) : '',
      });
    } else {
      setForm({
        title: '',
        description: '',
        startTime: toDefaultStart(defaultDate, defaultHour),
        endTime: toDefaultEnd(defaultDate, defaultHour),
        allDay: false,
        color: '#039be5' as EventColor,
        location: '',
        recurrence: 'none',
        recurrenceEnd: '',
      });
    }
    setError('');
    setOverlapWarning(null);
  }, [isOpen, mode, event, defaultDate, defaultHour]);

  const handleSubmit = async (_force = false) => {
    if (!form.title.trim()) {
      setError('Event title is required');
      return;
    }
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      setError('End time must be after start time');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setOverlapWarning(null);

    try {
      const payload = {
        ...form,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        recurrenceEnd: form.recurrenceEnd
          ? new Date(form.recurrenceEnd).toISOString()
          : undefined,
      };
      await saveEvent(payload, mode === 'edit' ? editMode : undefined);
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.error === 'overlap') {
        setOverlapWarning(
          `⚠️ Overlaps with: ${data.overlappingEvents
            .map((e: any) => e.title)
            .join(', ')}. You can still save.`
        );
      } else {
        setError(data?.error || 'Failed to save event');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    try {
      await removeEvent(
        event._id,
        event.recurrenceGroupId ? deleteMode : undefined
      );
    } catch {
      setError('Failed to delete event');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
      />
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-[560px] z-50 overflow-hidden select-none border border-[#dadce0]"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'create' ? 'Create Event Dialog' : 'Edit Event Dialog'}
      >
        <div style={{ backgroundColor: form.color || '#039be5' }} className="h-2.5 w-full" />

        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <h2 className="text-xl font-normal text-[#3c4043] font-sans">
            {mode === 'create' ? 'Add Event' : 'Edit Event'}
          </h2>
          <div className="flex items-center gap-1">
            {mode === 'edit' && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                aria-label="Delete event"
                className="p-2 rounded-full hover:bg-red-50 text-[#5f6368] hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              onClick={closeModal}
              aria-label="Close dialog"
              className="p-2 rounded-full hover:bg-[rgba(60,64,67,0.08)] text-[#5f6368] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-5 max-h-[72vh] overflow-y-auto font-sans">
          <div>
            <input
              type="text"
              placeholder="Add title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full text-2xl font-normal border-0 border-b-2 border-[#dadce0] focus:border-[#1a73e8] outline-none py-1 text-[#3c4043] placeholder-[#70757a] transition-colors"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-4">
            <Clock size={20} className="text-[#5f6368] flex-shrink-0" />
            <label className="flex items-center gap-2.5 text-sm text-[#3c4043] cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={form.allDay}
                onChange={(e) => setForm({ ...form, allDay: e.target.checked })}
                className="w-4 h-4 rounded text-[#1a73e8] focus:ring-[#1a73e8]"
              />
              All day
            </label>
          </div>

          <div className="flex gap-4 pl-9">
            <div className="flex-1">
              <label className="text-xs text-[#70757a] block mb-1 font-medium">Start Time</label>
              <input
                type={form.allDay ? 'date' : 'datetime-local'}
                value={form.allDay ? form.startTime.slice(0, 10) : form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full border border-[#dadce0] rounded-lg px-3 py-2 text-sm text-[#3c4043] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-[#70757a] block mb-1 font-medium">End Time</label>
              <input
                type={form.allDay ? 'date' : 'datetime-local'}
                value={form.allDay ? form.endTime.slice(0, 10) : form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full border border-[#dadce0] rounded-lg px-3 py-2 text-sm text-[#3c4043] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Repeat size={20} className="text-[#5f6368] flex-shrink-0" />
            <div className="flex items-center gap-3 flex-1 flex-wrap">
              <select
                value={form.recurrence}
                onChange={(e) => setForm({ ...form, recurrence: e.target.value as RecurrenceType })}
                className="text-sm border border-[#dadce0] rounded-lg px-3 py-2 text-[#3c4043] focus:outline-none focus:border-[#1a73e8] bg-white"
              >
                <option value="none font-sans">Does not repeat</option>
                <option value="daily">Every day</option>
                <option value="weekly">Every week</option>
                <option value="monthly">Every month</option>
              </select>
              {form.recurrence !== 'none' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#70757a]">Until</span>
                  <input
                    type="date"
                    value={form.recurrenceEnd}
                    onChange={(e) => setForm({ ...form, recurrenceEnd: e.target.value })}
                    className="text-sm border border-[#dadce0] rounded-lg px-3 py-1.5 text-[#3c4043] focus:outline-none focus:border-[#1a73e8]"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <MapPin size={20} className="text-[#5f6368] flex-shrink-0" />
            <input
              type="text"
              placeholder="Add location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="flex-1 text-sm border-0 border-b border-[#dadce0] focus:border-[#1a73e8] outline-none py-1.5 text-[#3c4043] placeholder-[#70757a]"
            />
          </div>

          <div className="flex items-start gap-4">
            <AlignLeft size={20} className="text-[#5f6368] flex-shrink-0 mt-1" />
            <textarea
              placeholder="Add description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="flex-1 text-sm border border-[#dadce0] rounded-lg p-3 text-[#3c4043] resize-none focus:outline-none focus:border-[#1a73e8] placeholder-[#70757a]"
            />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <Tag size={20} className="text-[#5f6368] flex-shrink-0" />
            <div className="flex items-center gap-2 flex-wrap flex-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  aria-label={`Select color ${COLOR_NAMES[c] || c}`}
                  title={COLOR_NAMES[c] || c}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full transition-transform hover:scale-110 focus:outline-none ${
                    form.color === c ? 'ring-2 ring-offset-2 ring-[#1a73e8] scale-110' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {mode === 'edit' && event?.recurrenceGroupId && (
            <div className="bg-[#e8f0fe] rounded-xl p-3.5 border border-[#c2e7ff]">
              <p className="text-sm text-[#001d35] font-medium mb-2">Edit recurring event</p>
              <div className="flex gap-4">
                {(['this', 'following', 'all'] as const).map((m) => (
                  <label key={m} className="flex items-center gap-2 text-sm text-[#3c4043] cursor-pointer">
                    <input
                      type="radio"
                      name="editMode"
                      value={m}
                      checked={editMode === m}
                      onChange={() => setEditMode(m)}
                      className="text-[#1a73e8] focus:ring-[#1a73e8]"
                    />
                    {m === 'this' ? 'This event' : m === 'following' ? 'This & following' : 'All events'}
                  </label>
                ))}
              </div>
            </div>
          )}

          {overlapWarning && (
            <div className="bg-[#fef7e0] border border-[#fce8e6] rounded-xl p-3.5">
              <p className="text-sm text-[#b06000]">{overlapWarning}</p>
              <button
                onClick={() => { setOverlapWarning(null); handleSubmit(true); }}
                className="mt-2 text-sm font-medium text-[#1a73e8] hover:underline"
              >
                Save anyway
              </button>
            </div>
          )}

          {error && <p className="text-sm text-[#d93025] font-medium">{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-[#dadce0] bg-[#f8f9fa] flex items-center justify-between">
          <span className="text-xs text-[#70757a] font-sans">Google Calendar</span>
          <div className="flex items-center gap-3">
            <button
              onClick={closeModal}
              className="px-5 py-2 text-sm font-medium text-[#3c4043] rounded-full hover:bg-[rgba(60,64,67,0.08)] transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium bg-[#1a73e8] text-white rounded-full hover:bg-[#1765cc] transition-colors disabled:opacity-60 shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a73e8]"
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Save' : 'Update'}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6 z-10"
            >
              <p className="text-xl font-normal mb-3 text-[#3c4043] font-sans">Delete event?</p>
              {event?.recurrenceGroupId && (
                <div className="flex flex-col gap-2.5 mb-5 w-full max-w-xs">
                  {(['this', 'following', 'all'] as const).map((m) => (
                    <label key={m} className="flex items-center gap-2.5 text-sm text-[#3c4043] cursor-pointer">
                      <input
                        type="radio"
                        name="deleteMode"
                        value={m}
                        checked={deleteMode === m}
                        onChange={() => setDeleteMode(m)}
                        className="text-[#1a73e8]"
                      />
                      {m === 'this' ? 'This event' : m === 'following' ? 'This & following events' : 'All events'}
                    </label>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-5 py-2 text-sm font-medium text-[#3c4043] rounded-full hover:bg-[rgba(60,64,67,0.08)]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 text-sm font-medium bg-[#d93025] text-white rounded-full hover:bg-[#c5221f] shadow-xs"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}