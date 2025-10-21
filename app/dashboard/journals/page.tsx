"use client";
import { useState, useEffect } from "react";
import { JournalEntry, toJournalEntryList } from "@/models/Journals";
import {
  Calendar,
  Clock,
  FileText,
  ChevronRight,
  Edit,
  Trash2,
  X,
  Plus,
  Save,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface RecentJournalsProps {
  userId?: string;
  limit?: number;
}

interface EditModalProps {
  journal: JournalEntry;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, content: string) => Promise<void>;
}

interface DeleteModalProps {
  journal: JournalEntry;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (content: string) => Promise<void>;
}

// Edit Modal Component
function EditModal({ journal, isOpen, onClose, onSave }: EditModalProps) {
  const [content, setContent] = useState(journal.content);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setContent(journal.content);
  }, [journal.content]);

  const handleSave = async () => {
    if (!content.trim()) return;

    setSaving(true);
    try {
      await onSave(journal.id, content);
      onClose();
    } catch (error) {
      console.error("Error saving journal:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-midnight">
            Edit Journal Entry
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slateteal" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-slateteal mb-4">
            <Calendar className="w-4 h-4" />
            <span>{new Date(journal.date).toLocaleDateString()}</span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 p-4 bg-white/10 border border-white/20 rounded-xl text-midnight placeholder-slateteal/50 resize-none focus:outline-none focus:ring-2 focus:ring-deepaqua/50 focus:border-transparent"
            placeholder="Write your thoughts..."
          />

          <div className="flex justify-between items-center mt-2 text-sm text-slateteal">
            <span>{content.length} characters</span>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-midnight transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !content.trim()}
            className="px-4 py-2 bg-deepaqua/20 hover:bg-deepaqua/30 border border-deepaqua/30 rounded-lg text-midnight font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteModal({ journal, isOpen, onClose, onDelete }: DeleteModalProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(journal.id);
      onClose();
    } catch (error) {
      console.error("Error deleting journal:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-midnight rounded-full">
            <AlertTriangle className="w-6 h-6 text-mint" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-midnight text-center mb-2">
          Delete Journal Entry
        </h2>

        <p className="text-slateteal text-center mb-6">
          Are you sure you want to delete this journal entry from{" "}
          <span className="font-medium">
            {new Date(journal.date).toLocaleDateString()}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-midnight transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-deepaqua hover:bg-seagreen border border-red-500/30 rounded-lg text-red-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4 text-mint" />
            <span className="text-mint">
              {deleting ? "Deleting..." : "Delete"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Add Modal Component
function AddModal({ isOpen, onClose, onAdd }: AddModalProps) {
  const [content, setContent] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!content.trim()) return;

    setAdding(true);
    try {
      await onAdd(content);
      setContent("");
      onClose();
    } catch (error) {
      console.error("Error adding journal:", error);
    } finally {
      setAdding(false);
    }
  };

  const handleClose = () => {
    setContent("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-midnight">
            Add New Journal Entry
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slateteal" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-slateteal mb-4">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 p-4 bg-white/10 border border-white/20 rounded-xl text-midnight placeholder-slateteal/50 resize-none focus:outline-none focus:ring-2 focus:ring-deepaqua/50 focus:border-transparent"
            placeholder="Write your thoughts and reflections..."
            autoFocus
          />

          <div className="flex justify-between items-center mt-2 text-sm text-slateteal">
            <span>{content.length} characters</span>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-midnight transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={adding || !content.trim()}
            className="px-4 py-2 bg-deepaqua/20 hover:bg-deepaqua/30 border border-deepaqua/30 rounded-lg text-midnight font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{adding ? "Adding..." : "Add Journal"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecentJournals({ limit = 10 }: RecentJournalsProps) {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [editingJournal, setEditingJournal] = useState<JournalEntry | null>(
    null
  );
  const [deletingJournal, setDeletingJournal] = useState<JournalEntry | null>(
    null
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id || null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUserId = await getUser();
        setUserId(currentUserId);
        if (currentUserId) {
          await fetchRecentJournals(currentUserId);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user data");
      }
    };
    fetchData();
  }, []);

  const fetchRecentJournals = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("journals")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (fetchError) {
        throw fetchError;
      }

      setJournals(toJournalEntryList(data || []));
    } catch (err) {
      console.error("Error fetching journals:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch journals");
    } finally {
      setLoading(false);
    }
  };

  const handleAddJournal = async (content: string) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("journals")
      .insert([
        {
          user_id: userId,
          content: content,
          date: new Date().toISOString().split("T")[0],
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Refresh the journals list
    await fetchRecentJournals(userId);
  };

  const handleEditJournal = async (journalId: string, content: string) => {
    const { error } = await supabase
      .from("journals")
      .update({ content })
      .eq("id", journalId);

    if (error) {
      throw error;
    }

    // Update the local state
    setJournals((prev) =>
      prev.map((journal) =>
        journal.id === journalId ? { ...journal, content } : journal
      )
    );
  };

  const handleDeleteJournal = async (journalId: string) => {
    const { error } = await supabase
      .from("journals")
      .delete()
      .eq("id", journalId);

    if (error) {
      throw error;
    }

    // Update the local state
    setJournals((prev) => prev.filter((journal) => journal.id !== journalId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 animate-pulse"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-white/20 rounded w-32"></div>
                <div className="h-4 bg-white/20 rounded w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-white/20 rounded w-full"></div>
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 text-center">
          <FileText className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-midnight mb-2">
            Error Loading Journals
          </h3>
          <p className="text-slateteal mb-4">{error}</p>
          <button
            onClick={() => userId && fetchRecentJournals(userId)}
            className="px-4 py-2 bg-deepaqua/20 hover:bg-deepaqua/30 border border-deepaqua/30 rounded-lg text-midnight transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (journals.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
          <FileText className="w-16 h-16 text-deepaqua/40 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-midnight mb-2">
            No Journals Yet
          </h3>
          <p className="text-slateteal mb-6">
            Start documenting your thoughts and experiences by creating your
            first journal entry.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-deepaqua/20 hover:bg-deepaqua/30 border border-deepaqua/30 rounded-xl text-midnight font-medium transition-all duration-200 hover:scale-105"
          >
            Create Your First Journal
          </button>
        </div>

        <AddModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddJournal}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-midnight mb-2">
              Recent Journals
            </h1>
            <p className="text-slateteal">
              Your latest thoughts and reflections
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-deepaqua/20 hover:bg-deepaqua/30 border border-deepaqua/30 rounded-xl text-midnight font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Journal</span>
          </button>
        </div>
      </div>

      {/* Journals List */}
      <div className="space-y-4">
        {journals.map((journal, index) => (
          <div
            key={journal.id}
            onClick={() => router.push(`/dashboard/journals/${journal.id}`)}
            className="group bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "fadeInUp 0.6s ease-out forwards",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-deepaqua/20 rounded-lg">
                  <Calendar className="w-4 h-4 text-deepaqua" />
                </div>
                <div>
                  <h3 className="font-semibold text-midnight">
                    {formatDate(journal.date)}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-slateteal">
                    <Clock className="w-3 h-3" />
                    <span>{getRelativeTime(journal.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className=" flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingJournal(journal);
                  }}
                  className="p-2 bg-deepaqua hover:bg-seagreen border border-blue-500/30 rounded-lg text-blue-600 transition-colors"
                  title="Edit journal"
                >
                  <Edit className="w-4 h-4 text-mint" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingJournal(journal);
                  }}
                  className="p-2 bg-midnight hover:bg-slateteal border border-red-500/30 rounded-lg text-red-600 transition-colors"
                  title="Delete journal"
                >
                  <Trash2 className="w-4 h-4 text-mint" />
                </button>
                <ChevronRight className="w-5 h-5 text-slateteal group-hover:text-deepaqua group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </div>

            {/* Content Preview */}
            <div className="mb-4">
              <p className="text-midnight/90 leading-relaxed">
                {truncateContent(journal.content)}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-slateteal">
                <FileText className="w-3 h-3" />
                <span>{journal.content.length} characters</span>
              </div>
              <div className="text-slateteal">
                Created {formatTime(journal.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button (if there might be more entries) */}
      {journals.length === limit && (
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-deepaqua/20 hover:bg-deepaqua/30 border border-deepaqua/30 rounded-xl text-midnight font-medium transition-all duration-200 hover:scale-105">
            Load More Journals
          </button>
        </div>
      )}

      {/* Modals */}
      <AddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddJournal}
      />

      {editingJournal && (
        <EditModal
          journal={editingJournal}
          isOpen={!!editingJournal}
          onClose={() => setEditingJournal(null)}
          onSave={handleEditJournal}
        />
      )}

      {deletingJournal && (
        <DeleteModal
          journal={deletingJournal}
          isOpen={!!deletingJournal}
          onClose={() => setDeletingJournal(null)}
          onDelete={handleDeleteJournal}
        />
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
