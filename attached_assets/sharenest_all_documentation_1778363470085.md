# Sharenest

## Project Description
Sharenest — Detailed Project Description
1. Project Idea
Sharenest is a web-based solidarity platform that connects people who want to donate items or services with individuals in need. It functions as a structured, community-driven exchange system where everything is free and focused on social help rather than commercial transactions.
Users can publish:


Donations (offers): items or services they want to give away


Requests (needs): items or help they are looking for


The platform acts as an intermediary that organizes, verifies, and facilitates safe interactions between both sides.

2. Purpose of the Platform
The main goals of Sharenest are:


Reduce waste by giving unused items a second life


Support people in need by providing free access to essential goods


Encourage community solidarity and mutual aid


Ensure safe and structured donations through verification and moderation


Prevent abuse with quotas, rules, and monitoring systems


Simplify matching between donors and beneficiaries through categories, search, and filters



3. Target Audience
Primary users:


Individuals who want to donate items (furniture, clothes, food, electronics, etc.)


People in financial or social need looking for free assistance


Students or low-income users seeking basic necessities


Secondary users:


Associations and NGOs


Community volunteers


Local support groups


Admin users:


Platform administrators responsible for moderation, verification, and safety control



4. Core Features
4.1 User Account System


User registration and login


Role selection:


Donor


Requester (beneficiary)


Admin




Profile management (name, location, contact info)


Password update and account deletion


Activity history (posts, requests, accepted donations)



4.2 Authentication & Security


Secure login sessions


Protected routes (dashboard, posting, chat)


Role-based access control


Email verification (optional improvement)


Optional phone verification



4.3 Donation & Request System
Users can create two types of posts:
Donation (Offer)


Title


Description


Category (furniture, clothes, food, etc.)


Images


Location


Delivery option (can deliver / pick-up only)


Status (available / reserved / completed)


Request (Need)


Title (optional anonymity)


Description of need


Category


Location


Urgency level


Optional anonymity mode



4.4 Search & Filtering System
Users can find posts using:


Keyword search


Category filters


Location-based filtering


Type filter (donation / request)


Status filter (available, completed)


Date filtering



4.5 Dashboard (Personal Space)
Each user has a dashboard showing:


Their published donations and requests


Responses received


Accepted matches


Notifications


Activity summary



4.6 Matching & Interaction System


Users can respond to posts


A donation can be “claimed” by a requester


Confirmation system for successful exchanges


Optional acceptance approval by donor



4.7 Chat System


Real-time messaging between donor and requester


Linked to a specific post


Safe communication inside the platform (no external contact required initially)


Reporting option inside chat



4.8 Notification System


Notification when:


Someone responds to a post


A request is accepted


A donation is claimed


A chat message is received





4.9 Quota System (Anti-abuse rule)
To prevent exploitation:


Each user can only take 2 items per category per month


Exception: food category (no strict limit)


System resets monthly


Backend enforcement required



4.10 Verification System (Trust & Safety)
To ensure legitimacy:
User verification:


Email verification required


Optional phone verification


Trust score based on activity


Request verification:
For sensitive needs (e.g. medical equipment):


Upload proof document (medical certificate, prescription)


Admin approval required before validation


Trust system:


User ratings after each exchange (1–5 stars)


Reputation score displayed on profiles



4.11 Reporting & Moderation


Report button on posts and chats


Admin review panel


Ability to remove fake or abusive content


User blocking system



4.12 Admin Panel
Admins can:


View all users


Manage posts (delete/approve/reject)


Verify documents


Monitor suspicious activity


Handle reports



5. Data Management (Database Concept)
Main entities:


Users


Posts (donations + requests)


Categories


Messages (chat)


Transactions (matching records)


Reviews/Ratings


Notifications


Relationships:


One user → many posts


One post → many messages


Many-to-many between users via transactions



6. Overall System Behavior


User signs up and creates a profile


User posts a donation or request


Other users search or browse categories


Matching occurs through selection or chat


Exchange is confirmed and recorded


Rating is given to build trust system


Admin ensures safety and validates sensitive cases



7. Key Value of Sharenest
Sharenest is not just a marketplace; it is:


A solidarity ecosystem


A structured donation network


A safe matching system for real human needs


A community built on trust and sharing

