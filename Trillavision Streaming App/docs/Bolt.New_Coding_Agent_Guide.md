📜 Optimized AI Coding Agent Guide for Bolt.New (Trillavion T.V.)
📂 Category: AI-Assisted Live Streaming App Development | Production-Ready Code

📌 Objective: Ensure the AI coding agent follows systematic software engineering principles to build the Bolt.New streaming platform (Trillavion T.V.) into a fully functional, production-ready application.

📌 Section 1: Core Software Engineering Principles for AI Coding Agent
💬 "Before making any changes, follow these strict software engineering principles:

✅ 1️⃣ Ensure Clean Architecture & Modular Code

Follow separation of concerns (Frontend, Backend, Real-Time Communication, Video Processing).
Modularize code properly (services, controllers, UI components, API layers).
Use design patterns (MVC, Factory, Observer, Singleton where applicable).
No mixing of UI logic, API calls, and business logic in the same file.
✅ 2️⃣ Systematic Development Process (No Redundant Work)

Always check existing functionality before creating new features.
Before modifying any function, retrieve its current implementation and verify its impact on the system.
Log every change and update the development documentation.
✅ 3️⃣ Maintain High Code Quality Standards

Code must follow SOLID principles (Single Responsibility, Open-Closed, etc.).
Ensure strict type safety using TypeScript across the codebase.
Comment all complex logic to maintain readability.
✅ 4️⃣ Strict Testing & Validation Requirements

Unit Tests (Jest) for individual functions.
Integration Tests (React Testing Library) for component interactions.
End-to-End (E2E) Tests to validate full workflows.
Performance & Load Testing for handling concurrent users efficiently.
✅ 5️⃣ Prioritize Security & Stability

Implement proper authentication & authorization (JWT, OAuth for YouTube integration).
Prevent CORS issues, memory leaks, and race conditions in real-time communication (Socket.IO).
Ensure secure handling of video/audio processing with FFmpeg.
📌 No changes should be made without following these principles. If any doubts arise, stop and analyze before proceeding.

📌 Section 2: Optimizing Performance for High-Load Streaming (Without WebRTC)
Since Bolt.New does not use WebRTC, the focus will be on:
✅ Socket.IO for real-time communication
✅ FFmpeg for video processing & streaming
✅ Redux for state management optimizations

💬 "Before deploying any changes, run a full performance analysis:

✅ 1️⃣ Optimize API & Real-Time Server Performance (Express + Socket.IO)
📌 Ensure real-time communication handles high concurrency efficiently.

Optimize Socket.IO event listeners to prevent memory leaks.
Test for race conditions and concurrency issues with multiple users.
Reduce redundant WebSocket messages to avoid excessive resource usage.
Implement caching strategies (Redis if needed) to reduce server load.
✅ 2️⃣ Optimize Video Processing & Streaming (FFmpeg + Fluent-FFmpeg)
📌 Ensure smooth video handling & reduce processing time.

Optimize FFmpeg command execution to reduce CPU & memory usage.
Implement progressive video loading & adaptive bitrate streaming.
Ensure FFmpeg logs errors and recovers from failed processes.
✅ 3️⃣ Frontend Optimization (React + Vite + Tailwind)
📌 Reduce unnecessary re-renders & optimize UI interactions.

Use memoization (React.memo, useMemo) for performance-heavy components.
Optimize Redux state updates to avoid unnecessary re-renders.
Implement code-splitting with Vite to reduce initial load times.
Ensure smooth drag-and-drop UI interactions (React Beautiful DnD).
✅ 4️⃣ Database & API Request Optimization
📌 Reduce server-side load with efficient database calls.

Optimize API calls with Axios interceptors & caching mechanisms.
Use pagination & query optimization for large data requests.
Prevent excessive requests to YouTube API (rate limits must be handled).
📌 No feature should be deployed without performance validation.

📌 Section 3: AI Prompts for Development & Debugging
🔹 1️⃣ Always Check Existing Code Before Modifying or Adding Features
💬 "Before implementing or modifying any feature, follow these steps:
1️⃣ Retrieve the current version of the relevant file(s).
2️⃣ Analyze how the function or module is currently implemented.
3️⃣ Identify any existing dependencies and interactions.
4️⃣ If modifying, log the proposed changes before executing.
📌 Ensure no redundant code is added and that all modifications align with the existing architecture."**

🔹 2️⃣ Implementing a New Feature Systematically
💬 "When implementing a new feature, follow this structured process:

✅ Step 1: Define Requirements

What problem is this feature solving?
What inputs, outputs, and dependencies are required?
✅ Step 2: Design the Feature First (Before Writing Code)

Outline the data flow, API calls, and user interactions.
Determine where this feature fits within the app architecture.
✅ Step 3: Write Modular, Reusable Code

Break functionality into small, testable components.
Keep UI logic, business logic, and database operations separate.
✅ Step 4: Implement & Test the Feature

Write the code following best practices.
Write unit tests to validate logic.
Log implementation details and update documentation.
📌 Confirm each step before proceeding to the next. No unstructured coding."**

🔹 3️⃣ Debugging & Fixing Errors Systematically
💬 "Before attempting to fix any issue, follow this debugging process:

✅ Step 1: Identify & Log the Issue

Capture full error messages and stack traces.
Identify what file, function, or API is failing.
Check recent commits to see if the issue was introduced by a change.
✅ Step 2: Investigate the Root Cause

Determine whether this is a logic error, configuration issue, API failure, or dependency conflict.
If a regression, identify the commit that caused it.
✅ Step 3: Implement a Fix Methodically

Never modify code blindly—analyze first.
Propose a fix with reasoning before applying it.
Test the fix in a local environment before pushing changes.
✅ Step 4: Validate the Fix with Testing

Run unit tests, integration tests, and E2E tests.
Check performance impact if applicable.
📌 Document the root cause and fix in the development log before moving forward."**

📌 Section 4: AI Coding Agent’s Final Directives for Bolt.New
💬 "Before making any modifications, adhere to these final directives:"

1️⃣ Verify existing functionality before adding new features.
2️⃣ Never modify code without understanding its current behavior.
3️⃣ Break tasks into small, manageable steps—no rushed development.
4️⃣ All code must be modular, scalable, and properly documented.
5️⃣ Run unit tests, integration tests, and performance tests before deployment.
6️⃣ Security must be a top priority—no exposed credentials or vulnerabilities.
7️⃣ Log all work, fixes, and new implementations in the development documentation.

📌 Follow these principles strictly. If at any point there is uncertainty, stop and analyze before proceeding.

