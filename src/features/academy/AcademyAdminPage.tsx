import React, { useState } from 'react';
import { useAcademyStore } from '../../store/academy';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  GraduationCap,
  DollarSign,
  Users,
  Award,
  BookOpen,
  Plus,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  X,
  ArrowRight,
} from 'lucide-react';

export const AcademyAdminPage: React.FC = () => {
  const {
    courses,
    publishCourse,
    unpublishCourse,
    certificates,
    revokeCertificate,
    adminRevenueThisMonth,
    adminNewEnrollmentsThisMonth,
    adminCompletionRate,
    activeLearnersCount,
    refundEnrollment,
  } = useAcademyStore();

  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'students' | 'certificates'>('overview');
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Operations');
  const [newPrice, setNewPrice] = useState(89);
  const [newInstructor, setNewInstructor] = useState('Staff Instructor');

  // 30-day enrollment line chart data
  const chartData = [
    { day: 'Day 1', enrollments: 4 },
    { day: 'Day 5', enrollments: 8 },
    { day: 'Day 10', enrollments: 14 },
    { day: 'Day 15', enrollments: 19 },
    { day: 'Day 20', enrollments: 24 },
    { day: 'Day 25', enrollments: 28 },
    { day: 'Day 30', enrollments: 31 },
  ];

  const handlePublishNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    publishCourse({
      title: newTitle,
      category: newCategory,
      price: newPrice,
      instructor: newInstructor,
    });

    setShowNewCourseModal(false);
    setNewTitle('');
    toast(`Published "${newTitle}"! Now live in the public catalog.`, 'success');
  };

  const handleRevoke = (certId: string) => {
    if (confirm('Revoke this issued certificate? The verification URL will show Revoked.')) {
      revokeCertificate(certId);
      toast('Certificate marked Revoked in registry', 'error');
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-[1500px] mx-auto text-left space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate tracking-wider block">
            School Administration
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
            Academy Operations Console
          </h1>
          <p className="text-xs text-ink-3 mt-1">
            Author modular curricula, audit student cohorts, manage tuition ledgers, and govern certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowNewCourseModal(true)}
            icon={<Plus className="w-4 h-4" />}
            className="bg-slate text-white"
          >
            Author New Course
          </Button>
        </div>
      </div>

      {/* Admin Subtabs */}
      <div className="flex border-b border-line text-xs">
        {[
          { id: 'overview', label: 'Overview & Analytics' },
          { id: 'courses', label: `Courses Management (${courses.length})` },
          { id: 'students', label: 'Enrolled Students (214)' },
          { id: 'certificates', label: `Certificates Registry (${certificates.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`py-2 px-4 border-b-2 font-medium transition-colors ${
              activeTab === t.id
                ? 'border-slate text-slate font-bold'
                : 'border-transparent text-ink-3 hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* KPI Tiles (Section 11 exact values) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-surface border border-line">
              <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider block mb-1">
                Tuition Revenue (This Month)
              </span>
              <span className="font-mono text-3xl font-bold text-ink">
                ${adminRevenueThisMonth.toLocaleString()}
              </span>
              <span className="text-[10px] text-ok block mt-1">+18% vs last month</span>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-line">
              <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider block mb-1">
                New Enrollments
              </span>
              <span className="font-mono text-3xl font-bold text-slate">
                {adminNewEnrollmentsThisMonth}
              </span>
              <span className="text-[10px] text-ink-3 block mt-1">Cohort velocity</span>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-line">
              <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider block mb-1">
                Completion Rate
              </span>
              <span className="font-mono text-3xl font-bold text-ok">
                {adminCompletionRate}%
              </span>
              <span className="text-[10px] text-ok block mt-1">Industry benchmark: 28%</span>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-line">
              <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider block mb-1">
                Active Learners
              </span>
              <span className="font-mono text-3xl font-bold text-primary">
                {activeLearnersCount}
              </span>
              <span className="text-[10px] text-ink-3 block mt-1">Across 14 restaurant groups</span>
            </div>
          </div>

          {/* 30-Day Enrollments Line Chart */}
          <div className="p-6 rounded-2xl bg-elevated border border-line shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-lg font-bold text-ink">30-Day Cumulative Enrollment Pace</h3>
                <p className="text-xs text-ink-3">Live registrations across all operational curricula</p>
              </div>
              <span className="font-mono text-xs font-bold text-slate">31 Total</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="day" stroke="#66736D" fontSize={11} tickLine={false} />
                  <YAxis stroke="#66736D" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FCFBF8', borderColor: '#E3DED3', borderRadius: 8, fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="enrollments"
                    stroke="#4E6A86"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#4E6A86' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Courses Management */}
      {activeTab === 'courses' && (
        <div className="bg-elevated rounded-2xl border border-line overflow-hidden shadow-xs animate-in fade-in duration-150">
          <div className="overflow-x-auto text-xs font-sans">
            <table className="w-full text-left divide-y divide-line">
              <thead className="bg-surface text-ink-3 text-[10px] uppercase font-mono tracking-wider">
                <tr>
                  <th className="p-3">Course Title</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Instructor</th>
                  <th className="p-3">Tuition</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-surface/50 transition-colors">
                    <td className="p-3 font-semibold text-ink">{c.title}</td>
                    <td className="p-3 text-ink-3 font-mono">{c.level}</td>
                    <td className="p-3 text-ink-2">{c.instructor}</td>
                    <td className="p-3 font-mono font-bold text-ink">
                      {c.price === 0 ? 'Free' : `$${c.price}`}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          c.status === 'Published' ? 'bg-ok-tint text-ok' : 'bg-warn-tint text-warn'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {c.status === 'Published' ? (
                        <button
                          type="button"
                          onClick={() => {
                            unpublishCourse(c.id);
                            toast(`Unpublished ${c.title}`, 'info');
                          }}
                          className="text-err hover:underline"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <span className="text-ink-3">Draft</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Students Cohort */}
      {activeTab === 'students' && (
        <div className="bg-elevated rounded-2xl border border-line overflow-hidden shadow-xs p-6 space-y-4 animate-in fade-in duration-150">
          <h3 className="font-serif text-lg font-bold text-ink">Active Student Cohort</h3>
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-surface border border-line flex items-center justify-between">
              <div>
                <p className="font-bold text-ink text-sm">Hira Siddiqui (Operations GM)</p>
                <p className="text-[11px] text-ink-3">h.siddiqui@dininggroup.example · 2 Enrolled Tracks</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-ok font-bold">46% Complete</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    refundEnrollment('restaurant-operations-essentials', 79);
                    toast('Issued $79 tuition refund for Hira Siddiqui', 'info');
                  }}
                >
                  Issue Refund
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Certificates Registry */}
      {activeTab === 'certificates' && (
        <div className="bg-elevated rounded-2xl border border-line overflow-hidden shadow-xs animate-in fade-in duration-150">
          <div className="overflow-x-auto text-xs font-sans">
            <table className="w-full text-left divide-y divide-line">
              <thead className="bg-surface text-ink-3 text-[10px] uppercase font-mono tracking-wider">
                <tr>
                  <th className="p-3">Serial ID</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Course Title</th>
                  <th className="p-3">Date Issued</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-surface/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate">
                      {cert.certificateNumber}
                    </td>
                    <td className="p-3 font-semibold text-ink">{cert.studentName}</td>
                    <td className="p-3 text-ink-2">{cert.courseTitle}</td>
                    <td className="p-3 font-mono text-ink-3">{cert.issueDate}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          cert.status === 'Valid' ? 'bg-ok-tint text-ok' : 'bg-err-tint text-err'
                        }`}
                      >
                        {cert.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {cert.status === 'Valid' ? (
                        <button
                          type="button"
                          onClick={() => handleRevoke(cert.id)}
                          className="text-err hover:underline font-semibold"
                        >
                          Revoke Certificate
                        </button>
                      ) : (
                        <span className="text-ink-3">Rescinded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Author New Course Modal */}
      {showNewCourseModal && (
        <div className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-elevated rounded-2xl border border-line p-6 shadow-2xl text-left space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-line">
              <h3 className="font-serif text-lg font-bold text-ink">Author New Course</h3>
              <button onClick={() => setShowNewCourseModal(false)}>
                <X className="w-4 h-4 text-ink-3" />
              </button>
            </div>

            <form onSubmit={handlePublishNew} className="space-y-3">
              <Input
                label="Course Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Advanced Inventory Forecasting"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Tuition ($ USD)"
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                  required
                />
                <Input
                  label="Lead Instructor"
                  value={newInstructor}
                  onChange={(e) => setNewInstructor(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-ink-2 mb-1.5">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-11 px-3 bg-elevated border border-line-2 rounded-md text-xs font-sans text-ink outline-none"
                >
                  <option value="Operations">Operations</option>
                  <option value="Finance & Analytics">Finance & Analytics</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Leadership">Leadership</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewCourseModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-slate text-white">
                  Publish Immediately
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
