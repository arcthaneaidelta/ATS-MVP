import React, { useState } from 'react';
import { Draw } from '../../types';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { AddressField } from '../ui/AddressField';

export const VerifyStepper: React.FC<{ draw: Draw }> = ({ draw }) => {
  const [showRawJson, setShowRawJson] = useState(false);

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* 4-Node Plain English Explanation */}
      <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-md p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-[#1B2420] mb-4">
          Plain-English Verification Stepper
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="p-4 bg-[#FBF9F5] border border-[#DDD8CD] rounded-md">
            <span className="text-xs font-mono text-[#B08A4E] font-bold block mb-1">Phase 1</span>
            <h5 className="text-sm font-semibold text-[#1B2420] mb-1">Entries Sealed</h5>
            <p className="text-xs text-[#4A5650] leading-relaxed">
              When the countdown struck zero, the smart contract locked all {draw.entriesCount} participants. No further entries could be inserted.
            </p>
          </div>

          <div className="p-4 bg-[#FBF9F5] border border-[#DDD8CD] rounded-md">
            <span className="text-xs font-mono text-[#B08A4E] font-bold block mb-1">Phase 2</span>
            <h5 className="text-sm font-semibold text-[#1B2420] mb-1">VRF Oracle Called</h5>
            <p className="text-xs text-[#4A5650] leading-relaxed">
              A decentralized request was fired to Chainlink VRF on Base L2, committing to a future random seed outside operator influence.
            </p>
          </div>

          <div className="p-4 bg-[#FBF9F5] border border-[#DDD8CD] rounded-md">
            <span className="text-xs font-mono text-[#B08A4E] font-bold block mb-1">Phase 3</span>
            <h5 className="text-sm font-semibold text-[#1B2420] mb-1">Cryptographic Proof</h5>
            <p className="text-xs text-[#4A5650] leading-relaxed">
              The oracle fulfilled the call with an ECDSA cryptographic proof verified directly inside the Base EVM smart contract bytecode.
            </p>
          </div>

          <div className="p-4 bg-[#FBF9F5] border border-[#DDD8CD] rounded-md">
            <span className="text-xs font-mono text-[#B08A4E] font-bold block mb-1">Phase 4</span>
            <h5 className="text-sm font-semibold text-[#1B2420] mb-1">Winner Selected</h5>
            <p className="text-xs text-[#4A5650] leading-relaxed">
              The 256-bit integer was divided by {draw.entriesCount}. The mathematical remainder derived Winning Ticket #{draw.winningEntryNumber}.
            </p>
          </div>
        </div>
      </div>

      {/* Raw Cryptographic Data */}
      <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-md p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#1B2420]">
            Cryptographic Artifacts & On-Chain Proof
          </h4>
          <a
            href={`https://basescan.org/tx/${draw.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#2C4A3E] hover:underline flex items-center gap-1 font-medium"
          >
            <span>View on BaseScan (Demo Tx)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AddressField
            label="Chainlink VRF Request ID"
            address={draw.vrfRequestId}
            isTruncated={false}
          />
          <AddressField
            label="Base Settlement Transaction Hash"
            address={draw.txHash}
            isTruncated={false}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#7C867F]">
            256-Bit Random Word (Full Integer)
          </span>
          <div className="p-3 bg-[#EDE9E1] border border-[#DDD8CD] rounded-md text-xs font-mono text-[#1B2420] break-all select-all">
            {draw.randomWord}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-[#FBF9F5] border border-[#DDD8CD] rounded">
            <span className="text-xs text-[#7C867F] block">Base Block Height</span>
            <span className="text-sm font-mono font-medium text-[#1B2420]">
              {draw.blockNumber.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-[#FBF9F5] border border-[#DDD8CD] rounded">
            <span className="text-xs text-[#7C867F] block">Winning Entry</span>
            <span className="text-sm font-mono font-medium text-[#B08A4E]">
              Ticket #{draw.winningEntryNumber}
            </span>
          </div>
          <div className="p-3 bg-[#FBF9F5] border border-[#DDD8CD] rounded">
            <span className="text-xs text-[#7C867F] block">Verification Status</span>
            <span className="text-sm font-medium text-[#3E7D5A] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#3E7D5A]" />
              Provably Verified
            </span>
          </div>
        </div>

        {/* Collapsible Raw JSON */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowRawJson(!showRawJson)}
            className="text-xs text-[#7C867F] hover:text-[#1B2420] flex items-center gap-1 cursor-pointer font-medium"
          >
            <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${showRawJson ? 'rotate-180' : ''}`} />
            <span>{showRawJson ? 'Hide raw contract log JSON' : 'Inspect raw contract log JSON'}</span>
          </button>
          {showRawJson && (
            <pre className="mt-2 p-3 bg-[#16201C] text-[#EDE9E1] rounded text-[11px] font-mono overflow-x-auto leading-relaxed">
              {JSON.stringify(draw, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
