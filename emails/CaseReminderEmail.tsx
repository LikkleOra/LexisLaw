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

interface CaseReminderEmailProps {
  clientName: string;
  matterReference: string;
  eventType: 'court_date' | 'consultation' | 'document_deadline' | 'general';
  eventDate: string;
  eventTime?: string;
  location?: string;
  notes?: string;
  daysUntilEvent: number;
}

export const CaseReminderEmail = ({
  clientName = 'Valued Client',
  matterReference = 'REF-12345',
  eventType = 'consultation',
  eventDate = '2026-05-20',
  eventTime = '10:00 AM',
  location,
  notes,
  daysUntilEvent = 7,
}: CaseReminderEmailProps) => {
  const getEventTypeLabel = () => {
    switch (eventType) {
      case 'court_date':
        return 'Court Appearance';
      case 'consultation':
        return 'Consultation Appointment';
      case 'document_deadline':
        return 'Document Submission Deadline';
      case 'general':
        return 'Important Event';
      default:
        return 'Scheduled Event';
    }
  };

  const getUrgencyMessage = () => {
    if (daysUntilEvent === 0) {
      return {
        message: 'This is a reminder that your scheduled event is TODAY.',
        color: '#DC2626',
        bgColor: '#FEF2F2',
      };
    } else if (daysUntilEvent === 1) {
      return {
        message: 'This is a reminder that your scheduled event is TOMORROW.',
        color: '#EA580C',
        bgColor: '#FFF7ED',
      };
    } else if (daysUntilEvent <= 3) {
      return {
        message: `Your scheduled event is in ${daysUntilEvent} days.`,
        color: '#D97706',
        bgColor: '#FFFBEB',
      };
    } else {
      return {
        message: `Your scheduled event is in ${daysUntilEvent} days.`,
        color: '#0891B2',
        bgColor: '#ECFEFF',
      };
    }
  };

  const urgency = getUrgencyMessage();
  const eventLabel = getEventTypeLabel();

  return (
    <Html>
      <Head />
      <Preview>{eventLabel} Reminder - {matterReference}</Preview>
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
              {eventLabel} Reminder
            </Heading>

            <Text style={text}>Dear {clientName},</Text>

            <Section style={{...urgencyBox, borderLeftColor: urgency.color, backgroundColor: urgency.bgColor}}>
              <Text style={{...urgencyText, color: urgency.color}}>
                {urgency.message}
              </Text>
            </Section>

            <Text style={text}>
              This is an automated reminder regarding your matter with reference <strong>{matterReference}</strong>.
            </Text>

            {/* Event Details Box */}
            <Section style={detailsBox}>
              <Text style={detailsLabel}>Event Type:</Text>
              <Text style={detailsValue}>{eventLabel}</Text>

              <Text style={detailsLabel}>Date:</Text>
              <Text style={detailsValue}>{eventDate}</Text>

              {eventTime && (
                <>
                  <Text style={detailsLabel}>Time:</Text>
                  <Text style={detailsValue}>{eventTime}</Text>
                </>
              )}

              {location && (
                <>
                  <Text style={detailsLabel}>Location:</Text>
                  <Text style={detailsValue}>{location}</Text>
                </>
              )}

              <Text style={detailsLabel}>Matter Reference:</Text>
              <Text style={detailsValue}>{matterReference}</Text>
            </Section>

            {notes && (
              <Section style={notesBox}>
                <Text style={notesHeading}>Important Notes:</Text>
                <Text style={notesText}>{notes}</Text>
              </Section>
            )}

            {/* Preparation Checklist */}
            {eventType === 'court_date' && (
              <Section style={checklistBox}>
                <Text style={checklistHeading}>Court Appearance Checklist:</Text>
                <Text style={checklistItem}>✓ Arrive 30 minutes early</Text>
                <Text style={checklistItem}>✓ Bring valid identification</Text>
                <Text style={checklistItem}>✓ Bring all relevant documents</Text>
                <Text style={checklistItem}>✓ Dress formally and conservatively</Text>
                <Text style={checklistItem}>✓ Turn off mobile devices before entering courtroom</Text>
              </Section>
            )}

            {eventType === 'consultation' && (
              <Section style={checklistBox}>
                <Text style={checklistHeading}>Consultation Preparation:</Text>
                <Text style={checklistItem}>✓ Prepare a list of questions or concerns</Text>
                <Text style={checklistItem}>✓ Bring all relevant documents</Text>
                <Text style={checklistItem}>✓ Arrive 10 minutes early</Text>
                <Text style={checklistItem}>✓ Confirm attendance if you cannot make it</Text>
              </Section>
            )}

            {eventType === 'document_deadline' && (
              <Section style={checklistBox}>
                <Text style={checklistHeading}>Document Submission Requirements:</Text>
                <Text style={checklistItem}>✓ Ensure all documents are complete and signed</Text>
                <Text style={checklistItem}>✓ Make copies for your records</Text>
                <Text style={checklistItem}>✓ Submit documents before the deadline</Text>
                <Text style={checklistItem}>✓ Request confirmation of receipt</Text>
              </Section>
            )}

            <Hr style={hr} />

            <Text style={contactText}>
              If you have any questions or need to reschedule, please contact our offices immediately:
            </Text>

            <Text style={footer}>
              <strong>Mokoena Legal Services</strong><br />
              Phone: +27 11 XXX XXXX<br />
              Email: info@mokoenalegal.co.za<br />
              WhatsApp: +27 XX XXX XXXX<br />
              www.mokoenalegal.co.za
            </Text>

            <Text style={disclaimer}>
              This is an automated reminder from our case management system. All client data is handled in compliance with POPIA regulations.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default CaseReminderEmail;

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

const urgencyBox = {
  padding: '16px',
  margin: '24px 0',
  borderLeft: '4px solid',
  borderRadius: '4px',
};

const urgencyText = {
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  fontWeight: '600',
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
  margin: '12px 0 4px',
  fontWeight: '600',
};

const detailsValue = {
  color: '#000000',
  fontSize: '16px',
  margin: '0 0 8px',
  fontWeight: '500',
};

const notesBox = {
  backgroundColor: '#FFFBEB',
  border: '1px solid #FCD34D',
  borderLeft: '4px solid #D97706',
  borderRadius: '4px',
  padding: '16px',
  margin: '24px 0',
};

const notesHeading = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#92400E',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
};

const notesText = {
  fontSize: '14px',
  color: '#78350F',
  lineHeight: '22px',
  margin: '0',
};

const checklistBox = {
  backgroundColor: '#F0FDF4',
  border: '1px solid #BBF7D0',
  borderRadius: '4px',
  padding: '16px',
  margin: '24px 0',
};

const checklistHeading = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#166534',
  textTransform: 'uppercase' as const,
  margin: '0 0 12px',
};

const checklistItem = {
  fontSize: '14px',
  color: '#166534',
  lineHeight: '24px',
  margin: '4px 0',
};

const contactText = {
  color: '#333333',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '24px 0 8px',
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
