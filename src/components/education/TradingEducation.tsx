import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Course } from '../../types';
import {
  GraduationCap,
  Clock,
  BookOpen,
  Star,
  Users,
  ArrowRight,
  CheckCircle,
  PlayCircle,
  X,
} from 'lucide-react';

export const TradingEducation: React.FC = () => {
  const { courses, enrollInCourse, userProgress, setActiveTab } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Mastery'];

  const filteredCourses =
    selectedLevel === 'All'
      ? courses
      : courses.filter((c) => c.level === selectedLevel);

  const handleEnrollAndLearn = async (course: Course) => {
    await enrollInCourse(course.id);
    setActiveCourseModal(null);
    setActiveTab('my-courses');
  };

  return (
    <section id="education" className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#087BFF]/15 border border-[#087BFF]/30 mb-3">
              <GraduationCap className="w-4 h-4 text-[#00D9FF]" />
              <span className="text-xs font-mono font-bold text-[#00D9FF] uppercase tracking-wider">
                NOVA FX Institutional Academy
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
              MASTER THE ART OF TRADING
            </h2>
            <p className="text-base text-[#AAB5C5] mt-2 max-w-xl">
              Curated by funded prop-firm traders and quantitative analysts. Built to take you from foundational market mechanics to institutional mastery.
            </p>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center p-1.5 rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 overflow-x-auto">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedLevel === lvl
                    ? 'bg-[#087BFF] text-white shadow-lg shadow-[#087BFF]/25'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const isEnrolled = userProgress.enrolledCourses.includes(course.id);

            return (
              <div
                key={course.id}
                className="group rounded-3xl bg-[#0A1224]/90 border border-[#087BFF]/20 hover:border-[#00D9FF]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#087BFF]/15 flex flex-col justify-between overflow-hidden"
              >
                {/* Thumbnail Container */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1224] via-transparent to-black/30" />

                  {/* Level Pill */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase backdrop-blur-md ${
                        course.level === 'Beginner'
                          ? 'bg-[#00E59B]/20 border border-[#00E59B]/40 text-[#00E59B]'
                          : course.level === 'Intermediate'
                          ? 'bg-[#00D9FF]/20 border border-[#00D9FF]/40 text-[#00D9FF]'
                          : course.level === 'Advanced'
                          ? 'bg-[#087BFF]/30 border border-[#087BFF]/60 text-white'
                          : 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                      }`}
                    >
                      {course.level}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{course.rating.toFixed(1)}</span>
                  </div>

                  {/* Enrolled Badge if already taking */}
                  {isEnrolled && (
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-[#00E59B]/20 border border-[#00E59B]/40 text-[#00E59B] text-xs font-mono font-semibold flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Enrolled</span>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-[#AAB5C5] mb-2 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#087BFF]" />
                        {course.duration}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-[#00D9FF]" />
                        {course.lessonsCount} Lessons
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-heading text-white group-hover:text-[#00D9FF] transition-colors leading-snug">
                      {course.title}
                    </h3>

                    <p className="text-sm text-[#AAB5C5] mt-2.5 line-clamp-2 leading-relaxed">
                      {course.shortDescription}
                    </p>
                  </div>

                  {/* Instructor & CTA */}
                  <div className="pt-6 mt-6 border-t border-gray-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#087BFF]/40"
                      />
                      <div className="text-xs">
                        <div className="font-semibold text-white">{course.instructor.name}</div>
                        <div className="text-[10px] text-gray-400">{course.instructor.role}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveCourseModal(course)}
                      className="px-4 py-2 rounded-xl bg-[#087BFF]/15 border border-[#087BFF]/40 text-[#00D9FF] hover:bg-[#087BFF] hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 group-hover:shadow-lg group-hover:shadow-[#087BFF]/20"
                    >
                      <span>Explore Course</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Detailed Preview Modal */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0A1224] border border-[#087BFF]/40 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setActiveCourseModal(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#087BFF]/20 text-[#00D9FF]">
                {activeCourseModal.level}
              </span>
              <span className="text-xs font-mono text-gray-400">{activeCourseModal.duration}</span>
              <span className="text-xs font-mono text-gray-400">
                {activeCourseModal.studentsCount.toLocaleString()} Students Enrolled
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              {activeCourseModal.title}
            </h2>

            <p className="text-sm text-[#AAB5C5] leading-relaxed">
              {activeCourseModal.fullDescription}
            </p>

            {/* Modules Syllabus List */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold font-heading text-white uppercase tracking-wider">
                Curriculum Syllabus
              </h4>
              <div className="space-y-2">
                {activeCourseModal.modules.map((mod) => (
                  <div key={mod.id} className="p-3.5 rounded-xl bg-[#050914] border border-gray-800">
                    <div className="font-semibold text-xs text-white mb-2">{mod.title}</div>
                    <div className="space-y-1.5 pl-2">
                      {mod.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between text-xs text-[#AAB5C5]"
                        >
                          <span className="flex items-center gap-2">
                            <PlayCircle className="w-3.5 h-3.5 text-[#00D9FF]" />
                            {lesson.title}
                          </span>
                          <span className="font-mono text-[11px] text-gray-500">
                            {lesson.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-white text-sm">
                  {activeCourseModal.rating.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400">
                  ({activeCourseModal.reviewsCount} reviews)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveCourseModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-700 text-xs font-semibold text-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() => handleEnrollAndLearn(activeCourseModal)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#00D9FF] text-white text-xs font-bold shadow-lg shadow-[#087BFF]/30 hover:brightness-110 flex items-center gap-2"
                >
                  <span>Start Learning Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
