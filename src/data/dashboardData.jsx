import { FaBook, FaClock, FaBullseye } from "react-icons/fa"

export const statIcons = {
  books: <FaBook />,
  time: <FaClock />,
  goal: <FaBullseye />,
}

export const yearlyBookGoal = 12

export const initialRecentSessions = [
  {
    id: 1,
    bookTitle: "Atomic Habits",
    duration: 25,
    date: "Today",
  },
  {
    id: 2,
    bookTitle: "The Psychology of Money",
    duration: 40,
    date: "Yesterday",
  },
  {
    id: 3,
    bookTitle: "Deep Work",
    duration: 30,
    date: "2 days ago",
  },
]

export const initialRecommendations = [
  {
    id: 1,
    title: "Thinking, Fast and Slow",
    reason: "Because you enjoy habit and psychology books.",
  },
  {
    id: 2,
    title: "The Power of Habit",
    reason: "A good match for your reading interests.",
  },
]

export const initialLibraryBooks = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    status: "Reading",
  },
  {
    id: 2,
    title: "Deep Work",
    author: "Cal Newport",
    status: "Completed",
  },
  {
    id: 3,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    status: "Want to Read",
  },
]