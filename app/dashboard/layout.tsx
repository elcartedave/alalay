import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import {
  Heart,
  BookOpen,
  FileText,
  Star,
  CheckSquare,
  Sparkles,
  MessageCircle,
  PenTool,
  Wind,
  BarChart3,
  Home,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alalay - Mental Health Assistant",
  description: "Your personal mental health companion",
};

const navigationData = {
  dashboard: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
  ],
  tracking: [
    {
      title: "Daily Emotions Tracker",
      url: "/dashboard/mood",
      icon: Heart,
    },
    {
      title: "Statistical Report/Progress",
      url: "/dashboard/progress",
      icon: BarChart3,
    },
  ],
  journaling: [
    {
      title: "Diary/Journal",
      url: "/dashboard/journals",
      icon: BookOpen,
    },
    {
      title: "Note/Letter to Self",
      url: "/notes",
      icon: FileText,
    },
    {
      title: "Compliment Yourself Diary",
      url: "/dashboard/compliments",
      icon: Star,
    },
    {
      title: "Daily Prompt",
      url: "/prompts",
      icon: PenTool,
    },
  ],
  goals: [
    {
      title: "Goals/Checklist",
      url: "/goals",
      icon: CheckSquare,
    },
  ],
  support: [
    {
      title: "Daily Affirmations (AI)",
      url: "/affirmations",
      icon: Sparkles,
    },
    {
      title: "Chatbot",
      url: "/dashboard/chat",
      icon: MessageCircle,
    },
  ],
  wellness: [
    {
      title: "Breathing Exercise / Meditation",
      url: "/dashboard/meditation",
      icon: Wind,
    },
  ],
};

function AppSidebar() {
  return (
    <Sidebar className="border-r border-tealgreen/30 bg-midnight">
      <SidebarHeader className="flex h-16 items-center gap-2 bg-slateteal border-b border-deepaqua/50 px-4">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-tealgreen text-midnight">
            <Heart className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold text-mint">Alalay</span>
            <span className="text-xs text-softgreen">
              Mental Health Assistant
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-midnight">
        <SidebarGroup>
          <SidebarGroupLabel className="text-tealgreen font-medium px-3 py-2 text-xs uppercase tracking-wider">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.dashboard.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="text-softgreen hover:bg-slateteal hover:text-mint transition-colors duration-200 mx-2 rounded-md"
                  >
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-tealgreen font-medium px-3 py-2 text-xs uppercase tracking-wider">
            Tracking & Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.tracking.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="text-softgreen hover:bg-slateteal hover:text-mint transition-colors duration-200 mx-2 rounded-md"
                  >
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-tealgreen font-medium px-3 py-2 text-xs uppercase tracking-wider">
            Journaling & Reflection
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.journaling.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="text-softgreen hover:bg-slateteal hover:text-mint transition-colors duration-200 mx-2 rounded-md"
                  >
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-tealgreen font-medium px-3 py-2 text-xs uppercase tracking-wider">
            Goals & Planning
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.goals.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="text-softgreen hover:bg-slateteal hover:text-mint transition-colors duration-200 mx-2 rounded-md"
                  >
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-tealgreen font-medium px-3 py-2 text-xs uppercase tracking-wider">
            AI Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.support.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="text-softgreen hover:bg-slateteal hover:text-mint transition-colors duration-200 mx-2 rounded-md"
                  >
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-tealgreen font-medium px-3 py-2 text-xs uppercase tracking-wider">
            Wellness Activities
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.wellness.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="text-softgreen hover:bg-slateteal hover:text-mint transition-colors duration-200 mx-2 rounded-md"
                  >
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-4 py-4">
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="w-full text-softgreen hover:bg-slateteal hover:text-mint transition-colors duration-200 py-2 px-4 rounded-md text-sm font-medium"
            >
              Log Out
            </button>
          </form>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <SidebarProvider>
          <AppSidebar />
          <header className="flex h-16 shrink-0 items-center gap-2 bg-mint px-4">
            <SidebarTrigger className="-ml-1 text-slateteal hover:bg-softgreen/30" />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-mint">
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
