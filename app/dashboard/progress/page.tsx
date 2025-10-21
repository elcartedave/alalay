"use client";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Lightbulb,
  Target,
  Heart,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// Types
interface MoodEntry {
  id: string;
  user_id: string;
  date: string;
  mood_score: number;
  notes?: string;
  created_at: string;
}

interface ChartData {
  date: string;
  mood: number;
  formattedDate: string;
}

interface MoodStats {
  average: number;
  trend: "improving" | "declining" | "stable";
  bestDay: { date: string; score: number } | null;
  worstDay: { date: string; score: number } | null;
  totalEntries: number;
  streak: number;
}

// Props interface
interface MoodProgressPageProps {
  supabase: any;
  userId?: string;
}

export default function MoodProgressPage() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [dateRange, setDateRange] = useState<"7" | "30" | "90" | "all">("30");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<MoodStats | null>(null);

  useEffect(() => {
    fetchMoodData();
  }, [dateRange]);

  const fetchMoodData = async () => {
    try {
      setLoading(true);

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No user found");
      }

      // Fetch mood entries from Supabase
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (error) throw error;

      if (data) {
        setMoodEntries(data);

        // Filter data based on date range
        const filteredData = filterDataByRange(data, dateRange);
        const formattedData = formatChartData(filteredData);

        setChartData(formattedData);
        setStats(calculateStats(filteredData));
      }
    } catch (error) {
      console.error("Error fetching mood data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDataByRange = (data: MoodEntry[], range: string): MoodEntry[] => {
    const now = new Date();
    const daysBack =
      range === "7" ? 7 : range === "30" ? 30 : range === "90" ? 90 : 365;

    if (range === "all") return data;

    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    return data.filter((entry) => new Date(entry.date) >= cutoffDate);
  };

  const formatChartData = (data: MoodEntry[]): ChartData[] => {
    return data.map((entry) => ({
      date: entry.date,
      mood: entry.mood_score,
      formattedDate: new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  };

  const calculateStats = (data: MoodEntry[]): MoodStats => {
    if (data.length === 0) {
      return {
        average: 0,
        trend: "stable",
        bestDay: null,
        worstDay: null,
        totalEntries: 0,
        streak: 0,
      };
    }

    const average =
      data.reduce((sum, entry) => sum + entry.mood_score, 0) / data.length;

    // Calculate trend
    const recentData = data.slice(-7); // Last 7 entries
    const olderData = data.slice(-14, -7); // Previous 7 entries

    const recentAvg =
      recentData.length > 0
        ? recentData.reduce((sum, entry) => sum + entry.mood_score, 0) /
          recentData.length
        : average;
    const olderAvg =
      olderData.length > 0
        ? olderData.reduce((sum, entry) => sum + entry.mood_score, 0) /
          olderData.length
        : average;

    let trend: "improving" | "declining" | "stable" = "stable";
    if (recentAvg > olderAvg + 0.2) trend = "improving";
    else if (recentAvg < olderAvg - 0.2) trend = "declining";

    // Find best and worst days
    const bestDay = data.reduce(
      (best, entry) =>
        entry.mood_score > (best?.score || 0)
          ? { date: entry.date, score: entry.mood_score }
          : best,
      null as { date: string; score: number } | null
    );

    const worstDay = data.reduce(
      (worst, entry) =>
        entry.mood_score < (worst?.score || 6)
          ? { date: entry.date, score: entry.mood_score }
          : worst,
      null as { date: string; score: number } | null
    );

    return {
      average,
      trend,
      bestDay,
      worstDay,
      totalEntries: data.length,
      streak: calculateStreak(data),
    };
  };

  const calculateStreak = (data: MoodEntry[]): number => {
    // Calculate current logging streak
    const sortedData = [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < sortedData.length; i++) {
      const entryDate = new Date(sortedData[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (entryDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const getMoodLabel = (score: number): string => {
    const labels = ["", "Very Sad", "Sad", "Neutral", "Happy", "Very Happy"];
    return labels[score] || "Unknown";
  };

  const getInsights = (
    stats: MoodStats
  ): { recommendations: string[]; observations: string[] } => {
    const recommendations: string[] = [];
    const observations: string[] = [];

    if (stats.average < 2.5) {
      observations.push(
        "Your mood has been consistently low recently. This is a sign that you may need extra support."
      );
      recommendations.push(
        "Consider reaching out to a mental health professional or trusted friend"
      );
      recommendations.push(
        "Try incorporating daily mindfulness or meditation practices"
      );
      recommendations.push(
        "Ensure you're getting enough sleep, exercise, and nutritious food"
      );
    } else if (stats.average < 3.5) {
      observations.push(
        "Your mood has been in the neutral to low range. There's room for improvement."
      );
      recommendations.push(
        "Identify activities that bring you joy and schedule them regularly"
      );
      recommendations.push(
        "Practice gratitude by writing down 3 things you're thankful for each day"
      );
      recommendations.push("Connect with supportive friends or family members");
    } else if (stats.average < 4.5) {
      observations.push(
        "You're maintaining a generally positive mood with some fluctuations."
      );
      recommendations.push(
        "Continue your current self-care practices as they seem to be working"
      );
      recommendations.push(
        "Pay attention to patterns around your lower mood days"
      );
      recommendations.push(
        "Consider keeping a brief journal to identify triggers and boosters"
      );
    } else {
      observations.push(
        "Excellent! You're maintaining a very positive mood consistently."
      );
      recommendations.push(
        "Share your positive practices with others who might benefit"
      );
      recommendations.push(
        "Continue to prioritize the activities and habits that support your wellbeing"
      );
      recommendations.push(
        "Consider mentoring others or volunteering to maintain this positive outlook"
      );
    }

    if (stats.trend === "improving") {
      observations.push("Great news! Your mood trend is improving over time.");
    } else if (stats.trend === "declining") {
      observations.push(
        "Your mood has been trending downward recently. This is important to address."
      );
      recommendations.push(
        "Review recent changes in your life that might be affecting your mood"
      );
      recommendations.push(
        "Consider professional support if this trend continues"
      );
    }

    if (stats.streak > 7) {
      observations.push(
        `Fantastic! You've maintained a ${stats.streak}-day logging streak. Consistency is key to understanding your patterns.`
      );
    } else if (stats.streak > 0) {
      observations.push(
        `You're building a good habit with a ${stats.streak}-day streak. Keep it up!`
      );
    }

    return { recommendations, observations };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white/90 backdrop-blur-sm border border-tealgreen/20 rounded-lg p-3 shadow-lg">
          <p className="text-slateteal font-medium">{label}</p>
          <p className="text-seagreen">
            Mood: {getMoodLabel(data.value)} ({data.value}/5)
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tealgreen"></div>
          </div>
        </div>
      </div>
    );
  }

  const insights = stats
    ? getInsights(stats)
    : { recommendations: [], observations: [] };

  return (
    <div className="min-h-screen bg-transparent p-6">
      {/* Floating decoration elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-softgreen/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-tealgreen/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-seagreen/25 rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-tealgreen to-seagreen rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slateteal to-seagreen bg-clip-text text-transparent">
              Your Mood Journey
            </h1>
          </div>
          <p className="text-lg text-slateteal/80 max-w-2xl mx-auto">
            Discover patterns, celebrate progress, and gain insights into your
            emotional wellbeing
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-softgreen/30 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-tealgreen to-seagreen rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slateteal/70 uppercase tracking-wide">
                    Average Mood
                  </p>
                  <p className="text-2xl font-bold text-deepaqua">
                    {stats.average.toFixed(1)}/5
                  </p>
                  <p className="text-xs text-seagreen">
                    {getMoodLabel(Math.round(stats.average))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-softgreen/30 shadow-lg">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    stats.trend === "improving"
                      ? "bg-gradient-to-br from-green-400 to-green-600"
                      : stats.trend === "declining"
                      ? "bg-gradient-to-br from-red-400 to-red-600"
                      : "bg-gradient-to-br from-gray-400 to-gray-600"
                  }`}
                >
                  {stats.trend === "improving" ? (
                    <TrendingUp className="w-6 h-6 text-white" />
                  ) : stats.trend === "declining" ? (
                    <TrendingDown className="w-6 h-6 text-white" />
                  ) : (
                    <Activity className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-slateteal/70 uppercase tracking-wide">
                    Trend
                  </p>
                  <p className="text-lg font-bold text-deepaqua capitalize">
                    {stats.trend}
                  </p>
                  <p className="text-xs text-seagreen">Recent pattern</p>
                </div>
              </div>
            </div>

            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-softgreen/30 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-softgreen to-tealgreen rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slateteal/70 uppercase tracking-wide">
                    Logging Streak
                  </p>
                  <p className="text-2xl font-bold text-deepaqua">
                    {stats.streak}
                  </p>
                  <p className="text-xs text-seagreen">Days in a row</p>
                </div>
              </div>
            </div>

            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-softgreen/30 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-seagreen to-deepaqua rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slateteal/70 uppercase tracking-wide">
                    Total Entries
                  </p>
                  <p className="text-2xl font-bold text-deepaqua">
                    {stats.totalEntries}
                  </p>
                  <p className="text-xs text-seagreen">Recorded moods</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart Section */}
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-tealgreen/20 shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-bold text-deepaqua mb-4 sm:mb-0">
              Mood Trend
            </h2>
            <div className="flex space-x-2">
              {(["7", "30", "90", "all"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    dateRange === range
                      ? "bg-tealgreen text-white shadow-md"
                      : "bg-white/50 text-slateteal hover:bg-white/70"
                  }`}
                >
                  {range === "all" ? "All Time" : `${range} Days`}
                </button>
              ))}
            </div>
          </div>

          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#69C5A0" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#69C5A0" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#69C5A0"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="formattedDate"
                  stroke="#126171"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  domain={[1, 5]}
                  stroke="#126171"
                  fontSize={12}
                  tickLine={false}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(value) => getMoodLabel(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="mood"
                  stroke="#45A994"
                  strokeWidth={3}
                  fill="url(#moodGradient)"
                  dot={{ fill: "#45A994", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "#288D8A" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Observations */}
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-tealgreen/20 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-tealgreen to-seagreen rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-deepaqua">Insights</h3>
            </div>
            <div className="space-y-4">
              {insights.observations.map((observation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-tealgreen rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slateteal leading-relaxed">
                    {observation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-tealgreen/20 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-softgreen to-tealgreen rounded-full flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-deepaqua">
                Recommendations
              </h3>
            </div>
            <div className="space-y-4">
              {insights.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-softgreen to-tealgreen rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-slateteal leading-relaxed">
                    {recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Best and Worst Days */}
        {stats?.bestDay && stats?.worstDay && (
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🌟</span>
                </div>
                <h3 className="text-xl font-bold text-green-800">Best Day</h3>
              </div>
              <p className="text-green-700 text-lg font-medium">
                {new Date(stats.bestDay.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-green-600">
                Mood: {getMoodLabel(stats.bestDay.score)} ({stats.bestDay.score}
                /5)
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">💙</span>
                </div>
                <h3 className="text-xl font-bold text-blue-800">
                  Growth Opportunity
                </h3>
              </div>
              <p className="text-blue-700 text-lg font-medium">
                {new Date(stats.worstDay.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-blue-600">
                Mood: {getMoodLabel(stats.worstDay.score)} (
                {stats.worstDay.score}/5)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
