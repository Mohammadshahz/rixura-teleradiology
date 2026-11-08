# Radiology Service Enum Types Documentation

This document provides a comprehensive overview of all enum types used in the Radiology Service, including their values, where they are used, and their purpose in the application.

## User Enums

### UserRole

```typescript
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  RADIOLOGIST = 'RADIOLOGIST',
  CENTER = 'CENTER',
}
```

**Purpose:** Defines the different types of users in the system with varying permissions and capabilities.

**Usage:**
- Used in `user.entity.ts` to define the role property of users
- Used in DTOs like `create-user.dto.ts`, `update-user.dto.ts`, and `filter-user.dto.ts` for validation
- Used in services like `user.service.ts` to implement role-specific logic:
  ```typescript
  if (savedUser.role === UserRole.CENTER && centerId) {
    // CENTER-specific logic
  }
  ```
- Used in `auth.service.ts` for authorization checks:
  ```typescript
  if (user.role !== UserRole.CENTER) {
    // Authorization logic
  }
  ```
- Used in `report-comment.service.ts` for role-based access control:
  ```typescript
  if (userRole === UserRole.RADIOLOGIST) {
    // RADIOLOGIST-specific logic
  } else if (userRole === UserRole.CENTER) {
    // CENTER-specific logic
  }
  ```
- Used in `report-comment.repository.ts` to handle role-specific queries

### UserStatus

```typescript
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
```

**Purpose:** Defines the possible states for a user account.

**Usage:**
- Used in `user.entity.ts` to define the status property of users
- Used in DTOs like `create-user.dto.ts`, `update-user.dto.ts`, and `filter-user.dto.ts` for validation
- Used in services like `user.service.ts` for default values:
  ```typescript
  status: createUserDto.status || UserStatus.ACTIVE,
  ```
- Used to filter and identify active/inactive users throughout the application

## Report Enums

### XRayType

```typescript
export enum XRayType {
  CT_SCAN = 'CT-SCAN',
  XRAY = 'XRAY',
  MRI = 'MRI',
}
```

**Purpose:** Identifies the type of radiological imaging procedure that was performed.

**Usage:**
- Used in `report.entity.ts` to define the xRayType property of reports
- Used in DTOs like `create-report.dto.ts`, `upload-report.dto.ts`, `update-report.dto.ts`, and `filter-report.dto.ts` for validation
- Used in API requests to specify the type of X-ray when creating or filtering reports

### ReportType

```typescript
export enum ReportType {
  NORMAL = 'NORMAL',
  CRITICAL = 'CRITICAL',
}
```

**Purpose:** Classifies the medical significance of a radiological report.

**Usage:**
- Used in `report.entity.ts` to define the reportType property of reports
- Used in DTOs like `create-report.dto.ts`, `upload-report.dto.ts`, `update-report.dto.ts`, and `filter-report.dto.ts` for validation
- Used to categorize reports by medical importance (normal vs critical)

### ReportStatus

```typescript
export enum ReportStatus {
  IDLE = 'IDLE',
  ACCEPTED = 'ACCEPTED',
  REPORTED = 'REPORTED',
  REVERTED = 'REVERTED',
}
```

**Purpose:** Tracks the current stage in the workflow of a radiological report.

**Usage:**
- Used in `report.entity.ts` to define the status property of reports with default value of IDLE
- Used in DTOs like `create-report.dto.ts`, `update-report.dto.ts`, and `filter-report.dto.ts` for validation
- Used in `report.controller.ts` for API query parameters:
  ```typescript
  @ApiQuery({ name: 'status', enum: ReportStatus, required: false, description: 'Filter reports by status' })
  ```
- Used to implement workflow transitions (IDLE → ACCEPTED → REPORTED or REVERTED)

## Template Enums

### TemplateType

```typescript
export enum TemplateType {
  DEFAULT = 'DEFAULT',
  CUSTOM = 'CUSTOM',
}
```

**Purpose:** Distinguishes between system-provided default templates and custom templates created by users.

**Usage:**
- Used to categorize and filter different types of report templates
- Enables separation between unchangeable system templates and modifiable user templates
