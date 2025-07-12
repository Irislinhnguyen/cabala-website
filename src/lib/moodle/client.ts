// Moodle Web Services API Client
export interface MoodleConfig {
  baseUrl: string;
  token: string;
}

export interface MoodleUser {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  profileimageurl?: string;
}

export interface MoodleCourse {
  id: number;
  fullname: string;
  shortname: string;
  categoryid: number;
  summary: string;
  summaryformat: number;
  format: string;
  startdate: number;
  enddate: number;
  visible: number;
  enrollmentmethods?: string[];
  lang?: string;
  courseimage?: string;
}

export interface MoodleCategory {
  id: number;
  name: string;
  description: string;
  parent: number;
  sortorder: number;
  coursecount: number;
  visible: number;
  path: string;
}

export interface MoodleEnrollment {
  id: number;
  courseid: number;
  userid: number;
  timestart: number;
  timeend: number;
  timecreated: number;
  timemodified: number;
  status: number;
  enrol: string;
}

export class MoodleClient {
  private config: MoodleConfig;

  constructor(config: MoodleConfig) {
    this.config = config;
  }

  private async makeRequest<T>(
    wsfunction: string,
    params: Record<string, unknown> = {},
    format: 'json' | 'xml' = 'json'
  ): Promise<T> {
    const url = new URL(`${this.config.baseUrl}/webservice/rest/server.php`);
    
    // Improved parameter handling for Moodle API
    const requestParams = new URLSearchParams({
      wstoken: this.config.token,
      wsfunction,
      moodlewsrestformat: format,
    });

    // Handle parameters properly for Moodle API format
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle arrays properly for Moodle
        value.forEach((item, index) => {
          if (typeof item === 'object') {
            Object.entries(item).forEach(([subKey, subValue]) => {
              requestParams.append(`${key}[${index}][${subKey}]`, String(subValue));
            });
          } else {
            requestParams.append(`${key}[${index}]`, String(item));
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        // Handle nested objects
        Object.entries(value).forEach(([subKey, subValue]) => {
          requestParams.append(`${key}[${subKey}]`, String(subValue));
        });
      } else {
        requestParams.append(key, String(value));
      }
    });

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Moodle API Request:', {
        wsfunction,
        params,
        url: url.toString(),
        formattedParams: Object.fromEntries(requestParams.entries()),
      });
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestParams,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Enhanced error handling
      if (data.exception) {
        console.error('Moodle API Exception:', {
          wsfunction,
          exception: data.exception,
          message: data.message,
          errorcode: data.errorcode,
          debuginfo: data.debuginfo,
        });
        throw new Error(`Moodle API Error: ${data.message || data.exception} (${data.errorcode || 'Unknown'})`);
      }

      if (data.warnings && data.warnings.length > 0) {
        console.warn('Moodle API Warnings:', data.warnings);
      }

      return data;
    } catch (error) {
      console.error('Moodle API Error:', {
        wsfunction,
        error: error instanceof Error ? error.message : error,
        params,
      });
      throw error;
    }
  }

  // User Management
  async getUserById(userId: number): Promise<MoodleUser> {
    const response = await this.makeRequest<MoodleUser[]>('core_user_get_users_by_field', {
      field: 'id',
      values: [userId],
    });
    return response[0];
  }

  async getUserByEmail(email: string): Promise<MoodleUser | null> {
    try {
      const response = await this.makeRequest<MoodleUser[]>('core_user_get_users_by_field', {
        field: 'email',
        values: [email],
      });
      return response && response.length > 0 ? response[0] : null;
    } catch (error) {
      // If user not found, return null instead of throwing
      if (error instanceof Error && error.message.includes('Invalid parameter value detected')) {
        return null;
      }
      throw error;
    }
  }

  async createUser(userData: {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    password: string;
  }): Promise<MoodleUser> {
    // Validate and sanitize user data
    const cleanUserData = {
      username: userData.username.trim(),
      email: userData.email.trim().toLowerCase(),
      firstname: userData.firstname.trim() || 'User',
      lastname: userData.lastname.trim() || 'Unknown',
      password: userData.password,
      auth: 'manual', // Specify auth method
      lang: 'en', // Default language
      timezone: 'Asia/Ho_Chi_Minh', // Vietnam timezone
    };

    // Ensure required fields are not empty
    if (!cleanUserData.username || !cleanUserData.email || !cleanUserData.password) {
      throw new Error('Username, email, and password are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanUserData.email)) {
      throw new Error('Invalid email format');
    }

    const response = await this.makeRequest<{ id: number }[]>('core_user_create_users', {
      users: [cleanUserData],
    });
    
    if (!response || !response[0] || !response[0].id) {
      throw new Error('Failed to create user - no ID returned');
    }
    
    return this.getUserById(response[0].id);
  }

  // Course Management
  async getAllCourses(): Promise<MoodleCourse[]> {
    return this.makeRequest<MoodleCourse[]>('core_course_get_courses');
  }

  async getCourseById(courseId: number): Promise<MoodleCourse> {
    const response = await this.makeRequest<MoodleCourse[]>('core_course_get_courses', {
      options: {
        ids: [courseId],
      },
    });
    return response[0];
  }

  async getCoursesByCategory(categoryId: number): Promise<MoodleCourse[]> {
    return this.makeRequest<MoodleCourse[]>('core_course_get_courses_by_field', {
      field: 'category',
      value: categoryId,
    });
  }

  // Category Management
  async getAllCategories(): Promise<MoodleCategory[]> {
    return this.makeRequest<MoodleCategory[]>('core_course_get_categories');
  }

  // Enrollment Management
  async enrollUser(courseId: number, userId: number, roleId: number = 5): Promise<void> {
    await this.makeRequest('enrol_manual_enrol_users', {
      enrolments: [
        {
          roleid: roleId, // 5 = Student role
          userid: userId,
          courseid: courseId,
        },
      ],
    });
  }

  async unenrollUser(courseId: number, userId: number): Promise<void> {
    await this.makeRequest('enrol_manual_unenrol_users', {
      enrolments: [
        {
          userid: userId,
          courseid: courseId,
        },
      ],
    });
  }

  async getUserEnrollments(userId: number): Promise<MoodleEnrollment[]> {
    return this.makeRequest<MoodleEnrollment[]>('core_enrol_get_users_courses', {
      userid: userId,
    });
  }

  // Authentication
  async authenticateUser(username: string, password: string): Promise<{ token?: string; error?: string }> {
    try {
      const response = await this.makeRequest<{ token: string }>('auth_email_get_signup_settings', {
        username,
        password,
      });
      return { token: response.token };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Authentication failed' };
    }
  }

  // Utilities
  async testConnection(): Promise<boolean> {
    try {
      const siteInfo = await this.makeRequest('core_webservice_get_site_info');
      console.log('Moodle connection successful:', {
        sitename: siteInfo.sitename,
        siteurl: siteInfo.siteurl,
        version: siteInfo.version,
        functions: siteInfo.functions?.length || 0,
      });
      return true;
    } catch (error) {
      console.error('Moodle connection test failed:', error);
      return false;
    }
  }

  async getSiteInfo(): Promise<Record<string, unknown>> {
    return this.makeRequest('core_webservice_get_site_info');
  }

  async checkCapabilities(): Promise<void> {
    try {
      const siteInfo = await this.getSiteInfo();
      const functions = siteInfo.functions as any[] || [];
      
      const requiredFunctions = [
        'core_user_get_users_by_field',
        'core_user_create_users',
        'core_course_get_courses',
        'enrol_manual_enrol_users'
      ];
      
      console.log('Available Moodle functions:', functions.map(f => f.name));
      console.log('Required functions check:');
      
      requiredFunctions.forEach(func => {
        const available = functions.some(f => f.name === func);
        console.log(`  ${func}: ${available ? '✅' : '❌'}`);
      });
    } catch (error) {
      console.error('Failed to check capabilities:', error);
    }
  }
}

// Factory function to create Moodle client
export function createMoodleClient(): MoodleClient {
  const config: MoodleConfig = {
    baseUrl: process.env.MOODLE_URL || '',
    token: process.env.MOODLE_TOKEN || '',
  };

  if (!config.baseUrl || !config.token) {
    throw new Error('Moodle configuration is missing. Please set MOODLE_URL and MOODLE_TOKEN environment variables.');
  }

  return new MoodleClient(config);
}