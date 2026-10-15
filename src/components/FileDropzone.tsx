import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface FileDropzoneProps {
  onFileAccepted: (file: File) => void;
  maxSizeBytes?: number;
  acceptFormats?: string[];
  isUploading?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileAccepted,
  maxSizeBytes = 5 * 1024 * 1024, // 5MB
  acceptFormats = ['application/pdf', 'image/png', 'image/jpeg'],
  isUploading = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndHandle = (file: File) => {
    setErrorMessage(null);

    // Validate size
    if (file.size > maxSizeBytes) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is 5MB.`);
      return;
    }

    // Validate type
    if (!acceptFormats.includes(file.type) && !file.name.match(/\.(pdf|png|jpe?g)$/i)) {
      setErrorMessage('Invalid file format. Please upload a PDF, PNG, or JPG document.');
      return;
    }

    setSelectedFile(file);
    setUploadProgress(15);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onFileAccepted(file);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndHandle(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndHandle(e.target.files[0]);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-card p-6 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-meridian-primary bg-meridian-primary-tint/30'
            : 'border-meridian-border-strong bg-meridian-surface hover:bg-meridian-surface-sunken/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleChange}
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="p-3 bg-meridian-surface-sunken rounded-full text-meridian-primary">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-meridian-text-primary">
              Click to select or drag and drop supplier payment proof
            </p>
            <p className="text-xs text-meridian-text-muted mt-1">
              Supports SWIFT MT103 wire receipts, bank statements in PDF, PNG, JPG (up to 5MB)
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-meridian-error-tint/60 text-meridian-error rounded-md text-xs font-medium border border-meridian-error/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {selectedFile && (
        <div className="border border-meridian-border bg-meridian-surface-elevated rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="w-4 h-4 text-meridian-primary shrink-0" />
              <div className="truncate">
                <p className="text-xs font-semibold text-meridian-text-primary truncate">
                  {selectedFile.name}
                </p>
                <p className="text-[11px] text-meridian-text-muted">
                  {(selectedFile.size / 1024).toFixed(0)} KB • {selectedFile.type || 'Document'}
                </p>
              </div>
            </div>
            {uploadProgress === 100 ? (
              <span className="flex items-center gap-1 text-xs text-meridian-success font-medium">
                <CheckCircle2 className="w-4 h-4" /> Ready
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  setUploadProgress(0);
                }}
                className="text-meridian-text-muted hover:text-meridian-text-primary p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative h-1.5 w-full bg-meridian-surface-sunken rounded-full overflow-hidden">
            <div
              className="h-full bg-meridian-primary transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
