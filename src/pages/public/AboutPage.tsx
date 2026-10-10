import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react'

interface TeamMember {
  name: string
  role: string
  initials: string
  bio: string
  credentials: string
}

export const AboutPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [expandedMethod, setExpandedMethod] = useState<number | null>(null)

  const team: TeamMember[] = [
    {
      name: 'Lorato Dube',
      role: 'Head of Bids & Senior Evaluator',
      initials: 'LD',
      credentials: 'BSc Project Management, 12 years Botswana public procurement',
      bio: 'Lorato led procurement evaluations for infrastructure and mining concessions before joining TenderVantage. She oversees all technical methodology drafting and ensures full compliance with Botswana PPRA standards.',
    },
    {
      name: 'Kabo Ntshole',
      role: 'Senior Bid Writer',
      initials: 'KN',
      credentials: 'BA English & Public Administration (UB), ex-Government Gazetting',
      bio: 'Kabo specializes in turning complex engineering, IT, and medical equipment specifications into concise, scoring-oriented proposals. He has authored over 140 successful submissions across SADC.',
    },
    {
      name: 'Mpho Rantao',
      role: 'Compliance & Statutory Specialist',
      initials: 'MR',
      credentials: 'LLB, Commissioner of Oaths, CIPA & BURS liaison',
      bio: 'Mpho audits Stage 1 returnables, sworn affidavits, joint venture agreements, and BURS e-services clearances. His eagle eye ensures zero clerical disqualifications.',
    },
  ]

  const methodSteps = [
    {
      num: '01',
      title: 'Read the Invitation to Tender (ITT)',
      summary: 'We read every line of instructions, addenda, and terms before writing a word.',
      expanded: 'Every statutory returnable, guarantee clause, and qualification rule is extracted into an internal audit matrix to guarantee Stage 1 compliance.',
    },
    {
      num: '02',
      title: 'Map Against Evaluator Rubrics',
      summary: 'We structure the submission to mirror the published scoring methodology.',
      expanded: 'Evaluators look for specific headings and cross-references. We align our drafts directly to the marks breakdown for effortless scoring.',
    },
    {
      num: '03',
      title: 'Write with Evidence and Precision',
      summary: 'We eliminate vague marketing fluff in favour of verifiable technical proof.',
      expanded: 'Detailed work breakdown schedules, mobilization timelines, risk registers, and audited BoQ schedules replace hollow claims.',
    },
    {
      num: '04',
      title: 'Check and Index for Submission',
      summary: 'A cold audit catches arithmetic slips, missing stamps, and packaging errors.',
      expanded: 'We provide indexed tabs, certified copy counts, and tender box envelope labelling instructions for seamless delivery.',
    },
  ]

  const standards = [
    'Strict document confidentiality governed by non-disclosure agreements.',
    'Plain-language authoring: no generic corporate buzzwords or vague promises.',
    'Honest appraisal: no fabricated win-rate claims or unethical award guarantees.',
    'Fixed-price transparency in Botswana Pula with no hidden contingency billings.',
    'Prompt, direct communication without chasing through email or WhatsApp.',
  ]

  return (
    <div className="py-20 lg:py-28 px-6 sm:px-10">
      <div className="max-w-[1240px] mx-auto space-y-24">
        {/* Intro */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
              ABOUT TENDERVANTAGE
            </div>
            <h1 className="type-h1 text-[#17323A] leading-tight">
              Specialists in one thing: the tender.
            </h1>
            <div className="space-y-4 text-base sm:text-lg text-[#4A5755] leading-relaxed">
              <p>
                TenderVantage was founded in Gaborone with a single purpose: to give Botswana contractors and suppliers the rigorous, professional bid authoring usually reserved for multinational corporations.
              </p>
              <p>
                Winning public and private procurement is not a lottery. It is an exercise in meticulous reading, disciplined evidence mapping, and persuasive plain-language writing under strict deadline pressure.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button variant="primary" size="lg" onClick={() => navigate('/store')}>
                View our services
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/contact')}>
                Talk to our team
              </Button>
            </div>

            <BuildMapTag
              label="About Intro"
              wpEquivalent="Elementor Pro · About Page Template"
              position="top-left"
            />
          </div>

          <div className="lg:col-span-5 flex justify-center">
            {/* Duotone Still Life Graphic */}
            <div className="w-full max-w-[380px] aspect-[4/5] rounded-[16px] bg-[#17323A] border border-[#224752] p-8 flex flex-col justify-between shadow-[0_12px_28px_-10px_rgba(23,50,58,0.2)] text-[#F6F3EC]">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B8864B]">
                  Established in Gaborone
                </span>
                <h3 className="font-serif text-2xl font-medium">
                  The calm desk of a careful editor.
                </h3>
              </div>

              <div className="space-y-4 text-xs text-[#CFC7B6] font-mono leading-relaxed border-t border-white/10 pt-6">
                <div>· Gaborone CBD, Botswana</div>
                <div>· PPRA & CEE Compliance Specialists</div>
                <div>· Fixed-Price Consulting in BWP</div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Method */}
        <section className="space-y-10 border-t border-[#E3DDD0] pt-16">
          <div className="max-w-xl">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
              HOW WE OPERATE
            </div>
            <h2 className="type-h2 text-[#17323A] mt-1">Our method</h2>
            <p className="text-base text-[#4A5755] mt-2">
              Four steps applied systematically to every document. Click any step to read our working rules.
            </p>
          </div>

          <div className="divide-y divide-[#E3DDD0] border-y border-[#E3DDD0]">
            {methodSteps.map((m, idx) => {
              const isExpanded = expandedMethod === idx
              return (
                <div
                  key={m.num}
                  onClick={() => setExpandedMethod(isExpanded ? null : idx)}
                  className="py-6 cursor-pointer group hover:bg-[#FBF9F4] transition-colors px-2 -mx-2 rounded-[6px]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-6">
                      <span className="font-serif text-3xl sm:text-4xl text-[#B8864B] font-normal shrink-0">
                        {m.num}
                      </span>
                      <div>
                        <h3 className="font-serif text-2xl text-[#17323A] group-hover:text-[#B8864B] transition-colors">
                          {m.title}
                        </h3>
                        <p className="text-sm text-[#4A5755] mt-1">{m.summary}</p>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-5 h-5 text-[#6F7A78] group-hover:text-[#17323A] transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-[#E3DDD0]/50 ml-14 text-sm text-[#1B2625] leading-relaxed animate-in fade-in">
                      {m.expanded}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Standards */}
        <section className="bg-[#FBF9F4] rounded-[16px] border border-[#E3DDD0] p-8 sm:p-12 space-y-6">
          <div className="max-w-xl">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
              PROFESSIONAL ETHICS
            </div>
            <h2 className="type-h2 text-[#17323A] mt-1">Our standards</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {standards.map((std, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-[8px] border border-[#E3DDD0]">
                <CheckCircle2 className="w-5 h-5 text-[#3E7A5B] shrink-0 mt-0.5" />
                <span className="text-sm text-[#1B2625] leading-relaxed">{std}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Team Strip */}
        <section className="space-y-10 border-t border-[#E3DDD0] pt-16">
          <div className="max-w-xl">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
              THE TEAM
            </div>
            <h2 className="type-h2 text-[#17323A] mt-1">Senior bid practitioners</h2>
            <p className="text-sm text-[#4A5755] mt-1">
              Click any team member to review their background and procurement credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                onClick={() => setSelectedMember(member)}
                className="p-6 bg-white rounded-[12px] border border-[#E3DDD0] hover:border-[#17323A] hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-full bg-[#DCE5DF] text-[#17323A] font-serif text-xl flex items-center justify-center font-semibold mb-4 group-hover:bg-[#17323A] group-hover:text-[#F6F3EC] transition-colors">
                  {member.initials}
                </div>

                <h3 className="font-serif text-xl font-medium text-[#17323A]">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-[#8A5F2B] mt-0.5">{member.role}</p>
                <p className="text-xs text-[#6F7A78] mt-2 line-clamp-2 leading-relaxed">
                  {member.credentials}
                </p>

                <div className="mt-4 pt-3 border-t border-[#E3DDD0] flex items-center justify-between text-xs text-[#17323A] font-semibold">
                  <span>View profile</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Team Member Bio Modal */}
      {selectedMember && (
        <Modal
          isOpen={Boolean(selectedMember)}
          onClose={() => setSelectedMember(null)}
          title={selectedMember.name}
          description={selectedMember.role}
        >
          <div className="space-y-4 text-sm text-[#1B2625] leading-relaxed">
            <div className="p-3 rounded-[8px] bg-[#FBF9F4] border border-[#E3DDD0] text-xs font-mono text-[#8A5F2B]">
              {selectedMember.credentials}
            </div>
            <p>{selectedMember.bio}</p>
          </div>
        </Modal>
      )}
    </div>
  )
}
