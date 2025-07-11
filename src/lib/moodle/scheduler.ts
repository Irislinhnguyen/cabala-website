// Moodle Synchronization Scheduler
import { createMoodleClient } from './client';
import { createMoodleSyncService } from './sync';

export class MoodleScheduler {
  private syncService: ReturnType<typeof createMoodleSyncService>;
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    const moodleClient = createMoodleClient();
    this.syncService = createMoodleSyncService(moodleClient);
  }

  // Schedule regular synchronization
  startScheduledSync(intervalMinutes: number = 60): void {
    // Clear existing interval if any
    this.stopScheduledSync();

    const intervalMs = intervalMinutes * 60 * 1000;
    
    // Run initial sync
    this.runSyncWithErrorHandling();

    // Schedule recurring sync
    const intervalId = setInterval(() => {
      this.runSyncWithErrorHandling();
    }, intervalMs);

    this.intervals.set('main', intervalId);
    console.log(`Scheduled Moodle sync every ${intervalMinutes} minutes`);
  }

  // Stop scheduled synchronization
  stopScheduledSync(): void {
    const intervalId = this.intervals.get('main');
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete('main');
      console.log('Stopped scheduled Moodle sync');
    }
  }

  // Schedule analytics update (more frequent)
  startAnalyticsUpdate(intervalMinutes: number = 30): void {
    const intervalMs = intervalMinutes * 60 * 1000;
    
    const intervalId = setInterval(() => {
      this.updateAnalyticsWithErrorHandling();
    }, intervalMs);

    this.intervals.set('analytics', intervalId);
    console.log(`Scheduled analytics update every ${intervalMinutes} minutes`);
  }

  // Stop analytics update
  stopAnalyticsUpdate(): void {
    const intervalId = this.intervals.get('analytics');
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete('analytics');
      console.log('Stopped scheduled analytics update');
    }
  }

  // Manual sync trigger
  async triggerSync(): Promise<void> {
    await this.syncService.fullSync();
  }

  // Stop all scheduled tasks
  stopAll(): void {
    this.intervals.forEach((intervalId, key) => {
      clearInterval(intervalId);
      console.log(`Stopped scheduled task: ${key}`);
    });
    this.intervals.clear();
  }

  // Get status of scheduled tasks
  getStatus(): { task: string; active: boolean }[] {
    return Array.from(this.intervals.keys()).map(key => ({
      task: key,
      active: true,
    }));
  }

  // Private methods
  private async runSyncWithErrorHandling(): Promise<void> {
    try {
      console.log('Starting scheduled Moodle synchronization...');
      await this.syncService.fullSync();
      console.log('Scheduled synchronization completed successfully');
    } catch (error) {
      console.error('Scheduled synchronization failed:', error);
      // Here you could add notification logic (email, Slack, etc.)
    }
  }

  private async updateAnalyticsWithErrorHandling(): Promise<void> {
    try {
      console.log('Starting scheduled analytics update...');
      await this.syncService.updateCourseAnalytics();
      console.log('Scheduled analytics update completed successfully');
    } catch (error) {
      console.error('Scheduled analytics update failed:', error);
    }
  }
}

// Singleton instance
let schedulerInstance: MoodleScheduler | null = null;

export function getMoodleScheduler(): MoodleScheduler {
  if (!schedulerInstance) {
    schedulerInstance = new MoodleScheduler();
  }
  return schedulerInstance;
}

// Initialize scheduler if in server environment
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  // Auto-start scheduler in production
  const scheduler = getMoodleScheduler();
  scheduler.startScheduledSync(60); // Sync every hour
  scheduler.startAnalyticsUpdate(30); // Update analytics every 30 minutes
}

export default MoodleScheduler;