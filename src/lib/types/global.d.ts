declare global {

  var mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;

  type UserRole = "EMPLOYEE" | "COMPANY" | "ADMIN";
  type JobStatus = "open" | "in-progress" | "completed" | "closed";
  type JobType = "FULL_TIME" | "PART_TIME" | "REMOTE" | "INTERNSHIP";
  type ApplicationStatus = "pending" | "accepted" | "rejected";

  interface IUser {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: number;
    role: UserRole;
    rating: number;
    ratingCount: number;
    skills?: string[];
    companyName?: string;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  interface JobResponse {
    _id: string;
    companyId: string;
    companyName: string;
    title: string;
    description: string;
    location: string;
    salary: number;
    jobType: JobType;
    skillsRequired: string[];
    startDate: string;
    endDate: string;
    status: JobStatus;
    applicantsCount: number;
    positions: number;
    isUnlimitedHiring: boolean;
    createdAt: string;
    updatedAt: string;
  }

  interface JobsResponse {
    jobs: JobResponse[];
    total: number;
    page: number;
    totalPages: number;
  }

  interface CreateJobBody {
    title: string;
    companyName: string;
    description?: string;
    location?: string;
    salary?: number;
    jobType: JobType;
    skillsRequired?: string[];
    positions?: number;
    isUnlimitedHiring?: boolean;
    startDate: string;
    endDate: string;
  }

  interface UpdateJobBody {
    title?: string;
    companyName?: string;
    description?: string;
    location?: string;
    salary?: number;
    jobType?: JobType;
    skillsRequired?: string[];
    startDate?: string;
    endDate?: string;
    status?: JobStatus;
    positions?: number;
    isUnlimitedHiring?: boolean;
  }

  interface ApplicationResponse {
    _id: string;
    jobId: string | JobResponse;
    employeeId: string | Partial<IUser>;
    status: ApplicationStatus;
    note?: string;
    appliedAt: string;
    createdAt: string;
    updatedAt: string;
  }

  interface ReviewResponse {
    _id: string;
    fromUserId: string | Partial<IUser>;
    toUserId: string;
    jobId: string;
    rating: number;
    comment?: string;
    createdAt: string;
    updatedAt: string;
  }
}
export { };
