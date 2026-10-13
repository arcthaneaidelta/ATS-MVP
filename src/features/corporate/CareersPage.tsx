import React, { useState } from 'react';
import { jobRoles } from '../../data/seeds/corporate';
import { JobRole } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Chip } from '../../components/ui/Chip';
import { useToast } from '../../components/ui/Toast';
import {
  Search,
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  X,
  Upload,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

export const CareersPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);

  // Apply Drawer State
  const [applyStep, setApplyStep] = useState<number>(1);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePortfolio, setCandidatePortfolio] = useState('');
  const [cvUploaded, setCvUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { toast } = useToast();

  const teams = ['All', 'Engineering', 'Design', 'Product', 'Operations'];
  const locations = ['All', 'Remote', 'On-site'];

  const filteredRoles = jobRoles.filter((role) => {
    const matchesQuery =
      role.title.toLowerCase().includes(query.toLowerCase()) ||
      role.description.toLowerCase().includes(query.toLowerCase());
    const matchesTeam = selectedTeam === 'All' || role.team === selectedTeam;
    const matchesLoc = selectedLocation === 'All' || role.location === selectedLocation;
    return matchesQuery && matchesTeam && matchesLoc;
  });

  const handleSimulateCvUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setCvUploaded(true);
      toast('CV uploaded successfully (resume_2026.pdf)', 'success');
    }, 900);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast('Application submitted successfully!', 'success');
  };

  const resetApplyDrawer = () => {
    setSelectedRole(null);
    setApplyStep(1);
    setCandidateName('');
    setCandidateEmail('');
    setCandidatePortfolio('');
    setCvUploaded(false);
    setIsSubmitted(false);
  };

  return (
    <div className="py-16 md:py-24 max-w-container mx-auto px-6 text-left space-y-12">
      {/* Header */}
      <div className="max-w-2xl space-y-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-clay block">
          Open Positions
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal leading-tight">
          Work with senior engineers who care about craft.
        </h1>
        <p className="text-base text-ink-2 leading-relaxed">
          We operate as a high-density, autonomous engineering collective building flagships for ambitious tech companies. No fluff, no endless meetings.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-surface border border-line space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-ink-3 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles by title or keyword..."
              className="w-full h-10 pl-9 pr-3 rounded-md bg-elevated border border-line text-xs font-sans text-ink placeholder:text-ink-3 outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-ink-3 mr-1">Team:</span>
            {teams.map((t) => (
              <Chip
                key={t}
                label={t}
                selected={selectedTeam === t}
                onClick={() => setSelectedTeam(t)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-ink-3 pt-2 border-t border-line/60">
          <span>Showing {filteredRoles.length} open opportunities</span>
          <span>·</span>
          <span>Location:</span>
          {locations.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setSelectedLocation(loc)}
              className={`hover:underline ${
                selectedLocation === loc ? 'text-primary font-bold' : 'text-ink-3'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Role Rows List */}
      <div className="space-y-3">
        {filteredRoles.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-line rounded-xl bg-surface">
            <p className="text-sm text-ink-2 mb-2">No open roles match those filters.</p>
            <p className="text-xs text-ink-3 mb-4">
              Join our talent network to be alerted when matching opportunities open.
            </p>
            <div className="max-w-xs mx-auto flex gap-2">
              <input
                type="email"
                placeholder="you@domain.example"
                className="flex-1 h-9 px-3 rounded-md border border-line bg-elevated text-xs text-ink"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => toast('Added to talent list!', 'success')}
              >
                Join
              </Button>
            </div>
          </div>
        ) : (
          filteredRoles.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className="p-5 rounded-xl bg-surface border border-line hover:border-line-2 hover:bg-elevated transition-all duration-150 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-serif text-xl text-ink group-hover:text-primary transition-colors">
                    {role.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-bg border border-line text-ink-2">
                    {role.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-ink-3">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    {role.team}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {role.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {role.posted}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-semibold text-clay group-hover:translate-x-1 transition-transform">
                <span>View role & apply</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* 560px Apply Drawer */}
      {selectedRole && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xl h-full bg-elevated border-l border-line p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-line mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-clay tracking-wider">
                    {selectedRole.team} · {selectedRole.location}
                  </span>
                  <h2 className="font-serif text-2xl text-ink mt-0.5">{selectedRole.title}</h2>
                </div>
                <button
                  onClick={resetApplyDrawer}
                  className="p-1.5 text-ink-3 hover:text-ink rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!isSubmitted ? (
                <div className="space-y-6">
                  {/* Role Brief */}
                  <div className="space-y-3">
                    <p className="text-xs text-ink-2 leading-relaxed">{selectedRole.description}</p>
                    <div className="space-y-1.5 pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-ink block">
                        What We Look For:
                      </span>
                      {selectedRole.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-ink-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-ok shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3-Step Application Form */}
                  <div className="pt-6 border-t border-line space-y-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-ink-3">
                      <span>Step {applyStep} of 2</span>
                      <span>{applyStep === 1 ? 'Personal Details' : 'CV Upload & Review'}</span>
                    </div>

                    {applyStep === 1 ? (
                      <div className="space-y-3">
                        <Input
                          label="Full Name"
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          placeholder="e.g. Maya Lin"
                          required
                        />
                        <Input
                          label="Email Address"
                          type="email"
                          value={candidateEmail}
                          onChange={(e) => setCandidateEmail(e.target.value)}
                          placeholder="maya@example.com"
                          required
                        />
                        <Input
                          label="GitHub / Portfolio / LinkedIn"
                          value={candidatePortfolio}
                          onChange={(e) => setCandidatePortfolio(e.target.value)}
                          placeholder="https://github.com/..."
                        />
                        <Button
                          variant="primary"
                          size="md"
                          block
                          disabled={!candidateName || !candidateEmail}
                          onClick={() => setApplyStep(2)}
                        >
                          Continue to CV Upload →
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 border-2 border-dashed border-line rounded-xl text-center space-y-3 bg-surface/50">
                          {cvUploaded ? (
                            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-ok">
                              <FileCheck className="w-5 h-5 text-ok" />
                              <span>resume_2026.pdf (1.2 MB) attached</span>
                            </div>
                          ) : isUploading ? (
                            <div className="space-y-2">
                              <div className="w-full h-1.5 bg-line rounded-full overflow-hidden">
                                <div className="h-full bg-clay animate-pulse w-3/4" />
                              </div>
                              <span className="text-xs text-ink-3">Simulating upload...</span>
                            </div>
                          ) : (
                            <div>
                              <Upload className="w-6 h-6 text-ink-3 mx-auto mb-1" />
                              <p className="text-xs font-semibold text-ink">Upload your CV</p>
                              <p className="text-[11px] text-ink-3">PDF or DOCX (Max 5 MB)</p>
                              <button
                                type="button"
                                onClick={handleSimulateCvUpload}
                                className="mt-2 text-xs text-clay font-bold underline"
                              >
                                Click to attach sample CV
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="p-3 rounded-lg bg-surface border border-line text-xs space-y-1">
                          <span className="text-[10px] uppercase font-bold text-ink-3 block">
                            Summary
                          </span>
                          <p className="text-ink font-medium">{candidateName} ({candidateEmail})</p>
                          <p className="text-ink-3 text-[11px] truncate">{candidatePortfolio}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="md"
                            onClick={() => setApplyStep(1)}
                          >
                            Back
                          </Button>
                          <Button
                            variant="primary"
                            size="md"
                            block
                            isLoading={isSubmitting}
                            disabled={!cvUploaded}
                            onClick={handleApplySubmit}
                          >
                            Submit Application
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center space-y-4 my-auto">
                  <div className="w-12 h-12 rounded-full bg-ok-tint text-ok flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <h3 className="font-serif text-2xl text-ink">Application Received</h3>
                  <p className="text-xs text-ink-2 max-w-sm mx-auto leading-relaxed">
                    Thank you, {candidateName}. Our engineering lead reviews every submission within two working days.
                  </p>
                  <Button variant="ghost" size="sm" onClick={resetApplyDrawer}>
                    Close Drawer
                  </Button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-line text-center text-[11px] text-ink-3">
              BionicIQ is an equal opportunity engineering collective.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
