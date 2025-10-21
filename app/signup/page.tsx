import SignupForm from "@/components/SignupForm";

export default function Signup({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mint to-softgreen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slateteal mb-2">
              Create Account
            </h1>
            <p className="text-seagreen">Join us and start your journey</p>
          </div>

          <SignupForm error={searchParams.error} />

          <div className="mt-6 text-center">
            <p className="text-sm text-seagreen">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-deepaqua hover:text-seagreen transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
