import "@/app/globals.css";
export const metadata = {
  title: "Alalay - Login",
  description: "Login to Alalay",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