Sharenest is designed with a clean, intuitive, and highly structured user interface to ensure accessibility for all types of users, regardless of their technical skills. The design must be minimalistic and uncluttered, with clear navigation, well-organized sections, and visually simple layouts to avoid confusion. Every feature should be easy to locate and use, allowing users from different backgrounds, including elderly users or people with limited digital experience, to interact with the platform effortlessly. The goal is to provide a smooth, straightforward user experience that prioritizes clarity, usability, and inclusivity.


## Product Requirements Document
# Product Requirements Document: Sharenest

## 1. Project Overview
Sharenest is a web-based solidarity platform designed to facilitate the redistribution of goods and services. By connecting donors with those in need, the platform promotes waste reduction and mutual aid. It is a non-commercial, community-driven ecosystem emphasizing trust, accessibility, and structured interaction.

## 2. Goals & Objectives
- Facilitate the second life of goods to reduce environmental waste.
- Provide a safe and intuitive channel for those requiring essential assistance.
- Foster community solidarity through a structured, transparent exchange process.
- Implement a robust moderation system to maintain platform safety and trust.

## 3. Target Audience
- **Donors:** Individuals, households, and local businesses contributing goods or services.
- **Beneficiaries:** Individuals or families seeking essential items or support.
- **Administrators:** Staff managing platform integrity, verification, and conflict resolution.

## 4. Functional Requirements (MVP Scope)
The MVP will focus on the core exchange flow to ensure system viability and usability.

### 4.1 Authentication & User Management
- User Registration: Email-based account creation.
- Login System: Secure session-based authentication.
- Profile Management: Basic user information, role assignment (Donor/Requester), and location data.

### 4.2 Post Management
- Donation Posting: Creation of listings with title, description, category, images, location, and delivery status.
- Request Posting: Creation of help requests categorized by urgency and nature.
- Post Lifecycle: Ability to set status (Available, Reserved, Completed).

### 4.3 Discovery
- Search & Filter: Keyword search capabilities combined with filtering by category, location, and post type.

### 4.4 Interaction Workflow (Donor-Controlled)
- Request-to-Claim: Requesters initiate interest via a "Request" button.
- Approval System: Donors view a list of interested parties and manually approve the recipient.
- Status Update: System updates the post status to "Reserved" upon approval to prevent double-claiming.

### 4.5 Dashboard
- Personal Hub: View active/past posts and current status of requested items.

## 5. Non-Functional Requirements
- **Usability:** Minimalist, accessible design suitable for users with varying levels of digital literacy.
- **Responsiveness:** Mobile-first approach, ensuring functionality across desktop and handheld devices.
- **Security:** Protection against unauthorized access; secure handling of user contact information.
- **Performance:** Efficient database queries to ensure fast load times during search and filtering.

## 6. Technical Specifications
- **Frontend:** HTML5, CSS3 (Tailwind/Bootstrap), Vanilla JavaScript or React for UI components.
- **Backend:** Node.js with Express.js.
- **Database:** Relational database (e.g., MySQL or PostgreSQL) to handle complex user-post-transaction relationships.
- **Hosting:** Local development (XAMPP/WAMP) for academic demonstration; Render/Railway for cloud deployment.
- **Third-Party Integrations:** OpenStreetMap/Leaflet.js for location services; Nodemailer for transactional emails.

## 7. Moderation & Safety (Future Scalability)
While deferred from the initial MVP, the architecture is designed to accommodate:
- **Risk Scoring:** Automated flagging based on account age, interaction frequency, and reporting history.
- **Verification:** Administrative review for sensitive requests (e.g., medical equipment) requiring uploaded documentation.
- **Community Trust:** Post-exchange rating system (1–5 stars) to influence future visibility and platform reputation.

## 8. Data Privacy & Compliance
- Compliance with GDPR principles: Data minimization, explicit consent for information processing, and secure storage of sensitive documents.
- Users maintain the right to view, modify, or delete their data through the platform settings.

## 9. Roadmap for Future Phases
- **Phase 2:** Integration of a real-time Chat System and full Notification engine.
- **Phase 3:** Implementation of the formal Trust/Reputation System and Quota Management.
- **Phase 4:** Advanced analytics and administrative dashboards for community health monitoring.

## Technology Stack
# TECHSTACK: Sharenest

## 1. Overview
The Sharenest technology stack is selected to prioritize rapid development, maintainability, and ease of deployment for the MVP phase. The stack follows a "Full-Stack JavaScript" approach to ensure consistency, reduce context switching, and leverage a massive ecosystem of libraries.

## 2. Core Technologies

