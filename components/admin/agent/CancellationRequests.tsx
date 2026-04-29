'use client';

import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  LucideX,
  LucideClock,
  LucideCheckCircle2,
  LucideAlertTriangle,
  LucideMessageSquare
} from 'lucide-react';

export default function CancellationRequests() {
  const cancellations = useQuery(api.functions.getCancellationRequests, {}) as any[] | undefined;
  const updateCancellation = useMutation(api.functions.updateCancellationRequest);

  const formatAmount = (amountCents: number) => {
    return `R${(amountCents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const getStepLabel = (step: number) => {
    switch (step) {
      case 1:
        return 'Step 1: Reason Selection';
      case 2:
        return 'Step 2: Outstanding Balance Review';
      case 3:
        return 'Step 3: Cooling-Off Period (48h)';
      case 4:
        return 'Step 4: Final Confirmation';
      default:
        return `Step ${step}`;
    }
  };

  const getCoolingOffRemaining = (expiry: number | undefined) => {
    if (!expiry) return null;

    const remaining = expiry - Date.now();
    if (remaining <= 0) return 'Expired';

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  const handleApprove = async (id: string) => {
    try {
      await updateCancellation({
        id: id as any,
        status: 'completed',
        completedAt: Date.now(),
        notes: 'Approved by admin',
      });
    } catch (error) {
      console.error('Failed to approve cancellation:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateCancellation({
        id: id as any,
        status: 'abandoned',
        notes: 'Rejected by admin - case to continue',
      });
    } catch (error) {
      console.error('Failed to reject cancellation:', error);
    }
  };

  const activeCancellations = (cancellations || []).filter(c => c.status === 'in_progress');
  const completedCancellations = (cancellations || []).filter(c => c.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Active Cancellations */}
      <Card className="bg-white border-black/10" padding="none" shadow>
        <div className="p-8 border-b border-black/10 flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="font-display text-xl tracking-tight text-black uppercase flex items-center gap-3">
              <LucideX className="text-lexis-red" size={24} />
              Active Cancellation Requests
            </h3>
            <p className="font-mono text-[10px] uppercase tracking-widest text-black/50">
              Multi-step friction-based cancellations in progress
            </p>
          </div>
          <Badge variant={activeCancellations.length > 0 ? 'rejected' : 'verified'} size="sm">
            {activeCancellations.length} Active
          </Badge>
        </div>

        <div className="divide-y divide-black/5">
          {activeCancellations.length === 0 && (
            <div className="p-12 text-center space-y-4">
              <LucideCheckCircle2 className="mx-auto text-lexis-green" size={48} />
              <div className="text-black/60 font-mono text-sm">
                No active cancellation requests. All clients are retained.
              </div>
            </div>
          )}

          {activeCancellations.map((cancellation) => {
            const coolingOffRemaining = getCoolingOffRemaining(cancellation.coolingOffExpiry);

            return (
              <div
                key={cancellation._id}
                className="p-6 hover:bg-black/[0.02] transition-colors border-l-4 border-l-lexis-red"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-display text-lg font-bold text-black">
                        {cancellation.clientName}
                      </div>
                      <div className="font-mono text-[10px] text-black/60 uppercase tracking-wider">
                        Case: <span className="text-black font-bold">{cancellation.matterReference}</span>
                        <span className="mx-2">•</span>
                        {cancellation.daysInProgress} days in progress
                      </div>
                    </div>
                    <Badge variant="progress" size="sm">
                      {getStepLabel(cancellation.step)}
                    </Badge>
                  </div>

                  {/* Progress Stepper */}
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((stepNum) => (
                      <React.Fragment key={stepNum}>
                        <div
                          className={`flex-1 h-2 transition-colors ${
                            stepNum <= cancellation.step
                              ? 'bg-lexis-red'
                              : 'bg-black/10'
                          }`}
                        />
                        {stepNum < 4 && (
                          <div
                            className={`w-2 h-2 rounded-full ${
                              stepNum < cancellation.step
                                ? 'bg-lexis-red'
                                : 'bg-black/20'
                            }`}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-black/5 border border-black/10">
                    <div>
                      <div className="font-mono text-[9px] text-black/40 uppercase tracking-widest mb-1">
                        Outstanding Balance
                      </div>
                      <div className="font-display text-lg text-lexis-red font-bold">
                        {formatAmount(cancellation.outstandingBalance)}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-black/40 uppercase tracking-widest mb-1">
                        Initiated
                      </div>
                      <div className="font-mono text-sm text-black">
                        {new Date(cancellation.initiatedAt).toLocaleDateString('en-ZA')}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-black/40 uppercase tracking-widest mb-1">
                        Acknowledged
                      </div>
                      <div className="font-mono text-sm text-black">
                        {cancellation.acknowledgedConsequences ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>

                  {/* Reason */}
                  {cancellation.reason && (
                    <div className="p-3 bg-yellow-50 border-l-4 border-yellow-600">
                      <div className="font-mono text-[9px] text-yellow-900 uppercase tracking-wider mb-1">
                        Cancellation Reason
                      </div>
                      <div className="font-mono text-xs text-yellow-900">
                        {cancellation.reason}
                      </div>
                    </div>
                  )}

                  {/* Cooling-Off Timer */}
                  {cancellation.step === 3 && cancellation.coolingOffExpiry && (
                    <div className="p-4 bg-orange-50 border-2 border-orange-600">
                      <div className="flex items-center gap-3">
                        <LucideClock className="text-orange-600" size={20} />
                        <div className="flex-1">
                          <div className="font-mono text-xs font-bold text-orange-900 uppercase">
                            48-Hour Cooling-Off Period
                          </div>
                          <div className="font-mono text-[10px] text-orange-700">
                            {coolingOffRemaining}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admin Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleReject(cancellation._id)}
                    >
                      <LucideX size={14} />
                      Reject & Retain Client
                    </Button>
                    {cancellation.step >= 3 && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex items-center gap-2 bg-lexis-red"
                        onClick={() => handleApprove(cancellation._id)}
                      >
                        <LucideCheckCircle2 size={14} />
                        Approve Cancellation
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-2 ml-auto"
                    >
                      <LucideMessageSquare size={14} />
                      Contact Client
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recently Completed */}
      {completedCancellations.length > 0 && (
        <Card className="bg-white border-black/10" padding="none" shadow>
          <div className="p-6 border-b border-black/10">
            <h4 className="font-display text-lg tracking-tight text-black uppercase">
              Recently Completed Cancellations
            </h4>
          </div>
          <div className="divide-y divide-black/5">
            {completedCancellations.slice(0, 5).map((cancellation) => (
              <div
                key={cancellation._id}
                className="p-4 hover:bg-black/[0.02] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-mono text-sm font-bold text-black">
                      {cancellation.clientName}
                    </div>
                    <div className="font-mono text-[10px] text-black/60">
                      Case: {cancellation.matterReference}
                      <span className="mx-2">•</span>
                      Completed: {new Date(cancellation.completedAt).toLocaleDateString('en-ZA')}
                    </div>
                  </div>
                  <Badge variant="rejected" size="sm">
                    Cancelled
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
