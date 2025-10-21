"use client";
import { useState, useEffect } from "react";
import { JournalEntry } from "@/models/Journals";
import { Calendar, Clock, FileText, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { use } from "react";

interface JournalDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

function JournalDetailsContent({ journalId }: { journalId: string }) {
  const [journal, setJournal] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }

        const { data, error: fetchError } = await supabase
          .from("journals")
          .select("*")
          .eq("id", journalId)
          .eq("user_id", user.id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          throw new Error("Journal not found");
        }

        setJournal(data as JournalEntry);
      } catch (err) {
        console.error("Error fetching journal:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch journal"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJournal();
  }, [journalId]);

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

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-white/20 rounded w-32"></div>
            <div className="h-4 bg-white/20 rounded w-20"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-white/20 rounded w-full"></div>
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
          </div>
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
            Error Loading Journal
          </h3>
          <p className="text-slateteal mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-deepaqua/20 hover:bg-deepaqua/30 border border-deepaqua/30 rounded-lg text-midnight transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
          <FileText className="w-16 h-16 text-deepaqua/40 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-midnight mb-2">
            Journal Not Found
          </h3>
          <p className="text-slateteal mb-6">
            The journal entry you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-deepaqua/20 hover:bg-deepaqua/30 border border-deepaqua/30 rounded-xl text-midnight font-medium transition-all duration-200 hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard/journals")}
          className="flex items-center space-x-2 text-slateteal hover:text-deepaqua transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journals</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-midnight mb-2">
              Journal Entry
            </h1>
            <div className="flex items-center space-x-4 text-slateteal">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(journal.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Created {formatTime(journal.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Journal Content */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
        <div className="prose prose-lg max-w-none text-midnight">
          <p className="whitespace-pre-wrap">{journal.content}</p>
        </div>
      </div>
    </div>
  );
}

export default function JournalDetails({ params }: JournalDetailsProps) {
  const unwrappedParams = use(params) as { id: string };
  return <JournalDetailsContent journalId={unwrappedParams.id} />;
}
