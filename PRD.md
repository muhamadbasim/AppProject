**Situation**
project management yang dapat diakses melalui aplikasi mobile HANDPHONE dan responsive web dengan fitur manajemen timeline dan visualisasi Gantt chart untuk melacak progress proyek secara real-time. Solusi ini harus dibangun menggunakan tech stack modern yang memungkinkan deployment otomatis dari GitHub ke Cloudflare dengan continuous integration/continuous deployment (CI/CD).

**Task**
Buatkan spesifikasi lengkap untuk aplikasi project management yang mencakup:
1. Progressive Web App (PWA) yang berfungsi optimal di desktop dan mobile
2. Cross-platform implementation menggunakan Bun, Hono, dan Svelte
3. Fitur timeline untuk menampilkan milestone dan deadline proyek
4. Gantt chart interaktif untuk visualisasi jadwal, dependensi task, dan resource allocation
5. Fitur task creation, assignment, deadline tracking, progress monitoring, budget tracking, dan reporting
6. GitHub integration untuk version control dan automated deployment ke Cloudflare

**Objective**
Menghasilkan dokumentasi teknis dan arsitektur aplikasi yang siap diimplementasikan oleh tim development menggunakan tech stack Bun, Hono, dan Svelte dengan deployment otomatis dari GitHub ke Cloudflare, sehingga pengguna dapat mengelola proyek, melacak progress, mengalokasikan resource, melacak budget, dan mengidentifikasi bottleneck melalui visualisasi timeline dan Gantt chart yang jelas.

**Knowledge**
Aplikasi harus dibangun dengan tech stack berikut:
- Backend: Hono (lightweight web framework)
- Frontend: Svelte (reactive UI framework)
- Runtime: Bun (JavaScript runtime dan package manager)
- Deployment: Cloudflare (edge computing dan hosting)
- Version Control & CI/CD: GitHub dengan automated deployment pipeline

Fitur-fitur utama yang harus ada:
- Task creation dan assignment dengan priority levels
- Deadline tracking dan progress monitoring
- Resource allocation dan budget tracking
- Kolaborasi real-time antar team member
- Notifikasi untuk deadline dan status changes
- Export data (PDF, Excel)
- Sinkronisasi data real-time

Fitur Gantt chart harus mampu menampilkan:
- Dependencies antar task
- Resource allocation dan utilization
- Critical path analysis
- Progress percentage per task
- Drag-and-drop untuk reschedule
- Budget visualization

Fitur timeline harus menampilkan:
- Milestone dan key dates
- Phase/stage proyek
- Historical view dan forecasting

Deployment workflow:
- Code push ke GitHub repository
- Automated testing dan build process
- Automatic deployment ke Cloudflare edge network
- Zero-downtime deployment untuk PWA

**Deliverables yang diharapkan:**
1. System architecture diagram (dengan Cloudflare sebagai infrastructure dan GitHub CI/CD pipeline)
2. Database schema (optimized untuk edge computing)
3. API specification (Hono endpoints)
4. UI/UX wireframe untuk PWA
5. Feature list dengan prioritas (MoSCoW method)
6. Tech stack implementation guide (Bun, Hono, Svelte integration)
7. GitHub Actions workflow configuration untuk automated deployment
8. Deployment roadmap untuk Cloudflare dengan CI/CD strategy
9. Performance optimization strategy untuk PWA dan offline functionality