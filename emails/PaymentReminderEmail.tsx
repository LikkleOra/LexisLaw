import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface PaymentReminderEmailProps {
  clientName: string;
  invoiceId: string;
  amountDue: number; // in ZAR cents
  dueDate: string;
  escalationLevel: number;
  matterReference?: string;
}

export const PaymentReminderEmail = ({
  clientName = 'Valued Client',
  invoiceId = 'INV-12345',
  amountDue = 150000, // R1,500.00
  dueDate = '2026-05-15',
  escalationLevel = 1,
  matterReference,
}: PaymentReminderEmailProps) => {
  const formattedAmount = `R${(amountDue / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  const getTone = () => {
    switch (escalationLevel) {
      case 0:
        return {
          heading: 'Payment Reminder',
          message: `This is a friendly reminder that payment for invoice ${invoiceId} is due on ${dueDate}.`,
          urgency: 'We kindly request that you settle this account at your earliest convenience.',
        };
      case 1:
        return {
          heading: 'Outstanding Payment Notice',
          message: `Our records indicate that invoice ${invoiceId}, due on ${dueDate}, remains unpaid.`,
          urgency: 'We request payment within 5 business days to avoid further escalation.',
        };
      case 2:
        return {
          heading: 'URGENT: Payment Required',
          message: `Despite previous reminders, invoice ${invoiceId} remains outstanding past the due date of ${dueDate}.`,
          urgency: 'Immediate payment is required within 3 business days. Failure to settle this account may result in formal legal action.',
        };
      case 3:
        return {
          heading: 'FORMAL DEMAND FOR PAYMENT',
          message: `This serves as formal notice that invoice ${invoiceId}, originally due ${dueDate}, remains unpaid.`,
          urgency: 'You have 5 business days from the date of this letter to settle the full outstanding amount. Failure to comply will result in the issuance of a Letter of Demand and potential legal proceedings under the National Credit Act.',
        };
      default:
        return {
          heading: 'Payment Reminder',
          message: `Payment for invoice ${invoiceId} is due.`,
          urgency: 'Please settle this account promptly.',
        };
    }
  };

  const tone = getTone();

  return (
    <Html>
      <Head />
      <Preview>{tone.heading} - MOKOENA LEGAL SERVICES</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <div style={logo}>L</div>
            <Heading style={h1}>MOKOENA LEGAL SERVICES</Heading>
            <Text style={subtitle}>Expert Legal Counsel</Text>
          </Section>

          <Hr style={hr} />

          {/* Content */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              {tone.heading}
            </Heading>

            <Text style={text}>Dear {clientName},</Text>

            <Text style={text}>{tone.message}</Text>

            {/* Payment Details Box */}
            <Section style={detailsBox}>
              <Text style={detailsLabel}>Invoice Number:</Text>
              <Text style={detailsValue}>{invoiceId}</Text>

              {matterReference && (
                <>
                  <Text style={detailsLabel}>Matter Reference:</Text>
                  <Text style={detailsValue}>{matterReference}</Text>
                </>
              )}

              <Text style={detailsLabel}>Amount Due:</Text>
              <Text style={{...detailsValue, ...amountHighlight}}>{formattedAmount}</Text>

              <Text style={detailsLabel}>Original Due Date:</Text>
              <Text style={detailsValue}>{dueDate}</Text>
            </Section>

            <Text style={urgencyText}>{tone.urgency}</Text>

            {/* Payment Instructions */}
            <Section style={instructionsBox}>
              <Text style={instructionsHeading}>Payment Methods:</Text>
              <Text style={instructionsText}>
                <strong>Bank Transfer:</strong><br />
                Account Name: Mokoena Legal Services<br />
                Bank: First National Bank<br />
                Account Number: 62XXXXXXXXXX<br />
                Branch Code: 250655<br />
                Reference: {invoiceId}
              </Text>
              <Text style={instructionsText}>
                <strong>Email Proof of Payment:</strong> accounts@mokoenalegal.co.za
              </Text>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Should you have any queries regarding this account, please contact our offices immediately.
            </Text>

            <Text style={footer}>
              <strong>Mokoena Legal Services</strong><br />
              Phone: +27 11 XXX XXXX<br />
              Email: info@mokoenalegal.co.za<br />
              www.mokoenalegal.co.za
            </Text>

            <Text style={disclaimer}>
              This is an automated communication from our collections system. All client data is handled in compliance with POPIA regulations.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PaymentReminderEmail;

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 20px 48px',
  maxWidth: '600px',
};

const header = {
  textAlign: 'center' as const,
  padding: '32px 0',
};

const logo = {
  width: '64px',
  height: '64px',
  backgroundColor: '#DC2626',
  color: '#000000',
  fontSize: '32px',
  fontWeight: 'bold',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px',
};

const h1 = {
  color: '#000000',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '8px 0',
  padding: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '-0.5px',
};

const subtitle = {
  color: '#666666',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '2px',
  margin: '0',
};

const content = {
  padding: '0 20px',
};

const h2 = {
  color: '#000000',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '24px 0 16px',
  textTransform: 'uppercase' as const,
};

const text = {
  color: '#333333',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '16px 0',
};

const urgencyText = {
  color: '#DC2626',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '24px 0',
  fontWeight: '600',
  padding: '16px',
  backgroundColor: '#FEF2F2',
  borderLeft: '4px solid #DC2626',
};

const detailsBox = {
  backgroundColor: '#F9FAFB',
  border: '1px solid #E5E7EB',
  borderRadius: '4px',
  padding: '20px',
  margin: '24px 0',
};

const detailsLabel = {
  color: '#666666',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '8px 0 4px',
  fontWeight: '600',
};

const detailsValue = {
  color: '#000000',
  fontSize: '16px',
  margin: '0 0 16px',
  fontWeight: '500',
};

const amountHighlight = {
  fontSize: '24px',
  color: '#DC2626',
  fontWeight: 'bold',
};

const instructionsBox = {
  backgroundColor: '#FAFAFA',
  padding: '20px',
  margin: '24px 0',
  borderRadius: '4px',
};

const instructionsHeading = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#000000',
  textTransform: 'uppercase' as const,
  margin: '0 0 12px',
};

const instructionsText = {
  fontSize: '14px',
  color: '#333333',
  lineHeight: '22px',
  margin: '12px 0',
};

const hr = {
  borderColor: '#E5E7EB',
  margin: '32px 0',
};

const footer = {
  color: '#666666',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '16px 0',
};

const disclaimer = {
  color: '#999999',
  fontSize: '11px',
  lineHeight: '16px',
  margin: '32px 0 0',
  fontStyle: 'italic',
};
