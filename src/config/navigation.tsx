import { IconBook, IconCalendar, IconChartBar, IconDashboard, IconHome, IconMessage, IconSearch, IconSettings, IconUser } from "@tabler/icons-react";

export interface NavItem {
  title: string;
  href: string;
  icon: any;
}

export const parentNavItems: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: IconHome },
  { title: "Reports", href: "/parent/reports", icon: IconChartBar },
  { title: "Queries", href: "/parent/query", icon: IconMessage },
  // { title: "Schedule", href: "/dashboard/schedule", icon: IconCalendar },
  // { title: "Progress", href: "/dashboard/progress", icon: IconChartBar },
  // { title: "Messages", href: "/dashboard/messages", icon: IconMessage },
  { title: "Profile", href: "/profile/parent", icon: IconUser },
  // { title: "Payments", href: "/parent/payments", icon: IconCreditCard },
  { title: "Find Tutors", href: "/tutors", icon: IconSearch },
];

export const tutorNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: IconDashboard },
  { title: "Students", href: "/tutor/students", icon: IconUser },
  { title: "All Classes", href: "/tutor/classes", icon: IconBook },
  // { title: "Messages", href: "/dashboard/messages", icon: IconMessage },
  { title: "Queries", href: "/tutor/query", icon: IconMessage },
  { title: "Profile", href: "/profile/tutor", icon: IconSettings },
  // { title: "Schedule", href: "/dashboard/schedule", icon: IconCalendar },
];

export const studentNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: IconDashboard },
  { title: "Homework", href: "/student/homework", icon: IconBook },
  { title: "Attendance", href: "/student/attendance", icon: IconCalendar },
  { title: "Queries", href: "/student/query", icon: IconMessage },
  { title: "Profile", href: "/profile/student", icon: IconUser },
  // { title: "Messages", href: "/dashboard/messages", icon: IconMessage },
  // { title: "Schedule", href: "/dashboard/schedule", icon: IconCalendar },
  // { title: "Find Tutors", href: "/tutors", icon: IconSearch },
];
