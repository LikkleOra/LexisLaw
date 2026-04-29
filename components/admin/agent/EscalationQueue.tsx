'use client';

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  LucideAlertTriangle,
  LucideAlertCircle,
  LucideAlertOctagon,
  LucideClock,
  LucidePhone,
  LucideMail
} from 'lucide-react';

export default function EscalationQueue() {
  const paymentRecords = useQuery(api.functions.getPaymentRecords, {}) as any[] | undefined;

  // Filter for Level 2+ escalations
  const escalatedPayments = React.useMemo(() => {
    return (paymentRecords || [])
      .filter(p => p.escalationLevel >= 2 && p.status !== 'paid')
      .sort((a, b) => b.escalationLevel - a.escalationLevel || b.daysOverdue - a.daysOverdue);
  }, [paymentRecords]);

  const getEscalationIcon = (level: number) => {
    switch (level) {
      case 3:
        return LucideAlertOctagon;
      case 2:
        return LucideAlertCircle;
      default:
        return LucideAlertTriangle;
    }
  };

  const getEscalationColor = (level: number) => {
    switch (level) {
      case 3:
        return 'text-lexis-red';
      case 2:
        return 'text-orange-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getEscalationBg = (level: number) => {
    switch (level) {
      case 3:
        return 'bg-red-50 border-lexis-red';
      case 2:
        return 'bg-orange-50 border-orange-600';
      default:
        return 'bg-yellow-50 border-yellow-600';
    }
  };

  const formatAmount = (amountCents: number) => {
    return `R${(amountCents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const getEscalationLabel = (level: number) => {
    switch (level) {
      case 3:
        return 'CRITICAL - Demand Issued';
      case 2:
        return 'URGENT - Legal Action Pending';
      case 1:
        return 'Escalated - Reminder Sent';
      default:
        return 'Initial Notice';
    }
  };

  return (
    <Card className="bg-white border-black/10" padding="none" shadow>
      <div className="p-8 border-b border-black/10 flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-display text-xl tracking-tight text-black uppercase flex items-center gap-3">
            <LucideAlertTriangle className="text-lexis-red" size={24} />
            Escalation Queue
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-widest text-black/50">
            Level 2+ clients requiring attention
          </p>
        </div>
        <Badge variant="rejected" size="sm">
          {escalatedPayments.length} Critical
        </Badge>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {escalatedPayments.length === 0 && (
          <div className="p-12 text-center space-y-4">
            <LucideAlertTriangle className="mx-auto text-black/20" size={48} />
            <div className="text-black/30 italic font-mono text-sm">
              No escalated payments. All clients are in good standing.
            </div>
          </div>
        )}

        <div className="divide-y divide-black/5">
          {escalatedPayments.map((payment, idx) => {
            const Icon = getEscalationIcon(payment.escalationLevel);
            const color = getEscalationColor(payment.escalationLevel);
            const bgClass = getEscalationBg(payment.escalationLevel);

            return (
              <div
                key={payment._id || idx}
                className={`p-6 hover:bg-black/[0.02] transition-colors group ${
                  payment.escalationLevel === 3 ? 'border-l-4 border-l-lexis-red' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Escalation Icon */}
                  <div className={`w-12 h-12 ${bgClass} border-2 flex items-center justify-center ${color}`}>
                    <Icon size={24} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-display text-lg font-bold text-black">
                          {payment.clientName || 'Unknown Client'}
                        </div>
                        <div className="font-mono text-[10px] text-black/60 uppercase tracking-wider">
                          Invoice: <span className="text-black font-bold">{payment.invoiceId}</span>
                          {payment.matterReference && (
                            <>
                              <span className="mx-2">•</span>
                              Case: <span className="text-black font-bold">{payment.matterReference}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <Badge
                        variant={payment.escalationLevel === 3 ? 'rejected' : 'progress'}
                        size="sm"
                      >
                        LEVEL {payment.escalationLevel}
                      </Badge>
                    </div>

                    {/* Escalation Status */}
                    <div className={`p-3 ${bgClass} border-l-4`}>
                      <div className={`font-mono text-xs font-bold ${color} uppercase`}>
                        {getEscalationLabel(payment.escalationLevel)}
                      </div>
                      <div className="font-mono text-[10px] text-black/60 mt-1">
                        {payment.daysOverdue} days overdue
                        {payment.lastNudgeAt && (
                          <>
                            <span className="mx-2">•</span>
                            Last contact: {Math.floor((Date.now() - payment.lastNudgeAt) / 86400000)}d ago
                          </>
                        )}
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-black/5 border border-black/10">
                      <div>
                        <div className="font-mono text-[9px] text-black/40 uppercase tracking-widest mb-1">
                          Amount Due
                        </div>
                        <div className="font-display text-lg text-lexis-red font-bold">
                          {formatAmount(payment.amountDue)}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[9px] text-black/40 uppercase tracking-widest mb-1">
                          Due Date
                        </div>
                        <div className="font-mono text-sm text-black">
                          {new Date(payment.dueDate).toLocaleDateString('en-ZA')}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[9px] text-black/40 uppercase tracking-widest mb-1">
                          Status
                        </div>
                        <div className="font-mono text-sm text-black uppercase">
                          {payment.status}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <LucidePhone size={14} />
                        Call Client
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <LucideMail size={14} />
                        Send Email
                      </Button>
                      {payment.escalationLevel === 3 && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="ml-auto"
                        >
                          Review Demand Letter
                        </Button>
                      )}
                    </div>

                    {payment.notes && (
                      <div className="p-3 bg-blue-50 border-l-4 border-blue-600">
                        <div className="font-mono text-[9px] text-blue-900 uppercase tracking-wider mb-1">
                          Admin Notes
                        </div>
                        <div className="font-mono text-xs text-blue-900">
                          {payment.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
