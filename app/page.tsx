'use client';

import Navbar from './components/navbar/Navbar';
import Timer from './components/timer/Timer';
import Todo from './components/todo/Todo';
import Calendar from './components/calendar/Calendar';
import Time from './components/time/Time';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Navbar />
      <main className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
          <Time />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-1">
              <Timer />
            </div>
            <div className="lg:col-span-1">
              <Todo />
            </div>
            <div className="lg:col-span-1">
              <Calendar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
