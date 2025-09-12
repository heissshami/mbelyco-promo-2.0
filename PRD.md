📘 Product Requirement Document (PRD)

📌 Product Name (Working Title):
MBELYCO Promo v2.0 - Promo Code Management System.

🎯 Objective
MBELYCO Promo v2.0 is a comprehensive Promotional Code Management System 
that enables MBELYCO Paints to execute large-scale marketing initiatives 
through USSD-based promo code redemption and automated mobile money disbursements.

### Core Workflow
1. **Batch Creation**: Administrators create promotional campaigns with configurable parameters
2. **Code Generation**: System generates unique, secure promo codes in batches using timestamp-based algorithms
3. **User Redemption**: Customers redeem codes via USSD (*XYZ#) without requiring smartphones
4. **Instant Payout**: Automated disbursement through MTN MoMo integration with retry mechanisms
5. **Real-time Monitoring**: Comprehensive tracking and analytics through admin dashboard

🌟 Core Features

### 1. Authentication & Authorization

#### 1.1. Security & Permissions Framework

The system implements a comprehensive role-based access control (RBAC) system with granular permissions for every feature and operation.

**User Story**:
As a system administrator, I want to implement role-based access control with granular permissions, so that I can ensure only authorized users can access specific system functions and maintain security.

**Scope**:
- Role-based access control (RBAC) system.
- Granular permission management.
- Session management with secure tokens.
- Permission-based middleware for API protection.
- User role assignment and management.

**Authentication Strategy (Better Auth Integration)**:
- JWT-based authentication with **httpOnly cookies**.
- Session management with configurable expiration.
- Secure password policies and validation.

**Out of Scope**:
- Single sign-on (SSO) integration.
- Advanced biometric authentication.
- Integration with external identity providers.
- Automated role assignment based on user behavior.

**Acceptance Criteria**:
- [ ] System supports multiple user roles (Admin, Customer, Batch Manager, etc.).
- [ ] Each role has specific permissions defined.
- [ ] API endpoints are protected with permission middleware.
- [ ] Users can only access functions they have permissions for.
- [ ] Session management with configurable expiration.
- [ ] Multi-factor authentication for admin accounts.
- [ ] Audit logging of all permission-based actions.
- [ ] Role changes require admin approval.

**User Flow**:
1. The user attempts to access protected resources.
2. The system checks user authentication status.
3. If authenticated, the system retrieves user permissions.
4. The system validates that the user has required permission for the resource.
5. If authorized, access is granted; otherwise, access is denied.
6. All access attempts are logged for audit purposes.
7. Admin can modify user roles and permissions.
8. Changes take effect immediately for active sessions.

#### 1.2. Authorization Framework

**Permission Enforcement**:
- Middleware-based authorization checking.
- Granular permission system for different user roles.
- API endpoint protection with role-based access.
- Audit logging of all permission-based actions.

**Authorization Implementation**:  
The permissions are enforced through the **withAuth middleware** function which takes an array of required permissions as a parameter. The authorization middleware design is documented to check if users have required permissions before allowing access to protected resources.

**System Permissions**:

**1. User Management Permissions**
- `users.read` - View user profiles and information
- `users.create` - Create new user accounts
- `users.update` - Modify user information and settings
- `users.delete` - Remove user accounts
- `users.roles.assign` - Assign roles to users
- `users.roles.revoke` - Remove roles from users
- `users.permissions.manage` - Manage user-specific permissions

**2. Batch Management Permissions**
- `batches.read` - View batch information and statistics
- `batches.create` - Create new promotional batches
- `batches.update` - Modify batch settings and parameters
- `batches.delete` - Remove batches (with restrictions)
- `batches.assign` - Assign batches to specific users
- `batches.status.change` - Change batch status (active/expired/blocked)
- `batches.export` - Export batch data and reports

**3. Promo Code Management Permissions**
- `promo-codes.read` - View promo code information
- `promo-codes.generate` - Generate new promo codes
- `promo-codes.import` - Import codes from CSV files
- `promo-codes.download` - Download codes in PDF/CSV format
- `promo-codes.status.change` - Change individual code status
- `promo-codes.bulk.operations` - Perform bulk operations on codes
- `promo-codes.validate` - Validate code format and uniqueness
- `promo-codes.search` - Search if codes exist only

**4. Redemption Management Permissions**
- `redemptions.read` - View redemption transactions
- `redemptions.monitor` - Monitor real-time redemption activity
- `redemptions.search` - Search and filter redemption records
- `redemptions.export` - Export redemption data
- `redemptions.audit` - Access redemption audit logs
- `redemptions.fraud.report` - Report suspicious redemption activities

**5. Payment & Disbursement Permissions**
- `disbursements.read` - View disbursement records
- `disbursements.monitor` - Monitor payment processing status
- `disbursements.retry` - Retry failed disbursements
- `disbursements.approve` - Approve manual disbursements
- `disbursements.reconcile` - Reconcile with MTN MoMo records
- `disbursements.export` - Export financial reports
- `disbursements.configure` - Configure disbursement settings and retry policies

**6. System Configuration Permissions**
- `system.settings.read` - View system configuration
- `system.settings.update` - Modify system settings
- `system.integrations.manage` - Manage API integrations
- `system.rate-limits.configure` - Configure rate limiting rules
- `system.notifications.setup` - Setup alert notifications
- `system.backup.manage` - Manage system backups
- `system.monitoring` - Monitor system performance and concurrency control

**7. Reporting & Analytics Permissions**
- `reports.read` - Access standard reports
- `reports.create` - Create custom reports
- `reports.export` - Export reports in various formats
- `analytics.dashboard` - Access analytics dashboard
- `analytics.real-time` - View real-time analytics
- `analytics.historical` - Access historical data analysis

**8. Audit & Security Permissions**
- `audit.logs.read` - View audit logs
- `audit.logs.export` - Export audit trail data
- `audit.logs.configure` - Configure audit logging settings and retention policies
- `security.alerts.view` - View security alerts
- `security.incidents.manage` - Manage security incidents
- `security.fraud.detect` - Access fraud detection tools
- `security.compliance.report` - Generate compliance reports

**9. System Alerts & Monitoring Permissions**
- `alerts.read` - View system alerts and notifications
- `alerts.create` - Create custom alert rules
- `alerts.update` - Modify alert configurations and thresholds
- `alerts.delete` - Remove alert rules
- `alerts.acknowledge` - Acknowledge and resolve alerts
- `alerts.escalate` - Escalate critical alerts
- `alerts.configure` - Configure alert delivery channels
- `alerts.export` - Export alert history and reports
- `fraud.alerts.view` - View fraud detection alerts
- `fraud.alerts.manage` - Manage fraud detection rules
- `system.alerts.view` - View system health alerts
- `financial.alerts.view` - View financial threshold alerts

#### 1.3. Predefined Roles

**1. Super Administrator**
- Full system access with all permissions
- Can manage all users, roles, and system settings
- Access to all financial and security operations
- System configuration and integration management.

**2. Batch Manager**
- `promo-codes.search`, `redemptions.read`, `reports.read`, `alerts.read`, `fraud.alerts.view`
- Can create and manage batches
- Access to redemption monitoring and basic reporting
- Can view alerts related to campaign performance and fraud

**3. Financial Administrator**
- `disbursements.*`, `redemptions.read`, `reports.read`, `audit.logs.read`, `alerts.read`, `financial.alerts.view`, `alerts.acknowledge`
- Manages payment processing and financial reconciliation
- Access to financial reports and audit trails
- Can view and acknowledge financial threshold alerts

**4. Support Agent**
- `users.read`, `redemptions.read`, `promo-codes.read`, `alerts.read`, `system.alerts.view`
- Limited access for customer support operations
- Can view user information and redemption history
- Can view system health alerts for troubleshooting

**5. Viewer**
- `batches.read`, `promo-codes.read`, `redemptions.read`, `reports.read`, `alerts.read`
- Read-only access to system information
- Suitable for stakeholders and monitoring purposes
- Can view alerts but cannot acknowledge or manage them

**API Endpoint Protection**
- All admin endpoints protected with permission middleware
- Granular permission checking for each operation
- Audit logging of all permission-based access attempts

### 1.4. User Management & Authentication

Comprehensive authentication system with dual user registration methods - automatic USSD registration for customers and configurable admin panel registration for system administrators, with role-based access control and granular permissions.

**User Story**: As a system administrator, I want to control user registration access through system settings, so that I can manage who can create admin accounts while maintaining automatic registration for USSD users.

**Scope**:
- **Dual Registration System**:
  - Automatic USSD user registration (always enabled)
  - Configurable admin panel registration (toggleable via system settings)
- Better Auth integration with JWT tokens and httpOnly cookies
- Role-based access control (RBAC) with granular permissions
- Session management with configurable expiration
- Multi-factor authentication for admin accounts
- Permission-based middleware for API protection
- User role assignment and management
- Comprehensive audit logging
- Registration access control through system settings

**Out of Scope**:
- Single sign-on (SSO) integration with external providers
- Advanced biometric authentication
- Integration with external identity providers
- Automated role assignment based on user behavior

**Acceptance Criteria**:
- [ ] System supports multiple user roles (Super Admin, Campaign Manager, Financial Admin, Support Agent, Viewer)
- [ ] Each role has specific granular permissions defined
- [ ] All API endpoints are protected with permission middleware
- [ ] Users can only access functions they have permissions for
- [ ] Session management with configurable expiration (default: 24 hours)
- [ ] Multi-factor authentication for admin accounts
- [ ] Comprehensive audit logging of all permission-based actions
- [ ] Role changes require admin approval and are logged
- [ ] Password policies enforce strong authentication
- [ ] Account lockout after failed login attempts
- [ ] **USSD users are automatically registered when they first use the system**
- [ ] **Admin panel registration can be enabled/disabled through system settings**
- [ ] **Registration link visibility is controlled by system configuration**
- [ ] **Registration attempts are logged and monitored**

**User Flow**:

**For USSD Users (Automatic Registration)**:
1. Customer dials USSD code for first time
2. System automatically creates user account with phone number
3. User is assigned default "Customer" role with limited permissions
4. User can immediately redeem promo codes
5. All USSD interactions are logged for audit

**For Admin Users (Configurable Registration)**:
1. Admin navigates to login page
2. If registration is enabled in system settings, "Register" link is visible
3. If registration is disabled, only "Login" option is available
4. Admin clicks "Register" (if enabled) and fills registration form
5. System validates registration data and checks if registration is allowed
6. New admin account is created with pending approval status
7. Super Admin receives notification of new registration request
8. Super Admin approves or rejects the registration
9. Approved user receives email with login credentials
10. User can now access admin panel with assigned permissions

**System Permissions Required**:
- `users.read` - View user profiles and information
- `users.create` - Create new user accounts
- `users.update` - Modify user information and settings
- `users.delete` - Remove user accounts
- `users.roles.assign` - Assign roles to users
- `users.roles.revoke` - Remove roles from users
- `users.registration.manage` - Manage registration settings
- `users.registration.approve` - Approve pending registrations
- `audit.logs.read` - View authentication audit logs

### 2. Admin Panel Features
Provides comprehensive administrative functionality including batch management, promo code generation, user management, redemption tracking, disbursement monitoring, and reporting with role-based access control (RBAC).

#### 2.1. Administrative Dashboard

**User Story**:
As a system administrator, I want to have a comprehensive dashboard that provides real-time visibility into all system operations, so that I can monitor Promo Codes Redemption's performance and track user activities.

**Scope**:
- Real-time system metrics and KPIs
- Promo Codes Redemptions performance.
- User activity tracking
- Quick action buttons for common tasks
- Responsive design for mobile and desktop access

**Out of Scope**:
- Real-time chat or communication features
- Advanced data visualization with custom charts
- Third-party analytics integration
- Automated system maintenance actions

**Acceptance Criteria**:
- [ ] Dashboard loads within 2 seconds
- [ ] Real-time data updates every 30 seconds
- [ ] Shows key metrics: total redemptions, active batches, system uptime
- [ ] Displays recent activity feed with timestamps
- [ ] Provides quick access to create new batches and manage users
- [ ] Responsive design works on tablets and mobile devices
- [ ] Role-based access shows only relevant information

**User Flow**:
1. Admin logs into system
2. Dashboard automatically loads with default view.
3. The system displays real-time metrics and recent activities.
4. Admin can click on any metric to drill down into details.
5. Quick action buttons provide shortcuts to common tasks.

#### 2.2. Batch Management
Complete batch lifecycle management including creation, code generation, assignment, monitoring, and export capabilities for promotional campaigns.

**User Story**: As a campaign manager, I want to create and manage promotional batches with configurable parameters, so that I can organize and track promotional campaigns effectively.

**Scope**:
- Create new batches with configurable parameters
- Generate unique promo codes in bulk (100,000+ codes per batch)
- Assign batches to specific users with proper permissions
- Track batch lifecycle from creation to completion
- Monitor batch performance metrics and statistics
- Export batch data in PDF and CSV formats
- Import existing codes from CSV files
- Bulk operations on batches (status changes, deletion)

**Out of Scope**:
- Automated batch creation based on external triggers
- Advanced batch analytics with machine learning
- Integration with external campaign management systems
- Real-time batch performance optimization

**Acceptance Criteria**:
- [ ] Can create batches with required fields: name, description, total_codes, amount_per_code, expiration_date
- [ ] Batch names must be unique within the system
- [ ] Can generate more than 100,000 promo codes per batch
- [ ] Generated codes follow format: XXXX-XXYY-XXMM-XXDD
- [ ] All generated codes are unique within the system
- [ ] Can assign batches to specific users with proper permissions
- [ ] Can export batch data in PDF (12 codes per A4 page) and CSV formats
- [ ] Can import codes from CSV with validation and error reporting
- [ ] Batch status updates automatically based on expiration and redemption status
- [ ] Can perform bulk operations: block, delete, or change status of multiple batches
- [ ] All batch operations are logged for audit purposes
- [ ] Form validation prevents invalid data entry

**User Flow**:
1. Campaign manager navigates to Batch Management section
2. Views list of batches with action buttons: "Generate Codes", "Import Codes", "Download Codes"
3. For new batch: Clicks "Create New Batch" button
4. Fills out batch creation form with required parameters
5. System validates input and checks for duplicate batch names
6. Manager assigns batch to specific user (optional)
7. System creates batch and generates associated promo codes
8. Manager can view batch details and monitor performance
9. System automatically updates batch status based on conditions
10. Manager can use Generate/Import/Download buttons for batch operations

**System Permissions Required**:
- `batches.read` - View batch information and statistics
- `batches.create` - Create new promotional batches
- `batches.update` - Modify batch settings and parameters
- `batches.delete` - Remove batches (with restrictions)
- `batches.assign` - Assign batches to specific users
- `batches.status.change` - Change batch status
- `batches.export` - Export batch data and reports
- `promo-codes.generate` - Generate new promo codes
- `promo-codes.import` - Import codes from CSV files
- `promo-codes.export` - Export codes in PDF/CSV format

#### 2.3. Promo Code Management
Comprehensive promo code lifecycle management including generation, validation, status tracking, and bulk operations with secure algorithms.

**User Story**: As a system administrator, I want to generate, manage, and track individual promo codes with secure algorithms, so that I can maintain code integrity and prevent fraud.

**Scope**:
- Generate unique promo codes using secure timestamp-based algorithms
- Individual code status management (active, used, expired, redeemed, reported, blocked)
- Code search and filtering capabilities
- Bulk operations on codes (status changes, blocking, deletion)
- Code validation and duplicate detection
- Import/export functionality for codes
- Fraud reporting and investigation tools

**Out of Scope**:
- AI-powered code generation with custom patterns
- Integration with external code generation services
- Advanced code analytics and pattern recognition
- Automated code distribution to external systems

**Acceptance Criteria**:
- [ ] Can generate codes using format: XXXX-XXYY-XXMM-XXDD
- [ ] All generated codes are cryptographically secure and unique
- [ ] Can search codes by batch, status, or partial code match
- [ ] Can change individual code status (active, blocked, reported)
- [ ] Can perform bulk operations on multiple codes
- [ ] Code validation prevents duplicate entries
- [ ] Import/export functionality works with proper validation
- [ ] Fraud reporting system flags suspicious codes
- [ ] All code operations are logged for audit purposes

**User Flow**:
1. Admin navigates to Promo Code Management section
2. Views list of promo codes with action buttons: "Generate Codes", "Import Codes", "Download Codes"
3. For generation: Clicks "Generate Codes" button, configures parameters and initiates bulk generation
4. For import: Clicks "Import Codes" button, uploads CSV file with validation
5. For export: Clicks "Download Codes" button, selects format (PDF/CSV) and batch
6. For management: Searches, filters, and modifies individual codes
7. System validates all operations and shows progress
8. Admin reviews results and performs additional operations as needed

**System Permissions Required**:
- `promo-codes.read` - View promo code information
- `promo-codes.generate` - Generate new promo codes
- `promo-codes.import` - Import codes from CSV files
- `promo-codes.export` - Export codes in PDF/CSV format
- `promo-codes.status.change` - Change individual code status
- `promo-codes.bulk.operations` - Perform bulk operations on codes
- `promo-codes.validate` - Validate code format and uniqueness

#### 2.4. Promo Code Generation

Comprehensive bulk promo code generation system with secure algorithms, validation, and progress tracking for large-scale promotional campaigns.

**User Story**: As a system administrator, I want to generate unique promotional codes in bulk with a secure algorithm, so that I can generate large-scale Batches efficiently while maintaining code security and uniqueness.

**Scope**:
- Bulk generation of unique promo codes (up to 100,000 codes per batch)
- Secure timestamp-based code generation algorithm
- Real-time progress tracking and status updates
- Code uniqueness validation and duplicate prevention
- Batch association and status initialization
- Form validation with comprehensive error handling
- Performance optimization for large-scale generation
- Audit logging of all generation activities

**Out of Scope**:
- AI-powered code generation with custom patterns
- Integration with external code generation services
- Advanced code analytics and pattern recognition
- Automated code distribution to external systems
- Real-time code generation streaming

**Acceptance Criteria**:
- [ ] Can generate up to 100,000 unique promo codes per batch
- [ ] Generated codes follow format: XXXX-XXYY-XXMM-XXDD
- [ ] All generated codes are cryptographically secure and unique
- [ ] Real-time progress tracking shows generation percentage
- [ ] Code generation completes within acceptable time limits
- [ ] Duplicate code detection prevents conflicts
- [ ] All codes are properly associated with specified batch
- [ ] Generated codes are initialized with 'active' status
- [ ] Generation activities are logged for audit purposes
- [ ] Form validation prevents invalid data entry

**User Flow**:
1. Administrator navigates to Promo Code Generation section
2. Fills out generation form with batch parameters
3. System validates form data and checks permissions
4. Administrator initiates bulk code generation
5. System shows real-time progress indicator
6. Background process generates codes using secure algorithm
7. System validates uniqueness and associates codes with batch
8. Generation completion notification is displayed
9. Administrator can view generated codes and download them
10. All generation activities are logged for audit

**Generation Workflow**:
1. **Batch Configuration**: Define batch parameters (`batch_name`, `expiration_date`, `total_codes`, `amount_per_code`)
2. **Code Creation**: Generate unique codes using secure algorithms with timestamp-based formatting
3. **Validation**: Ensure code uniqueness and format compliance
4. **Batch Assignment**: Associate generated codes with specified batch
5. **Status Initialization**: Set all codes to 'active' status

**Code Format Algorithm:**
```
Format: XXXX-XXYY-XXMM-XXDD
Where: X = Random alphanumeric character
       YY = Year (last 2 digits)
       MM = Month (2 digits)
       DD = Day (2 digits)
Example: A1B2-C324-5D12-6E25
```

**Code Generation Form**:
- **Form Fields:**
    - Batch Name: Unique identifier for the promotional batch
    - Code Quantity: Number of promo codes to generate (1-100,000)
    - Amount per Code: Monetary value for each code (RWF)
    - Expiration Date: Campaign end date with timezone support
    - Assigned User: User responsible for batch management
    - Description: Optional batch description for internal tracking

- **Form Validation:**
    - Batch name uniqueness validation
    - Code quantity limits and performance considerations
    - Amount validation with currency formatting
    - Date validation ensuring future expiration dates
    - User assignment validation and permission checks

**System Permissions Required**:
- `promo-codes.generate` - Generate new promo codes
- `batches.create` - Create new promotional batches
- `batches.update` - Modify batch settings and parameters
- `audit.logs.read` - View generation audit logs

#### 2.5. Promo Codes Download

Comprehensive download system for promotional codes in multiple formats with progress tracking, proper formatting, and audit logging for offline distribution and record keeping.

**User Story**: As an administrator, I want to download Promo Codes in A4 PDF or CSV format, so that I can distribute codes to sales teams and maintain them offline.

**Scope**:
- A4 PDF and CSV download functionality with proper formatting
- Batch-specific code download with filtering options
- Real-time download progress indication and status updates
- Comprehensive data export with all relevant code information
- Proper file naming conventions and metadata inclusion
- Authorization-based access control for download operations
- Download activity logging and audit trail
- Performance optimization for large dataset downloads

**Out of Scope**:
- Real-time download streaming for very large datasets
- Custom download templates beyond standard formats
- Integration with external document management systems
- Automated download scheduling and distribution
- Advanced document customization and branding

**Acceptance Criteria**:
- [ ] Can download promo codes in PDF and CSV formats
- [ ] PDF format displays 12 codes per A4 page with proper layout
- [ ] PDF includes batch name, generation date, and page numbers
- [ ] CSV includes all relevant code data (code, batch, amount, status, dates)
- [ ] Download process shows real-time progress indicator
- [ ] Downloaded files have proper naming conventions (Batch Name + timestamp)
- [ ] Download is limited to authorized users with proper permissions
- [ ] Download activities are logged for audit purposes
- [ ] Large file downloads are handled efficiently without timeouts
- [ ] File integrity is validated before download completion

**User Flow**:
1. Administrator navigates to "Batches" or "Promo Codes" pages
2. Clicks on the "Download Codes" button
3. Selects download format (PDF or CSV) from options
4. Chooses specific batch from dropdown menu
5. Clicks the "Download" button to initiate process
6. System shows real-time progress indicator during generation
7. File is generated with proper formatting and validation
8. Browser downloads file with descriptive name
9. Download activity is logged for audit purposes
10. Administrator receives confirmation of successful download

**Download Interface**:
- **Format Selection**: Choose between PDF and CSV download formats
- **Batch Selection**: Select specific batch for download from dropdown menu
- **Download Trigger**: Single-click download with progress indication
- **Progress Tracking**: Real-time percentage and status updates
- **Error Handling**: Clear error messages and retry options

**PDF Download Features**:
- **Page Layout**: A4 format with 12 codes per page
- **Header Information**: Batch number, batch name, and generation date
- **Pagination**: Automatic page calculation (e.g., 1,201 codes = 101 pages)
- **Code Formatting**: Clear display of code and amount with proper spacing
- **Footer Information**: Page numbers and total page count
- **Branding**: Company logo and contact information

**CSV Download Features**:
- **Comprehensive Data**: Code, Batch Number, Batch Name, Amount, Currency, Status, Created Date, Expiration Date
- **Proper Formatting**: CSV escape characters and encoding compliance
- **Batch Filtering**: Download only codes from selected batch
- **Data Integrity**: Validation of downloaded data accuracy
- **Header Row**: Column names for easy data import
- **UTF-8 Encoding**: Proper character encoding for international support

**Backend Implementation**:
- **API Endpoint**: `/api/v1/admin/promo-codes/export`
- **Query Parameters**: `format` (pdf/csv) and `batchId`
- **Database Integration**: Drizzle ORM queries for efficient data retrieval
- **File Generation**: Server-side PDF/CSV creation with appropriate headers
- **Security**: Authorization checks and rate limiting for download operations
- **Progress Tracking**: Real-time status updates via WebSocket or polling
- **Error Handling**: Comprehensive error handling and user feedback

**System Permissions Required**:
- `promo-codes.export` - Download codes in PDF/CSV format
- `batches.read` - View batch information for download
- `audit.logs.read` - View download audit logs

#### 2.6. Transaction Monitoring

Comprehensive real-time transaction monitoring system for redemption and disbursement tracking with detailed analytics, retry mechanisms, and reconciliation capabilities.

**User Story**: As an administrator, I want to monitor all redemption and disbursement transactions in real-time, so that I can ensure proper payment processing and identify any issues quickly.

**Scope**:
- Real-time redemption tracking with live status updates
- Disbursement status monitoring and progress tracking
- Comprehensive transaction history with detailed information
- Failed transaction analysis and automated retry mechanisms
- Payment reconciliation with MTN MoMo records
- Advanced transaction search and filtering capabilities
- Transaction analytics and performance metrics
- Automated alert notifications for critical issues
- Export functionality for transaction data analysis
- Audit trail and compliance reporting

**Out of Scope**:
- Real-time fraud detection with machine learning algorithms
- Integration with external accounting systems (QuickBooks, SAP)
- Advanced financial reporting and business intelligence
- Automated transaction dispute resolution
- Integration with external payment processors beyond MTN MoMo
- Advanced predictive analytics for transaction patterns

**Acceptance Criteria**:
- [ ] Shows real-time list of all redemption attempts with live updates
- [ ] Displays comprehensive disbursement status for each transaction
- [ ] Can filter transactions by date, status, amount, user, or batch
- [ ] Shows detailed transaction information including timestamps and metadata
- [ ] Identifies failed transactions with detailed error messages and codes
- [ ] Provides manual and automated retry mechanisms for failed disbursements
- [ ] Reconciles transaction records with MTN MoMo API responses
- [ ] Downloads transaction data in multiple formats for external analysis
- [ ] Generates transaction reports with performance metrics
- [ ] Sends automated alerts for critical transaction failures
- [ ] Maintains complete audit trail for all transaction activities
- [ ] Supports bulk operations for transaction management

**User Flow**:
1. Financial administrator accesses Transaction Monitoring dashboard
2. Views real-time list of recent transactions with live status updates
3. Applies filters based on criteria (date range, status, amount, user)
4. Clicks on specific transaction to view detailed information
5. For failed transactions, reviews error details and initiates retry process
6. Monitors disbursement status updates and progress indicators
7. Downloads transaction data for reconciliation and analysis
8. Reviews system alerts and notifications for transaction issues
9. Generates reports for management and compliance purposes
10. Performs bulk operations on selected transactions

**Transaction Monitoring Dashboard**:
- **Real-time Updates**: Live transaction status updates via WebSocket
- **Filtering Options**: Date range, status, amount, user, batch, payment method
- **Search Functionality**: Text search across transaction details
- **Sorting Options**: Multiple column sorting with custom criteria
- **Pagination**: Efficient handling of large transaction datasets
- **Export Options**: PDF, CSV export with custom date ranges

**Transaction Details View**:
- **Basic Information**: Transaction ID, timestamp, user details, amount
- **Status Tracking**: Current status with historical status changes
- **Payment Details**: MoMo transaction ID, reference, phone number
- **Error Information**: Detailed error messages and retry attempts
- **Audit Trail**: Complete history of transaction modifications
- **Related Data**: Associated promo code, batch, and user information

**Retry and Resolution**:
- **Manual Retry**: One-click retry for failed disbursements
- **Bulk Retry**: Retry multiple failed transactions simultaneously
- **Retry Scheduling**: Schedule retry attempts for optimal timing
- **Resolution Tracking**: Track resolution status and notes
- **Escalation**: Escalate unresolved transactions to supervisors

**Reconciliation Features**:
- **MTN MoMo Sync**: Automatic synchronization with MoMo records
- **Discrepancy Detection**: Identify mismatches between systems
- **Reconciliation Reports**: Detailed reconciliation status reports
- **Manual Override**: Manual reconciliation for complex cases
- **Audit Logging**: Complete reconciliation activity logging

**System Permissions Required**:
- `redemptions.read` - View redemption transactions
- `redemptions.monitor` - Monitor real-time redemption activity
- `disbursements.read` - View disbursement records
- `disbursements.monitor` - Monitor payment processing status
- `disbursements.retry` - Retry failed disbursements
- `disbursements.reconcile` - Reconcile with MTN MoMo records
- `disbursements.export` - Export financial reports
- `reports.read` - Access transaction reports
- `audit.logs.read` - View transaction audit logs

#### 2.7. System Alerts

Comprehensive alert and notification system that monitors system health, financial thresholds, fraud detection, and critical business events with real-time notifications and automated responses.

**User Story**: As a system administrator, I want to receive real-time alerts for critical system events, financial thresholds, and fraud detection, so that I can respond quickly to issues and maintain system integrity and financial security.

**Scope**:
- Real-time system health monitoring and alerting
- Financial threshold monitoring (balance alerts, transaction limits)
- Fraud detection alerts and suspicious activity notifications
- System performance monitoring (API failures, database issues)
- User activity monitoring (suspicious login attempts, unusual patterns)
- Automated alert escalation and notification routing
- Alert acknowledgment and resolution tracking
- Custom alert rules and threshold configuration
- Multi-channel notification delivery (email, SMS, dashboard)
- Alert history and audit trail

**Out of Scope**:
- Advanced machine learning-based fraud detection
- Integration with external SIEM systems
- Automated incident response and remediation
- Advanced correlation and pattern analysis
- Integration with external monitoring tools (Datadog, New Relic)

**Acceptance Criteria**:
- [ ] System monitors financial thresholds and sends alerts when limits are reached
- [ ] Fraud detection alerts are triggered for suspicious redemption patterns
- [ ] System health alerts notify administrators of API failures or database issues
- [ ] User activity monitoring detects and alerts on suspicious login attempts
- [ ] Alerts are delivered through multiple channels (email, SMS, dashboard)
- [ ] Alert acknowledgment and resolution tracking is implemented
- [ ] Custom alert rules can be configured by administrators
- [ ] Alert history is maintained with search and filtering capabilities
- [ ] Alert escalation rules ensure critical alerts reach appropriate personnel
- [ ] All alert activities are logged for audit purposes

**User Flow**:
1. System continuously monitors various metrics and events
2. When threshold is exceeded or suspicious activity detected, alert is triggered
3. Alert is processed and routed to appropriate recipients based on severity
4. Recipients receive notification through configured channels
5. Alert is displayed in admin dashboard with acknowledgment options
6. Administrator acknowledges and resolves the alert
7. Alert status is updated and resolution is logged
8. Follow-up notifications are sent if alert remains unresolved

**System Permissions Required**:
- `alerts.read` - View system alerts and notifications
- `alerts.create` - Create custom alert rules
- `alerts.update` - Modify alert configurations and thresholds
- `alerts.delete` - Remove alert rules
- `alerts.acknowledge` - Acknowledge and resolve alerts
- `alerts.escalate` - Escalate critical alerts
- `alerts.configure` - Configure alert delivery channels
- `alerts.export` - Export alert history and reports
- `fraud.alerts.view` - View fraud detection alerts
- `fraud.alerts.manage` - Manage fraud detection rules
- `system.alerts.view` - View system health alerts
- `financial.alerts.view` - View financial threshold alerts

#### 2.6. Reporting & Analytics

Comprehensive reporting and analytics system with real-time monitoring, custom reports, and data export capabilities.

**User Story**: As an administrator, I want to generate comprehensive reports on batch performance and system usage, so that I can make data-driven decisions and track business metrics.

**Scope**:
- Real-time system metrics and KPIs dashboard
- Batch performance analytics and conversion tracking
- User engagement metrics and redemption patterns
- Financial reconciliation reports and payment tracking
- Custom date range filtering and report generation
- Export capabilities in PDF and CSV formats
- Automated report scheduling and delivery

**Out of Scope**:
- Real-time business intelligence dashboards with custom charts
- Predictive analytics and forecasting
- Integration with external BI tools
- Advanced data visualization with interactive charts

**Acceptance Criteria**:
- [ ] Dashboard loads within 2 seconds with real-time data
- [ ] Can generate reports for specific date ranges
- [ ] Shows batch performance metrics (redemption rates, conversion)
- [ ] Displays user engagement statistics and patterns
- [ ] Provides financial reconciliation data
- [ ] Downloads reports in PDF and CSV formats
- [ ] Report generation shows progress indicator
- [ ] Reports include proper branding and formatting
- [ ] Real-time data updates every 30 seconds

**User Flow**:
1. Authorized user navigates to Reports section
2. Selects report type and configures date range
3. Configures report parameters and filters
4. Initiates report generation
5. System processes data and shows progress
6. User downloads generated report
7. Receives notification when report is ready

**System Permissions Required**:
- `reports.read` - Access standard reports
- `reports.create` - Create custom reports
- `reports.export` - Export reports in various formats
- `analytics.dashboard` - Access analytics dashboard
- `analytics.real-time` - View real-time analytics
- `analytics.historical` - Access historical data analysis

#### 2.8. System Configuration

A comprehensive administrative interface that allows system administrators to configure, manage, and customize all aspects of the MBELYCO Promo system including USSD settings, Mobile Money integration, security configurations, business logic parameters, and system branding.

**User Story**: As a system administrator, I want to configure all system settings through a comprehensive interface, so that I can fully customize the system behavior, appearance, and integrations to match our business requirements.

**Scope**:
- **System Branding & Appearance**: Complete UI customization
- **USSD Configuration**: Service codes, languages, and flow customization
- **Payment Integration**: MTN MoMo and other payment provider settings
- **Business Logic**: Code generation, validation, and expiration policies
- **Security & Access Control**: Rate limiting, authentication, and permissions
- **Notification System**: Email, SMS, and webhook configurations
- **Analytics & Reporting**: Dashboard customization and report settings
- **Integration Management**: API credentials and third-party services
- **Backup & Maintenance**: Automated backup and system maintenance
- **Advanced Features**: Custom fields, workflows, and automation rules

**Out of Scope**:
- Real-time configuration changes without restart (some settings require restart)
- Advanced configuration templates and presets
- Integration with external configuration management systems
- Automated configuration optimization based on usage patterns

**Acceptance Criteria**:
- [ ] Can customize complete system branding (logo, colors, fonts, favicon)
- [ ] Can configure USSD service codes, languages, and menu flows
- [ ] Can manage multiple payment provider integrations
- [ ] Can set custom business logic rules and validation policies
- [ ] Can configure comprehensive security and rate limiting settings
- [ ] Can setup multi-channel notification systems
- [ ] Can customize dashboard layouts and analytics views
- [ ] Can manage API credentials and integration settings securely
- [ ] Can configure automated backup and maintenance schedules
- [ ] All configuration changes are logged with before/after values
- [ ] Configuration validation prevents invalid or conflicting settings
- [ ] Can export/import configuration settings for backup/migration
- [ ] Can preview configuration changes before applying
- [ ] Can rollback configuration changes to previous versions

**User Flow**:
1. System administrator navigates to System Configuration
2. Selects configuration category from organized tabs
3. Views current settings with clear descriptions and help text
4. Modifies settings through intuitive form interfaces
5. System validates configuration changes in real-time
6. Administrator can preview changes before saving
7. System applies new configuration with confirmation
8. Changes are logged for audit purposes
9. Administrator receives notification of successful configuration update

**System Permissions:**
- **Super Admin**: Full access to all system configuration settings
- **System Admin**: Access to most configuration settings except sensitive credentials
- **Configuration Manager**: Limited access to non-security related settings
- **Audit Viewer**: Read-only access to view configuration history and logs

**Required Permissions for Configuration Access:**:
- `system.settings.read` - View system configuration
- `system.settings.update` - Modify system settings
- `system.settings.export` - Export configuration settings
- `system.settings.import` - Import configuration settings
- `system.settings.backup` - Backup configuration settings
- `system.settings.restore` - Restore configuration settings
- `system.integrations.manage` - Manage API integrations
- `system.rate-limits.configure` - Configure rate limiting rules
- `system.notifications.setup` - Setup alert notifications
- `system.backup.manage` - Manage system backups
- `system.branding.customize` - Customize system appearance
- `system.workflows.manage` - Manage custom workflows

### Detailed System Configuration Categories

#### 1. System Branding & Appearance
```typescript
interface BrandingSettings {
  // Company Information
  companyName: string;
  companyLogo: File | string;
  companyFavicon: File | string;
  companyTagline: string;
  companyWebsite: string;
  companyEmail: string;
  companyPhone: string;
  
  // Color Scheme
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  
  // Typography
  primaryFont: string;
  secondaryFont: string;
  headingFont: string;
  bodyFontSize: number;
  headingFontSize: number;
  
  // Layout
  sidebarWidth: number;
  headerHeight: number;
  borderRadius: number;
  boxShadow: string;
  
  // Custom CSS
  customCSS: string;
  customJavaScript: string;
}
```

#### 2. USSD Configuration
```typescript
interface USSDSettings {
  // Service Configuration
  serviceCode: string; // *XYZ#
  serviceName: string;
  serviceDescription: string;
  
  // Language Settings
  defaultLanguage: 'en' | 'rw';
  supportedLanguages: string[];
  languageSwitchingEnabled: boolean;
  
  // Menu Configuration
  welcomeMessage: {
    en: string;
    rw: string;
  };
  helpMessage: {
    en: string;
    rw: string;
  };
  errorMessage: {
    en: string;
    rw: string;
  };
  successMessage: {
    en: string;
    rw: string;
  };
  
  // Flow Configuration
  maxMenuDepth: number;
  sessionTimeout: number; // seconds
  inputTimeout: number; // seconds
  
  // Rate Limiting
  maxAttemptsPerMinute: number;
  maxAttemptsPerHour: number;
  maxAttemptsPerDay: number;
  blockDuration: number; // minutes
  
  // Integration Settings
  africasTalkingApiKey: string;
  africasTalkingUsername: string;
  africasTalkingEnvironment: 'sandbox' | 'production';
}
```

#### 3. Payment Integration Settings
```typescript
interface PaymentSettings {
  // MTN MoMo Configuration
  momo: {
    baseUrl: string;
    apiUser: string;
    apiKey: string;
    subscriptionKey: string;
    targetEnvironment: 'sandbox' | 'production';
    currency: string;
    maxAmount: number;
    minAmount: number;
  };
  
  // Other Payment Providers
  otherProviders: {
    name: string;
    enabled: boolean;
    credentials: Record<string, string>;
    settings: Record<string, any>;
  }[];
  
  // Payment Processing
  autoRetryEnabled: boolean;
  maxRetryAttempts: number;
  retryDelayMinutes: number[];
  manualApprovalRequired: boolean;
  approvalThreshold: number;
  
  // Transaction Limits
  dailyTransactionLimit: number;
  monthlyTransactionLimit: number;
  perUserDailyLimit: number;
  perUserMonthlyLimit: number;
}
```

#### 4. Business Logic Configuration
```typescript
interface BusinessLogicSettings {
  // Promo Code Generation
  codeGeneration: {
    format: string; // XXXX-XXYY-XXMM-XXDD
    length: number;
    characterSet: string;
    prefix: string;
    suffix: string;
    separator: string;
    includeTimestamp: boolean;
    includeChecksum: boolean;
  };
  
  // Code Validation
  codeValidation: {
    formatValidation: boolean;
    uniquenessCheck: boolean;
    expirationCheck: boolean;
    statusCheck: boolean;
    batchValidation: boolean;
  };
  
  // Expiration Policies
  expiration: {
    defaultExpirationDays: number;
    maxExpirationDays: number;
    minExpirationDays: number;
    autoExpireEnabled: boolean;
    gracePeriodHours: number;
  };
  
  // Batch Management
  batchManagement: {
    maxCodesPerBatch: number;
    maxBatchesPerUser: number;
    autoAssignEnabled: boolean;
    defaultAssignmentRules: any;
  };
  
  // Redemption Rules
  redemption: {
    allowMultipleRedemptions: boolean;
    maxRedemptionsPerUser: number;
    maxRedemptionsPerCode: number;
    cooldownPeriodMinutes: number;
    fraudDetectionEnabled: boolean;
  };
}
```

#### 5. Security & Access Control
```typescript
interface SecuritySettings {
  // Authentication
  authentication: {
    sessionTimeout: number; // minutes
    maxLoginAttempts: number;
    lockoutDuration: number; // minutes
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      maxAge: number; // days
    };
    twoFactorEnabled: boolean;
    twoFactorRequired: boolean;
  };
  
  // Registration Control
  registration: {
    adminRegistrationEnabled: boolean;
    requireApproval: boolean;
    autoApproveRoles: string[];
    registrationFormFields: {
      firstName: boolean;
      lastName: boolean;
      email: boolean;
      phone: boolean;
      company: boolean;
      department: boolean;
    };
    defaultRole: string;
    registrationMessage: string;
    approvalNotificationEmail: string;
    registrationLimit: {
      enabled: boolean;
      maxRegistrationsPerDay: number;
      maxRegistrationsPerHour: number;
    };
  };
  
  // Rate Limiting
  rateLimiting: {
    apiRequestsPerMinute: number;
    apiRequestsPerHour: number;
    ussdRequestsPerMinute: number;
    ussdRequestsPerHour: number;
    loginAttemptsPerMinute: number;
    fileUploadsPerHour: number;
  };
  
  // Access Control
  accessControl: {
    ipWhitelist: string[];
    ipBlacklist: string[];
    countryRestrictions: string[];
    timeBasedAccess: {
      enabled: boolean;
      allowedHours: { start: number; end: number }[];
      timezone: string;
    };
  };
  
  // Audit & Monitoring
  audit: {
    logAllActions: boolean;
    logFailedAttempts: boolean;
    logDataChanges: boolean;
    retentionDays: number;
    realTimeAlerts: boolean;
  };
}
```

#### 6. Notification System
```typescript
interface NotificationSettings {
  // Email Configuration
  email: {
    enabled: boolean;
    provider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses';
    smtp: {
      host: string;
      port: number;
      username: string;
      password: string;
      secure: boolean;
    };
    fromEmail: string;
    fromName: string;
    replyTo: string;
  };
  
  // SMS Configuration
  sms: {
    enabled: boolean;
    provider: 'africas_talking' | 'twilio' | 'custom';
    credentials: Record<string, string>;
    fromNumber: string;
  };
  
  // Webhook Configuration
  webhooks: {
    enabled: boolean;
    endpoints: {
      url: string;
      events: string[];
      secret: string;
      retryAttempts: number;
    }[];
  };
  
  // Notification Templates
  templates: {
    redemptionSuccess: {
      email: string;
      sms: string;
      ussd: string;
    };
    redemptionFailed: {
      email: string;
      sms: string;
      ussd: string;
    };
    disbursementSuccess: {
      email: string;
      sms: string;
    };
    disbursementFailed: {
      email: string;
      sms: string;
    };
    systemAlert: {
      email: string;
      sms: string;
    };
  };
  
  // Alert Thresholds
  alerts: {
    lowBalance: {
      enabled: boolean;
      threshold: number;
      recipients: string[];
    };
    highFailureRate: {
      enabled: boolean;
      threshold: number; // percentage
      recipients: string[];
    };
    systemDown: {
      enabled: boolean;
      recipients: string[];
    };
  };
}
```

#### 7. Analytics & Reporting
```typescript
interface AnalyticsSettings {
  // Dashboard Configuration
  dashboard: {
    defaultView: 'overview' | 'detailed' | 'custom';
    refreshInterval: number; // seconds
    maxDataPoints: number;
    chartTypes: {
      redemptions: 'line' | 'bar' | 'pie';
      disbursements: 'line' | 'bar' | 'pie';
      batches: 'line' | 'bar' | 'pie';
    };
  };
  
  // Report Configuration
  reports: {
    defaultFormat: 'pdf' | 'csv' | 'excel';
    includeCharts: boolean;
    includeRawData: boolean;
    branding: boolean;
    autoGenerate: boolean;
    schedule: {
      daily: boolean;
      weekly: boolean;
      monthly: boolean;
      recipients: string[];
    };
  };
  
  // Data Retention
  dataRetention: {
    rawDataDays: number;
    aggregatedDataDays: number;
    reportDataDays: number;
    autoCleanup: boolean;
  };
  
  // Custom Metrics
  customMetrics: {
    name: string;
    description: string;
    calculation: string;
    displayType: 'number' | 'percentage' | 'chart';
    enabled: boolean;
  }[];
}
```

#### 8. Integration Management
```typescript
interface IntegrationSettings {
  // API Management
  apiManagement: {
    baseUrl: string;
    version: string;
    rateLimiting: {
      enabled: boolean;
      requestsPerMinute: number;
      requestsPerHour: number;
    };
    authentication: {
      type: 'jwt' | 'api_key' | 'oauth';
      settings: Record<string, any>;
    };
    cors: {
      enabled: boolean;
      allowedOrigins: string[];
      allowedMethods: string[];
      allowedHeaders: string[];
    };
  };
  
  // Third-party Integrations
  integrations: {
    name: string;
    type: 'payment' | 'sms' | 'email' | 'analytics' | 'crm';
    enabled: boolean;
    credentials: Record<string, string>;
    settings: Record<string, any>;
    webhooks: {
      enabled: boolean;
      url: string;
      events: string[];
    };
  }[];
  
  // Data Synchronization
  dataSync: {
    enabled: boolean;
    frequency: 'realtime' | 'hourly' | 'daily';
    direction: 'inbound' | 'outbound' | 'bidirectional';
    endpoints: {
      url: string;
      authentication: Record<string, any>;
      mapping: Record<string, string>;
    }[];
  };
}
```

#### 9. Backup & Maintenance
```typescript
interface BackupSettings {
  // Database Backup
  databaseBackup: {
    enabled: boolean;
    frequency: 'hourly' | 'daily' | 'weekly';
    retention: number; // days
    compression: boolean;
    encryption: boolean;
    storage: {
      type: 'local' | 's3' | 'gcs' | 'azure';
      settings: Record<string, any>;
    };
  };
  
  // File Backup
  fileBackup: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    retention: number; // days
    includeUploads: boolean;
    includeLogs: boolean;
    includeConfig: boolean;
  };
  
  // System Maintenance
  maintenance: {
    enabled: boolean;
    schedule: {
      day: string;
      time: string;
      timezone: string;
    };
    tasks: {
      cleanupLogs: boolean;
      optimizeDatabase: boolean;
      clearCache: boolean;
      updateStatistics: boolean;
    };
    notification: {
      beforeMaintenance: boolean;
      afterMaintenance: boolean;
      onFailure: boolean;
      recipients: string[];
    };
  };
  
  // Monitoring
  monitoring: {
    enabled: boolean;
    checks: {
      database: boolean;
      redis: boolean;
      externalAPIs: boolean;
      diskSpace: boolean;
      memoryUsage: boolean;
    };
    thresholds: {
      diskSpacePercent: number;
      memoryUsagePercent: number;
      responseTimeMs: number;
    };
    alerts: {
      email: boolean;
      sms: boolean;
      webhook: boolean;
      recipients: string[];
    };
  };
}
```

### 3. USSD Redemption & Integration

Complete USSD-based promo code redemption system with auto-registration, multi-language support, and real-time processing.

#### 3.1 Primary Customer Flow

**User Story**: As a customer, I want to redeem promotional codes via USSD without needing a smartphone or internet connection, so that I can easily access promo rewards using any mobile phone.

**Scope**:
- USSD-based promo code redemption interface
- Auto-registration for new users
- Multi-language menu support (English and Ikinyarwanda)
- Real-time code validation and processing
- Rate limiting and security controls
- User-friendly error messages and guidance
- Integration with Africa's Talking USSD API

**Out of Scope**:
- Voice-based redemption system
- SMS-based redemption as primary method
- Integration with mobile apps
- Advanced user profile management via USSD

**Acceptance Criteria**:
- [ ] Users can dial *XYZ# to access the system
- [ ] System prompts user to enter promo code
- [ ] Code validation happens in real-time
- [ ] New users are automatically registered with phone number
- [ ] System provides clear success/error messages
- [ ] Configurable rate limiting (default: 5 attempts per minute)
- [ ] Multi-language menu support for English and Ikinyarwanda
- [ ] All interactions are logged for audit purposes
- [ ] System handles network timeouts gracefully

**User Flow**:
1. Customer dials *XYZ# on their mobile phone
2. System auto-registers user if not exists
3. System displays welcome message and prompts for promo code
4. Customer enters promo code
5. System validates code format and existence
6. If valid, system checks code status and availability
7. System creates redemption record and marks code as used
8. System queues disbursement job for payment processing
9. Customer receives confirmation message with payment details
10. System logs all transaction details

**System Permissions Required**:
- `redemptions.read` - View redemption transactions
- `redemptions.monitor` - Monitor real-time redemption activity
- `promo-codes.validate` - Validate code format and uniqueness
- `users.create` - Auto-register new users
- `audit.logs.read` - View redemption audit logs

**Dependencies**:
- Africa's Talking USSD API integration
- Promo code validation service
- User auto-registration system
- Background job queue (BullMQ)
- Rate limiting service
- Multi-language translation system
- Audit logging infrastructure

**USSD Flow Steps**:
1. **User Management**: Auto-register new users or update existing profiles.
2. **Request Validation**: Rate limiting
3. **Input Processing**: Parse and validate promo code format
4. **Idempotency Control**: Acquire redemption lock (as `used`) to prevent duplicate processing.
5. **Code Validation**: Verify code exists, is `active`, not `expired`, not `used`, not `redeemed` or not `blocked`.
6. **Transaction Processing**: Create redemption record and update code status.
7. **Queue Management**: Add disbursement job to background processing queue.
8. **Audit Logging**: Record all transaction details for compliance.

**Key Features**:
- **Auto-Registration**: Seamless user onboarding without pre-registration.
- **Multi-language Support**: Localized USSD responses in Ikinyarwanda.
- **Rate Limiting**: Configurable limits to prevent abuse and ensure fair usage.
- **Error Handling**: User-friendly error messages and recovery mechanisms.

### 4. MTN MoMo Disbursement Integration

Comprehensive automated background processing system for mobile money disbursements with advanced retry mechanisms, real-time monitoring, and financial reconciliation capabilities.

**User Story**: As a system administrator, I want automated background processing of mobile money disbursements with retry mechanisms, so that customers receive their payments reliably even during system issues or network problems.

**Scope**:
- Asynchronous disbursement job processing with BullMQ queue system
- Complete MTN MoMo API integration for mobile money transfers
- Advanced retry mechanisms with configurable exponential backoff
- Real-time transaction status tracking and live updates
- Comprehensive error handling and alert notification system
- Manual intervention capabilities for failed transactions
- Financial reconciliation and reporting with MTN MoMo records
- Queue monitoring and performance optimization
- Webhook integration for payment status updates
- Disbursement analytics and performance metrics

**Out of Scope**:
- Real-time synchronous payment processing
- Integration with multiple payment providers beyond MTN MoMo
- Advanced fraud detection during disbursement processing
- Automated dispute resolution for failed payments
- Integration with external accounting systems
- Advanced machine learning for payment optimization

**Acceptance Criteria**:
- [ ] Disbursement jobs are processed asynchronously in background with BullMQ
- [ ] System integrates seamlessly with MTN MoMo API for all payment operations
- [ ] Configurable failed transaction retries (default: 3 times, max: 5 times)
- [ ] Retry intervals follow exponential backoff (1min, 5min, 15min, 30min, 60min)
- [ ] Transaction status is updated in real-time with WebSocket notifications
- [ ] Failed transactions trigger immediate alert notifications to administrators
- [ ] Manual retry option available for persistent failures with detailed error logs
- [ ] All disbursement activities are comprehensively logged for audit and compliance
- [ ] System handles MTN MoMo API rate limits and timeouts gracefully
- [ ] Queue performance is monitored with metrics and alerting
- [ ] Financial reconciliation matches 100% with MTN MoMo transaction records
- [ ] Disbursement success rate meets minimum threshold of 95%

**User Flow**:
1. Redemption is successfully processed via USSD system
2. System creates disbursement job with all required metadata and adds to BullMQ queue
3. Background worker picks up job from queue with proper concurrency control
4. Worker calls MTN MoMo API to process mobile money transfer
5. If successful, worker updates transaction status to 'disbursed' and notifies user
6. If failed, worker schedules retry with exponential backoff and logs error details
7. After maximum retries, system marks transaction as 'failed' and alerts administrators
8. Administrator can manually retry failed transactions with detailed error analysis
9. All activities are logged for audit, reconciliation, and compliance purposes
10. System generates performance reports and reconciliation summaries

**Queue System Architecture**:
- **BullMQ Integration**: Reliable job processing with Redis persistence
- **Worker Configuration**: Configurable concurrency levels and processing limits
- **Job Prioritization**: Priority-based job processing for urgent transactions
- **Dead Letter Queue**: Failed job handling and manual intervention
- **Monitoring**: Real-time queue metrics and performance dashboards
- **Scaling**: Horizontal scaling capabilities for high-volume processing

**Disbursement Processing Flow**:
1. **Job Creation**: Redemption triggers disbursement job creation with metadata
2. **Queue Management**: Job added to BullMQ with appropriate priority and retry settings
3. **Worker Processing**: Background worker retrieves and processes jobs asynchronously
4. **MTN MoMo Integration**: Secure API calls to MTN MoMo disbursement endpoints
5. **Status Updates**: Real-time status updates to database and user notifications
6. **Error Handling**: Comprehensive error handling with retry logic and alerting
7. **Audit Trail**: Complete logging of all disbursement activities and decisions

**Retry Logic & Error Handling**:
- **Exponential Backoff**: 1min, 5min, 15min, 30min, 60min retry intervals
- **Maximum Retries**: Configurable retry attempts (default: 3, max: 5)
- **Error Classification**: Different retry strategies for different error types
- **Alert Escalation**: Progressive alerting for persistent failures
- **Manual Intervention**: Admin tools for complex failure resolution
- **Circuit Breaker**: Automatic circuit breaking for API failures

**MTN MoMo API Integration**:
- **Authentication**: Secure API key and subscription key management
- **Rate Limiting**: Respectful API usage with built-in rate limiting
- **Error Handling**: Comprehensive error response handling and classification
- **Webhook Support**: Real-time payment status updates via webhooks
- **Reconciliation**: Automated transaction matching and reconciliation
- **Security**: Encrypted communication and secure credential management

**Financial Reconciliation**:
- **Transaction Matching**: Automatic matching of disbursements with MTN MoMo records
- **Discrepancy Detection**: Identification and alerting of payment discrepancies
- **Reconciliation Reports**: Detailed financial reconciliation reports
- **Audit Trail**: Complete audit trail for financial compliance
- **Exception Handling**: Manual resolution of reconciliation exceptions

**System Permissions Required**:
- `disbursements.read` - View disbursement records and status
- `disbursements.monitor` - Monitor payment processing status and queues
- `disbursements.retry` - Retry failed disbursements manually
- `disbursements.approve` - Approve manual disbursements and overrides
- `disbursements.reconcile` - Reconcile with MTN MoMo records
- `disbursements.export` - Export financial reports and reconciliation data
- `disbursements.configure` - Configure disbursement settings and retry policies
- `audit.logs.read` - View disbursement audit logs

### 5. Idempotency & Concurrency Control

Comprehensive system for ensuring data consistency, preventing duplicate operations, and maintaining system integrity through advanced locking mechanisms, idempotency controls, and comprehensive audit logging.

**User Story**: As a system administrator, I want robust concurrency control and comprehensive audit logging to prevent duplicate redemptions, ensure data consistency, and maintain complete system integrity for regulatory compliance and security monitoring.

**Scope**:
- Advanced database-level locking mechanisms for concurrent access control
- Comprehensive idempotency key management for API request deduplication
- Race condition prevention through atomic transactions and optimistic locking
- Complete audit logging system with immutable records and compliance features
- Real-time concurrency monitoring and performance optimization
- Unique constraint enforcement across all critical data entities
- Session-based activity tracking and user behavior monitoring
- Automated security event detection and alerting
- Configurable retention policies and data lifecycle management
- Advanced search and filtering capabilities for audit logs

**Out of Scope**:
- Distributed locking across multiple server instances
- Advanced conflict resolution algorithms with machine learning
- Real-time synchronization with external systems
- Integration with external SIEM (Security Information and Event Management) systems
- Advanced log correlation and pattern detection with AI
- Automated compliance reporting generation
- Real-time log analysis and alerting dashboards

**Acceptance Criteria**:
- [ ] Database locks prevent concurrent redemption of the same promo code
- [ ] Unique constraints prevent duplicate promo codes and user redemptions
- [ ] Atomic transactions ensure complete data consistency across all operations
- [ ] Idempotency keys prevent duplicate API requests and ensure operation safety
- [ ] System handles race conditions gracefully with proper error handling
- [ ] Lock timeout mechanisms prevent indefinite blocking and deadlocks
- [ ] All locking activities are comprehensively logged for monitoring and audit
- [ ] Complete activity tracking for all system operations with timestamps
- [ ] Entity changes include detailed before/after values for audit trails
- [ ] User activities are tracked with complete session information
- [ ] System events are logged for infrastructure monitoring and troubleshooting
- [ ] Security events are captured and classified for audit purposes
- [ ] Log entries are immutable and tamper-proof with cryptographic integrity
- [ ] Logs are searchable and filterable with advanced query capabilities
- [ ] Retention policies are configurable for compliance requirements
- [ ] Suspicious activities trigger automated alerts and notifications

**User Flow**:
1. User attempts to perform any system operation (login, create batch, redeem code)
2. System generates unique idempotency key for the operation
3. System acquires appropriate database locks for data consistency
4. Operation is processed with atomic transaction guarantees
5. System captures all activity details (user, timestamp, entity, changes)
6. Immutable audit log entry is created with cryptographic integrity
7. Log is stored in audit_logs table with proper indexing
8. System releases locks and completes transaction
9. Administrator can search and filter logs for analysis
10. Logs are retained according to configured policies
11. Suspicious activities trigger automated security alerts
12. System maintains performance metrics for concurrency control

#### 5.1 Duplicate Prevention & Concurrency Control

Advanced database-level locking and idempotency mechanisms to prevent duplicate operations and ensure data consistency in high-concurrency scenarios.

**User Story**: As a system administrator, I want to prevent duplicate redemptions and ensure data consistency, so that customers cannot redeem the same code multiple times and system integrity is maintained.

**Scope**:
- Database-level locking mechanisms with configurable timeout settings
- Unique constraint enforcement across all critical entities
- Race condition prevention through atomic transactions
- Comprehensive idempotency key management and validation
- Concurrent access control with performance optimization
- Lock monitoring and deadlock detection
- Transaction rollback and recovery mechanisms

**Out of Scope**:
- Distributed locking across multiple server instances
- Advanced conflict resolution algorithms with machine learning
- Real-time synchronization with external systems

**Acceptance Criteria**:
- [ ] Database locks prevent concurrent redemption of the same promo code
- [ ] Unique constraints prevent duplicate promo codes and user redemptions
- [ ] Atomic transactions ensure complete data consistency
- [ ] Idempotency keys prevent duplicate API requests with proper validation
- [ ] System handles race conditions gracefully with clear error messages
- [ ] Lock timeout prevents indefinite blocking (configurable, default: 30 seconds)
- [ ] All locking activities are logged for monitoring and performance analysis
- [ ] Deadlock detection and automatic resolution mechanisms
- [ ] Transaction rollback capabilities for failed operations
- [ ] Performance metrics for lock contention and resolution times

**User Flow**:
1. Multiple users attempt to redeem the same promo code simultaneously
2. System generates unique idempotency key for each request
3. System acquires database lock for the specific promo code
4. First request processes successfully and marks code as redeemed
5. Subsequent requests are blocked or receive "already redeemed" message
6. Lock is released after transaction completion with proper cleanup
7. System logs all locking activities for audit and performance monitoring
8. Failed requests are properly handled with appropriate error messages

**Locking Mechanisms**:
- **Row-Level Locking**: Database-level locking to prevent concurrent redemption attempts
- **Unique Constraints**: Enforcement on promo codes and user redemptions
- **Optimistic Locking**: Version-based concurrency control for high-performance scenarios
- **Pessimistic Locking**: Exclusive locks for critical operations
- **Idempotency Keys**: API request deduplication and operation safety
- **Transaction Isolation**: Proper isolation levels for data consistency

**System Permissions Required**:
- `audit.logs.read` - View concurrency control audit logs
- `system.monitoring` - Monitor lock performance and contention
- `disbursements.retry` - Retry operations affected by concurrency issues

#### 5.2 Comprehensive Audit Logging System

Complete activity tracking and audit trail system with immutable records, compliance features, and advanced search capabilities for regulatory compliance and security monitoring.

**User Story**: As a system administrator, I want comprehensive audit logging of all system activities, so that I can track user actions, maintain regulatory compliance, and investigate security incidents.

**Scope**:
- Complete activity tracking for all system operations and user interactions
- Entity change tracking with detailed before/after values
- User activity monitoring with session tracking and behavior analysis
- System event logging for infrastructure monitoring and troubleshooting
- Security event tracking for authentication, authorization, and security incidents
- Immutable log entries with cryptographic integrity and tamper-proofing
- Advanced search and filtering capabilities with query optimization
- Configurable retention policies for compliance and data lifecycle management
- Automated alerting for suspicious activities and security events
- Performance monitoring and log analysis capabilities

**Out of Scope**:
- Real-time log analysis and alerting dashboards
- Integration with external SIEM systems
- Advanced log correlation and pattern detection with AI
- Automated compliance reporting generation
- Real-time streaming analytics

**Acceptance Criteria**:
- [ ] All critical operations are logged with precise timestamps and user context
- [ ] Entity changes include comprehensive before/after values with field-level tracking
- [ ] User activities are tracked with complete session information and IP addresses
- [ ] System events are logged for infrastructure monitoring and performance analysis
- [ ] Security events are captured and classified for audit and compliance purposes
- [ ] Log entries are immutable and tamper-proof with cryptographic integrity
- [ ] Logs are searchable and filterable with advanced query capabilities
- [ ] Retention policies are configurable for compliance requirements (default: 7 years)
- [ ] Suspicious activities trigger automated alerts with severity classification
- [ ] Log performance meets sub-second query response times
- [ ] Complete audit trail for all financial transactions and user actions
- [ ] Data export capabilities for compliance reporting and external analysis

**User Flow**:
1. User performs any system action (login, create batch, redeem code, view reports)
2. System captures comprehensive action details (user, timestamp, entity, changes, IP)
3. Immutable log entry is created with cryptographic hash for integrity
4. Log is stored in audit_logs table with proper indexing and partitioning
5. System administrator can search and filter logs with advanced queries
6. Logs are retained according to configured policies and compliance requirements
7. Suspicious activities trigger automated alerts with severity classification
8. Performance metrics are collected for log query optimization
9. Data export capabilities enable compliance reporting and external analysis

**Comprehensive Activity Tracking**:
- **Action Logging**: All critical operations recorded with timestamps, user context, and metadata
- **Entity Change Tracking**: Detailed before/after values for all data modifications with field-level granularity
- **User Activity Monitoring**: Complete audit trail of user interactions with session tracking
- **System Event Logging**: Infrastructure and integration events for monitoring and troubleshooting
- **Security Event Tracking**: Authentication, authorization, and security-related activities with threat classification

**Audit Trail Features**:
- **Immutable Records**: Cryptographic integrity with tamper-proof log entries
- **Compliance Ready**: Configurable retention policies for regulatory requirements
- **Advanced Search**: Full-text search with filtering and query optimization
- **Security Alerts**: Automated alerting for suspicious activities and security events
- **Performance Optimized**: Sub-second query response times with proper indexing
- **Data Export**: Comprehensive export capabilities for compliance and analysis

**System Permissions Required**:
- `audit.logs.read` - View audit logs and search capabilities
- `audit.logs.export` - Export audit trail data for compliance
- `security.alerts.view` - View security alerts and incidents
- `security.incidents.manage` - Manage security incidents and responses
- `audit.logs.configure` - Configure audit logging settings and retention policies

## ⚙️ Tech Stack<

The MBELYCO Promo v2.0 system is built using a modern, modular monolith architecture.

### Frontend Architecture

**Core Framework**:
- **[Next.js with App Router](https://nextjs.org/docs)** is a powerful React framework for building full-stack web applications. It simplifies development with features like server-side rendering, static site generation, and API routes, enabling developers to focus on building products and shipping quickly.

- **[TypeScript](https://www.typescriptlang.org/)** is a superset of JavaScript that adds static typing, providing better tooling, code quality, and error detection for developers. It is ideal for building large-scale applications and enhances the development experience.

- **[TailwindCSS](https://tailwindcss.com/)** is a utility-first CSS framework that allows developers to build custom, responsive designs quickly without leaving their HTML. It provides pre-defined classes for layout, typography, colors, and more.

**State Management & Forms**:
- **[Zustand](https://zustand-demo.pmnd.rs)** is a minimal, hook-based state management library for React. It lets you manage global state with zero boilerplate, no context providers, and excellent performance through selective state subscriptions.

- **[React Hook Form](https://react.dev/reference/react/hooks/)** is a popular library for handling forms in React. It focuses on simplicity, performance, and minimal re-renders, using React hooks. Instead of manually managing state for each input, RHF provides a more declarative and efficient way to work with forms.

- **[Zod](https://zod.dev/)** is a TypeScript-first validation library. Using Zod, you can define schemas you can use to validate data, from a simple `string` to a complex nested object.

### Backend Architecture

**Next.js API Routes**: Serverless API endpoints

**Database & ORM**:
- **[Neon](https://neon.com/)** is a fully managed, serverless PostgreSQL database platform. It offers features like instant provisioning, autoscaling, and database branching, enabling developers to build scalable applications without managing infrastructure.

- **[Drizzle ORM](https://orm.drizzle.team/)** is a lightweight and performant TypeScript ORM designed with developer experience in mind. It provides a seamless interface between application code and database operations while maintaining high performance and reliability.

**Authentication**:
- **[Better Auth](https://www.better-auth.com/)** is a framework-agnostic authentication and authorization library for TypeScript. It provides built-in support for email and password authentication, social sign-on (Google, GitHub, Apple, and more), and multi-factor authentication, simplifying user authentication and account management.

- **[OAuth 2.0](https://oauth.net/2/)** is an open standard protocol that allows applications to access a user’s resources on another service without exposing the user’s credentials. Standard protocol for MTN MoMo API authentication and authorization.

**Queue Processing**:
- **[BullMQ](https://docs.bullmq.io/)** is a Node.js library that implements a fast and robust queue system built on top of Redis that helps in resolving many modern age micro-services architectures. Robust queue system built on Redis for background job processing and disbursement handling.

### Integration Layer

**Disbursements**:
- **[MTN MoMo Disbursements](https://momodeveloper.mtn.com/product#product=disbursements)** is a service offered by MTN MoMo that enables businesses to automatically send funds to multiple mobile money users in a single transaction. By subscribing, partners can integrate features like QR code payments, refunds, and fund transfers with status updates into their platforms. Additionally, they can access detailed Know Your Customer (KYC) information.

**USSD Gateway**:
- **[Africa’s Talking USSD API](https://developers.africastalking.com/docs/ussd/handle_sessions)** enables developers and businesses to create interactive, menu-based services that users can access via USSD codes, without requiring mobile data.

**Caching and sessions**: 
- **[Upstash Redis](https://upstash.com/docs/redis/overall/getstarted)** is a serverless, cloud-hosted Redis solution designed for modern applications. Think of it as Redis, but without the hassle of managing servers, scaling, or infrastructure.

- **[Jest](https://jestjs.io/docs/getting-started)** is JavaScript Testing Framework.

### Core Business Logic Implementation

#### Promo Code Generation Service
```typescript
export class PromoCodeGenerator {
  private static readonly CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  static generateCode(createdAt: Date): string {
    const random = (length: number): string => {
      return Array.from({ length }, () => 
        this.CHARS[Math.floor(Math.random() * this.CHARS.length)]
      ).join('');
    };
    
    const YY = createdAt.getFullYear().toString().slice(-2);
    const MM = String(createdAt.getMonth() + 1).padStart(2, '0');
    const DD = String(createdAt.getDate()).padStart(2, '0');
    
    return `${random(4)}-${random(2)}${YY}-${random(2)}${MM}-${random(2)}${DD}`;
  }
  
  static validateCode(code: string): boolean {
    const pattern = /^[A-Z0-9]{4}-[A-Z0-9]{2}[0-9]{2}-[A-Z0-9]{2}[0-9]{2}-[A-Z0-9]{2}[0-9]{2}$/;
    return pattern.test(code);
  }
}
```

#### USSD Service Implementation
```typescript
export class USSDService {
  async handleUSSDRequest(request: USSDRequest): Promise<USSDResponse> {
    try {
      // Auto-register user if not exists
      const user = await this.ensureUserExists(request.phoneNumber);
      
      // Parse USSD input
      const input = request.text?.trim();
      
      if (!input) {
        return this.showWelcomeMessage();
      }
      
      // Validate promo code format
      if (!PromoCodeGenerator.validateCode(input)) {
        return this.showInvalidCodeMessage();
      }
      
      // Check idempotency
      const existingRedemption = await this.checkExistingRedemption(
        user.id, 
        input
      );
      
      if (existingRedemption) {
        return this.showAlreadyRedeemedMessage();
      }
      
      // Process redemption
      const redemption = await this.processRedemption(user.id, input);
      
      if (redemption.success) {
        return this.showSuccessMessage(redemption.amount);
      } else {
        return this.showErrorMessage(redemption.error);
      }
      
    } catch (error) {
      console.error('USSD processing error:', error);
      return this.showErrorMessage('System temporarily unavailable');
    }
  }
  
  private async ensureUserExists(phoneNumber: string): Promise<User> {
    let user = await this.userRepository.findByPhoneNumber(phoneNumber);
    
    if (!user) {
      user = await this.userRepository.create({
        phone_number: phoneNumber,
        is_active: true,
        is_verified: true
      });
    }
    
    return user;
  }
}
```

#### Disbursement Queue Processing
```typescript
export class DisbursementProcessor {
  async processDisbursement(job: DisbursementJob): Promise<void> {
    const { redemptionId, amount, phoneNumber } = job.data;
    
    try {
      // Process MoMo disbursement
      const momoResponse = await this.momoService.transfer({
        amount,
        phoneNumber,
        reference: `REDEEM-${redemptionId}`
      });
      
      // Update redemption status
      await this.redemptionRepository.update(redemptionId, {
        status: 'completed',
        momo_transaction_id: momoResponse.transactionId,
        momo_reference: momoResponse.reference,
        disbursed_at: new Date()
      });
      
      // Log audit trail
      await this.auditLogger.log({
        action: 'disbursement_completed',
        entity_type: 'redemption',
        entity_id: redemptionId,
        new_values: { status: 'completed' }
      });
      
    } catch (error) {
      // Mark as failed after max retries
      if (job.attemptsMade >= job.opts.attempts) {
        await this.redemptionRepository.update(redemptionId, {
          status: 'failed',
          error_message: error.message
        });
        
        // Send alert to admin
        await this.notificationService.sendAlert({
          type: 'disbursement_failed',
          redemptionId,
          error: error.message
        });
      } else {
        throw error; // Retry
      }
    }
  }
}
```

## 🔌 API Documentation

### Enhanced REST API Structure
```
/api/v1/
├── auth/                             # Authentication endpoints
│   ├── login/                        # POST - User authentication
│   ├── logout/                       # POST - Session termination
│   ├── refresh/                      # POST - Token refresh
│   ├── me/                           # GET - Current user info
│   └── register/                     # POST - User registration
├── admin/                            # Admin panel endpoints
│   ├── batches/                      # Batch management
│   │   ├── GET /                     # List batches with pagination
│   │   ├── POST /                    # Create new batch
│   │   ├── GET /{id}                 # Get batch details
│   │   ├── PUT /{id}                 # Update batch
│   │   ├── DELETE /{id}              # Delete batch
│   │   ├── POST /generate/           # Generate codes for batch
│   │   ├── POST /import/             # Import codes to batch
│   │   ├── GET /download/            # Download batch data (PDF/CSV)
│   │   ├── POST /{id}/assign         # Assign batch to user
│   │   ├── PUT /{id}/status          # Change batch status
│   │   └── GET /{id}/stats           # Get batch statistics
│   ├── promo-codes/                  # Promo code operations
│   │   ├── GET /                     # List promo codes with filters
│   │   ├── GET /{id}                 # Get promo code details
│   │   ├── PUT /{id}                 # Update promo code
│   │   ├── DELETE /{id}              # Delete promo code
│   │   ├── POST /generate/           # Generate new codes
│   │   ├── POST /import/             # Import codes from CSV
│   │   ├── GET /download/            # Download codes (PDF/CSV)
│   │   ├── PUT /{id}/status          # Change code status
│   │   ├── POST /bulk/               # Bulk operations
│   │   ├── POST /validate/           # Validate code format
│   │   ├── GET /search/              # Search codes
│   │   └── GET /stats/               # Get code statistics
│   ├── redemptions/                  # Redemption tracking
│   │   ├── GET /                     # List redemptions
│   │   ├── GET /{id}                 # Get redemption details
│   │   ├── GET /download/            # Download redemption data
│   │   ├── POST /{id}/retry          # Retry failed redemption
│   │   ├── GET /stats/               # Get redemption statistics
│   │   └── GET /search/              # Search redemptions
│   ├── disbursements/                # Payment monitoring
│   │   ├── GET /                     # List disbursements
│   │   ├── GET /{id}                 # Get disbursement details
│   │   ├── POST /{id}/retry          # Retry failed disbursement
│   │   ├── GET /reconcile/           # Reconcile with MTN MoMo
│   │   ├── GET /stats/               # Get disbursement statistics
│   │   └── GET /export/              # Export disbursement data
│   ├── users/                        # User management
│   │   ├── GET /                     # List users
│   │   ├── POST /                    # Create user
│   │   ├── GET /{id}                 # Get user details
│   │   ├── PUT /{id}                 # Update user
│   │   ├── DELETE /{id}              # Delete user
│   │   ├── POST /{id}/roles          # Assign roles
│   │   ├── DELETE /{id}/roles        # Remove roles
│   │   ├── GET /{id}/permissions     # Get user permissions
│   │   ├── GET /stats/               # Get user statistics
│   │   ├── GET /pending/             # Get pending registrations
│   │   ├── POST /{id}/approve        # Approve registration
│   │   ├── POST /{id}/reject         # Reject registration
│   │   └── GET /registration-status  # Get registration settings
│   ├── reports/                      # Analytics and reporting
│   │   ├── GET /dashboard/           # Dashboard metrics
│   │   ├── GET /batches/             # Batch performance reports
│   │   ├── GET /financial/           # Financial reports
│   │   ├── POST /custom/             # Generate custom reports
│   │   ├── GET /export/              # Export reports
│   │   └── GET /schedule/            # Scheduled reports
│   └── settings/                     # System configuration
│       ├── GET /                     # Get system settings
│       ├── PUT /                     # Update system settings
│       ├── GET /permissions          # Get permissions
│       ├── GET /roles/               # Get user roles
│       ├── POST /backup/             # Backup settings
│       ├── POST /restore/            # Restore settings
│       ├── GET /export/              # Export settings
│       ├── POST /import/             # Import settings
│       ├── GET /branding/            # Get branding settings
│       ├── PUT /branding/            # Update branding settings
│       ├── GET /ussd/                # Get USSD settings
│       ├── PUT /ussd/                # Update USSD settings
│       ├── GET /payments/            # Get payment settings
│       ├── PUT /payments/            # Update payment settings
│       ├── GET /security/            # Get security settings
│       ├── PUT /security/            # Update security settings
│       ├── GET /notifications/       # Get notification settings
│       ├── PUT /notifications/       # Update notification settings
│       ├── GET /integrations/        # Get integration settings
│       └── PUT /integrations/        # Update integration settings
├── ussd/                             # USSD handling
│   ├── handle/                       # POST - USSD request processing
│   ├── session/                      # GET - Get session info
│   └── status/                       # GET - USSD service status
└── webhooks/                         # External integrations
    ├── momo/                         # MTN MoMo callbacks
    │   ├── disbursements/            # POST - Disbursement status updates
    │   └── balance/                  # POST - Balance updates
    └── ussd/                         # USSD provider callbacks
        ├── status/                   # POST - USSD session status
        └── delivery/                 # POST - Message delivery status
```

## 🗄️ Database Design Schema

### Entity-Relationship Overview
- Users manage Batches and operate on Promo Codes; Redemptions link Users to Promo Codes.
- Each Redemption triggers a Disbursement workflow (1–1) and writes Audit Logs.
- RBAC is modeled via Roles, Permissions, and join tables (RolePermissions, UserRoleAssignments).
- System configuration and operational controls live in Settings, RateLimits, and NotificationTemplates.

### Tables and Columns (PostgreSQL)
```sql
- users
  - id (uuid, pk)
  - phone_number (text, unique, null allowed for admins)
  - email (citext, unique, null allowed)
  - password_hash (text, null for USSD-only users)
  - is_active (boolean, default true)
  - is_verified (boolean, default false)
  - mfa_enabled (boolean, default false)
  - failed_login_attempts (integer, default 0)
  - lockout_until (timestamptz, null)
  - created_at, updated_at (timestamptz)

- roles
  - id (uuid, pk)
  - name (text, unique)
  - description (text)
  - created_at (timestamptz)

- permissions
  - id (uuid, pk)
  - key (text, unique)  // e.g., "batches.read", "promo-codes.generate"
  - description (text)

- role_permissions
  - role_id (uuid, fk roles.id)
  - permission_id (uuid, fk permissions.id)
  - created_at (timestamptz)
  - UNIQUE (role_id, permission_id)

- user_role_assignments
  - user_id (uuid, fk users.id)
  - role_id (uuid, fk roles.id)
  - created_at (timestamptz)
  - UNIQUE (user_id, role_id)

- sessions (Better Auth)
  - id (uuid, pk)
  - user_id (uuid, fk users.id)
  - ip (inet)
  - user_agent (text)
  - expires_at (timestamptz)
  - created_at, updated_at (timestamptz)

- verifications
  - id (uuid, pk)
  - user_id (uuid, fk users.id)
  - type (text)  // email_verification, password_reset, etc.
  - token_hash (text)
  - expires_at (timestamptz)
  - consumed_at (timestamptz, null)
  - created_at (timestamptz)

- batches
  - id (uuid, pk)
  - name (text, unique)
  - description (text)
  - total_codes (integer)
  - amount_per_code (numeric(14,2))
  - currency (text)
  - expiration_date (timestamptz)
  - assigned_user_id (uuid, fk users.id, null)
  - status (text)  // active, expired, blocked, completed
  - created_at, updated_at (timestamptz)

- promo_codes
  - id (uuid, pk)
  - code (text, unique)
  - batch_id (uuid, fk batches.id)
  - amount (numeric(14,2))
  - status (text)  // active, used, expired, redeemed, reported, blocked
  - created_at (timestamptz)
  - expires_at (timestamptz, null)
  - used_at (timestamptz, null)
  - redeemed_at (timestamptz, null)
  - reported_at (timestamptz, null)
  - blocked_at (timestamptz, null)
  - metadata (jsonb, default '{}')
  - INDEX (batch_id, status), INDEX (status)

- redemptions
  - id (uuid, pk)
  - user_id (uuid, fk users.id)
  - promo_code_id (uuid, fk promo_codes.id)
  - phone_number (text)
  - amount (numeric(14,2))
  - status (text)  // pending, completed, failed
  - idempotency_key (text, unique)
  - error_code (text, null)
  - error_message (text, null)
  - created_at (timestamptz)
  - completed_at (timestamptz, null)
  - UNIQUE (promo_code_id)  // Prevent duplicate redemption of same code
  - INDEX (user_id, created_at desc)

- disbursements
  - id (uuid, pk)
  - redemption_id (uuid, fk redemptions.id, unique)
  - momo_transaction_id (text, unique, null until assigned)
  - momo_reference (text, null)
  - status (text)  // queued, processing, completed, failed
  - attempts (integer, default 0)
  - last_attempt_at (timestamptz, null)
  - error_code (text, null)
  - error_message (text, null)
  - disbursed_at (timestamptz, null)
  - created_at, updated_at (timestamptz)
  - INDEX (status, created_at desc)

- audit_logs
  - id (uuid, pk)
  - actor_user_id (uuid, fk users.id, null for system)
  - action (text)
  - entity_type (text)
  - entity_id (text)
  - session_id (uuid, fk sessions.id, null)
  - ip (inet, null)
  - before (jsonb)
  - after (jsonb)
  - integrity_hash (text)  // cryptographic hash of entry
  - created_at (timestamptz)
  - INDEX (entity_type, entity_id, created_at desc)

- system_settings
  - id (uuid, pk)
  - category (text)  // branding, ussd, payments, security, notifications, analytics, integrations
  - key (text)
  - value (jsonb)
  - version (integer, default 1)
  - updated_by_user_id (uuid, fk users.id)
  - updated_at, created_at (timestamptz)
  - UNIQUE (category, key)

- rate_limits
  - id (uuid, pk)
  - key (text)  // e.g., 'ussd:phone:123', 'api:ip:1.2.3.4'
  - window_seconds (integer)
  - max_requests (integer)
  - created_at, updated_at (timestamptz)
  - INDEX (key)

- notification_templates
  - id (uuid, pk)
  - key (text, unique)
  - channel (text)  // email, sms, webhook
  - locale (text)  // en, rw
  - subject (text, null for sms/webhook)
  - body (text)
  - created_at, updated_at (timestamptz)
  ```

### Constraints and Integrity
- Enforce foreign keys (restrict deletes for financial/audit tables; cascade only where safe).
- Enforce uniqueness on: `promo_codes.code`, `batches.name`, `redemptions.promo_code_id`, `redemptions.idempotency_key`, `disbursements.redemption_id`, `disbursements.momo_transaction_id`, `roles.name`, `permissions.key`.
- Use enums or constrained text for statuses to match PRD states.
- Add NOT NULL where applicable to maintain data quality (amounts, statuses, timestamps).

### Concurrency & Idempotency
- During redemption: SELECT ... FOR UPDATE on the `promo_codes` row to prevent concurrent use.
- Atomic transaction: update code status, insert redemption, enqueue disbursement.
- Use `redemptions.idempotency_key` to deduplicate USSD repeat submissions.

### Performance & Indexing
- Promo codes: composite indexes on `(batch_id, status)` and `(status)` for filters.
- Redemptions: `(user_id, created_at desc)` for monitoring; `(status)` if filtering by state.
- Disbursements: `(status, created_at desc)` for queues and dashboards.
- Audit logs: `(entity_type, entity_id, created_at desc)` for fast trace queries.
- Consider partitioning large tables (audit_logs, redemptions, disbursements) by month.

### Retention & Compliance
- Configure retention for `audit_logs` per PRD defaults (e.g., 7 years) with partition pruning.
- Store cryptographic `integrity_hash` for tamper-evidence.