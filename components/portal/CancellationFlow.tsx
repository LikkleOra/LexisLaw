'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  LucideX,
  LucideCheck,
  LucideAlertTriangle,
  LucideClock,
  LucideInfo,
  LucideArrowRight,
  LucideArrowLeft
} from 'lucide-react';

interface CancellationFlowProps {
  caseId: string;
  clientId: string;
  matterReference: string;
  outstandingBalance: number;
  onComplete?: () => void;
  onCancel?: () => void;
}

export default function CancellationFlow({
  caseId,
  clientId,
  matterReference,
  outstandingBalance,
  onComplete,
  onCancel
}: CancellationFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [acknowledgedConsequences, setAcknowledgedConsequences] = useState(false);
  const [coolingOffExpiry, setCoolingOffExpiry] = useState<number | null>(null);
  const [cancellationRequestId, setCancellationRequestId] = useState<string | null>(null);

  const createCancellation = useMutation(api.functions.createCancellationRequest);
  const updateCancellation = useMutation(api.functions.updateCancellationRequest);

  const cancellationReasons = [
    'Financial constraints - cannot afford legal fees',
    'Decided to handle matter independently',
    'Found alternative legal representation',
    'Matter has been resolved',
    'Personal circumstances have changed',
    'Dissatisfied with service',
    'Other (please specify)',
  ];

  const consequences = [
    'Any work already completed will be billed',
    'Outstanding fees remain due and payable',
    'Court dates/deadlines are your responsibility',
    'Documents in our possession will be returned',
    'No refunds on fees already paid',
    'Case progress may be adversely affected',
  ];

  const formatAmount = (amountCents: number) => {
    return `R${(amountCents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const getCoolingOffRemaining = () => {
    if (!coolingOffExpiry) return null;

    const remaining = coolingOffExpiry - Date.now();
    if (remaining <= 0) return 'Cooling-off period complete';

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  const handleStartCancellation = async () => {
    try {
      const id = await createCancellation({
        clientId: clientId as any,
        caseId: caseId as any,
        outstandingBalance,
      });

      setCancellationRequestId(id as any);
      setCurrentStep(2);
    } catch (error) {
      console.error('Failed to create cancellation request:', error);
      alert('Failed to start cancellation process. Please try again.');
    }
  };

  const handleReasonSubmit = async () => {
    if (!cancellationRequestId) return;

    const finalReason = selectedReason === 'Other (please specify)' ? customReason : selectedReason;

    if (!finalReason) {
      alert('Please select or specify a reason for cancellation.');
      return;
    }

    try {
      await updateCancellation({
        id: cancellationRequestId as any,
        step: 2,
        reason: finalReason,
      });

      setCurrentStep(3);
    } catch (error) {
      console.error('Failed to update cancellation:', error);
    }
  };

  const handleAcknowledgeConsequences = async () => {
    if (!cancellationRequestId || !acknowledgedConsequences) return;

    const expiry = Date.now() + (48 * 60 * 60 * 1000); // 48 hours from now

    try {
      await updateCancellation({
        id: cancellationRequestId as any,
        step: 3,
        acknowledgedConsequences: true,
        coolingOffExpiry: expiry,
      });

      setCoolingOffExpiry(expiry);
      setCurrentStep(4);
    } catch (error) {
      console.error('Failed to update cancellation:', error);
    }
  };

  const handleFinalConfirmation = async () => {
    if (!cancellationRequestId) return;

    try {
      await updateCancellation({
        id: cancellationRequestId as any,
        step: 4,
        status: 'completed',
        completedAt: Date.now(),
      });

      onComplete?.();
    } catch (error) {
      console.error('Failed to complete cancellation:', error);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancelFlow = () => {
    onCancel?.();
  };

  // Auto-refresh cooling-off timer
  useEffect(() => {
    if (currentStep === 4 && coolingOffExpiry) {
      const interval = setInterval(() => {
        setCoolingOffExpiry(coolingOffExpiry); // Trigger re-render
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [currentStep, coolingOffExpiry]);

  return (
    <div className="space-y-8">
      {/* Stepper */}
      <Card className="bg-white border-black/10 p-8" shadow>
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-display text-lg font-bold transition-all ${
                    step < currentStep
                      ? 'bg-lexis-green border-lexis-green text-white'
                      : step === currentStep
                      ? 'bg-lexis-red border-lexis-red text-white'
                      : 'bg-white border-black/20 text-black/40'
                  }`}
                >
                  {step < currentStep ? <LucideCheck size={24} /> : step}
                </div>
                <div
                  className={`mt-2 font-mono text-[10px] uppercase tracking-wider text-center ${
                    step === currentStep ? 'text-lexis-red font-bold' : 'text-black/60'
                  }`}
                >
                  {step === 1 && 'Reason'}
                  {step === 2 && 'Review'}
                  {step === 3 && 'Acknowledge'}
                  {step === 4 && 'Confirm'}
                </div>
              </div>
              {step < 4 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-lexis-green' : 'bg-black/10'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* Step 1: Reason Selection */}
      {currentStep === 1 && (
        <Card className="bg-white border-black/10 p-8" shadow>
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-display text-2xl tracking-tight text-black uppercase">
                Cancellation Request
              </h2>
              <p className="font-mono text-sm text-black/60">
                We're sorry to hear you're considering canceling your case. Please help us understand why.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-600 flex items-start gap-3">
              <LucideInfo className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
              <div className="space-y-1">
                <div className="font-mono text-xs font-bold text-yellow-900 uppercase">
                  Important Notice
                </div>
                <div className="font-mono text-xs text-yellow-900">
                  This is a formal cancellation process. Once completed, your case will be closed.
                  Please consider contacting us first to discuss any concerns.
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-mono text-xs uppercase tracking-wider text-black font-bold">
                Select Reason for Cancellation
              </label>
              {cancellationReasons.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center p-4 border-2 cursor-pointer transition-all hover:border-lexis-red ${
                    selectedReason === reason
                      ? 'border-lexis-red bg-lexis-red/5'
                      : 'border-black/10 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mr-4 w-5 h-5 accent-lexis-red"
                  />
                  <span className="font-mono text-sm text-black">{reason}</span>
                </label>
              ))}
            </div>

            {selectedReason === 'Other (please specify)' && (
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-black font-bold">
                  Please Specify
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Enter your reason here..."
                  className="w-full p-4 border-2 border-black/10 font-mono text-sm focus:border-lexis-red focus:outline-none min-h-[100px]"
                  required
                />
              </div>
            )}

            <div className="flex items-center gap-4 pt-4">
              <Button
                variant="secondary"
                onClick={handleCancelFlow}
                className="flex items-center gap-2"
              >
                <LucideX size={16} />
                Cancel Request
              </Button>
              <Button
                variant="primary"
                onClick={handleStartCancellation}
                disabled={!selectedReason || (selectedReason === 'Other (please specify)' && !customReason)}
                className="flex items-center gap-2 ml-auto"
              >
                Continue
                <LucideArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Review Outstanding Balance */}
      {currentStep === 2 && (
        <Card className="bg-white border-black/10 p-8" shadow>
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-display text-2xl tracking-tight text-black uppercase">
                Outstanding Balance Review
              </h2>
              <p className="font-mono text-sm text-black/60">
                Please review your outstanding balance before proceeding.
              </p>
            </div>

            <div className="p-6 bg-red-50 border-2 border-lexis-red">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <div className="font-mono text-xs uppercase tracking-wider text-lexis-red font-bold">
                    Outstanding Amount
                  </div>
                  <div className="font-display text-4xl text-lexis-red font-bold">
                    {formatAmount(outstandingBalance)}
                  </div>
                </div>
                <LucideAlertTriangle className="text-lexis-red" size={32} />
              </div>
              <div className="font-mono text-sm text-lexis-red">
                Case Reference: <span className="font-bold">{matterReference}</span>
              </div>
            </div>

            <div className="p-4 bg-black/5 border-l-4 border-black">
              <div className="font-mono text-xs font-bold text-black uppercase mb-2">
                Payment Terms
              </div>
              <div className="font-mono text-sm text-black/80 space-y-1">
                <p>• This balance remains due and payable regardless of cancellation</p>
                <p>• Payment is required within 30 days of cancellation</p>
                <p>• Failure to pay may result in debt collection proceedings</p>
                <p>• All fees incurred to date are non-refundable</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border-l-4 border-blue-600 flex items-start gap-3">
              <LucideInfo className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div className="space-y-1">
                <div className="font-mono text-xs font-bold text-blue-900 uppercase">
                  Alternative Option
                </div>
                <div className="font-mono text-xs text-blue-900">
                  If you're experiencing financial difficulties, please contact us to discuss payment plan options
                  before canceling your case.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button
                variant="secondary"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <LucideArrowLeft size={16} />
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleReasonSubmit}
                className="flex items-center gap-2 ml-auto"
              >
                I Understand
                <LucideArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 3: Acknowledge Consequences */}
      {currentStep === 3 && (
        <Card className="bg-white border-black/10 p-8" shadow>
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-display text-2xl tracking-tight text-black uppercase">
                Cancellation Consequences
              </h2>
              <p className="font-mono text-sm text-black/60">
                Please carefully review and acknowledge the following consequences.
              </p>
            </div>

            <div className="space-y-3">
              {consequences.map((consequence, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-black/5 border-l-4 border-lexis-red"
                >
                  <LucideAlertTriangle className="text-lexis-red flex-shrink-0 mt-1" size={18} />
                  <div className="font-mono text-sm text-black">{consequence}</div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-orange-50 border-2 border-orange-600">
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acknowledgedConsequences}
                  onChange={(e) => setAcknowledgedConsequences(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-lexis-red flex-shrink-0"
                  required
                />
                <div className="space-y-2">
                  <div className="font-mono text-sm font-bold text-orange-900 uppercase">
                    Required Acknowledgment
                  </div>
                  <div className="font-mono text-sm text-orange-900">
                    I have read and understand all consequences listed above. I acknowledge that canceling
                    my case may adversely affect my legal matter and that outstanding fees remain due.
                  </div>
                </div>
              </label>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button
                variant="secondary"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <LucideArrowLeft size={16} />
                Back
              </Button>
              <Button
                variant="primary"
                onClick={handleAcknowledgeConsequences}
                disabled={!acknowledgedConsequences}
                className="flex items-center gap-2 ml-auto"
              >
                Continue to Cooling-Off Period
                <LucideArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 4: 48-Hour Cooling-Off Period */}
      {currentStep === 4 && (
        <Card className="bg-white border-black/10 p-8" shadow>
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-display text-2xl tracking-tight text-black uppercase">
                48-Hour Cooling-Off Period
              </h2>
              <p className="font-mono text-sm text-black/60">
                We require a mandatory 48-hour waiting period before finalizing cancellation.
              </p>
            </div>

            <div className="p-8 bg-orange-50 border-2 border-orange-600 text-center space-y-4">
              <LucideClock className="mx-auto text-orange-600" size={64} />
              <div className="space-y-2">
                <div className="font-display text-3xl text-orange-600 font-bold">
                  {getCoolingOffRemaining()}
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-orange-900">
                  Time Remaining Until Cancellation Available
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border-l-4 border-blue-600 flex items-start gap-3">
              <LucideInfo className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div className="space-y-1">
                <div className="font-mono text-xs font-bold text-blue-900 uppercase">
                  Why the Wait?
                </div>
                <div className="font-mono text-xs text-blue-900">
                  This cooling-off period gives you time to reconsider your decision. Many clients find that
                  after discussing concerns with us, they choose to continue with their case. We're here to help.
                </div>
              </div>
            </div>

            <div className="p-6 bg-black/5 border border-black/10">
              <div className="font-mono text-xs font-bold text-black uppercase mb-3">
                During This Period
              </div>
              <div className="space-y-2 font-mono text-sm text-black/80">
                <p>• You may cancel this request at any time</p>
                <p>• Contact us to discuss alternatives or concerns</p>
                <p>• Review your case documents and progress</p>
                <p>• Consider the impact on your legal matter</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button
                variant="secondary"
                onClick={handleCancelFlow}
                className="flex items-center gap-2"
              >
                <LucideX size={16} />
                Withdraw Cancellation Request
              </Button>
              <Button
                variant="primary"
                onClick={handleFinalConfirmation}
                disabled={!coolingOffExpiry || coolingOffExpiry > Date.now()}
                className="flex items-center gap-2 ml-auto bg-lexis-red"
              >
                {coolingOffExpiry && coolingOffExpiry <= Date.now() ? (
                  <>
                    <LucideCheck size={16} />
                    Confirm Cancellation
                  </>
                ) : (
                  <>
                    <LucideClock size={16} />
                    Waiting Period Active
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
