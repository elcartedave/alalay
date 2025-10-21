"use client";
import { useState, useEffect } from "react";
import { JournalEntry, toJournalEntryList } from "@/models/Journals";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";

export default function RecentJournalEntry() {
  const [recentJournal, setRecentJournal] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchRecentJournal = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("journals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching recent journal:", error);
        return;
      }

      if (!data || data.length === 0) {
        setRecentJournal(null);
        return;
      }

      setRecentJournal(toJournalEntryList([data[0]])[0]);
    } catch (err) {
      console.error("Error fetching recent journal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentJournal();

    // Subscribe to changes in the journals table
    const channel = supabase
      .channel("journals_changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "journals",
        },
        () => {
          // Refresh the data when any change occurs
          fetchRecentJournal();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  if (loading) {
    return (
      <Card className="bg-white border border-tealgreen/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-deepaqua/10 to-slateteal/10 border-b border-tealgreen/20">
          <CardTitle className="flex items-center gap-2 text-slateteal">
            <div className="p-2 bg-deepaqua/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-deepaqua" />
            </div>
            Recent Journal Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-slateteal/10 rounded w-3/4"></div>
            <div className="h-4 bg-slateteal/10 rounded w-full"></div>
            <div className="h-4 bg-slateteal/10 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recentJournal) {
    return (
      <Card className="bg-white border border-tealgreen/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-deepaqua/10 to-slateteal/10 border-b border-tealgreen/20">
          <CardTitle className="flex items-center gap-2 text-slateteal">
            <div className="p-2 bg-deepaqua/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-deepaqua" />
            </div>
            Recent Journal Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-slateteal/80 mb-4">
            No journal entries yet. Start documenting your thoughts and
            experiences.
          </p>
          <Button
            onClick={() => router.push("/dashboard/journals")}
            className="w-full bg-deepaqua/20 hover:bg-deepaqua/30 text-slateteal border-0 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Journal Entry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-tealgreen/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-deepaqua/10 to-slateteal/10 border-b border-tealgreen/20">
        <CardTitle className="flex items-center gap-2 text-slateteal">
          <div className="p-2 bg-deepaqua/20 rounded-lg">
            <BookOpen className="h-5 w-5 text-deepaqua" />
          </div>
          Recent Journal Entry
        </CardTitle>
        <CardDescription className="text-slateteal/70">
          {formatDate(recentJournal.created_at)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-sm text-slateteal/80 line-clamp-3 leading-relaxed">
          {truncateContent(recentJournal.content)}
        </p>
        <Button
          variant="link"
          size="sm"
          onClick={() => router.push(`/dashboard/journals/${recentJournal.id}`)}
          className="mt-4 text-deepaqua hover:text-slateteal p-0"
        >
          Read more →
        </Button>
      </CardContent>
    </Card>
  );
}
