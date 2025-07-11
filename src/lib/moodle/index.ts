// Moodle Integration - Main Export
export { MoodleClient, createMoodleClient } from './client';
export { MoodleSyncService, createMoodleSyncService } from './sync';
export { MoodleScheduler, getMoodleScheduler } from './scheduler';

export type {
  MoodleConfig,
  MoodleUser,
  MoodleCourse,
  MoodleCategory,
  MoodleEnrollment,
} from './client';