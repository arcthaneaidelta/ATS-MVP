import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAcademyStore } from '../../store/academy';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, AlertTriangle, ShieldCheck, ArrowLeft, Building2 } from 'lucide-react';

export const CertificateVerifyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { certificates } = useAcademyStore();

  const cert = certificates.find((c) => c.certificateNumber === id || c.id === id);

  const isValid = cert?.status === 'Valid';
  const isRevoked = cert?.status === 'Revoked';

  return (
    <div className="py-16 md:py-24 max-w-lg mx-auto px-6 text-center font-sans space-y-6">
      <div className="flex justify-center mb-2">
        <button
          onClick={() => navigate('/academy')}
          className="inline-flex items-center gap-1.5 text-xs text-ink-3 hover:text-ink font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Academy Home</span>
        </button>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-surface border border-line shadow-lg space-y-6 text-left">
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <span className="text-[10px] uppercase font-bold text-slate tracking-wider font-mono">
            BionicIQ Verification Ledger
          </span>
          <span className="font-mono text-xs text-ink-3">ID: {id}</span>
        </div>

        {cert && isValid ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-ok-tint border border-ok/20 text-ok">
              <CheckCircle2 className="w-6 h-6 shrink-0 stroke-[2.5]" />
              <div>
                <h3 className="font-bold text-sm">Official Credential Verified</h3>
                <p className="text-[11px] text-ok/80">Tamper-proof record confirmed in registry</p>
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-line pt-2">
              <div className="flex justify-between py-1.5">
                <span className="text-ink-3">Recipient Name:</span>
                <span className="font-bold text-ink">{cert.studentName}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-ink-3">Course Title:</span>
                <span className="font-bold text-ink">{cert.courseTitle}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-ink-3">Date of Issuance:</span>
                <span className="font-mono text-ink">{cert.issueDate}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-ink-3">Status:</span>
                <span className="text-ok font-bold">Valid & Active</span>
              </div>
            </div>
          </div>
        ) : isRevoked ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-err-tint border border-err/20 text-err">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold text-sm">Certificate Revoked</h3>
                <p className="text-[11px] text-err/80">This credential was revoked by Academy Admin</p>
              </div>
            </div>
            <p className="text-xs text-ink-3">
              The credential ID {id} has been administratively rescinded.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-warn-tint border border-warn/20 text-warn">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold text-sm">Unknown Credential ID</h3>
                <p className="text-[11px] text-warn/80">No matching serial record found</p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-line text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/academy/app/certificates')}
            block
          >
            Open Student Certificates Portal
          </Button>
        </div>
      </div>
    </div>
  );
};
