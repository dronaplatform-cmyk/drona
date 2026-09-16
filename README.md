```
docker run --name postgres -p 5432:5432 -e POSTGRES_USER="manmeets" -e POSTGRES_PASSWORD="admin"  -e POSTGRES_DB="drona" -d postgres:latest
```

# 🎓 Drona - Modern Educational Platform

> Connecting passionate educators with eager learners through a comprehensive, feature-rich tutoring ecosystem.

[![Live Demo](https://img.shields.io/badge/demo-drona--akf.vercel.app-blue)](https://drona-akf.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.0-teal)](https://www.prisma.io/)

---

## 🌟 Philosophy

**Drona** is named after the legendary teacher from ancient Indian epics, embodying the spirit of mentorship and knowledge transfer. Our platform believes that:

- **Education should be accessible** - Breaking geographical and economic barriers between students and tutors
- **Quality matters** - Connecting learners with verified, skilled educators who are passionate about teaching
- **Accountability drives growth** - Both students and tutors benefit from transparent rating systems and progress tracking
- **Community empowers** - Building an ecosystem where learning is collaborative, not transactional

We're not just another tutoring marketplace; we're creating a comprehensive educational ecosystem with integrated session management, progress analytics, gamification through points systems, and automated scheduling.

---

## 🎯 Problems We Solve

### For Students:
- **Finding the Right Tutor** - Advanced filtering by subject, location, rating, and hourly rate
- **Session Management** - Book, reschedule, and track tutoring sessions seamlessly
- **Progress Tracking** - Analytics dashboard showing learning progress, completed sessions, and areas of improvement
- **Budget Management** - Transparent pricing with integrated payment processing
- **Community Building** - Leaderboards and points system for motivation

### For Tutors:
- **Professional Profile** - Showcase expertise, qualifications, and student reviews
- **Schedule Management** - Automated booking system with availability management
- **Income Tracking** - Dashboard showing earnings, sessions conducted, and student retention
- **Growth Analytics** - Insights into popular subjects, peak booking times, and student engagement

### For Parents:
- **Visibility & Control** - Monitor child's progress, session attendance, and tutor interactions
- **Safety** - Verified tutor profiles with ratings and reviews
- **Communication** - Direct messaging with tutors and real-time session updates

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.0 (App Router)
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS 4.x with custom design system
- **UI Components:** Shadcn/UI + Radix UI primitives
- **State Management:** Redux Toolkit, React Query (TanStack Query)
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion
- **Data Visualization:** Recharts

### Backend
- **Runtime:** Node.js with Next.js API routes
- **Database:** PostgreSQL with Prisma ORM
- **Caching:** Redis (ioredis)
- **Authentication:** NextAuth.js with multiple providers
- **Email Service:** Brevo, Resend, React Email
- **Session Management:** Express Session
- **Scheduled Tasks:** Node-Cron

### DevOps & Tools
- **Deployment:** Vercel
- **Testing:** Jest, React Testing Library
- **Type Safety:** TypeScript with strict mode
- **Code Quality:** ESLint, Prettier
- **Version Control:** Git

### Key Features
- 🔐 Multi-role authentication (Student, Tutor, Parent)
- 📅 Real-time session booking and management
- 💳 Integrated payment processing
- 📊 Comprehensive analytics dashboards
- 🎮 Gamification with points and leaderboards
- 📧 Automated email notifications
- 🔔 Push notifications (Web Push)
- 🌙 Dark mode support
- 📱 Fully responsive design

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database
- Redis server (optional, for caching)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd drona

# Install dependencies
npm install
# or
bun install

# Set up environment variables
cp .env.example .env

# Configure your .env file with:
# - Database URL (PostgreSQL)
# - NextAuth configuration
# - Email service API keys
# - Redis connection (optional)

# Run Prisma migrations
npm run migrate

# Seed the database (optional)
npx prisma db seed

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

### Build for Production

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
drona/
├── src/
│   ├── app/
│   │   ├── (application-pages)/     # Protected app pages
│   │   │   ├── (users)/
│   │   │   │   ├── student/         # Student dashboard
│   │   │   │   ├── tutor/           # Tutor dashboard
│   │   │   │   └── parent/          # Parent dashboard
│   │   │   ├── auth/                # Authentication pages
│   │   │   ├── dashboard/           # Main dashboard
│   │   │   └── profile/             # User profiles
│   │   ├── (marketing-pages)/       # Public pages
│   │   ├── api/                     # API routes
│   │   └── shared/                  # Shared components
│   ├── components/                  # React components
│   ├── lib/                         # Utility functions
│   └── types/                       # TypeScript types
├── prisma/
│   └── schema.prisma               # Database schema
├── public/                         # Static assets
└── package.json
```

---

## 🌐 Key Features

### 1. **Smart Tutor Discovery**
- Advanced search with filters (subject, location, rating, price)
- Tutor profiles with qualifications and reviews
- Real-time availability calendar

### 2. **Session Management**
- Book sessions with one click
- Automated scheduling and reminders
- Session history and recordings support

### 3. **Analytics Dashboard**
- Student progress tracking
- Session completion rates
- Learning streaks and milestones
- Earnings overview (for tutors)

### 4. **Points & Gamification**
- Earn points for completing sessions
- Leaderboard rankings
- Achievement badges
- Transaction history

### 5. **Communication**
- In-app messaging
- Email notifications
- Push notifications

---

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, feature additions, or documentation improvements.

### How to Contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is proprietary software. All rights reserved.

---

## 🎯 Roadmap

- [ ] Mobile app (React Native/Expo)
- [ ] Video conferencing integration
- [ ] AI-powered tutor recommendations
- [ ] Whiteboard collaboration tool
- [ ] Multi-language support
- [ ] Advanced analytics with ML insights
- [ ] Subscription plans for premium features

---

## 📞 Call to Action

### 👨‍🎓 For Students
**Stop wasting time searching for the right tutor.** Join Drona today and get matched with expert tutors in your area. First session on us!

👉 **[Sign Up Now](https://drona-akf.vercel.app/auth/register)**

### 👨‍🏫 For Tutors
**Turn your expertise into income.** Create your profile, set your rates, and start teaching students who need your skills.

👉 **[Become a Tutor](https://drona-akf.vercel.app/auth/register?role=tutor)**

### 👪 For Parents
**Stay informed about your child's learning journey.** Monitor progress, track sessions, and communicate with tutors all in one place.

👉 **[Get Started](https://drona-akf.vercel.app)**

---

## 💬 Support

For questions, feedback, or support:
- 📧 Email: [Your Email]
- 🐛 Issues: [GitHub Issues]
- 💼 LinkedIn: [Your LinkedIn]

---

**Built with ❤️ for the future of education**
