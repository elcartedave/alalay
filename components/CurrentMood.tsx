"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Smile } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const moodScale = [
  {
    value: 1,
    label: "Very Sad",
    emoji: "😢",
    color: "from-red-400 to-red-500",
  },
  {
    value: 2,
    label: "Sad",
    emoji: "😔",
    color: "from-orange-400 to-orange-500",
  },
  {
    value: 3,
    label: "Neutral",
    emoji: "😐",
    color: "from-yellow-400 to-yellow-500",
  },
  {
    value: 4,
    label: "Happy",
    emoji: "😊",
    color: "from-tealgreen to-seagreen",
  },
  {
    value: 5,
    label: "Very Happy",
    emoji: "😄",
    color: "from-softgreen to-tealgreen",
  },
];

interface TodayMoodEntry {
  id: string;
  mood_score: number;
  created_at: string;
}

export default function CurrentMood() {
  const [todayEntry, setTodayEntry] = useState<TodayMoodEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkTodayEntry = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const today = new Date();
        const todayFormatted = today.toISOString().split("T")[0];

        const { data, error } = await supabase
          .from("mood_entries")
          .select("id, mood_score, created_at")
          .eq("user_id", user.id)
          .eq("date", todayFormatted)
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error checking today's entry:", error);
          return;
        }

        if (data && data.length > 0) {
          setTodayEntry(data[0]);
        }
      } catch (err) {
        console.error("Error checking today's entry:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkTodayEntry();
  }, []);

  const getMoodData = (score: number) => {
    return moodScale.find((mood) => mood.value === score);
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-softgreen to-tealgreen border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-midnight">
            Current Mood
          </CardTitle>
          <Smile className="h-5 w-5 text-midnight/70" />
        </CardHeader>
        <CardContent>
          <div className="h-6 bg-white/20 rounded w-24"></div>
          <div className="h-4 bg-white/20 rounded w-32 mt-1"></div>
        </CardContent>
      </Card>
    );
  }

  if (!todayEntry) {
    return (
      <Card className="bg-gradient-to-br from-softgreen to-tealgreen border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-midnight">
            Current Mood
          </CardTitle>
          <Smile className="h-5 w-5 text-midnight/70" />
        </CardHeader>
        <CardContent>
          <button
            onClick={() => router.push("/dashboard/mood")}
            className="text-midnight hover:text-midnight/80 transition-colors"
          >
            <div className="text-2xl font-bold">Add Mood Today</div>
            <p className="text-xs text-midnight/70">Click to log your mood</p>
          </button>
        </CardContent>
      </Card>
    );
  }

  const moodData = getMoodData(todayEntry.mood_score);

  if (!moodData) return null;

  return (
    <Card className="bg-gradient-to-br from-softgreen to-tealgreen border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-midnight">
          Current Mood
        </CardTitle>
        <Smile className="h-5 w-5 text-midnight/70" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-midnight">{moodData.label}</div>
        <p className="text-xs text-midnight/70">
          Logged {new Date(todayEntry.created_at).toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
}