### 2.1 Frontend
- Framework: HTML5, CSS3, and Vanilla JavaScript (ES6+)
- UI Library/Framework: Bootstrap 5
  - Justification: Provides a responsive, mobile-first grid system and pre-built components (cards, forms, navbars) that significantly accelerate the development of the minimal, clean interface required for Sharenest.
- Icons: FontAwesome
  - Justification: Lightweight and provides clear visual cues for categories and user actions.

### 2.2 Backend
- Runtime: Node.js
- Framework: Express.js
  - Justification: Node.js allows for a shared language (JavaScript) between client and server. Express.js is a minimalist, unopinionated framework that allows for rapid setup of RESTful API routes, middleware, and request handling.

### 2.3 Database
- Database Management System: MongoDB (NoSQL)
- ORM/ODM: Mongoose
  - Justification: The flexible schema of MongoDB is ideal for an MVP where post structures (donations vs. requests) may evolve. Mongoose provides a robust way to model user-to-post relationships and enforce data validation schemas.

## 3. Tooling & Infrastructure

### 3.1 Development Environment
- Local Server: XAMPP or local Node.js environment
- Version Control: Git / GitHub
- Package Management: npm

### 3.2 Hosting & Deployment
- Platform: Render or Railway
  - Justification: These platforms provide excellent free-tier options for Node.js/MongoDB projects and offer simple deployment pipelines directly from GitHub repositories.

## 4. Third-Party Integrations

### 4.1 Location Services
- Engine: Leaflet.js with OpenStreetMap data
  - Justification: OpenStreetMap is free and open-source, avoiding the cost and API key complexity of Google Maps while providing all necessary functionality for displaying post locations and filtering by area.

### 4.2 Authentication & Verification
- Security: JSON Web Tokens (JWT) & bcrypt
  - Justification: JWT provides stateless, secure session management. bcrypt is used for industry-standard password hashing.
- Email Services: Nodemailer
  - Justification: Ideal for sending transactional emails (account verification, password reset) directly from the backend via an SMTP relay.

## 5. Technical Justification & Constraints

### 5.1 Why This Stack?
- Consistency: Using JavaScript everywhere lowers the barrier for future development and documentation.
- Scalability: The architecture allows for scaling from the initial ~100 users to larger community cohorts by simply migrating to a managed cloud database (e.g., MongoDB Atlas).
- Simplicity: By avoiding heavy frontend frameworks (like Angular) or complex backend structures (like NestJS) during the MVP, the team can focus strictly on the core logic: creating, filtering, and matching posts.

### 5.2 Performance & Safety
- Input Validation: Strict server-side validation using Joi or built-in Mongoose validators to prevent malicious data injection.
- Security: Implementation of CORS, Helmet.js (for secure HTTP headers), and rate limiting to prevent basic brute-force or automated spam attempts.
- Responsive Design: The CSS strategy focuses on mobile-first design, ensuring that users in various socio-economic settings can access the platform via low-end smartphones as effectively as high-end desktops."

## Project Structure
PROJECTSTRUCTURE

1. OVERVIEW
The Sharenest project follows a modular, scalable architecture designed to facilitate clear separation between the presentation layer, business logic, and data storage. The directory structure is organized to support the Node.js/Express ecosystem while remaining intuitive for maintenance and future feature expansion.

2. DIRECTORY TREE

sharenest/
├── public/                # Static assets
│   ├── css/               # Stylesheets (Tailwind/Custom)
│   ├── js/                # Client-side scripts
│   ├── img/               # Brand assets and icons
│   └── uploads/           # User-uploaded images (donations)
├── src/                   # Source code
│   ├── config/            # Database and environment configurations
│   ├── controllers/       # Request handlers (Business logic)
│   ├── middleware/        # Authentication and validation layers
│   ├── models/            # Database schema definitions
│   ├── routes/            # API and page routing definitions
│   ├── views/             # Frontend templates (EJS/HTML)
│   └── utils/             # Helper functions (date formatting, etc.)
├── tests/                 # Unit and integration tests
├── .env                   # Environment variables (DB credentials, API keys)
├── .gitignore             # Files to exclude from version control
├── app.js                 # Main server entry point
├── package.json           # Project dependencies and metadata
└── README.md              # Project documentation

3. FOLDER EXPLANATIONS

