import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Course, Certificate } from '../types';
import { initialCourses, initialCertificates } from '../data/seeds/academy';

interface AcademyState {
  courses: Course[];
  enrolledCourseSlugs: string[];
  completedLessonIds: string[];
  certificates: Certificate[];
  studentName: string;
  studentEmail: string;
  weeklyHoursLearned: number;
  currentStreakDays: number;
  adminRevenueThisMonth: number;
  adminNewEnrollmentsThisMonth: number;
  adminCompletionRate: number;
  activeLearnersCount: number;

  // Actions
  enrollInCourse: (slug: string) => void;
  markLessonComplete: (lessonId: string) => void;
  issueCertificate: (courseTitle: string, courseSlug: string) => Certificate;
  revokeCertificate: (certId: string) => void;
  publishCourse: (courseData: Partial<Course>) => void;
  unpublishCourse: (courseId: string) => void;
  refundEnrollment: (courseSlug: string, amount: number) => void;
}

export const useAcademyStore = create<AcademyState>()(
  persist(
    (set, get) => ({
      courses: initialCourses,
      enrolledCourseSlugs: ['restaurant-operations-essentials', 'reading-your-numbers'],
      // Hira Siddiqui progress: Restaurant Ops lessons 1-10 complete, Data Lit lessons 1-2 complete
      completedLessonIds: [
        'les-1', 'les-2', 'les-3', 'les-4', 'les-5', 'les-6', 'les-7', 'les-8', 'les-9', 'les-10',
        'les-dl-1', 'les-dl-2',
      ],
      certificates: initialCertificates,
      studentName: 'Hira Siddiqui',
      studentEmail: 'h.siddiqui@dininggroup.example',
      weeklyHoursLearned: 4.8,
      currentStreakDays: 5,
      adminRevenueThisMonth: 4860,
      adminNewEnrollmentsThisMonth: 31,
      adminCompletionRate: 62,
      activeLearnersCount: 214,

      enrollInCourse: (slug) =>
        set((state) => {
          if (state.enrolledCourseSlugs.includes(slug)) return state;
          const course = state.courses.find((c) => c.slug === slug);
          const price = course?.price || 0;
          return {
            enrolledCourseSlugs: [...state.enrolledCourseSlugs, slug],
            adminRevenueThisMonth: state.adminRevenueThisMonth + price,
            adminNewEnrollmentsThisMonth: state.adminNewEnrollmentsThisMonth + 1,
          };
        }),

      markLessonComplete: (lessonId) =>
        set((state) => {
          if (state.completedLessonIds.includes(lessonId)) return state;
          return {
            completedLessonIds: [...state.completedLessonIds, lessonId],
            weeklyHoursLearned: Number((state.weeklyHoursLearned + 0.3).toFixed(1)),
          };
        }),

      issueCertificate: (courseTitle, courseSlug) => {
        const state = get();
        const randNum = Math.floor(400 + Math.random() * 50);
        const certNumber = `BIQ-2026-00${randNum}`;
        const newCert: Certificate = {
          id: `cert-${Date.now()}`,
          certificateNumber: certNumber,
          studentName: state.studentName,
          courseTitle,
          courseSlug,
          issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          status: 'Valid',
          qrVerifyUrl: `/academy/verify/${certNumber}`,
        };

        set({ certificates: [newCert, ...state.certificates] });
        return newCert;
      },

      revokeCertificate: (certId) =>
        set((state) => ({
          certificates: state.certificates.map((c) =>
            c.id === certId || c.certificateNumber === certId ? { ...c, status: 'Revoked' } : c
          ),
        })),

      publishCourse: (courseData) =>
        set((state) => {
          const newCourse: Course = {
            id: `course-${Date.now()}`,
            slug: (courseData.title || 'new-course').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: courseData.title || 'Untitled Course',
            description: courseData.description || 'Newly added course on BionicIQ Academy.',
            level: courseData.level || 'Beginner',
            instructor: courseData.instructor || 'Staff Instructor',
            instructorRole: 'Curriculum Specialist',
            lessonCount: courseData.lessonCount || 8,
            durationHours: courseData.durationHours || 2.5,
            price: courseData.price ?? 49,
            rating: 5.0,
            studentsEnrolled: 0,
            status: 'Published',
            category: courseData.category || 'Operations',
            modules: courseData.modules || [
              {
                id: `mod-${Date.now()}`,
                title: 'Module 1: Introduction',
                lessons: [
                  { id: `les-${Date.now()}-1`, title: '1.1 Getting Started', duration: '12:00', durationMinutes: 12 },
                ],
              },
            ],
          };
          return { courses: [newCourse, ...state.courses] };
        }),

      unpublishCourse: (courseId) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === courseId ? { ...c, status: 'Draft' } : c
          ),
        })),

      refundEnrollment: (courseSlug, amount) =>
        set((state) => ({
          enrolledCourseSlugs: state.enrolledCourseSlugs.filter((s) => s !== courseSlug),
          adminRevenueThisMonth: Math.max(0, state.adminRevenueThisMonth - amount),
        })),
    }),
    {
      name: 'bioniciq-academy-store',
    }
  )
);
