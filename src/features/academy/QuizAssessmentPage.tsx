import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizQuestions } from '../../data/seeds/academy';
import { useAcademyStore } from '../../store/academy';
import { Button } from '../../components/ui/Button';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { useToast } from '../../components/ui/Toast';
import {
  ShieldCheck,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const QuizAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { studentName, issueCertificate } = useAcademyStore();
  const { toast } = useToast();

  const [hasStarted, setHasStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(8 * 60); // 8 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Countdown timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hasStarted && !isSubmitted && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((s) => {
          if (s <= 1) {
            setIsSubmitted(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasStarted, isSubmitted, secondsRemaining]);

  const currentQ = quizQuestions[currentIdx];

  // Calculate score
  const correctCount = quizQuestions.reduce((acc, q, idx) => {
    return selectedAnswers[idx] === q.correctAnswer ? acc + 1 : acc;
  }, 0);
  const scorePercent = Math.round((correctCount / quizQuestions.length) * 100);
  const isPassed = scorePercent >= 70;

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    if (isPassed) {
      issueCertificate('Restaurant Operations Essentials', 'restaurant-operations-essentials');
      toast('Certificate issued! Added to your credentials.', 'success');
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="py-12 md:py-16 max-w-2xl mx-auto px-6 text-left font-sans space-y-6">
      {!hasStarted ? (
        /* Intro Card */
        <div className="p-8 sm:p-10 rounded-2xl bg-surface border border-line shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate/10 text-slate">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate tracking-wider block">
                Official Certification Assessment
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                Operations Mastery Assessment
              </h1>
            </div>
          </div>

          <p className="text-xs text-ink-2 leading-relaxed">
            Test your understanding of multi-tenancy, cross-tab synchronization, and anti-AI design systems. Achieving 70% or higher generates your accredited diploma.
          </p>

          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-bg border border-line text-xs font-mono text-center">
            <div>
              <span className="text-[10px] text-ink-3 block">Questions</span>
              <strong className="text-ink text-sm">5 Items</strong>
            </div>
            <div>
              <span className="text-[10px] text-ink-3 block">Time Limit</span>
              <strong className="text-ink text-sm">8 Minutes</strong>
            </div>
            <div>
              <span className="text-[10px] text-ink-3 block">Pass Mark</span>
              <strong className="text-ok text-sm">70%</strong>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/academy/app')}
            >
              Back to Dashboard
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setHasStarted(true)}
              className="bg-slate text-white"
            >
              <span>Begin Assessment</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      ) : !isSubmitted ? (
        /* Question Screen */
        <div className="p-8 rounded-2xl bg-surface border border-line shadow-sm space-y-6">
          {/* Top Bar: Progress Dots & Mono Timer */}
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <div className="flex items-center gap-2">
              {quizQuestions.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentIdx
                      ? 'bg-slate w-6'
                      : selectedAnswers[i] !== undefined
                      ? 'bg-primary'
                      : 'bg-line-2'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Shortcut to simulate timer expiry */}
              <button
                type="button"
                onClick={() => setSecondsRemaining(10)}
                className="text-[10px] text-ink-3 hover:text-clay underline font-mono"
              >
                Set timer to 10s (Test)
              </button>

              <span
                className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                  secondsRemaining <= 60
                    ? 'bg-warn-tint text-warn border-warn/30 animate-pulse'
                    : 'bg-bg text-ink border-line'
                }`}
              >
                ⏱ {formatTimer(secondsRemaining)}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate tracking-wider block">
              Question {currentIdx + 1} of {quizQuestions.length}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Answer Rows (Large 56px rows per Section 7.7) */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentIdx] === optIdx;
              return (
                <div
                  key={optIdx}
                  onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentIdx]: optIdx })}
                  className={`min-h-[56px] p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-elevated border-primary ring-1 ring-primary/40 shadow-xs'
                      : 'bg-elevated border-line hover:border-line-2'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-primary bg-primary' : 'border-line-2'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-xs font-medium text-ink leading-relaxed">{opt}</span>
                </div>
              );
            })}
          </div>

          {/* Bottom Stepper Buttons */}
          <div className="pt-4 border-t border-line flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => i - 1)}
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back</span>
            </Button>

            {currentIdx < quizQuestions.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentIdx((i) => i + 1)}
                className="bg-slate text-white"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                className="bg-ok text-white"
              >
                <span>Submit Assessment</span>
                <CheckCircle2 className="w-4 h-4 ml-1.5" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="p-8 sm:p-10 rounded-2xl bg-surface border border-line shadow-sm text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="flex justify-center">
            <ProgressRing
              progress={scorePercent}
              size={96}
              strokeWidth={8}
              color={isPassed ? 'var(--ok)' : 'var(--err)'}
            />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-3xl font-bold text-ink">
              {isPassed ? 'Assessment Passed!' : 'Requires Review'}
            </h2>
            <p className="text-xs text-ink-2">
              You scored <strong>{scorePercent}%</strong> ({correctCount} of {quizQuestions.length} correct).
            </p>
          </div>

          {isPassed ? (
            <div className="p-4 rounded-xl bg-ok-tint/60 border border-ok/30 space-y-3 max-w-md mx-auto text-left text-xs text-ink">
              <div className="flex items-center gap-2 text-ok font-bold">
                <Award className="w-5 h-5 shrink-0" />
                <span>Certificate Awarded: Restaurant Operations</span>
              </div>
              <p className="text-[11px] text-ink-2">
                Your name <strong>{studentName}</strong> has been registered with unique serial ID.
              </p>
              <Button
                variant="primary"
                size="sm"
                block
                onClick={() => navigate('/academy/app/certificates')}
                className="bg-ok text-white"
              >
                <span>View & Print Diploma</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-err-tint/60 border border-err/30 space-y-3 max-w-md mx-auto text-left text-xs text-ink">
              <p className="text-[11px] text-ink-2">
                You need 70% to pass. Review the lessons on multi-tenancy and modifier validation before retrying.
              </p>
              <Button
                variant="ghost"
                size="sm"
                block
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentIdx(0);
                  setSelectedAnswers({});
                  setSecondsRemaining(8 * 60);
                }}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>Retry Assessment</span>
              </Button>
            </div>
          )}

          {/* Explanations Review */}
          <div className="pt-4 border-t border-line text-left space-y-3">
            <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider block">
              Question Review & Explanations
            </span>
            {quizQuestions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div key={q.id} className="p-3 rounded-xl bg-elevated border border-line text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">Q{idx + 1}: {q.question}</span>
                    {isCorrect ? (
                      <span className="text-ok font-bold text-[10px]">✓ Correct</span>
                    ) : (
                      <span className="text-err font-bold text-[10px]">✗ Missed</span>
                    )}
                  </div>
                  <p className="text-[11px] text-ink-3 italic">{q.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
