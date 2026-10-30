import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Course, Lesson } from '../../types';
import {
  GraduationCap,
  PlayCircle,
  CheckCircle,
  Circle,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  Download,
  Share2,
  FileText,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react';

export const MyCourseDashboard: React.FC = () => {
  const { courses, userProgress, toggleLessonComplete, setActiveTab } = useApp();

  // Find enrolled courses
  const enrolledCoursesList = courses.filter((c) =>
    userProgress.enrolledCourses.includes(c.id)
  );

  // Active playing course & lesson
  const [activeCourseId, setActiveCourseId] = useState<string>(
    enrolledCoursesList[0]?.id || courses[0]?.id
  );

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  const firstLesson = activeCourse?.modules[0]?.lessons[0];
  const [activeLesson, setActiveLesson] = useState<Lesson | undefined>(firstLesson);
  const [activeTabSub, setActiveTabSub] = useState<'overview' | 'notes' | 'resources'>('overview');

  // Calculate course completion percentage
  const completedInActive = userProgress.completedLessons[activeCourse?.id] || [];
  const totalLessonsInActive = activeCourse?.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  ) || 1;
  const progressPercent = Math.min(
    100,
    Math.round((completedInActive.length / totalLessonsInActive) * 100)
  );

  const isCurrentLessonComplete = activeLesson
    ? completedInActive.includes(activeLesson.id)
    : false;

  return (
    <div className="py-10 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF] mb-1">
              <button
                onClick={() => setActiveTab('home')}
                className="hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Platform
              </button>
              <span>/</span>
              <span>Learning Dashboard</span>
            </div>
            <h1 className="text-3xl font-extrabold font-heading text-white">
              My Trading Courses
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#087BFF]/20 border border-[#087BFF]/40 text-[#00D9FF] text-xs font-mono font-semibold flex items-center gap-2">
              <Award className="w-4 h-4 text-[#00E59B]" />
              <span>{enrolledCoursesList.length} Courses Enrolled</span>
            </span>
          </div>
        </div>

        {/* Course Switcher Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {enrolledCoursesList.map((course) => {
            const completedCount = (userProgress.completedLessons[course.id] || []).length;
            const total = course.modules.reduce((a, m) => a + m.lessons.length, 0);
            const pct = Math.round((completedCount / (total || 1)) * 100);

            return (
              <button
                key={course.id}
                onClick={() => {
                  setActiveCourseId(course.id);
                  setActiveLesson(course.modules[0]?.lessons[0]);
                }}
                className={`p-4 rounded-2xl border text-left min-w-[260px] transition-all ${
                  activeCourseId === course.id
                    ? 'bg-[#0A1224] border-[#087BFF] shadow-lg shadow-[#087BFF]/20'
                    : 'bg-[#050914] border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="text-xs font-mono text-[#00D9FF] uppercase">{course.level}</div>
                <div className="font-bold text-white text-sm truncate mt-1">{course.title}</div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#087BFF] to-[#00E59B] h-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-1 flex justify-between">
                  <span>Progress</span>
                  <span className="text-white font-bold">{pct}%</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Video Player & Syllabus Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Player & Lesson Notes Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Interactive Player Screen */}
            <div className="rounded-3xl bg-[#0A1224] border border-[#087BFF]/30 p-2 overflow-hidden shadow-2xl">
              <div className="relative aspect-video rounded-2xl bg-black flex flex-col items-center justify-center overflow-hidden group">
                {/* Background Poster Image */}
                <img
                  src={activeCourse.thumbnail}
                  alt={activeCourse.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30 filter blur-xs"
                />

                {/* Central Play Trigger Button */}
                <div className="relative z-10 text-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-[#087BFF]/80 text-white flex items-center justify-center mx-auto shadow-2xl shadow-[#087BFF]/50 group-hover:scale-110 transition-transform cursor-pointer">
                    <PlayCircle className="w-10 h-10 fill-white" />
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-[#00D9FF]">
                      Now Playing • Lesson {activeLesson?.id}
                    </div>
                    <h3 className="text-lg font-bold font-heading text-white">
                      {activeLesson?.title || 'Course Orientation'}
                    </h3>
                  </div>
                </div>

                {/* Video HUD Control Bar */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between text-xs text-white font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-[#00E59B]">HD 1080p</span>
                    <span>{activeLesson?.duration || '15:00'}</span>
                  </div>
                  <button
                    onClick={() =>
                      activeLesson && toggleLessonComplete(activeCourse.id, activeLesson.id)
                    }
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      isCurrentLessonComplete
                        ? 'bg-[#00E59B] text-black'
                        : 'bg-[#087BFF] text-white hover:brightness-110'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{isCurrentLessonComplete ? 'Completed' : 'Mark Lesson Complete'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Lesson Details & Sub-Tabs */}
            <div className="p-6 rounded-3xl bg-[#0A1224]/80 border border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold font-heading text-white">
                    {activeLesson?.title}
                  </h2>
                  <div className="text-xs text-[#AAB5C5] mt-1">
                    Course: <strong className="text-white">{activeCourse.title}</strong> • Instructor:{' '}
                    <strong className="text-white">{activeCourse.instructor.name}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      activeLesson && toggleLessonComplete(activeCourse.id, activeLesson.id)
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                      isCurrentLessonComplete
                        ? 'bg-[#00E59B]/10 border-[#00E59B] text-[#00E59B]'
                        : 'bg-[#050914] border-gray-700 text-gray-300 hover:text-white'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isCurrentLessonComplete ? 'Lesson Completed' : 'Mark Complete'}</span>
                  </button>
                </div>
              </div>

              {/* Lesson Summary */}
              <div className="p-4 rounded-2xl bg-[#050914] border border-gray-800 text-sm text-[#AAB5C5] leading-relaxed">
                <p className="font-semibold text-white mb-1">Key Takeaway:</p>
                {activeLesson?.summary ||
                  'Understand institutional liquidity, order block formation, and optimal trade entries with verified probabilistic math.'}
              </div>
            </div>
          </div>

          {/* Right Column: Syllabus & Course Progress */}
          <div className="lg:col-span-4 space-y-6">
            {/* Progress Card */}
            <div className="p-6 rounded-3xl bg-[#0A1224]/90 border border-[#087BFF]/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#AAB5C5]">
                  Course Progress
                </span>
                <span className="text-base font-mono font-extrabold text-[#00E59B]">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-[#050914] rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#087BFF] to-[#00E59B] h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-xs text-[#AAB5C5]">
                {completedInActive.length} of {totalLessonsInActive} lessons finished.
              </div>
            </div>

            {/* Modules & Lessons List */}
            <div className="p-6 rounded-3xl bg-[#0A1224]/80 border border-gray-800 space-y-4 max-h-[600px] overflow-y-auto">
              <h3 className="text-sm font-bold font-heading text-white uppercase tracking-wider">
                Modules & Syllabus
              </h3>

              <div className="space-y-4">
                {activeCourse.modules.map((mod, modIdx) => (
                  <div key={mod.id} className="space-y-2">
                    <div className="text-xs font-bold text-[#00D9FF] flex items-center justify-between">
                      <span>{mod.title}</span>
                      <span className="font-mono text-gray-500 text-[10px]">{mod.duration}</span>
                    </div>

                    <div className="space-y-1.5 pl-1">
                      {mod.lessons.map((lesson) => {
                        const isDone = completedInActive.includes(lesson.id);
                        const isSelected = activeLesson?.id === lesson.id;

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`w-full text-left p-3 rounded-xl text-xs flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-[#087BFF]/20 border border-[#087BFF]/50 text-white'
                                : 'bg-[#050914] border border-transparent text-gray-300 hover:border-gray-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {isDone ? (
                                <CheckCircle className="w-4 h-4 text-[#00E59B] shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-600 shrink-0" />
                              )}
                              <span className="truncate max-w-[180px] font-medium">
                                {lesson.title}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-gray-500">
                              {lesson.duration}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
