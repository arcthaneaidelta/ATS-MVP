import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import {
  ShieldCheck,
  Lock,
  Layers,
  KeyRound,
  Cpu,
  AlertCircle,
  Play,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const TrustCenterPage: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<number>(3); // 1 to 5
  const [isTestingRateLimit, setIsTestingRateLimit] = useState<boolean>(false);
  const [rateLimitLogs, setRateLimitLogs] = useState<
    { id: number; timestamp: string; status: number; message: string }[]
  >([]);

  const layers = [
    {
      id: 1,
      name: 'Layer 1: Browser & Client Application',
      subtitle: 'Zero crypto vocabulary, SSO, and localized caching',
      whatItDoes:
        'Presents standard dollar balances and bank-grade UI. Generates deterministic CREATE2 address displays without requiring browser extensions or client-side private key storage.',
      whatItPrevents:
        'Phishing attacks targeting seed phrases, malicious browser extension wallet drains, and end-user gas management errors.',
      status: 'Protected',
    },
    {
      id: 2,
      name: 'Layer 2: Edge API Gateway & Anti-Bot Defense',
      subtitle: 'Token-bucket rate limiters & sybil filtering',
      whatItDoes:
        'Monitors incoming requests with token-bucket rate limiting (max 5 actions per 10s window). Filters automated scripting bots and sybil pool manipulation.',
      whatItPrevents:
        'High-frequency entry spam, denial-of-service against RPC nodes, and automated script front-running.',
      status: 'Active (Simulated Below)',
    },
    {
      id: 3,
      name: 'Layer 3: Key Management & HSM Isolation',
      subtitle: 'FIPS 140-2 Level 3 Hardware Security Modules',
      whatItDoes:
        'Platform operator and relayer private keys are sealed inside AWS KMS / Cloud HSM enclaves. Transaction signing happens entirely within hardware boundary; keys are never loaded into RAM or disk.',
      whatItPrevents:
        'Server compromise leaks, insider key theft, and arbitrary un-audited state mutations.',
      status: 'Enforced Architecture',
    },
    {
      id: 4,
      name: 'Layer 4: OpenZeppelin Smart Contracts',
      subtitle: 'Battle-tested contract security standards',
      whatItDoes:
        'Manages pool vaults using OpenZeppelin ERC-20, ReentrancyGuard, AccessControl, and 48-hour Timelock governance. Automatic pause controls can freeze pools if an oracle anomaly occurs.',
      whatItPrevents:
        'Reentrancy exploits, unauthorized operator balance withdrawals, and malicious instant bytecode upgrades.',
      status: 'OpenZeppelin Verified',
    },
    {
      id: 5,
      name: 'Layer 5: Base L2 Rollup & Chainlink VRF',
      subtitle: 'Decentralized consensus & verifiable randomness',
      whatItDoes:
        'Settles round deposits and prize sweeps with sub-cent network fees. Chains unbiasable cryptographic randomness directly through Chainlink VRF v2.5 oracles on Base.',
      whatItPrevents:
        'Operator draw manipulation, participant collusion, and front-running of winner derivation seeds.',
      status: 'On-Chain Verifiable',
    },
  ];

  const currentLayer = layers.find((l) => l.id === activeLayer) || layers[2];

  const handleTestRateLimit = async () => {
    setIsTestingRateLimit(true);
    setRateLimitLogs([]);

    const newLogs: { id: number; timestamp: string; status: number; message: string }[] = [];

    for (let i = 1; i <= 10; i++) {
      await new Promise((res) => setTimeout(res, 180));
      const nowStr = new Date().toLocaleTimeString() + `.${Math.floor(Math.random() * 900 + 100)}`;
      if (i <= 6) {
        newLogs.push({
          id: i,
          timestamp: nowStr,
          status: 200,
          message: `Request #${i}: Accepted by gateway. Token bucket tokens remaining: ${6 - i}.`,
        });
      } else {
        newLogs.push({
          id: i,
          timestamp: nowStr,
          status: 429,
          message: `Request #${i}: 429 Too Many Requests. Token bucket exhausted. Throttled.`,
        });
      }
      setRateLimitLogs([...newLogs]);
    }

    setIsTestingRateLimit(false);
  };

  return (
    <div className="py-12 px-6 sm:px-8 max-w-[1200px] mx-auto flex flex-col gap-12 text-left">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#E3EBE6] text-[#2C4A3E] text-xs font-semibold tracking-wider uppercase mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Institutional Trust Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-medium text-[#1B2420]">
          How funds & draws are protected.
        </h1>
        <p className="text-sm text-[#4A5650] max-w-2xl mt-1 leading-relaxed">
          Comprehensive defense-in-depth across the client interface, edge rate limiters, isolated key managers, OpenZeppelin contracts, and Chainlink VRF.
        </p>
      </div>

      {/* Interactive 5-Layer Architecture Diagram (Wow Moment 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 5 Interactive Layers */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7C867F] px-1 mb-1">
            System Layers (Click or hover to inspect)
          </span>

          {layers.map((layer) => {
            const isSelected = activeLayer === layer.id;
            return (
              <div
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                onMouseEnter={() => setActiveLayer(layer.id)}
                className={`p-4 rounded-md border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFFFFF] border-[#2C4A3E] shadow-md -translate-x-1'
                    : 'bg-[#FBF9F5] border-[#DDD8CD] hover:border-[#C7C1B3]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-[#2C4A3E]' : 'text-[#1B2420]'
                    }`}
                  >
                    {layer.name}
                  </h3>
                  <span className="text-[10px] font-mono bg-[#EDE9E1] px-2 py-0.5 rounded text-[#4A5650]">
                    {layer.status}
                  </span>
                </div>
                <p className="text-xs text-[#7C867F]">{layer.subtitle}</p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Layer Detail Panel */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 sm:p-8 shadow-[0_1px_2px_rgba(27,36,32,0.05)] space-y-6">
          <div className="pb-4 border-b border-[#DDD8CD]">
            <span className="text-xs font-mono font-semibold text-[#B08A4E] block mb-1">
              Active Inspector
            </span>
            <h2 className="text-xl font-display font-medium text-[#1B2420]">
              {currentLayer.name}
            </h2>
            <p className="text-xs text-[#7C867F] mt-0.5">{currentLayer.subtitle}</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="font-semibold uppercase tracking-wider text-[#2C4A3E] block mb-1">
                What this layer does:
              </span>
              <p className="text-[#4A5650] leading-relaxed bg-[#FBF9F5] p-3.5 rounded border border-[#DDD8CD]">
                {currentLayer.whatItDoes}
              </p>
            </div>

            <div>
              <span className="font-semibold uppercase tracking-wider text-[#A8453A] block mb-1">
                Threats prevented:
              </span>
              <p className="text-[#4A5650] leading-relaxed bg-[#FBF9F5] p-3.5 rounded border border-[#DDD8CD]">
                {currentLayer.whatItPrevents}
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#E3EBE6] rounded text-xs text-[#2C4A3E] flex items-center justify-between">
            <span className="font-medium">Verification Status: Verified Architecture</span>
            <span className="font-mono text-[11px]">Base L2 Standard</span>
          </div>
        </div>
      </div>

      {/* Simulated Rate-Limit Playground (Wow Moment 5) */}
      <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDD8CD] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#B08A4E]">
                Edge Defense Playground
              </span>
              <span className="text-[10px] font-mono bg-[#EDE9E1] px-2 py-0.5 rounded text-[#7C867F]">
                Token-Bucket Algorithm
              </span>
            </div>
            <h3 className="text-xl font-display font-medium text-[#1B2420]">
              Simulate 10 Rapid Requests
            </h3>
            <p className="text-xs text-[#7C867F] mt-0.5">
              Watch the rate limiter allow 6 rapid requests and throttle the subsequent 4 with HTTP 429 status codes.
            </p>
          </div>

          <Button
            variant="primary"
            isLoading={isTestingRateLimit}
            onClick={handleTestRateLimit}
            className="flex items-center gap-1.5 shrink-0"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Send 10 Rapid Requests</span>
          </Button>
        </div>

        {/* Real-time Rate Limit Logs Table */}
        <div className="bg-[#16201C] rounded-lg p-4 font-mono text-xs overflow-x-auto min-h-[160px]">
          {rateLimitLogs.length === 0 ? (
            <div className="h-28 flex items-center justify-center text-[#7C867F] text-xs">
              Click “Send 10 Rapid Requests” to observe the edge rate limiter in action.
            </div>
          ) : (
            <div className="space-y-1.5">
              {rateLimitLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3">
                  <span className="text-[#A8B5AE] text-[11px]">{log.timestamp}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 200
                        ? 'bg-[#3E7D5A]/30 text-[#4EAC76]'
                        : 'bg-[#A8453A]/30 text-[#E06A5E]'
                    }`}
                  >
                    {log.status}
                  </span>
                  <span
                    className={
                      log.status === 200 ? 'text-[#EDE9E1]' : 'text-[#E06A5E]'
                    }
                  >
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contract & Security Controls Checklist */}
      <div className="space-y-4">
        <h3 className="text-xl font-display font-medium text-[#1B2420]">
          Verified Smart Contract Controls
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#2C4A3E] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#3E7D5A]" />
              <span>ReentrancyGuard</span>
            </div>
            <p className="text-[#4A5650] leading-relaxed">
              Every state-modifying deposit and payout function enforces non-reentrant mutex locks to defeat external contract recursion.
            </p>
          </div>

          <div className="p-5 bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#2C4A3E] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#3E7D5A]" />
              <span>48-Hour Timelock</span>
            </div>
            <p className="text-[#4A5650] leading-relaxed">
              Administrative parameters cannot be modified instantly. All configuration adjustments require a visible 48-hour timelock queue on-chain.
            </p>
          </div>

          <div className="p-5 bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#2C4A3E] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#3E7D5A]" />
              <span>Pausable Circuit Breakers</span>
            </div>
            <p className="text-[#4A5650] leading-relaxed">
              Emergency stops can temporarily freeze new pool registrations if an oracle failure or anomalous network condition is reported.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-[#EDE9E1] rounded text-xs text-[#7C867F] font-mono text-center">
        * Note: Architecture details illustrate target production specifications for this interactive prototype.
      </div>
    </div>
  );
};
