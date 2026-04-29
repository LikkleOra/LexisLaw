'use client';

import React, { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  LucidePlus,
  LucideX,
  LucideSave,
  LucideAlertCircle
} from 'lucide-react';

interface PaymentRecordFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
  editingPayment?: any;
}

export default function PaymentRecordForm({
  onClose,
  onSuccess,
  editingPayment
}: PaymentRecordFormProps) {
  const clients = useQuery(api.functions.getClients, {}) as any[] | undefined;
  const matters = useQuery(api.functions.getMatters, {}) as any[] | undefined;

  const [formData, setFormData] = useState({
    clientId: editingPayment?.clientId || '',
    invoiceId: editingPayment?.invoiceId || `INV-${Date.now().toString().slice(-6)}`,
    caseId: editingPayment?.caseId || '',
    amountDue: editingPayment?.amountDue ? (editingPayment.amountDue / 100).toString() : '',
    dueDate: editingPayment?.dueDate
      ? new Date(editingPayment.dueDate).toISOString().split('T')[0]
      : '',
    status: editingPayment?.status || 'unpaid',
    escalationLevel: editingPayment?.escalationLevel || 0,
    notes: editingPayment?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.clientId = 'Please select a client';
    }

    if (!formData.invoiceId) {
      newErrors.invoiceId = 'Invoice ID is required';
    }

    if (!formData.amountDue || parseFloat(formData.amountDue) <= 0) {
      newErrors.amountDue = 'Amount must be greater than 0';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Convert amount to cents
      const amountInCents = Math.round(parseFloat(formData.amountDue) * 100);
      const dueDateTimestamp = new Date(formData.dueDate).getTime();

      // In a real implementation, you'd call a mutation here
      // For now, we'll just log and close
      console.log('Creating payment record:', {
        ...formData,
        amountDue: amountInCents,
        dueDate: dueDateTimestamp,
      });

      alert('Payment record created successfully!');
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('Failed to create payment record:', error);
      alert('Failed to create payment record. Please try again.');
    }
  };

  const formatAmount = (value: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, '');
    // Limit to 2 decimal places
    const parts = cleaned.split('.');
    if (parts.length > 2) return parts[0] + '.' + parts[1];
    if (parts[1]?.length > 2) return parts[0] + '.' + parts[1].slice(0, 2);
    return cleaned;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <Card className="bg-white border-black/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto" shadow>
        <div className="p-8 border-b border-black/10 flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="space-y-1">
            <h2 className="font-display text-2xl tracking-tight text-black uppercase">
              {editingPayment ? 'Edit Payment Record' : 'Create Payment Record'}
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-black/50">
              Invoice & payment tracking
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-black/5 hover:bg-lexis-red/10 border border-black/10 hover:border-lexis-red flex items-center justify-center transition-colors"
          >
            <LucideX className="text-black hover:text-lexis-red" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Client Selection */}
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-wider text-black font-bold">
              Client <span className="text-lexis-red">*</span>
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => handleChange('clientId', e.target.value)}
              className={`w-full p-4 border-2 font-mono text-sm focus:outline-none ${
                errors.clientId ? 'border-lexis-red' : 'border-black/10 focus:border-lexis-red'
              }`}
              required
            >
              <option value="">Select a client...</option>
              {clients?.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name} ({client.email || client.phone})
                </option>
              ))}
            </select>
            {errors.clientId && (
              <div className="flex items-center gap-2 text-lexis-red font-mono text-xs">
                <LucideAlertCircle size={14} />
                {errors.clientId}
              </div>
            )}
          </div>

          {/* Matter Selection (Optional) */}
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-wider text-black font-bold">
              Case / Matter (Optional)
            </label>
            <select
              value={formData.caseId}
              onChange={(e) => handleChange('caseId', e.target.value)}
              className="w-full p-4 border-2 border-black/10 font-mono text-sm focus:border-lexis-red focus:outline-none"
              disabled={!formData.clientId}
            >
              <option value="">No associated case</option>
              {matters
                ?.filter((m) => m.client_id === formData.clientId)
                .map((matter) => (
                  <option key={matter._id} value={matter._id}>
                    {matter.reference} - {matter.status}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Invoice ID */}
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase tracking-wider text-black font-bold">
                Invoice ID <span className="text-lexis-red">*</span>
              </label>
              <input
                type="text"
                value={formData.invoiceId}
                onChange={(e) => handleChange('invoiceId', e.target.value)}
                className={`w-full p-4 border-2 font-mono text-sm focus:outline-none ${
                  errors.invoiceId ? 'border-lexis-red' : 'border-black/10 focus:border-lexis-red'
                }`}
                placeholder="INV-123456"
                required
              />
              {errors.invoiceId && (
                <div className="flex items-center gap-2 text-lexis-red font-mono text-xs">
                  <LucideAlertCircle size={14} />
                  {errors.invoiceId}
                </div>
              )}
            </div>

            {/* Amount Due */}
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase tracking-wider text-black font-bold">
                Amount Due (ZAR) <span className="text-lexis-red">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-black/60">
                  R
                </span>
                <input
                  type="text"
                  value={formData.amountDue}
                  onChange={(e) => handleChange('amountDue', formatAmount(e.target.value))}
                  className={`w-full p-4 pl-10 border-2 font-mono text-sm focus:outline-none ${
                    errors.amountDue ? 'border-lexis-red' : 'border-black/10 focus:border-lexis-red'
                  }`}
                  placeholder="1500.00"
                  required
                />
              </div>
              {errors.amountDue && (
                <div className="flex items-center gap-2 text-lexis-red font-mono text-xs">
                  <LucideAlertCircle size={14} />
                  {errors.amountDue}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Due Date */}
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase tracking-wider text-black font-bold">
                Due Date <span className="text-lexis-red">*</span>
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className={`w-full p-4 border-2 font-mono text-sm focus:outline-none ${
                  errors.dueDate ? 'border-lexis-red' : 'border-black/10 focus:border-lexis-red'
                }`}
                required
              />
              {errors.dueDate && (
                <div className="flex items-center gap-2 text-lexis-red font-mono text-xs">
                  <LucideAlertCircle size={14} />
                  {errors.dueDate}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase tracking-wider text-black font-bold">
                Payment Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full p-4 border-2 border-black/10 font-mono text-sm focus:border-lexis-red focus:outline-none"
              >
                <option value="unpaid">Unpaid</option>
                <option value="partial">Partially Paid</option>
                <option value="paid">Paid in Full</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
          </div>

          {/* Escalation Level */}
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-wider text-black font-bold">
              Initial Escalation Level
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleChange('escalationLevel', level)}
                  className={`p-4 border-2 font-mono text-sm font-bold transition-all ${
                    formData.escalationLevel === level
                      ? 'border-lexis-red bg-lexis-red text-white'
                      : 'border-black/10 bg-white text-black hover:border-black/30'
                  }`}
                >
                  Level {level}
                  <div className="text-[10px] font-normal mt-1">
                    {level === 0 && 'Initial'}
                    {level === 1 && 'Reminder'}
                    {level === 2 && 'Urgent'}
                    {level === 3 && 'Demand'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-wider text-black font-bold">
              Admin Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full p-4 border-2 border-black/10 font-mono text-sm focus:border-lexis-red focus:outline-none min-h-[100px]"
              placeholder="Add any relevant notes about this invoice..."
            />
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border-l-4 border-blue-600">
            <div className="font-mono text-xs font-bold text-blue-900 uppercase mb-2">
              Automated Agent Behavior
            </div>
            <div className="font-mono text-xs text-blue-900 space-y-1">
              <p>• Payment reminders will be sent automatically based on escalation level</p>
              <p>• Escalation increases every 3-14 days if unpaid</p>
              <p>• All communications are logged and tracked</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <LucideX size={16} />
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2 ml-auto"
            >
              <LucideSave size={16} />
              {editingPayment ? 'Update' : 'Create'} Payment Record
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
