'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PaymentRecordForm from './PaymentRecordForm';
import {
  LucidePlus,
  LucideSearch,
  LucideFilter,
  LucideDownload,
  LucideEdit,
  LucideEye,
  LucideMail,
  LucideMoreVertical
} from 'lucide-react';

export default function InvoiceManagement() {
  const paymentRecords = useQuery(api.functions.getPaymentRecords, {}) as any[] | undefined;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [escalationFilter, setEscalationFilter] = useState<number | null>(null);

  const filteredPayments = React.useMemo(() => {
    if (!paymentRecords) return [];

    return paymentRecords.filter((payment) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        payment.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.matterReference?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

      // Escalation filter
      const matchesEscalation =
        escalationFilter === null || payment.escalationLevel === escalationFilter;

      return matchesSearch && matchesStatus && matchesEscalation;
    });
  }, [paymentRecords, searchQuery, statusFilter, escalationFilter]);

  const stats = React.useMemo(() => {
    if (!paymentRecords) return null;

    return {
      total: paymentRecords.length,
      unpaid: paymentRecords.filter((p) => p.status === 'unpaid').length,
      partial: paymentRecords.filter((p) => p.status === 'partial').length,
      paid: paymentRecords.filter((p) => p.status === 'paid').length,
      overdue: paymentRecords.filter((p) => p.daysOverdue > 0 && p.status !== 'paid').length,
    };
  }, [paymentRecords]);

  const formatAmount = (amountCents: number) => {
    return `R${(amountCents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEdit = (payment: any) => {
    setEditingPayment(payment);
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingPayment(null);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-white border-black/10 p-4 hover:border-lexis-red transition-all cursor-pointer">
          <div className="font-mono text-[10px] uppercase tracking-widest text-black/60 mb-1">
            Total Invoices
          </div>
          <div className="font-display text-2xl font-bold text-black">{stats?.total || 0}</div>
        </Card>
        <Card className="bg-white border-black/10 p-4 hover:border-lexis-red transition-all cursor-pointer">
          <div className="font-mono text-[10px] uppercase tracking-widest text-black/60 mb-1">
            Unpaid
          </div>
          <div className="font-display text-2xl font-bold text-lexis-red">{stats?.unpaid || 0}</div>
        </Card>
        <Card className="bg-white border-black/10 p-4 hover:border-lexis-red transition-all cursor-pointer">
          <div className="font-mono text-[10px] uppercase tracking-widest text-black/60 mb-1">
            Partial
          </div>
          <div className="font-display text-2xl font-bold text-orange-600">{stats?.partial || 0}</div>
        </Card>
        <Card className="bg-white border-black/10 p-4 hover:border-lexis-red transition-all cursor-pointer">
          <div className="font-mono text-[10px] uppercase tracking-widest text-black/60 mb-1">
            Paid
          </div>
          <div className="font-display text-2xl font-bold text-lexis-green">{stats?.paid || 0}</div>
        </Card>
        <Card className="bg-white border-black/10 p-4 hover:border-lexis-red transition-all cursor-pointer">
          <div className="font-mono text-[10px] uppercase tracking-widest text-black/60 mb-1">
            Overdue
          </div>
          <div className="font-display text-2xl font-bold text-lexis-red">{stats?.overdue || 0}</div>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card className="bg-white border-black/10 p-6" shadow>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <LucideSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" size={18} />
            <Input
              type="text"
              placeholder="Search invoices, clients, cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 border-2 border-black/10 font-mono text-xs uppercase tracking-wider focus:border-lexis-red focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
            <option value="disputed">Disputed</option>
          </select>

          {/* Escalation Filter */}
          <select
            value={escalationFilter === null ? 'all' : escalationFilter}
            onChange={(e) =>
              setEscalationFilter(e.target.value === 'all' ? null : parseInt(e.target.value))
            }
            className="p-3 border-2 border-black/10 font-mono text-xs uppercase tracking-wider focus:border-lexis-red focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="0">Level 0</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
          </select>

          {/* Create Button */}
          <Button
            variant="primary"
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <LucidePlus size={16} />
            New Invoice
          </Button>
        </div>
      </Card>

      {/* Invoice Table */}
      <Card className="bg-white border-black/10 overflow-hidden" padding="none" shadow>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-black/5 border-b border-black/10">
                <th className="p-4 uppercase tracking-widest text-black font-bold">Invoice ID</th>
                <th className="p-4 uppercase tracking-widest text-black font-bold">Client</th>
                <th className="p-4 uppercase tracking-widest text-black font-bold">Case Ref</th>
                <th className="p-4 uppercase tracking-widest text-black font-bold">Amount</th>
                <th className="p-4 uppercase tracking-widest text-black font-bold">Due Date</th>
                <th className="p-4 uppercase tracking-widest text-black font-bold">Overdue</th>
                <th className="p-4 uppercase tracking-widest text-black font-bold">Status</th>
                <th className="p-4 uppercase tracking-widest text-black font-bold">Level</th>
                <th className="p-4 uppercase tracking-widest text-black font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-black/30 italic">
                    No invoices found matching your filters.
                  </td>
                </tr>
              )}

              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-black/[0.02] transition-colors group">
                  <td className="p-4 text-lexis-red font-bold">{payment.invoiceId}</td>
                  <td className="p-4 text-black">{payment.clientName || 'Unknown'}</td>
                  <td className="p-4 text-black/60">{payment.matterReference || '—'}</td>
                  <td className="p-4 text-black font-bold">{formatAmount(payment.amountDue)}</td>
                  <td className="p-4 text-black">{formatDate(payment.dueDate)}</td>
                  <td className="p-4">
                    {payment.daysOverdue > 0 ? (
                      <span className="text-lexis-red font-bold">{payment.daysOverdue}d</span>
                    ) : (
                      <span className="text-black/40">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        payment.status === 'paid'
                          ? 'verified'
                          : payment.status === 'unpaid'
                          ? 'rejected'
                          : payment.status === 'partial'
                          ? 'progress'
                          : 'pending'
                      }
                      size="sm"
                    >
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        payment.escalationLevel === 3
                          ? 'rejected'
                          : payment.escalationLevel >= 1
                          ? 'progress'
                          : 'pending'
                      }
                      size="sm"
                    >
                      L{payment.escalationLevel}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(payment)}
                        className="p-2 hover:bg-black/5 border border-transparent hover:border-black/10 transition-all"
                        title="Edit"
                      >
                        <LucideEdit size={16} className="text-black/60 hover:text-lexis-red" />
                      </button>
                      <button
                        className="p-2 hover:bg-black/5 border border-transparent hover:border-black/10 transition-all"
                        title="Send Reminder"
                      >
                        <LucideMail size={16} className="text-black/60 hover:text-lexis-red" />
                      </button>
                      <button
                        className="p-2 hover:bg-black/5 border border-transparent hover:border-black/10 transition-all"
                        title="More"
                      >
                        <LucideMoreVertical size={16} className="text-black/60 hover:text-lexis-red" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Showing X of Y */}
      <div className="text-center font-mono text-xs text-black/60 uppercase tracking-wider">
        Showing {filteredPayments.length} of {paymentRecords?.length || 0} invoices
      </div>

      {/* Payment Record Form Modal */}
      {showCreateForm && (
        <PaymentRecordForm
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
          editingPayment={editingPayment}
        />
      )}
    </div>
  );
}
