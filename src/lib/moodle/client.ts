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

interface MoodleEnrolledUser {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
}

interface MoodleFunction {
  name: string;
  version: string;
}

interface MoodleSiteInfo {
  sitename?: string;
  siteurl?: string;
  version?: string;
  functions?: MoodleFunction[];
  [key: string]: unknown;
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

      const text = await response.text();
      
      // Handle empty responses
      if (!text || text.trim() === '') {
        console.log(`Moodle API returned empty response for ${wsfunction} - treating as success`);
        return {} as T;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse Moodle API response:', {
          wsfunction,
          responseText: text,
          parseError,
        });
        throw new Error(`Invalid JSON response from Moodle API: ${text.substring(0, 100)}...`);
      }

      // Handle null response (common for successful operations)
      if (data === null) {
        console.log(`Moodle API returned null for ${wsfunction} - treating as success`);
        return {} as T;
      }

      // Enhanced error handling for object responses
      if (data && typeof data === 'object' && data.exception) {
        console.error('Moodle API Exception:', {
          wsfunction,
          exception: data.exception,
          message: data.message,
          errorcode: data.errorcode,
          debuginfo: data.debuginfo,
        });
        throw new Error(`Moodle API Error: ${data.message || data.exception} (${data.errorcode || 'Unknown'})`);
      }

      // Handle warnings
      if (data && data.warnings && Array.isArray(data.warnings) && data.warnings.length > 0) {
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

    console.log('🔍 Attempting to create Moodle user with data:', cleanUserData);
    
    const response = await this.makeRequest<{ id: number }[]>('core_user_create_users', {
      users: [cleanUserData],
    });
    
    console.log('🔍 Moodle user creation response:', response);
    
    if (!response || !response[0] || !response[0].id) {
      throw new Error('Failed to create user - no ID returned');
    }
    
    const createdUser = await this.getUserById(response[0].id);
    console.log('🔍 Retrieved created user:', createdUser);
    
    return createdUser;
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
  async checkUserEnrollment(courseId: number, userId: number): Promise<boolean> {
    try {
      const enrolledUsers = await this.makeRequest<MoodleEnrolledUser[]>('core_enrol_get_enrolled_users', {
        courseid: courseId,
      });
      
      return enrolledUsers.some(user => user.id === userId);
    } catch (error) {
      console.warn('Could not check enrollment status:', error);
      return false; // Assume not enrolled if we can't check
    }
  }

  async enrollUser(courseId: number, userId: number, roleId: number = 5): Promise<{ success: boolean; alreadyEnrolled?: boolean }> {
    try {
      // First check if user is already enrolled
      const isEnrolled = await this.checkUserEnrollment(courseId, userId);
      
      if (isEnrolled) {
        console.log(`User ${userId} is already enrolled in course ${courseId}`);
        return { success: true, alreadyEnrolled: true };
      }

      // Attempt enrollment
      await this.makeRequest('enrol_manual_enrol_users', {
        enrolments: [
          {
            roleid: roleId, // 5 = Student role
            userid: userId,
            courseid: courseId,
          },
        ],
      });

      console.log(`Successfully enrolled user ${userId} in course ${courseId}`);
      return { success: true, alreadyEnrolled: false };
    } catch (error) {
      console.error('Enrollment failed:', error);
      throw error;
    }
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

  // Generate autologin token for SSO
  async generateLoginToken(): Promise<string | null> {
    try {
      // Try to get available authentication methods
      const siteInfo = await this.getSiteInfo();
      const functions = siteInfo.functions as MoodleFunction[] || [];
      
      // Check if token-based auth is available
      const hasTokenAuth = functions.some(f => 
        f.name.includes('auth') || 
        f.name.includes('token') || 
        f.name.includes('login')
      );
      
      if (!hasTokenAuth) {
        console.warn('No token-based authentication functions available in Moodle');
        return null;
      }
      
      // For now, return null as we need to configure Moodle plugins
      return null;
    } catch (error) {
      console.error('Failed to generate login token:', error);
      return null;
    }
  }

  // Generate secure autologin URL
  async generateAutologinUrl(userId: number, redirectUrl: string): Promise<string> {
    const moodleUrl = process.env.MOODLE_URL;
    if (!moodleUrl) {
      throw new Error('Moodle URL not configured');
    }

    // Try to generate login token
    const token = await this.generateLoginToken();
    
    if (token) {
      // Use token-based autologin (requires Moodle auth plugin)
      return `${moodleUrl}/auth/userkey/login.php?key=${token}&redirect=${encodeURIComponent(redirectUrl)}`;
    } else {
      // Fallback: direct course URL (user will need to login manually)
      console.warn('Token-based SSO not available, using direct course URL');
      return redirectUrl;
    }
  }

  // Utilities
  async testConnection(): Promise<boolean> {
    try {
      const siteInfo = await this.makeRequest<MoodleSiteInfo>('core_webservice_get_site_info');
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

  async getSiteInfo(): Promise<MoodleSiteInfo> {
    return this.makeRequest('core_webservice_get_site_info');
  }

  async checkCapabilities(): Promise<void> {
    try {
      const siteInfo = await this.getSiteInfo();
      const functions = siteInfo.functions as MoodleFunction[] || [];
      
      const requiredFunctions = [
        'core_user_get_users_by_field',
        'core_user_create_users',
        'core_course_get_courses',
        'enrol_manual_enrol_users',
        'core_enrol_get_enrolled_users'
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