3.1 Root Level
- /public: Contains all static assets served directly to the client. This includes frontend CSS, client-side JavaScript for interactivity, and the storage folder for donation images.
- /src: The heart of the application, containing all server-side logic, routing, and data handling.
- .env: Stores sensitive information like database connection strings and secret keys. This file is excluded from Git for security.
- app.js: The entry point for the Node.js server. It initializes middleware, connects to the database, and mounts the routers.

3.2 The Source Directory (/src)
- /config: Houses database connection logic and third-party API configurations (e.g., Nodemailer setups).
- /controllers: Functions responsible for processing incoming requests, interacting with models, and returning responses. Each entity (User, Post, Transaction) has a corresponding controller.
- /middleware: Contains security layers. Examples include 'auth.js' for session checks, 'roleCheck.js' for protecting admin routes, and 'upload.js' for image handling.
- /models: Defines the structure of the data. Since the project uses a relational database approach, these files map out User, Post, Category, and Transaction tables.
- /routes: Defines the application's endpoints. Keeps the main app.js file clean by modularizing routing based on functionality (e.g., authRoutes, postRoutes, dashboardRoutes).
- /views: Contains the template engine files (e.g., EJS) responsible for rendering the UI to the user's browser.

4. DATA FLOW ARCHITECTURE
- Client Request: Sent to a specific route in /routes.
- Router: Directs the request to the appropriate controller method.
- Controller: Validates input, interacts with the model, and performs business logic (e.g., matching a donor to a requester).
- Model: Performs database CRUD operations.
- Response: The view is rendered and returned to the user or an API response is sent back.

5. DEVELOPMENT GUIDELINES
- Consistency: Use camelCase for variables and PascalCase for models.
- Modularity: Keep controller functions small and focused on single tasks (Single Responsibility Principle).
- Security: Never expose internal paths; all database interactions must pass through the middleware layer for verification.
- Assets: All uploaded images must be sanitized and stored in /public/uploads/ with hashed filenames to prevent overwriting."

## Database Schema Design
SCHEMADESIGN

1. Overview
This section outlines the relational database schema for Sharenest. The design prioritizes data integrity, user account management, and the core transactional flow between donors and requesters. The schema follows a relational model (RDBMS) suitable for PostgreSQL or MySQL.

2. Database Entities

2.1 Users
- user_id (PK, UUID)
- email (Unique, String)
- password_hash (String)
- full_name (String)
- location (String)
- role (Enum: 'donor', 'requester', 'admin')
- reputation_score (Decimal, Default: 0)
- account_status (Enum: 'active', 'suspended', 'banned')
- created_at (Timestamp)

2.2 Categories
- category_id (PK, Integer)
- name (String: e.g., 'Furniture', 'Food', 'Medical')
- is_sensitive (Boolean, Default: False) // Used for trigger-based moderation

2.3 Posts
- post_id (PK, UUID)
- user_id (FK -> Users)
- category_id (FK -> Categories)
- title (String)
- description (Text)
- post_type (Enum: 'donation', 'request')
- location (String)
- status (Enum: 'available', 'reserved', 'completed', 'pending_review')
- urgency_level (Enum: 'low', 'medium', 'high')
- is_anonymous (Boolean, Default: False)
- created_at (Timestamp)

2.4 Transactions (Matching)
- transaction_id (PK, UUID)
- post_id (FK -> Posts)
- donor_id (FK -> Users)
- requester_id (FK -> Users)
- status (Enum: 'requested', 'accepted', 'completed', 'cancelled')
- created_at (Timestamp)

2.5 Messages
- message_id (PK, UUID)
- transaction_id (FK -> Transactions)
- sender_id (FK -> Users)
- content (Text)
- is_read (Boolean)
- created_at (Timestamp)

2.6 Reviews
- review_id (PK, UUID)
- transaction_id (FK -> Transactions)
- reviewer_id (FK -> Users)
- rated_user_id (FK -> Users)
- rating (Integer: 1-5)
- comment (Text)

2.7 Verification_Docs (Sensitive Data)
- doc_id (PK, UUID)
- user_id (FK -> Users)
- doc_path (String) // Storage path for secure uploaded files
- status (Enum: 'pending', 'approved', 'rejected')
- admin_notes (Text)

3. Relationships
- One-to-Many: User to Posts (A user can publish multiple donations or requests).
- One-to-Many: Category to Posts (Categories classify multiple posts).
- One-to-Many: Post to Transactions (A post can be the subject of multiple requests).
- One-to-Many: Transaction to Messages (Chat threads are bound to a specific exchange).
- One-to-One: Transaction to Review (An exchange allows one review per participant).

