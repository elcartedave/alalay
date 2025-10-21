"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Check, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toComplementEntry } from "@/models/Complement";
// Mock types - replace with your actual types
interface ComplementEntry {
  id: string;
  user_id: string;
  date: string;
  complements: string[];
  created_at: string;
}

interface ComplementEntryInput {
  user_id: string;
  date: string;
  complements: string[];
}

// Mock Supabase client - replace with your actual Supabase client

export default function ComplementYourselfPage() {
  const [entries, setEntries] = useState<ComplementEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ComplementEntry | null>(
    null
  );
  const [complements, setComplements] = useState<string[]>([""]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Mock user ID - replace with actual user authentication
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) {
        setUserId(user.id);
        // Only fetch entries after we have the user ID
        await fetchEntries(user.id);
      }
    };
    getUser();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const fetchEntries = async (uid: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("complement_entries")
        .select("*")
        .eq("user_id", uid)
        .order("date", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const canEditEntry = (entry: ComplementEntry) => {
    return entry.date === today;
  };

  const hasEntryForToday = () => {
    return entries.some((entry) => entry.date === today);
  };

  const openModal = (entry?: ComplementEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setComplements([...entry.complements]);
    } else {
      setEditingEntry(null);
      setComplements([""]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
    setComplements([""]);
  };

  const addComplementField = () => {
    setComplements([...complements, ""]);
  };

  const updateComplement = (index: number, value: string) => {
    const updated = [...complements];
    updated[index] = value;
    setComplements(updated);
  };

  const removeComplement = (index: number) => {
    if (complements.length > 1) {
      const updated = complements.filter((_, i) => i !== index);
      setComplements(updated);
    }
  };

  const saveEntry = async () => {
    const validComplements = complements.filter((c) => c.trim() !== "");
    if (validComplements.length === 0) return;

    try {
      setSaving(true);

      if (editingEntry) {
        // Update existing entry
        const { data: updateData, error: updateError } = await supabase
          .from("complement_entries")
          .update({ complements: validComplements })
          .eq("id", editingEntry.id)
          .select()
          .single();

        if (updateError) throw updateError;

        if (updateData) {
          const updatedEntry = toComplementEntry(updateData);
          setEntries(
            entries.map((entry) =>
              entry.id === editingEntry.id ? updatedEntry : entry
            )
          );
        }
      } else {
        // Create new entry
        const newEntry: ComplementEntryInput = {
          user_id: userId,
          date: today,
          complements: validComplements,
        };

        const { data: insertData, error: insertError } = await supabase
          .from("complement_entries")
          .insert([newEntry])
          .select()
          .single();

        if (insertError) throw insertError;

        if (insertData) {
          const newEntry = toComplementEntry(insertData);
          setEntries([newEntry, ...entries]);
        }
      }

      closeModal();
    } catch (error) {
      console.error("Error saving entry:", error);
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const { error } = await supabase
        .from("complement_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tealgreen"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-deepaqua mb-4">
            Compliment Yourself
          </h1>
          <p className="text-lg text-slateteal mb-6">
            Celebrate your daily achievements and acknowledge your worth
          </p>

          {!hasEntryForToday() && (
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-tealgreen to-seagreen text-white px-8 py-3 rounded-full font-semibold hover:from-seagreen hover:to-deepaqua transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Add Today's Compliments
            </button>
          )}
        </div>

        {/* Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-mint/50"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-deepaqua">
                    {formatDate(entry.date)}
                  </h3>
                  <p className="text-sm text-slateteal">
                    {entry.complements.length} compliment
                    {entry.complements.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {canEditEntry(entry) && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(entry)}
                      className="p-2 text-tealgreen hover:text-seagreen hover:bg-mint/50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-tealgreen/50 scrollbar-track-transparent">
                  {entry.complements.map((complement, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-mint/50 to-softgreen/50 p-3 rounded-lg"
                    >
                      <p className="text-midnight">
                        I compliment myself this day for{" "}
                        <span className="font-medium">{complement}</span>
                      </p>
                    </div>
                  ))}
                </div>
                {entry.complements.length > 2 && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/80 to-transparent pointer-events-none flex items-center justify-center">
                    <ChevronDown className="w-5 h-5 text-tealgreen animate-bounce" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {entries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-2xl font-semibold text-deepaqua mb-2">
              Start Your Journey
            </h3>
            <p className="text-slateteal mb-6">
              Begin by adding your first compliment entry for today
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-deepaqua">
                {editingEntry ? "Edit Compliments" : "Add Today's Compliments"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {complements.map((complement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <p className="text-sm text-slateteal mb-1">
                      I compliment myself this day for
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={complement}
                        onChange={(e) =>
                          updateComplement(index, e.target.value)
                        }
                        className="flex-1 p-3 border border-mint rounded-lg focus:outline-none focus:ring-2 focus:ring-tealgreen focus:border-transparent"
                        placeholder="being amazing..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addComplementField();
                          }
                        }}
                      />
                      {complements.length > 1 && (
                        <button
                          onClick={() => removeComplement(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addComplementField}
              className="w-full mt-4 p-3 border-2 border-dashed border-tealgreen text-tealgreen rounded-lg hover:bg-mint/50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Another Compliment
            </button>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEntry}
                disabled={saving || complements.every((c) => c.trim() === "")}
                className="flex-1 p-3 bg-gradient-to-r from-tealgreen to-seagreen text-white rounded-lg hover:from-seagreen hover:to-deepaqua transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Check size={20} />
                    Save Compliments
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
