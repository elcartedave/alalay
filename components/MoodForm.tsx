"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MoodEntryInput, fromMoodEntry } from "@/models/MoodEntries";

const moodScale = [
  {
    value: 1,
    label: "Very Sad",
    emoji: "😢",
    color: "from-red-400 to-red-500",
    bgColor: "bg-red-50",
  },
  {
    value: 2,
    label: "Sad",
    emoji: "😔",
    color: "from-orange-400 to-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    value: 3,
    label: "Neutral",
    emoji: "😐",
    color: "from-yellow-400 to-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    value: 4,
    label: "Happy",
    emoji: "😊",
    color: "from-tealgreen to-seagreen",
    bgColor: "bg-teal-50",
  },
  {
    value: 5,
    label: "Very Happy",
    emoji: "😄",
    color: "from-softgreen to-tealgreen",
    bgColor: "bg-green-50",
  },
];

const inspirationalQuotes = [
  "Every feeling you experience is valid and important.",
  "Your mental health journey is unique and valuable.",
  "Small steps lead to big changes over time.",
  "Be gentle with yourself - you're doing your best.",
  "Healing happens in waves, not in straight lines.",
];

interface TodayMoodEntry {
  id: string;
  mood_score: number;
  notes?: string;
  created_at: string;
}

export default function MoodForm() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentQuote] = useState(
    inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)]
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [todayEntry, setTodayEntry] = useState<TodayMoodEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      if (user?.id) {
        await checkTodayEntry(user.id);
      } else {
        setIsLoading(false);
      }
    };
    getUser();
  }, []);

  const checkTodayEntry = async (userId: string) => {
    try {
      const today = new Date();
      // Format today's date to match the database format (YYYY-MM-DD)
      const todayFormatted = today.toISOString().split("T")[0];

      console.log("Checking entry for date:", todayFormatted);
      console.log("User ID:", userId);

      const { data, error } = await supabase
        .from("mood_entries")
        .select("id, mood_score, notes, created_at, date")
        .eq("user_id", userId)
        .eq("date", todayFormatted)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error checking today's entry:", error);
        return;
      }

      console.log("Query result:", data);

      if (data && data.length > 0) {
        setTodayEntry(data[0]);
        setSelectedMood(data[0].mood_score);
        setNotes(data[0].notes || "");
      }
    } catch (err) {
      console.error("Error checking today's entry:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      setError("Please select a mood");
      return;
    }

    if (!userId) {
      setError("Please sign in to save your mood");
      return;
    }

    if (todayEntry) {
      setError(
        "You have already logged your mood for today. Come back tomorrow!"
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Create new entry only
      const moodEntry: MoodEntryInput = {
        date: new Date().toISOString(),
        mood_score: selectedMood,
        notes: notes.trim() || undefined,
        user_id: userId,
      };

      const { data, error: insertError } = await supabase
        .from("mood_entries")
        .insert([fromMoodEntry(moodEntry)])
        .select()
        .single();

      if (insertError) throw insertError;

      setTodayEntry({
        id: data.id,
        mood_score: selectedMood,
        notes: notes.trim() || undefined,
        created_at: data.created_at,
      });
      setJustUpdated(true);
      setSuccess(true);
    } catch (err) {
      setError("Failed to save mood entry. Please try again.");
      console.error("Error saving mood:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMoodData = moodScale.find(
    (mood) => mood.value === selectedMood
  );

  const getCurrentMoodData = () => {
    if (todayEntry) {
      return moodScale.find((mood) => mood.value === todayEntry.mood_score);
    }
    return null;
  };

  const currentMoodData = getCurrentMoodData();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-xl">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-2 border-tealgreen border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slateteal">Loading your mood data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show today's mood if already logged
  if (todayEntry && currentMoodData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-softgreen/20 rounded-full blur-sm"></div>
          <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-tealgreen/20 rounded-full blur-sm"></div>

          <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

            <div className="relative z-10 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-tealgreen to-seagreen rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slateteal to-seagreen bg-clip-text text-transparent mb-2">
                  You've Already Logged Today!
                </h2>
                <p className="text-slateteal/70">
                  Great job staying consistent with your mood tracking
                </p>
              </div>

              <div
                className={`bg-gradient-to-r ${currentMoodData.color} p-6 rounded-2xl text-white mb-6`}
              >
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <span className="text-4xl">{currentMoodData.emoji}</span>
                  <div>
                    <h3 className="text-xl font-semibold">
                      Today you felt {currentMoodData.label.toLowerCase()}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {todayEntry.notes && (
                  <div className="bg-white/20 rounded-xl p-4 mt-4">
                    <p className="text-sm text-white/95 italic">
                      "{todayEntry.notes}"
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white/30 rounded-xl p-4 mb-6 border border-tealgreen/20">
                <p className="text-sm text-slateteal/80 italic flex items-center justify-center space-x-2">
                  <span className="text-tealgreen">✨</span>
                  <span>{currentQuote}</span>
                  <span className="text-tealgreen">✨</span>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-xl">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-blue-500">🗓️</span>
                  <span className="text-sm font-medium">
                    Come back tomorrow to log your next mood entry!
                  </span>
                </div>
              </div>

              <div className="text-center pt-6">
                <p className="text-sm text-slateteal/70 flex items-center justify-center space-x-1">
                  <span>🌿</span>
                  <span>
                    Consistency in tracking helps build self-awareness
                  </span>
                  <span>🌿</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show success message after saving
  if (justUpdated && todayEntry && currentMoodData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-softgreen/20 rounded-full blur-sm"></div>
          <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-tealgreen/20 rounded-full blur-sm"></div>

          <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

            <div className="relative z-10 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-tealgreen to-seagreen rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎉</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slateteal to-seagreen bg-clip-text text-transparent mb-2">
                  Mood Saved Successfully!
                </h2>
                <p className="text-slateteal/70">
                  Thank you for taking care of your mental health today
                </p>
              </div>

              <div
                className={`bg-gradient-to-r ${currentMoodData.color} p-6 rounded-2xl text-white mb-6`}
              >
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <span className="text-4xl">{currentMoodData.emoji}</span>
                  <div>
                    <h3 className="text-xl font-semibold">
                      You're feeling {currentMoodData.label.toLowerCase()}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {todayEntry.notes && (
                  <div className="bg-white/20 rounded-xl p-4 mt-4">
                    <p className="text-sm text-white/95 italic">
                      "{todayEntry.notes}"
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white/30 rounded-xl p-4 mb-6 border border-tealgreen/20">
                <p className="text-sm text-slateteal/80 italic flex items-center justify-center space-x-2">
                  <span className="text-tealgreen">✨</span>
                  <span>{currentQuote}</span>
                  <span className="text-tealgreen">✨</span>
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500">🗓️</span>
                  <span className="text-sm font-medium">
                    Your mood has been logged for today. See you tomorrow!
                  </span>
                </div>
              </div>

              <div className="text-center pt-6">
                <p className="text-sm text-slateteal/70 flex items-center justify-center space-x-1">
                  <span>🌿</span>
                  <span>Every entry helps you understand yourself better</span>
                  <span>🌿</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-softgreen/20 rounded-full blur-sm"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-tealgreen/20 rounded-full blur-sm"></div>

        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slateteal to-seagreen bg-clip-text text-transparent mb-2 text-center">
              How are you feeling today?
            </h2>
            <p className="text-slateteal/70 text-center mb-8">
              Take a moment to reflect on your current mood
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Mood Selection */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slateteal mb-2">
                    Select your current mood
                  </h3>
                  <p className="text-sm text-slateteal/70">
                    Choose the emoji that best represents how you feel right now
                  </p>
                </div>

                <div className="flex justify-between items-center gap-2">
                  {moodScale.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setSelectedMood(mood.value)}
                      className={`group flex flex-col items-center p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-tealgreen focus:ring-offset-2 focus:ring-offset-transparent ${
                        selectedMood === mood.value
                          ? `bg-gradient-to-br ${mood.color} text-white shadow-lg scale-110`
                          : `bg-white/50 hover:bg-white/70 border border-tealgreen/20 hover:border-tealgreen/40`
                      }`}
                    >
                      <span
                        className={`text-3xl mb-2 transition-transform duration-300 ${
                          selectedMood === mood.value
                            ? "animate-bounce"
                            : "group-hover:scale-110"
                        }`}
                      >
                        {mood.emoji}
                      </span>
                      <span
                        className={`text-xs font-medium transition-colors duration-300 ${
                          selectedMood === mood.value
                            ? "text-white"
                            : "text-slateteal/70 group-hover:text-slateteal"
                        }`}
                      >
                        {mood.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Selected mood feedback */}
                {selectedMoodData && (
                  <div
                    className={`bg-gradient-to-r ${selectedMoodData.color} p-4 rounded-xl text-white text-center`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-2xl">{selectedMoodData.emoji}</span>
                      <span className="font-medium">
                        You're feeling {selectedMoodData.label.toLowerCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-tealgreen to-seagreen rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">📝</span>
                  </div>
                  <label
                    htmlFor="notes"
                    className="text-lg font-semibold text-slateteal"
                  >
                    What's on your mind?
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-4 bg-white/50 backdrop-blur-sm border border-tealgreen/30 rounded-2xl shadow-sm focus:ring-2 focus:ring-tealgreen focus:border-transparent focus:bg-white/70 transition-all duration-300 resize-none placeholder-slateteal/50"
                    rows={4}
                    placeholder="Share your thoughts, feelings, or what happened today... Remember, this is your safe space. 💚"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-slateteal/50">
                    {notes.length}/500
                  </div>
                </div>
              </div>

              {/* Error and Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
                  <span className="text-red-500">⚠️</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center space-x-2">
                  <span className="text-green-500">🎉</span>
                  <span className="text-sm font-medium">
                    Mood entry saved successfully! Thank you for taking care of
                    yourself.
                  </span>
                  <span className="text-green-500">💚</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tealgreen focus:ring-offset-transparent disabled:cursor-not-allowed ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-tealgreen to-seagreen hover:from-seagreen hover:to-deepaqua hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving your thoughts...</span>
                    </>
                  ) : (
                    <>
                      <span>Save Mood Entry</span>
                      <span className="text-lg">🌱</span>
                    </>
                  )}
                </div>
              </button>

              {/* Encouragement Message */}
              <div className="text-center pt-4">
                <p className="text-sm text-slateteal/70 flex items-center justify-center space-x-1">
                  <span>🌿</span>
                  <span>
                    Every entry is a step towards better self-understanding
                  </span>
                  <span>🌿</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
