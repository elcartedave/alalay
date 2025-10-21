import MoodForm from "@/components/MoodForm";

export default function NewMoodPage() {
  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      {/* Floating decoration elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-softgreen/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-tealgreen/20 rounded-full gentle-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-seagreen/25 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-softgreen/20 rounded-full gentle-bounce delay-500"></div>
        <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-tealgreen/30 rounded-full animate-ping delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 fade-in">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-tealgreen to-seagreen rounded-full flex items-center justify-center gentle-bounce">
                <span className="text-white text-lg">🌱</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slateteal to-seagreen bg-clip-text text-transparent">
                Check In With Yourself
              </h1>
              <div className="w-8 h-8 bg-gradient-to-r from-seagreen to-tealgreen rounded-full flex items-center justify-center gentle-bounce delay-300">
                <span className="text-white text-lg">💚</span>
              </div>
            </div>
          </div>

          <p className="text-lg text-slateteal/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Take a moment to pause, breathe, and connect with your inner self.
            Your feelings matter, and tracking them is a beautiful act of
            self-care.
          </p>

          {/* Inspirational Quote */}
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-tealgreen/20 shadow-lg slide-in-left">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-tealgreen to-seagreen rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">✨</span>
              </div>
              <div className="flex-1">
                <blockquote className="text-slateteal italic text-lg leading-relaxed">
                  "The greatest revolution of our generation is the discovery
                  that human beings, by changing the inner attitudes of their
                  minds, can change the outer aspects of their lives."
                </blockquote>
                <cite className="block text-seagreen font-medium mt-2 text-sm">
                  — William James
                </cite>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Tips */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-softgreen/30 shadow-lg slide-in-left delay-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-softgreen to-tealgreen rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">💡</span>
                </div>
                <h3 className="text-lg font-semibold text-slateteal">
                  Mindful Tips
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-slateteal/80">
                <li className="flex items-start space-x-2">
                  <span className="text-tealgreen mt-1">•</span>
                  <span>Be honest about your feelings - they're all valid</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-tealgreen mt-1">•</span>
                  <span>Notice patterns without judgment</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-tealgreen mt-1">•</span>
                  <span>Celebrate small emotional victories</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-softgreen/30 shadow-lg slide-in-left delay-400">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-seagreen to-deepaqua rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🌸</span>
                </div>
                <h3 className="text-lg font-semibold text-slateteal">
                  Remember
                </h3>
              </div>
              <p className="text-sm text-slateteal/80 italic">
                "Progress, not perfection. Every step forward, no matter how
                small, is a victory worth celebrating."
              </p>
            </div>
          </div>

          {/* Center Column - Mood Form */}
          <div className="lg:col-span-6">
            <MoodForm />
          </div>

          {/* Right Column - Encouragement */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-softgreen/30 shadow-lg slide-in-left delay-600">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-tealgreen to-seagreen rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🌟</span>
                </div>
                <h3 className="text-lg font-semibold text-slateteal">
                  You're Doing Great
                </h3>
              </div>
              <p className="text-sm text-slateteal/80 leading-relaxed">
                Taking time to check in with yourself shows incredible
                self-awareness and courage. Your mental health journey matters,
                and every entry you make is a step toward better understanding
                yourself.
              </p>
            </div>

            <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-softgreen/30 shadow-lg slide-in-left delay-800">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-softgreen via-tealgreen to-seagreen rounded-full flex items-center justify-center mx-auto mb-3 gentle-bounce">
                  <span className="text-white text-xl">🤗</span>
                </div>
                <p className="text-sm text-slateteal/80 italic">
                  "Healing isn't about forgetting or moving on. It's about
                  learning to carry our experiences with grace and wisdom."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Quote Section */}
        <div className="mt-16 text-center fade-in delay-1000">
          <div className="bg-gradient-to-r from-white/20 to-white/30 backdrop-blur-sm rounded-3xl p-8 border border-tealgreen/20 shadow-lg max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-6 h-6 bg-tealgreen/30 rounded-full gentle-bounce"></div>
              <div className="w-4 h-4 bg-seagreen/40 rounded-full gentle-bounce delay-200"></div>
              <div className="w-6 h-6 bg-softgreen/30 rounded-full gentle-bounce delay-400"></div>
            </div>
            <blockquote className="text-xl text-slateteal/90 italic leading-relaxed mb-4">
              "You are not your thoughts. You are the observer of your thoughts.
              You are not your emotions. You are the witness of your emotions."
            </blockquote>
            <cite className="text-seagreen font-medium">
              — Mindfulness Wisdom
            </cite>
          </div>
        </div>
      </div>
    </div>
  );
}
