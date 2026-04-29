'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CancellationFlow from '@/components/portal/CancellationFlow';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  LucideCheckCircle2,
  LucideX,
  LucideAlertTriangle
} from 'lucide-react';

export default function CancelCasePage() {
  const searchParams = useSearchParams();
  const [showFlow, setShowFlow] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // In a real implementation, these would come from URL params or authenticated session
  const caseId = searchParams?.get('caseId') || 'mock-case-id';
  const clientId = searchParams?.get('clientId') || 'mock-client-id';
  const matterReference = searchParams?.get('ref') || 'REF-12345';
  const outstandingBalance = parseInt(searchParams?.get('balance') || '150000'); // ZAR cents

  const handleComplete = () => {
    setIsComplete(true);
    setShowFlow(false);
  };

  const handleCancel = () => {
    setShowFlow(false);
  };

  const formatAmount = (amountCents: number) => {
    return `R${(amountCents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  if (isComplete) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 pt-32">
          <Card className="bg-white border-black/10 w-full max-w-2xl p-12 text-center space-y-6" shadow>
            <div className="w-20 h-20 bg-lexis-green flex items-center justify-center mx-auto">
              <LucideCheckCircle2 className="text-white" size={48} />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-3xl tracking-tight text-black uppercase">
                Cancellation Request Submitted
              </h1>
              <p className="font-mono text-sm text-black/60">
                Your case cancellation request has been processed.
              </p>
            </div>

            <div className="p-6 bg-black/5 border-l-4 border-lexis-green">
              <div className="font-mono text-xs text-black/80 text-left space-y-2">
                <p>• Our team has been notified of your cancellation request</p>
                <p>• You will receive confirmation via email within 24 hours</p>
                <p>• Outstanding fees remain due and payable</p>
                <p>• All documents will be prepared for collection or transfer</p>
              </div>
            </div>

            <div className="pt-6">
              <Button
                variant="primary"
                onClick={() => window.location.href = '/'}
                className="mx-auto"
              >
                Return to Home
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  if (!showFlow) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 pt-32">
          <Card className="bg-white border-black/10 w-full max-w-3xl p-12 space-y-8" shadow>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-lexis-red flex items-center justify-center mx-auto">
                <LucideX className="text-black" size={32} />
              </div>

              <h1 className="font-display text-4xl tracking-tight text-black uppercase">
                Case Cancellation Request
              </h1>
              <p className="font-mono text-sm text-black/60 max-w-2xl mx-auto">
                We understand that circumstances change. Before proceeding with cancellation,
                please review the information below carefully.
              </p>
            </div>

            <div className="p-6 bg-yellow-50 border-2 border-yellow-600">
              <div className="flex items-start gap-4">
                <LucideAlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
                <div className="space-y-2">
                  <div className="font-mono text-sm font-bold text-yellow-900 uppercase">
                    Important Notice
                  </div>
                  <div className="font-mono text-sm text-yellow-900">
                    Canceling your case may have significant legal consequences. We strongly recommend
                    discussing your concerns with our team before proceeding. Many issues can be resolved
                    through communication.
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 p-6 bg-black/5 border border-black/10">
              <div>
                <div className="font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
                  Case Reference
                </div>
                <div className="font-display text-xl font-bold text-black">
                  {matterReference}
                </div>
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
                  Outstanding Balance
                </div>
                <div className="font-display text-xl font-bold text-lexis-red">
                  {formatAmount(outstandingBalance)}
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border-l-4 border-blue-600">
              <div className="font-mono text-xs font-bold text-blue-900 uppercase mb-2">
                Alternative Options
              </div>
              <div className="font-mono text-xs text-blue-900 space-y-1">
                <p>• <strong>Payment Plans:</strong> Flexible payment arrangements available</p>
                <p>• <strong>Consultation:</strong> Speak with your attorney about concerns</p>
                <p>• <strong>Case Review:</strong> Reassess your legal strategy with our team</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button
                variant="secondary"
                onClick={() => window.location.href = '/tracker'}
                className="flex items-center gap-2"
              >
                <LucideX size={16} />
                Go Back to Case Tracker
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowFlow(true)}
                className="flex items-center gap-2 ml-auto bg-lexis-red"
              >
                <LucideAlertTriangle size={16} />
                Proceed with Cancellation
              </Button>
            </div>

            <div className="text-center pt-4 border-t border-black/10">
              <p className="font-mono text-xs text-black/60">
                Need assistance? Contact us at{' '}
                <a href="tel:+27 11 XXX XXXX" className="text-lexis-red font-bold hover:underline">
                  +27 11 XXX XXXX
                </a>{' '}
                or{' '}
                <a
                  href="mailto:info@mokoenalegal.co.za"
                  className="text-lexis-red font-bold hover:underline"
                >
                  info@mokoenalegal.co.za
                </a>
              </p>
            </div>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 p-6 pt-32 max-w-5xl mx-auto w-full">
        <CancellationFlow
          caseId={caseId}
          clientId={clientId}
          matterReference={matterReference}
          outstandingBalance={outstandingBalance}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </div>
      <Footer />
    </main>
  );
}
