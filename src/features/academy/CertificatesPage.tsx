import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useAcademyStore } from '../../store/academy';
import { Certificate } from '../../types';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { Award, Printer, Copy, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const CertificatesPage: React.FC = () => {
  const { certificates, studentName } = useAcademyStore();
  const { toast } = useToast();

  const [selectedCert, setSelectedCert] = useState<Certificate>(certificates[0]);
  const [certQrUrl, setCertQrUrl] = useState<string>('');

  useEffect(() => {
    if (!selectedCert) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bioniciq.example';
    const verifyUrl = `${origin}${selectedCert.qrVerifyUrl}`;

    QRCode.toDataURL(verifyUrl, {
      margin: 1,
      width: 140,
      color: { dark: '#17231F', light: '#FCFBF8' },
    }).then(setCertQrUrl);
  }, [selectedCert]);

  const handlePrint = () => {
    toast('Generating print-ready PDF layout...', 'info');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleShare = () => {
    const origin = window.location.origin;
    navigator.clipboard.writeText(`${origin}${selectedCert.qrVerifyUrl}`);
    toast('Verification URL copied to clipboard!', 'success');
  };

  return (
    <div className="p-6 sm:p-10 max-w-[1400px] mx-auto text-left space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate tracking-wider block">
            Accredited Credentials
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
            Issued Diplomas & Verifications
          </h1>
          <p className="text-xs text-ink-3 mt-1">
            Printable A4 certificates with cryptographic serial verification for venue compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleShare} icon={<Copy className="w-4 h-4" />}>
            Share Link
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            icon={<Printer className="w-4 h-4" />}
            className="bg-slate text-white"
          >
            Download / Print Diploma
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Certificate Selection List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider block">
            Your Credentials ({certificates.length})
          </span>

          {certificates.map((cert) => {
            const isSelected = selectedCert?.id === cert.id;
            return (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-elevated border-slate ring-1 ring-slate/30 shadow-sm'
                    : 'bg-surface border-line hover:border-line-2'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate">
                    {cert.certificateNumber}
                  </span>
                  <span
                    className={`px-2 py-0.2 rounded text-[10px] font-semibold ${
                      cert.status === 'Valid' ? 'bg-ok-tint text-ok' : 'bg-err-tint text-err'
                    }`}
                  >
                    {cert.status}
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-ink">{cert.courseTitle}</h4>
                <span className="text-[11px] text-ink-3 block">Issued {cert.issueDate}</span>
              </div>
            );
          })}
        </div>

        {/* Right: A4-Landscape Certificate Render (8 cols) */}
        <div className="lg:col-span-8">
          {selectedCert ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white border-2 border-[#D8CEBC] shadow-xl text-center space-y-8 relative overflow-hidden select-none">
              {/* Decorative Corner Ornaments */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-slate/40" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-slate/40" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-slate/40" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-slate/40" />

              <div className="space-y-2">
                <span className="font-serif text-lg tracking-widest text-slate uppercase block">
                  BionicIQ Academy of Technology & Operations
                </span>
                <span className="text-[10px] uppercase tracking-widest text-ink-3 font-mono">
                  ACCREDITED CERTIFICATE OF COMPLETION
                </span>
              </div>

              <div className="space-y-1 pt-4">
                <span className="text-xs text-ink-3 italic">This certifies that</span>
                <h2 className="font-serif text-3xl sm:text-4xl text-ink font-bold tracking-tight">
                  {selectedCert.studentName || studentName}
                </h2>
                <span className="text-xs text-ink-3 italic block pt-1">
                  has demonstrated rigorous operational competency in
                </span>
                <h3 className="font-serif text-2xl text-slate font-bold pt-1">
                  {selectedCert.courseTitle}
                </h3>
              </div>

              {/* Bottom Signatures and QR Code */}
              <div className="pt-8 border-t border-line grid grid-cols-3 items-end text-xs">
                {/* Signature 1 */}
                <div className="text-center space-y-1">
                  <div className="font-serif text-sm italic text-ink border-b border-line pb-1">
                    Dr. Sana Malik
                  </div>
                  <span className="text-[10px] text-ink-3 block">Academic Director</span>
                </div>

                {/* Center QR Mark */}
                <div className="flex flex-col items-center space-y-1">
                  {certQrUrl && (
                    <img src={certQrUrl} alt="Verify QR" className="w-16 h-16 border border-line rounded" />
                  )}
                  <span className="font-mono text-[9px] text-ink-3">{selectedCert.certificateNumber}</span>
                  <a
                    href={selectedCert.qrVerifyUrl}
                    className="text-[9px] text-slate hover:underline font-semibold"
                  >
                    Click to Verify Online
                  </a>
                </div>

                {/* Signature 2 */}
                <div className="text-center space-y-1">
                  <div className="font-serif text-sm italic text-ink border-b border-line pb-1">
                    {selectedCert.issueDate}
                  </div>
                  <span className="text-[10px] text-ink-3 block">Date of Registry</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
