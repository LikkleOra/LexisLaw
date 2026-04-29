'use client';

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  LucideMail,
  LucideMessageSquare,
  LucideAlertTriangle,
  LucideCheckCircle2,
  LucideClock,
  LucideBot
} from 'lucide-react';

export default function AgentActivityFeed() {
  const agentTasks = useQuery(api.functions.getAgentTasks, {}) as any[] | undefined;
  const communicationLog = useQuery(api.functions.getCommunicationLog, { limit: 20 }) as any[] | undefined;

  // Merge and sort activities
  const activities = React.useMemo(() => {
    const tasks = (agentTasks || []).map(task => ({
      type: 'task' as const,
      ...task,
      timestamp: task.scheduledAt || task._creationTime,
    }));

    const comms = (communicationLog || []).map(log => ({
      type: 'communication' as const,
      ...log,
      timestamp: log.sentAt,
    }));

    return [...tasks, ...comms]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 50);
  }, [agentTasks, communicationLog]);

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'payment_nudge':
      case 'demand':
        return LucideAlertTriangle;
      case 'reminder':
        return LucideClock;
      case 'cancellation':
        return LucideMessageSquare;
      default:
        return LucideBot;
    }
  };

  const getTaskColor = (taskType: string, status: string) => {
    if (status === 'sent') return 'text-lexis-green';
    if (status === 'escalated') return 'text-lexis-red';

    switch (taskType) {
      case 'demand':
        return 'text-lexis-red';
      case 'payment_nudge':
        return 'text-yellow-600';
      case 'reminder':
        return 'text-blue-600';
      default:
        return 'text-black';
    }
  };

  const formatTaskType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="bg-white border-black/10" padding="none" shadow>
      <div className="p-8 border-b border-black/10 flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-display text-xl tracking-tight text-black uppercase flex items-center gap-3">
            <LucideBot className="text-lexis-red" size={24} />
            AI Agent Activity
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-widest text-black/50">
            Real-time agent communications log
          </p>
        </div>
        <Badge variant="progress" size="sm">
          {activities.length} Recent
        </Badge>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {activities.length === 0 && (
          <div className="p-12 text-center text-black/30 italic font-mono text-sm">
            No agent activity yet. The AI agent will appear here once scheduled tasks begin.
          </div>
        )}

        {activities.map((activity, idx) => {
          if (activity.type === 'task') {
            const Icon = getTaskIcon(activity.taskType);
            const color = getTaskColor(activity.taskType, activity.status);

            return (
              <div
                key={`task-${activity._id}-${idx}`}
                className="p-6 border-b border-black/5 hover:bg-black/[0.02] transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 bg-black/5 border border-black/10 flex items-center justify-center ${color} group-hover:bg-black/10 transition-colors`}>
                    <Icon size={20} />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-mono text-xs font-bold text-black uppercase">
                          {formatTaskType(activity.taskType)}
                        </div>
                        <div className="font-mono text-[10px] text-black/60">
                          Client: <span className="text-black font-bold">{activity.clientName || 'Unknown'}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge
                          variant={
                            activity.status === 'sent' ? 'verified' :
                            activity.status === 'escalated' ? 'rejected' :
                            'pending'
                          }
                          size="sm"
                        >
                          {activity.status}
                        </Badge>
                        <div className="font-mono text-[9px] text-black/40 uppercase tracking-wider">
                          {formatTimestamp(activity.timestamp)}
                        </div>
                      </div>
                    </div>

                    {activity.generatedMessage && (
                      <div className="mt-2 p-3 bg-black/5 border-l-2 border-lexis-red">
                        <div className="font-mono text-[10px] text-black/60 line-clamp-2">
                          {activity.generatedMessage.substring(0, 120)}...
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 font-mono text-[9px] text-black/40 uppercase tracking-wider">
                      <span>Attempts: {activity.attemptCount}</span>
                      <span>•</span>
                      <span>Channel: {activity.channel}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            // Communication log entry
            const statusIcon =
              activity.status === 'delivered' || activity.status === 'sent' ? LucideCheckCircle2 :
              activity.status === 'failed' ? LucideAlertTriangle :
              activity.status === 'opened' ? LucideMail :
              LucideClock;

            const StatusIcon = statusIcon;

            return (
              <div
                key={`comm-${activity._id}-${idx}`}
                className="p-6 border-b border-black/5 hover:bg-black/[0.02] transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black/5 border border-black/10 flex items-center justify-center text-black/60 group-hover:bg-black/10 transition-colors">
                    <LucideMail size={20} />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-mono text-xs font-bold text-black">
                          {activity.subject || 'Communication Sent'}
                        </div>
                        <div className="font-mono text-[10px] text-black/60">
                          To: <span className="text-black font-bold">{activity.clientName || 'Unknown'}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-2">
                          <StatusIcon size={14} className={
                            activity.status === 'delivered' || activity.status === 'sent' ? 'text-lexis-green' :
                            activity.status === 'failed' ? 'text-lexis-red' :
                            'text-black/40'
                          } />
                          <span className="font-mono text-[9px] text-black/60 uppercase">
                            {activity.status}
                          </span>
                        </div>
                        <div className="font-mono text-[9px] text-black/40 uppercase tracking-wider">
                          {formatTimestamp(activity.timestamp)}
                        </div>
                      </div>
                    </div>

                    <div className="font-mono text-[9px] text-black/40 uppercase tracking-wider">
                      Channel: {activity.channel}
                      {activity.responseReceived && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-lexis-green">Response Received</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </Card>
  );
}