4. Data Integrity & Constraints
- Quota Enforcement: Application-level logic will check `Transactions` where `requester_id` matches current user and `created_at` is within the current month for non-food categories.
- Risk Scoring: The `Users` table contains a `reputation_score`, and the `Posts` table status `pending_review` handles the workflow for high-risk flags.
- Foreign Key Integrity: All transactions and posts require valid User IDs. Cascading deletes should be disabled; instead, use 'soft deletes' (updating status to 'archived') to maintain audit trails for moderation.

5. Indexing Strategy
- Index on `Posts(category_id)` and `Posts(post_type)` to optimize search and filter operations.
- Index on `Posts(location)` for geographical filtering.
- Index on `Transactions(donor_id, requester_id)` for fast dashboard retrieval of personal activity history.
- Index on `Users(email)` for high-performance authentication lookups.

## User Flow
USER FLOW DOCUMENT: SHARENEST

1. INTRODUCTION
The Sharenest user flow is designed for simplicity, accessibility, and trust. The flow prioritizes a linear journey that minimizes cognitive load, ensuring that even users with limited digital experience can navigate from registration to a successful exchange.

2. CORE USER JOURNEYS

2.1. Registration & Onboarding
- Landing Page: Displays a clear "Donate" or "Request" call-to-action.
- Sign-up Process:
    - User provides basic details: Name, Email, Password, Location.
    - Role Selection: User explicitly selects "Donor" or "Requester" (can be toggled later in settings).
    - Email Verification: User receives a confirmation link to activate the account.
- Post-Registration: Redirects to the Global Feed.

2.2. Donation Posting (Donor Journey)
- Entry: User clicks "Create Post" > "New Donation".
- Data Entry:
    - Title & Description: Simple text fields.
    - Category: Dropdown selector (Furniture, Clothes, Food, etc.).
    - Photos: Simple drag-and-drop or file upload.
    - Delivery Preference: Checkbox (Can deliver / Pick-up only).
- Submission: Post is saved to the database with status "Available".
- Visibility: Appears immediately in the global feed.

2.3. Requesting an Item (Requester Journey)
- Search & Discovery: User uses search bar or category filters to find a desired item.
- Viewing Details: User clicks on a post to see full details, donor location, and delivery terms.
- Action: User clicks "Request Item".
- Confirmation: A notification is sent to the donor; the request appears in the user’s "My Requests" dashboard.

2.4. Matching & Approval (Donor-Controlled Workflow)
- Notification: Donor receives a request notification.
- Review: Donor views the list of applicants for their post.
- Decision: Donor selects the preferred requester based on the user's profile and stated need.
- Confirmation: Donor clicks "Confirm Match".
- Finalization: Both users receive a notification to exchange contact/logistics info. Status updates to "Reserved".

3. WIREFRAME DESCRIPTIONS & INTERACTION PATTERNS

3.1. Navigation Pattern
- Global Header: Contains "Search", "Create Post" (+ icon), and "Profile/Dashboard" link.
- Mobile Navigation: Bottom tab bar (Home/Feed, Search, Post, Notifications, Profile).

3.2. Dashboard (Personal Space)
- Layout: Split into two tabs: "My Donations" and "My Requests".
- Interaction: Each card shows the item status (Available, Reserved, Completed).
- Quick Actions: "Edit", "Mark as Completed", or "Delete".

3.3. Search & Filter Interface
- Filter Sidebar (Desktop) / Filter Drawer (Mobile):
    - Category checkboxes.
    - Location radius slider.
    - "Only Show Available" toggle.

4. INTERACTION NUANCES
- Feedback Loops: Every successful action (posting, requesting, matching) triggers a simple toast notification (e.g., "Request sent successfully!").
- Error Handling: Clear, non-technical error messages (e.g., "Please check your internet connection" or "Please fill in the item description").
- Accessibility: High-contrast buttons and readable font sizes to assist elderly or visually impaired users.

5. ADMIN WORKFLOW (MODERATION)
- Admin Dashboard:
    - Overview: Real-time counter of Users, Active Posts, and Pending Reports.
    - Flagged Items Queue: A list of posts/users requiring attention.
    - Actions: Each item has "Approve", "Reject/Delete", and "Flag for Review" buttons.
- Suspension Logic: A "Ban User" button on the user profile view, which terminates active sessions and hides all associated posts.

