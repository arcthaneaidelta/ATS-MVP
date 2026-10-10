import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { IntakeFormId } from '@/mock/types'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  FileText,
  Save,
  Check,
} from 'lucide-react'

export const IntakeFormPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { orders, submitIntake, addToast } = useStore()

  const currentFormId = (formId?.toUpperCase() as IntakeFormId) || 'A'
  const linkedOrderId = searchParams.get('orderId') || orders[0]?.id

  const linkedOrder = orders.find((o) => o.id === linkedOrderId) || orders[0]

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [autoSavedTime, setAutoSavedTime] = useState('Saved just now')

  // FORM A: Company and Compliance state
  const [companyType, setCompanyType] = useState<'pty' | 'sole'>('pty')
  const [ppadbRegistered, setPpadbRegistered] = useState<'yes' | 'no'>('yes')
  const [startRegistrationSupport, setStartRegistrationSupport] = useState(false)
  const [cipaUploaded, setCipaUploaded] = useState(true)
  const [bursUploaded, setBursUploaded] = useState(true)
  const [ppadbUploaded, setPpadbUploaded] = useState(true)
  const [consentProcessing, setConsentProcessing] = useState(true)
  const [consentNda, setConsentNda] = useState(true)

  // FORM B: Tender Review state
  const [closingWithin7Days, setClosingWithin7Days] = useState<'no' | 'yes'>('no')
  const [rushAcknowledged, setRushAcknowledged] = useState(false)
  const [tenderSource, setTenderSource] = useState('Gov Gazette')
  const [otherSourceText, setOtherSourceText] = useState('')
  const [tenderPackUploaded, setTenderPackUploaded] = useState(true)
  const [consentNoGuarantee, setConsentNoGuarantee] = useState(true)

  // FORM C: Proposal Brief state
  const [hasSiteVisit, setHasSiteVisit] = useState<'no' | 'yes'>('no')
  const [siteVisitDate, setSiteVisitDate] = useState('2026-10-14')
  const [isJointVenture, setIsJointVenture] = useState<'no' | 'yes'>('no')
  const [jvPartnerName, setJvPartnerName] = useState('')
  const [cvsUploaded, setCvsUploaded] = useState(true)
  const [accuracyDeclared, setAccuracyDeclared] = useState(true)

  // Validation error state
  const [stepError, setStepError] = useState('')

  // Simulate auto-save every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoSavedTime('Saved just now')
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const formTitles: Record<IntakeFormId, string> = {
    A: 'Form A: Company and Compliance Returnables',
    B: 'Form B: Tender Document Review & Go/No-Go',
    C: 'Form C: Technical Proposal Brief & Methodology',
  }

  const handleNextStep = () => {
    setStepError('')

    // Conditional step validations
    if (currentFormId === 'A') {
      if (currentStep === 1 && companyType === 'sole' && !cipaUploaded) {
        setStepError('Please attach director national ID copy.')
        return
      }
    } else if (currentFormId === 'B') {
      if (currentStep === 1 && closingWithin7Days === 'yes' && !rushAcknowledged) {
        setStepError('Please acknowledge the Rush handling turnaround terms before continuing.')
        return
      }
    } else if (currentFormId === 'C') {
      if (currentStep === 1 && isJointVenture === 'yes' && !jvPartnerName.trim()) {
        setStepError('Please specify your Joint Venture partner company name.')
        return
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 120, behavior: 'smooth' })
    }
  }

  const handlePrevStep = () => {
    setStepError('')
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 120, behavior: 'smooth' })
    }
  }

  const handleFinalSubmit = () => {
    // Validate final consents
    if (currentFormId === 'A' && (!consentProcessing || !consentNda)) {
      setStepError('You must check both required consent boxes.')
      return
    }
    if (currentFormId === 'B' && (!consentProcessing || !consentNoGuarantee)) {
      setStepError('You must acknowledge the advisory and no-guarantee clauses.')
      return
    }
    if (currentFormId === 'C' && (!consentProcessing || !accuracyDeclared)) {
      setStepError('You must declare document accuracy and provide consent.')
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      submitIntake(linkedOrder.id, currentFormId, {
        formId: currentFormId,
        companyType,
        ppadbRegistered,
        closingWithin7Days,
        hasSiteVisit,
        isJointVenture,
      }, ['Tender-Documents-Pack.pdf'])
    }, 900)
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Top Header & Autosave indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DDD0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
              WPFORMS PRO INTAKE
            </span>
            <span className="text-xs text-[#6F7A78]">· Order: {linkedOrder.orderNumber}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#17323A] mt-1">
            {formTitles[currentFormId]}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-[11px] font-mono text-[#5E7F78] flex items-center gap-1.5 bg-[#FBF9F4] px-2.5 py-1 rounded border border-[#E3DDD0]">
            <Save className="w-3.5 h-3.5" />
            <span>{autoSavedTime}</span>
          </div>

          <BuildMapTag
            label="Intake Logic"
            wpEquivalent="WPForms Pro · Conditional Logic"
            position="inline"
          />
        </div>
      </div>

      {isSubmitted ? (
        <div className="bg-white rounded-[16px] border border-[#3E7A5B] p-8 sm:p-12 text-center space-y-4 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-[#3E7A5B]/15 text-[#3E7A5B] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="font-serif text-3xl font-medium text-[#17323A]">
            Intake received.
          </h2>

          <p className="text-sm text-[#4A5755] max-w-md mx-auto leading-relaxed">
            Your order <strong>{linkedOrder.orderNumber}</strong> is now <strong>In Production</strong>. Senior writer {linkedOrder.writerName} has been notified and document extraction has commenced.
          </p>

          <div className="p-4 rounded-[8px] bg-[#FBF9F4] border border-[#E3DDD0] text-xs text-[#6F7A78] max-w-sm mx-auto">
            A confirmation email has arrived in your mock inbox.
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/portal/orders/${linkedOrder.id}`)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View order in production
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[16px] border border-[#E3DDD0] p-6 sm:p-10 shadow-sm space-y-8">
          {/* Progress Steps Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E3DDD0]">
            <span className="text-xs font-mono font-bold text-[#17323A] uppercase">
              Step {currentStep} of 4
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-1.5 rounded-full ${
                    step <= currentStep ? 'bg-[#17323A]' : 'bg-[#E3DDD0]'
                  }`}
                />
              ))}
            </div>
          </div>

          {stepError && (
            <div className="p-3.5 rounded-[8px] bg-[#A94438]/10 border border-[#A94438] text-xs text-[#A94438] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{stepError}</span>
            </div>
          )}

          {/* ================= FORM A ================= */}
          {currentFormId === 'A' && (
            <>
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="font-serif text-xl font-medium text-[#17323A]">
                    1. Company Entity & Incorporation Structure
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#17323A] block">
                      Legal Company Entity Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCompanyType('pty')}
                        className={`p-3 rounded-[8px] border text-xs font-semibold cursor-pointer ${
                          companyType === 'pty' ? 'border-[#17323A] bg-[#FBF9F4]' : 'border-[#CFC7B6]'
                        }`}
                      >
                        (Pty) Ltd / Private Limited
                      </button>
                      <button
                        type="button"
                        onClick={() => setCompanyType('sole')}
                        className={`p-3 rounded-[8px] border text-xs font-semibold cursor-pointer ${
                          companyType === 'sole' ? 'border-[#17323A] bg-[#FBF9F4]' : 'border-[#CFC7B6]'
                        }`}
                      >
                        Sole Proprietor / Partnership
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#17323A] block">
                      Are you currently registered on the PPADB / PPRA portal?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPpadbRegistered('yes')}
                        className={`p-3 rounded-[8px] border text-xs font-semibold cursor-pointer ${
                          ppadbRegistered === 'yes' ? 'border-[#17323A] bg-[#FBF9F4]' : 'border-[#CFC7B6]'
                        }`}
                      >
                        Yes, we have active registration
                      </button>
                      <button
                        type="button"
                        onClick={() => setPpadbRegistered('no')}
                        className={`p-3 rounded-[8px] border text-xs font-semibold cursor-pointer ${
                          ppadbRegistered === 'no' ? 'border-[#17323A] bg-[#FBF9F4]' : 'border-[#CFC7B6]'
                        }`}
                      >
                        No, not yet registered
                      </button>
                    </div>
                  </div>

                  {/* CONDITIONAL LOGIC 1: If PPADB = No */}
                  {ppadbRegistered === 'no' && (
                    <div className="p-4 rounded-[8px] bg-[#EFEADF] border border-[#B8864B] space-y-2 animate-in fade-in">
                      <div className="text-xs font-bold text-[#8A5F2B] font-mono uppercase">
                        Notice · PPADB Registration Support
                      </div>
                      <p className="text-xs text-[#4A5755] leading-relaxed">
                        Public tenders in Botswana require registered PPADB procurement codes. Would you like our team to assemble and submit your PPRA registration dossier alongside this order?
                      </p>
                      <Checkbox
                        label="Yes, initiate PPADB registration assistance for our company."
                        checked={startRegistrationSupport}
                        onChange={(e) => setStartRegistrationSupport(e.target.checked)}
                      />
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="font-serif text-xl font-medium text-[#17323A]">
                    2. Mandatory Compliance Documents Upload
                  </h3>

                  <div className="space-y-4">
                    {/* Upload Slot 1: CIPA */}
                    <div className="p-4 rounded-[8px] border border-[#E3DDD0] bg-[#FBF9F4] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#5E7F78]" />
                        <div>
                          <div className="text-xs font-semibold text-[#17323A]">
                            {companyType === 'pty' ? 'CIPA Certificate of Incorporation' : 'National ID Document'}
                          </div>
                          <div className="text-[11px] text-[#6F7A78]">Kgosi-Mining-CIPA-Certificate.pdf (480 KB)</div>
                        </div>
                      </div>
                      <span className="text-xs text-[#3E7A5B] font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Attached</span>
                      </span>
                    </div>

                    {/* Upload Slot 2: BURS Tax Clearance */}
                    <div className="p-4 rounded-[8px] border border-[#E3DDD0] bg-[#FBF9F4] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#3F6C8C]" />
                        <div>
                          <div className="text-xs font-semibold text-[#17323A]">
                            BURS Valid Tax Clearance Certificate
                          </div>
                          <div className="text-[11px] text-[#6F7A78]">BURS-Tax-Clearance-Valid-2027.pdf (512 KB)</div>
                        </div>
                      </div>
                      <span className="text-xs text-[#3E7A5B] font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Attached</span>
                      </span>
                    </div>

                    {/* Upload Slot 3: PPADB Certificate (Conditional: Only if PPADB registered = Yes) */}
                    {ppadbRegistered === 'yes' && (
                      <div className="p-4 rounded-[8px] border border-[#E3DDD0] bg-[#FBF9F4] flex items-center justify-between animate-in fade-in">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#B8864B]" />
                          <div>
                            <div className="text-xs font-semibold text-[#17323A]">
                              PPADB Registration Certificate
                            </div>
                            <div className="text-[11px] text-[#6F7A78]">PPADB-Accreditation-Code-120.pdf (640 KB)</div>
                          </div>
                        </div>
                        <span className="text-xs text-[#3E7A5B] font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Attached</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="font-serif text-xl font-medium text-[#17323A]">
                    3. Past Contract Track Record & Referees
                  </h3>
                  <p className="text-xs text-[#4A5755]">
                    Evaluators verify 3 past completed contracts. List client referees below:
                  </p>

                  <div className="space-y-3">
                    <Input
                      label="Referee 1 (Client Organization, Project Title, Contact Phone)"
                      defaultValue="Morupule Coal Mine · Drilling Spares · +267 492 0000"
                    />
                    <Input
                      label="Referee 2 (Client Organization, Project Title, Contact Phone)"
                      defaultValue="Debswana Jwaneng Mine · Industrial Consumables · +267 588 4000"
                    />
                    <Input
                      label="Referee 3 (Client Organization, Project Title, Contact Phone)"
                      defaultValue="City of Gaborone Council · PPE Supply · +267 365 7400"
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="font-serif text-xl font-medium text-[#17323A]">
                    4. Final Review & Statutory Consents
                  </h3>

                  <div className="p-4 rounded-[8px] bg-[#FBF9F4] border border-[#E3DDD0] space-y-2 text-xs">
                    <div className="font-semibold text-[#17323A]">Review Submission Summary:</div>
                    <div>· Entity: {companyType === 'pty' ? '(Pty) Ltd' : 'Sole Proprietor'}</div>
                    <div>· PPADB Registered: {ppadbRegistered.toUpperCase()}</div>
                    <div>· Documents: CIPA Certificate, BURS Clearance, Past Referees attached.</div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Checkbox
                      label="I consent to TenderVantage processing and holding our statutory documents under strict confidentiality."
                      checked={consentProcessing}
                      onChange={(e) => setConsentProcessing(e.target.checked)}
                    />
                    <Checkbox
                      label="I acknowledge that submitted tax pins and directorship data are genuine and legally valid."
                      checked={consentNda}
                      onChange={(e) => setConsentNda(e.target.checked)}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* ================= FORM B ================= */}
          {currentFormId === 'B' && (
            <>
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="font-serif text-xl font-medium text-[#17323A]">
                    1. Tender Urgency & Closing Date
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#17323A] block">
                      Is this tender closing within 7 calendar days?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setClosingWithin7Days('yes')}
                        className={`p-3 rounded-[8px] border text-xs font-semibold cursor-pointer ${
                          closingWithin7Days === 'yes' ? 'border-[#17323A] bg-[#FBF9F4]' : 'border-[#CFC7B6]'
                        }`}
                      >
                        Yes (Urgent closing)
                      </button>
                      <button
                        type="button"
                        onClick={() => setClosingWithin7Days('no')}
                        className={`p-3 rounded-[8px] border text-xs font-semibold cursor-pointer ${
                          closingWithin7Days === 'no' ? 'border-[#17323A] bg-[#FBF9F4]' : 'border-[#CFC7B6]'
                        }`}
                      >
                        No (Standard schedule)
                      </button>
                    </div>
                  </div>

                  {/* CONDITIONAL LOGIC: If closing within 7 days = Yes */}
                  {closingWithin7Days === 'yes' && (
                    <div className="p-4 rounded-[8px] bg-[#A94438]/10 border border-[#A94438] space-y-2 animate-in fade-in">
                      <div className="text-xs font-bold text-[#A94438] font-mono uppercase">
                        ⚡ Rush Handling Priority Dispatch Notice
                      </div>
                      <p className="text-xs text-[#4A5755] leading-relaxed">
                        Tenders closing in under 7 days require emergency writer sprint shifts to ensure no returnable is missed.
                      </p>
                      <Checkbox
                        label="I acknowledge that urgent submissions prioritize critical Stage 1 disqualification prevention."
                        checked={rushAcknowledged}
                        onChange={(e) => setRushAcknowledged(e.target.checked)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#17323A] block">
                      Where was this tender published?
                    </label>
                    <select
                      value={tenderSource}
                      onChange={(e) => setTenderSource(e.target.value)}
                      className="w-full h-11 px-3 rounded-[8px] bg-white border border-[#CFC7B6] text-xs font-semibold text-[#17323A] cursor-pointer"
                    >
                      <option value="Gov Gazette">Government Gazette</option>
                      <option value="Daily News">Daily News Botswana</option>
                      <option value="Mining Portal">Debswana / Mining House</option>
                      <option value="Other">Other Procurement Source</option>
                    </select>
                  </div>

                  {/* CONDITIONAL: If tender source = Other */}
                  {tenderSource === 'Other' && (
                    <Input
                      label="Specify procurement source"
                      value={otherSourceText}
                      onChange={(e) => setOtherSourceText(e.target.value)}
                      placeholder="e.g. BPC direct invitation or council notice board"
                    />
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="font-serif text-xl font-medium text-[#17323A]">
                    2. Upload Tender Invitation Document
                  </h3>
                  <div className="p-4 rounded-[8px] border border-[#E3DDD0] bg-[#FBF9F4] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#3F6C8C]" />
                      <div>
                        <div className="text-xs font-semibold text-[#17323A]">
                          Invitation to Tender Pack (ITT)
                        </div>
                        <div className="text-[11px] text-[#6F7A78]">NR-2026-114-Tender-Specification-Pack.pdf (6.4 MB)</div>
                      </div>
                    </div>
                    <span className="text-xs text-[#3E7A5B] font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </span>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="font-serif text-xl font-medium text-[#17323A]">
                    3. Client Priorities & Feasibility
                  </h3>
                  <Textarea
                    label="What is your main commercial concern with this tender?"
                    defaultValue="We need to verify if the 10% performance bond can be provided via an insurance guarantee rather than cash deposit."
                  />
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="font-serif text-xl font-medium text-[#17323A]">
                    4. Final Review & Advisory Consents
                  </h3>
                  <div className="space-y-3">
                    <Checkbox
                      label="I consent to TenderVantage analyzing tender documents for this Go / No-Go review."
                      checked={consentProcessing}
                      onChange={(e) => setConsentProcessing(e.target.checked)}
                    />
                    <Checkbox
                      label="I acknowledge that Go/No-Go reviews provide advisory evaluations and do not guarantee tender awards."
                      checked={consentNoGuarantee}
                      onChange={(e) => setConsentNoGuarantee(e.target.checked)}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* ================= FORM C ================= */}
          {currentFormId === 'C' && (
            <>
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="font-serif text-xl font-medium text-[#17323A]">
                    1. Tender Scope, Site Visit & Joint Venture
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#17323A] block">
                      Was there a compulsory site visit or pre-bid meeting?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setHasSiteVisit('yes')}
                        className={`p-3 rounded-[8px] border text-xs font-semibold cursor-pointer ${
                          hasSiteVisit === 'yes' ? 'border-[#17323A] bg-[#FBF9F4]' : 'border-[#CFC7B6]'
                        }`}
                      >
                        Yes, attended
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasSiteVisit('no')}
                        className={`p-3 rounded-[8px] border text-xs font-semibold cursor-pointer ${
                          hasSiteVisit === 'no' ? 'border-[#17323A] bg-[#FBF9F4]' : 'border-[#CFC7B6]'
                        }`}
                      >
                        No site visit required
                      </button>
                    </div>
                  </div>

                  {/* CONDITIONAL: Site visit date */}
                  {hasSiteVisit === 'yes' && (
                    <div className="p-3.5 bg-[#FBF9F4] rounded-[8px] border border-[#E3DDD0] space-y-2 animate-in fade-in">
                      <Input
                        label="Date of attended site visit"
                        type="date"
                        value={siteVisitDate}
                        onChange={(e) => setSiteVisitDate(e.target.value)}
                        hint="Attendance register will be cross-checked during Stage 1 review."
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#17323A] block">
                      Are you bidding as a Joint Venture (JV)?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsJointVenture('yes')}
                        className={`p-3 rounded-[8px] border text-xs font-semibold cursor-pointer ${
                          isJointVenture === 'yes' ? 'border-[#17323A] bg-[#FBF9F4]' : 'border-[#CFC7B6]'
                        }`}
                      >
                        Yes, Joint Venture
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsJointVenture('no')}
                        className={`p-3 rounded-[8px] border text-xs font-semibold cursor-pointer ${
                          isJointVenture === 'no' ? 'border-[#17323A] bg-[#FBF9F4]' : 'border-[#CFC7B6]'
                        }`}
                      >
                        No, Sole Prime Bidder
                      </button>
                    </div>
                  </div>

                  {/* CONDITIONAL: JV Partner */}
                  {isJointVenture === 'yes' && (
                    <Input
                      label="Joint Venture Partner Company Name"
                      value={jvPartnerName}
                      onChange={(e) => setJvPartnerName(e.target.value)}
                      placeholder="e.g. Kalahari Engineering Partners (Pty) Ltd"
                      isRequired
                    />
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="font-serif text-xl font-medium text-[#17323A]">
                    2. Technical Staff Credentials & CVs
                  </h3>
                  <div className="p-4 rounded-[8px] border border-[#E3DDD0] bg-[#FBF9F4] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#5E7F78]" />
                      <div>
                        <div className="text-xs font-semibold text-[#17323A]">
                          Key Technical Staff CVs & ERB Certifications
                        </div>
                        <div className="text-[11px] text-[#6F7A78]">Drilling-Engineer-Certifications-CVs.pdf (1.4 MB)</div>
                      </div>
                    </div>
                    <span className="text-xs text-[#3E7A5B] font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </span>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="font-serif text-xl font-medium text-[#17323A]">
                    3. Pricing Inputs & Raw BoQ
                  </h3>
                  <Textarea
                    label="Pricing Notes / Preferred Margin Target"
                    defaultValue="Target margin is 18% net of 14% VAT. Diesel transportation from Palapye depot is factored in."
                  />
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="font-serif text-xl font-medium text-[#17323A]">
                    4. Declarations & Submission
                  </h3>
                  <div className="space-y-3">
                    <Checkbox
                      label="I consent to TenderVantage authoring technical responses based on these inputs."
                      checked={consentProcessing}
                      onChange={(e) => setConsentProcessing(e.target.checked)}
                    />
                    <Checkbox
                      label="I declare that all staff CVs and pricing assumptions are accurate and verifiable."
                      checked={accuracyDeclared}
                      onChange={(e) => setAccuracyDeclared(e.target.checked)}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-[#E3DDD0] flex items-center justify-between">
            {currentStep > 1 ? (
              <Button
                variant="secondary"
                size="md"
                onClick={handlePrevStep}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleNextStep}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleFinalSubmit}
                isLoading={isSubmitting}
                loadingText="Submitting to TenderVantage..."
                rightIcon={<Check className="w-4 h-4" />}
              >
                Submit to TenderVantage
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
