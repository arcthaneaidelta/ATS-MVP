import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcademyStore } from '../../store/academy';
import { Course } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Chip } from '../../components/ui/Chip';
import { Search, Filter, BookOpen, Clock, Star, ArrowRight } from 'lucide-react';

export const AcademyCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { courses } = useAcademyStore();

  const [query, setQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPrice, setSelectedPrice] = useState<'All' | 'Free' | 'Paid'>('All');

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const categories = ['All', 'Operations', 'Finance & Analytics', 'Service Design', 'Compliance', 'Leadership'];

  const filteredCourses = courses.filter((c) => {
    if (c.status !== 'Published') return false;
    const matchesQuery =
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase()) ||
      c.instructor.toLowerCase().includes(query.toLowerCase());
    const matchesLevel = selectedLevel === 'All' || c.level === selectedLevel;
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesPrice =
      selectedPrice === 'All'
        ? true
        : selectedPrice === 'Free'
        ? c.price === 0
        : c.price > 0;

    return matchesQuery && matchesLevel && matchesCategory && matchesPrice;
  });

  return (
    <div className="py-12 md:py-16 max-w-container mx-auto px-6 text-left space-y-8 font-sans">
      {/* Header */}
      <div className="max-w-2xl space-y-3">
        <span className="text-xs uppercase font-bold text-slate tracking-wider block">
          Academy Curriculum
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal leading-tight">
          Explore Operational Courses
        </h1>
        <p className="text-sm text-ink-2 leading-relaxed">
          Accredited modular training built for restaurant managers, kitchen teams, and enterprise hospitality leaders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Rail (3 cols) */}
        <div className="lg:col-span-3 bg-surface rounded-2xl border border-line p-5 space-y-6">
          {/* Search Input */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-ink-3 mb-1.5">
              Search Catalog
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-ink-3 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search title, instructor..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-lg bg-elevated border border-line text-xs font-sans text-ink outline-none"
              />
            </div>
          </div>

          {/* Level Filter */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-ink-3 block">
              Experience Level
            </span>
            <div className="flex flex-col gap-1 text-xs">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`text-left px-2.5 py-1.5 rounded-md transition-colors ${
                    selectedLevel === lvl
                      ? 'bg-elevated font-bold text-slate border border-line shadow-xs'
                      : 'text-ink-2 hover:bg-bg'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-ink-3 block">
              Department
            </span>
            <div className="flex flex-col gap-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left px-2.5 py-1.5 rounded-md transition-colors ${
                    selectedCategory === cat
                      ? 'bg-elevated font-bold text-slate border border-line shadow-xs'
                      : 'text-ink-2 hover:bg-bg'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-ink-3 block">
              Pricing Tier
            </span>
            <div className="grid grid-cols-3 gap-1 text-xs text-center">
              {(['All', 'Paid', 'Free'] as const).map((pr) => (
                <button
                  key={pr}
                  type="button"
                  onClick={() => setSelectedPrice(pr)}
                  className={`py-1 rounded border ${
                    selectedPrice === pr
                      ? 'bg-elevated border-slate text-slate font-bold'
                      : 'bg-bg border-line text-ink-3'
                  }`}
                >
                  {pr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 3-Column Course Grid (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex justify-between items-center text-xs text-ink-3 pb-2 border-b border-line">
            <span>Showing {filteredCourses.length} courses</span>
            <span>Sorted by popularity</span>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-line rounded-2xl bg-surface">
              <p className="text-xs text-ink-2 mb-2">Nothing matches those filters.</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setSelectedLevel('All');
                  setSelectedCategory('All');
                  setSelectedPrice('All');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/academy/courses/${c.slug}`)}
                  className="rounded-2xl bg-elevated border border-line shadow-xs hover:border-slate hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between overflow-hidden"
                >
                  {/* Abstract Tonal Palette Cover (PRD rule: CSS-generated, not stock photos) */}
                  <div className="h-32 bg-gradient-to-br from-[#E4ECE7] to-[#CCDCD2] p-4 flex flex-col justify-between border-b border-line relative">
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-white text-slate border border-slate/20 self-start shadow-2xs">
                      {c.level}
                    </span>
                    <div className="flex items-center gap-1 font-mono text-[10px] text-primary font-bold">
                      <Clock className="w-3 h-3" />
                      <span>{c.durationHours} Hours · {c.lessonCount} Lessons</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-ink group-hover:text-slate transition-colors leading-snug">
                        {c.title}
                      </h3>
                      <p className="text-xs text-ink-2 line-clamp-2 mt-1.5 leading-relaxed">
                        {c.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-line flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-ink-3 block">{c.instructor}</span>
                        <div className="flex items-center gap-1 text-[10px] text-warn">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-mono font-bold text-ink">{c.rating}</span>
                          <span className="text-ink-3">({c.studentsEnrolled})</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-base font-bold text-ink block">
                          {c.price === 0 ? 'Free' : `$${c.price}`}
                        </span>
                        <span className="text-[10px] text-clay font-medium group-hover:underline">
                          View Track →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
