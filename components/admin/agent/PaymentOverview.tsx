'use client';

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  LucideDollarSign,
  LucideTrendingUp,
  LucideTrendingDown,
  LucideCheckCircle2,
  LucideAlertCircle
} from 'lucide-react';

export default function PaymentOverview() {
  const paymentRecords = useQuery(api.functions.getPaymentRecords, {}) as any[] | undefined;

  const stats = React.useMemo(() => {
    if (!paymentRecords) return null;

    const totalOutstanding = paymentRecords
      .filter(p => p.status !== 'paid')
      .reduce((sum, p) => sum + p.amountDue, 0);

    const totalPaid = paymentRecords
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + (p.paidAmount || p.amountDue), 0);

    const overduePayments = paymentRecords.filter(p =>
      p.status !== 'paid' && p.daysOverdue > 0
    );

    const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amountDue, 0);

    const avgDaysOverdue = overduePayments.length > 0
      ? Math.round(overduePayments.reduce((sum, p) => sum + p.daysOverdue, 0) / overduePayments.length)
      : 0;

    const paymentsByStatus = {
      unpaid: paymentRecords.filter(p => p.status === 'unpaid').length,
      partial: paymentRecords.filter(p => p.status === 'partial').length,
      paid: paymentRecords.filter(p => p.status === 'paid').length,
      disputed: paymentRecords.filter(p => p.status === 'disputed').length,
    };

    const paymentsByEscalation = {
      level0: paymentRecords.filter(p => p.escalationLevel === 0).length,
      level1: paymentRecords.filter(p => p.escalationLevel === 1).length,
      level2: paymentRecords.filter(p => p.escalationLevel === 2).length,
      level3: paymentRecords.filter(p => p.escalationLevel === 3).length,
    };

    return {
      totalOutstanding,
      totalPaid,
      totalOverdue,
      avgDaysOverdue,
      overdueCount: overduePayments.length,
      paymentsByStatus,
      paymentsByEscalation,
      totalInvoices: paymentRecords.length,
    };
  }, [paymentRecords]);

  const formatAmount = (amountCents: number) => {
    return `R${(amountCents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  if (!stats) {
    return (
      <Card className="bg-white border-black/10 p-12" shadow>
        <div className="text-center text-black/30 italic font-mono text-sm">
          Loading payment data...
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Outstanding */}
        <Card className="bg-white border-black/10 p-6 border-l-4 border-l-lexis-red shadow-brutal hover:translate-x-1 hover:-translate-y-1 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-red-50 flex items-center justify-center border border-lexis-red/20 text-lexis-red">
              <LucideAlertCircle size={20} />
            </div>
            <LucideTrendingUp className="text-black/20 group-hover:text-lexis-red transition-colors" size={16} />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-display text-lexis-red font-bold">
              {formatAmount(stats.totalOutstanding)}
            </div>
            <div className="font-mono text-[9px] text-black uppercase tracking-[0.2em]">
              Total Outstanding
            </div>
            <div className="font-mono text-[10px] text-black/60">
              {stats.overdueCount} overdue invoices
            </div>
          </div>
        </Card>

        {/* Total Overdue */}
        <Card className="bg-white border-black/10 p-6 border-l-4 border-l-orange-600 shadow-brutal hover:translate-x-1 hover:-translate-y-1 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-orange-50 flex items-center justify-center border border-orange-600/20 text-orange-600">
              <LucideDollarSign size={20} />
            </div>
            <LucideTrendingDown className="text-black/20 group-hover:text-orange-600 transition-colors" size={16} />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-display text-orange-600 font-bold">
              {formatAmount(stats.totalOverdue)}
            </div>
            <div className="font-mono text-[9px] text-black uppercase tracking-[0.2em]">
              Overdue Amount
            </div>
            <div className="font-mono text-[10px] text-black/60">
              Avg {stats.avgDaysOverdue} days overdue
            </div>
          </div>
        </Card>

        {/* Total Paid */}
        <Card className="bg-white border-black/10 p-6 border-l-4 border-l-lexis-green shadow-brutal hover:translate-x-1 hover:-translate-y-1 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-green-50 flex items-center justify-center border border-lexis-green/20 text-lexis-green">
              <LucideCheckCircle2 size={20} />
            </div>
            <LucideTrendingUp className="text-black/20 group-hover:text-lexis-green transition-colors" size={16} />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-display text-lexis-green font-bold">
              {formatAmount(stats.totalPaid)}
            </div>
            <div className="font-mono text-[9px] text-black uppercase tracking-[0.2em]">
              Total Collected
            </div>
            <div className="font-mono text-[10px] text-black/60">
              {stats.paymentsByStatus.paid} paid invoices
            </div>
          </div>
        </Card>

        {/* Total Invoices */}
        <Card className="bg-white border-black/10 p-6 border-l-4 border-l-black shadow-brutal hover:translate-x-1 hover:-translate-y-1 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-black/5 flex items-center justify-center border border-black/10 text-black">
              <LucideDollarSign size={20} />
            </div>
            <LucideTrendingUp className="text-black/20 group-hover:text-black transition-colors" size={16} />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-display text-black font-bold">
              {stats.totalInvoices}
            </div>
            <div className="font-mono text-[9px] text-black uppercase tracking-[0.2em]">
              Total Invoices
            </div>
            <div className="font-mono text-[10px] text-black/60">
              {stats.paymentsByStatus.unpaid} unpaid
            </div>
          </div>
        </Card>
      </div>

      {/* Breakdown Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Status Breakdown */}
        <Card className="bg-white border-black/10" padding="none" shadow>
          <div className="p-6 border-b border-black/10">
            <h4 className="font-display text-lg tracking-tight text-black uppercase">
              Payment Status
            </h4>
          </div>
          <div className="p-6 space-y-4">
            {Object.entries(stats.paymentsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      status === 'paid' ? 'verified' :
                      status === 'unpaid' ? 'rejected' :
                      status === 'partial' ? 'progress' :
                      'pending'
                    }
                    size="sm"
                  >
                    {status}
                  </Badge>
                  <span className="font-mono text-xs text-black uppercase tracking-wider">
                    {status === 'paid' ? 'Paid in Full' :
                     status === 'unpaid' ? 'Not Paid' :
                     status === 'partial' ? 'Partially Paid' :
                     'Under Dispute'}
                  </span>
                </div>
                <div className="font-display text-lg font-bold text-black">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Escalation Level Breakdown */}
        <Card className="bg-white border-black/10" padding="none" shadow>
          <div className="p-6 border-b border-black/10">
            <h4 className="font-display text-lg tracking-tight text-black uppercase">
              Escalation Levels
            </h4>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 border border-black/10"></div>
                <span className="font-mono text-xs text-black uppercase tracking-wider">
                  Level 0 (Initial)
                </span>
              </div>
              <div className="font-display text-lg font-bold text-black">
                {stats.paymentsByEscalation.level0}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 border border-black/10"></div>
                <span className="font-mono text-xs text-black uppercase tracking-wider">
                  Level 1 (Reminder)
                </span>
              </div>
              <div className="font-display text-lg font-bold text-black">
                {stats.paymentsByEscalation.level1}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 border border-black/10"></div>
                <span className="font-mono text-xs text-black uppercase tracking-wider">
                  Level 2 (Urgent)
                </span>
              </div>
              <div className="font-display text-lg font-bold text-black">
                {stats.paymentsByEscalation.level2}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-lexis-red border border-black/10"></div>
                <span className="font-mono text-xs text-black uppercase tracking-wider">
                  Level 3 (Demand)
                </span>
              </div>
              <div className="font-display text-lg font-bold text-lexis-red">
                {stats.paymentsByEscalation.level3}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
