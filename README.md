# Swift Solutions Telehealth Platform

A full-stack, HIPAA-conscious telehealth platform built for Swift Solutions Medical Center. Patients can book appointments, message providers, upload documents, and join video consultations — all through a secure cloud-native application.

## 🌐 Live Demo
- **Frontend:** http://swift-solutions-frontend.s3-website-us-east-1.amazonaws.com
- **Backend API:** http://swift-solutions-alb-1492420054.us-east-1.elb.amazonaws.com
- **API Docs:** http://swift-solutions-alb-1492420054.us-east-1.elb.amazonaws.com/docs

---

## 🏗️ Architecture
                ┌─────────────────┐
                │   React Frontend │
                │   (AWS S3 +     │
                │   CloudFront)   │
                └────────┬────────┘
                         │
                ┌────────▼────────┐
                │  Application    │
                │  Load Balancer  │
                └────────┬────────┘
                         │
                ┌────────▼────────┐
                │   ECS Fargate   │
                │  (FastAPI +     │
                │   Docker)       │
                └────────┬────────┘
                         │
                ┌────────▼────────┐
                │   RDS PostgreSQL │
                │   (Private VPC) │
                └─────────────────┘

---

## 🚀 Tech Stack

### Frontend
- React 18 with TypeScript
- AWS S3 Static Website Hosting
- Responsive UI with custom CSS

### Backend
- Python FastAPI
- Docker containerized
- AWS ECS Fargate (serverless containers)
- AWS Application Load Balancer

### Database
- PostgreSQL 15
- AWS RDS (private subnet)

### Infrastructure
- AWS VPC with public/private subnets
- Terraform (Infrastructure as Code)
- GitHub Actions CI/CD pipeline
- AWS ECR (container registry)

---

## ✨ Features

- 🔐 **User Authentication** — secure login and registration
- 📅 **Appointment Booking** — schedule and manage appointments
- 💬 **Secure Messaging** — HIPAA-conscious patient-provider messaging
- 📄 **Document Management** — upload and manage medical documents
- 🎥 **Video Consultations** — join telehealth video calls
- 👤 **Patient Profiles** — manage patient demographics

---

## 🏗️ Infrastructure as Code

All AWS infrastructure is managed with Terraform:
terraform/
├── main.tf                 # Root module
├── variables.tf            # Input variables
├── outputs.tf              # Output values
├── providers.tf            # AWS provider config
└── modules/
├── vpc/                # VPC, subnets, routing
├── rds/                # PostgreSQL database
├── ecs/                # ECS cluster + service
├── alb/                # Application load balancer
└── s3/                 # Frontend hosting

Deploy infrastructure with one command:
```bash
terraform init
terraform apply
```

---

## 🔄 CI/CD Pipeline

GitHub Actions automatically deploys on every push to main:

1. **Backend** — builds Docker image → pushes to ECR → deploys to ECS
2. **Frontend** — builds React app → syncs to S3

---

## 🛠️ Local Development

### Prerequisites
- Docker Desktop
- Python 3.11+
- Node.js 18+
- AWS CLI

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Docker Compose
```bash
docker-compose up
```

---

## 📁 Project Structure
swift-solutions-telehealth/
├── backend/
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── database.py     # Database connection
│   │   ├── models.py       # SQLAlchemy models
│   │   └── routes.py       # API endpoints
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/          # React pages
│   │   └── App.tsx         # Root component
│   └── package.json
├── terraform/              # Infrastructure as Code
└── .github/
└── workflows/
└── deploy.yml      # CI/CD pipeline

---

## 🔒 Security

- Database in private VPC subnet (no public internet access)
- Security groups restrict traffic between layers
- Environment variables for sensitive configuration
- HTTPS-ready architecture

---

## 📊 AWS Services Used

| Service | Purpose |
|---|---|
| ECS Fargate | Run backend containers |
| RDS PostgreSQL | Managed database |
| S3 | Frontend static hosting |
| Application Load Balancer | Traffic routing + permanent URL |
| ECR | Docker image registry |
| VPC | Private network isolation |
| CloudWatch | Logging and monitoring |
| IAM | Security and permissions |

---

## 👩‍💻 Author

Built by **Edward Opong** as part of a cloud engineering portfolio project.

- GitHub: [@eopong87](https://github.com/eopong87)

---

## 🗺️ Roadmap

- [ ] Patient registration page
- [ ] Staff portal for providers
- [ ] AI chatbot powered by Claude API
- [ ] Real video calls with Daily.co
- [ ] Mobile responsive design
- [ ] Phase 3: Terraform rebuild ✅
