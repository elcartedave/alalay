"use client";
import {
  Calendar,
  TrendingUp,
  Smile,
  Target,
  Activity,
  Sparkles,
  Heart,
  BookOpen,
  Wind,
  MessageCircle,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import CurrentMood from "@/components/CurrentMood";
import RecentJournalEntry from "@/components/RecentJournalEntry";

export default function Dashboard() {
  return (
    <>
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-midnight">
          Welcome back!
        </h1>
        <p className="text-slateteal/80 text-lg">
          Here's how you're doing on your mental health journey today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 fade-in">
        <CurrentMood />

        <Card className="bg-gradient-to-br from-tealgreen to-seagreen border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Streak
            </CardTitle>
            <Calendar className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">7 days</div>
            <p className="text-xs text-white/80">Daily check-ins</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-seagreen to-deepaqua border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Goals Completed
            </CardTitle>
            <Target className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3/5</div>
            <p className="text-xs text-white/80">This week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-deepaqua to-slateteal border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-mint">
              Wellness Score
            </CardTitle>
            <Activity className="h-5 w-5 text-mint/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-mint">85%</div>
            <p className="text-xs text-mint/80">+12% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 fade-in">
        {/* Today's Affirmation */}
        <Card className="md:col-span-2 bg-white border border-tealgreen/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-softgreen/20 to-tealgreen/20 border-b border-tealgreen/20">
            <CardTitle className="flex items-center gap-2 text-slateteal">
              <div className="p-2 bg-tealgreen/20 rounded-lg">
                <Sparkles className="h-5 w-5 text-deepaqua" />
              </div>
              Today's Affirmation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <blockquote className="text-lg italic text-slateteal/80 leading-relaxed border-l-4 border-tealgreen pl-4">
              "You are capable of amazing things. Every step forward, no matter
              how small, is progress worth celebrating."
            </blockquote>
            <Button className="mt-6 bg-tealgreen hover:bg-seagreen text-white border-0 shadow-md hover:shadow-lg transition-all duration-200">
              <Heart className="mr-2 h-4 w-4" />
              Save to Favorites
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border border-tealgreen/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-tealgreen/10 to-seagreen/10 border-b border-tealgreen/20">
            <CardTitle className="text-slateteal">Quick Actions</CardTitle>
            <CardDescription className="text-slateteal/70">
              Jump into your daily activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            <Button className="w-full justify-start bg-softgreen/20 hover:bg-tealgreen/30 text-slateteal border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <Heart className="mr-3 h-4 w-4 text-deepaqua" />
              Log Emotions
            </Button>
            <Button className="w-full justify-start bg-tealgreen/20 hover:bg-seagreen/30 text-slateteal border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <BookOpen className="mr-3 h-4 w-4 text-deepaqua" />
              Write in Journal
            </Button>
            <Button className="w-full justify-start bg-seagreen/20 hover:bg-deepaqua/30 text-slateteal border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <Wind className="mr-3 h-4 w-4 text-deepaqua" />
              Start Meditation
            </Button>
            <Button className="w-full justify-start bg-deepaqua/20 hover:bg-slateteal/30 text-slateteal border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <MessageCircle className="mr-3 h-4 w-4 text-deepaqua" />
              Chat with AI
            </Button>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card className="bg-white border border-tealgreen/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-seagreen/10 to-deepaqua/10 border-b border-tealgreen/20">
            <CardTitle className="flex items-center gap-2 text-slateteal">
              <div className="p-2 bg-seagreen/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-deepaqua" />
              </div>
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slateteal font-medium">
                  Mood Tracking
                </span>
                <span className="text-deepaqua font-semibold">7/7 days</span>
              </div>
              <div className="w-full bg-softgreen/30 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-tealgreen to-seagreen h-3 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slateteal font-medium">
                  Journal Entries
                </span>
                <span className="text-deepaqua font-semibold">5/7 days</span>
              </div>
              <div className="w-full bg-softgreen/30 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-seagreen to-deepaqua h-3 rounded-full"
                  style={{ width: "71%" }}
                ></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slateteal font-medium">Meditation</span>
                <span className="text-deepaqua font-semibold">4/7 days</span>
              </div>
              <div className="w-full bg-softgreen/30 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-deepaqua to-slateteal h-3 rounded-full"
                  style={{ width: "57%" }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Journal Entry */}
        <RecentJournalEntry />

        {/* Today's Goals */}
        <Card className="bg-white border border-tealgreen/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-slateteal/10 to-midnight/10 border-b border-tealgreen/20">
            <CardTitle className="flex items-center gap-2 text-slateteal">
              <div className="p-2 bg-slateteal/20 rounded-lg">
                <CheckSquare className="h-5 w-5 text-deepaqua" />
              </div>
              Today's Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked
                className="w-4 h-4 text-tealgreen bg-tealgreen/20 border-tealgreen rounded focus:ring-teal focus:ring-2"
                readOnly
              />
              <span className="text-sm line-through text-slateteal/60">
                Morning meditation (10 min)
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked
                className="w-4 h-4 text-tealgreen bg-tealgreen/20 border-tealgreen rounded focus:ring-teal focus:ring-2"
                readOnly
              />
              <span className="text-sm line-through text-slateteal/60">
                Log emotions
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-tealgreen bg-white border-tealgreen rounded focus:ring-teal focus:ring-2"
                readOnly
              />
              <span className="text-sm text-slateteal font-medium">
                Write journal entry
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-tealgreen bg-white border-tealgreen rounded focus:ring-teal focus:ring-2"
                readOnly
              />
              <span className="text-sm text-slateteal font-medium">
                Practice gratitude
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