6. SEQUENCE OF OPERATIONS (MVP SCOPE)
1. User Authentication (Login/Sign-up).
2. Navigation to Feed.
3. Post Creation (Form completion -> Validation -> Database commit).
4. Item Request (Interaction -> Status update -> Notification).
5. Exchange Completion (Marking as "Completed" -> History update).

7. SUMMARY OF UI DESIGN RULES
- Minimalist aesthetic: Plenty of white space, neutral background colors.
- Call-to-action buttons: Use a distinct, primary brand color (e.g., a warm, trustworthy color like soft green or blue).
- Readability: Clean sans-serif typography with generous line spacing.
- Responsiveness: The layout must collapse from a three-column desktop grid to a single-column mobile stack seamlessly.

## Styling Guidelines
STYLING GUIDELINES: SHARENEST

1. DESIGN PHILOSOPHY
Sharenest is built on the core values of solidarity, trust, and inclusivity. The design system follows a "Human-Centered Minimalist" approach. The interface must be clutter-free, prioritizing readability and accessibility so that users with varying levels of digital literacy can navigate the platform with ease.

2. COLOR PALETTE
Our color system focuses on soft, calming tones that evoke trust and community rather than commercial urgency.

- Primary Action Color (Trust): #2D6A4F (Deep Forest Green) - Used for primary buttons, call-to-action elements, and positive indicators.
- Secondary Accent (Warmth): #F4A261 (Soft Apricot) - Used for highlights, request notifications, and status badges (e.g., 'Pending').
- Neutral Backgrounds: #F8F9FA (Off-White) - Used for main body backgrounds to reduce eye strain.
- Surface Elements: #FFFFFF (Pure White) - Used for cards, modals, and input fields to create depth.
- Text/Typography: #264653 (Charcoal Blue) - High contrast for primary text, ensuring excellent readability.
- Supportive/Alerts: #E76F51 (Muted Terra) - Used for reports, alerts, and critical errors.

3. TYPOGRAPHY
Typography is chosen for high legibility and a friendly, accessible tone.

- Font Family: 'Inter' or 'Roboto' (Sans-Serif).
- Hierarchy:
  - H1 (Headings): 32px / Bold / #264653 - Used for page titles.
  - H2 (Section Titles): 24px / Semibold / #264653 - Used for sub-sections.
  - Body Text: 16px / Regular / #264653 - Used for descriptions and general content.
  - Meta Text: 14px / Regular / #6C757D - Used for timestamps, locations, and labels.
  - Buttons: 16px / Semibold / #FFFFFF - Used inside actionable elements.

4. UI COMPONENTS
- Buttons: Rounded corners (radius: 8px). Full-width on mobile devices for easier touch interaction. Primary buttons must have a subtle hover state to provide user feedback.
- Cards: Used for displaying donations and requests. Must feature a subtle shadow (box-shadow: 0 4px 6px rgba(0,0,0,0.1)) to lift them off the background.
- Forms: Large input fields (min-height: 48px) with clearly visible labels to accommodate users with dexterity issues.
- Status Badges: Small pill-shaped elements (border-radius: 20px) indicating post status (Available, Reserved, Completed).

5. UI/UX PRINCIPLES
- Accessibility (A11y): High contrast ratios between text and background. All icons must include descriptive alt-text or labels.
- Minimalism: Use whitespace (padding and margins) generously to separate sections. Avoid overwhelming the user with too many options on a single screen.
- Responsive Behavior: A mobile-first approach is mandatory. Navigation should transition from a desktop header to a bottom-tab bar on mobile devices to facilitate thumb-friendly usage.
- Interaction Feedback: Buttons must show a visual change upon interaction. Loading states (spinners or skeleton loaders) should be used during data fetching to manage user expectations.
- Cognitive Load: Use consistent icons (e.g., a simple 'plus' icon for adding a post) across the entire platform. Keep labels clear and avoid technical jargon.

6. LAYOUT STRUCTURE
- Header: Contains the Sharenest logo, navigation links (Home, Search, Dashboard), and the user profile icon.
- Main Content Area: Centered container (max-width: 1200px) with fluid padding for responsiveness.
- Footer: Contains links to 'About Us', 'Safety Guidelines', and 'Report a Problem'.

7. ICONOGRAPHY
- Style: Outline-based, thin-stroke, and simple. Keep icons intuitive (e.g., a hand-holding-heart for donations, a magnifying glass for search). Maintain a consistent 24px x 24px size for global navigation.
