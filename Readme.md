# 🛡️💸 PayVault.ai - Your Smart Secure and Intelligent Payment Locker  
## Submission for **Amazon HackOn Hackathon 2025**

---

## 📚 Table of Contents
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution-payvaultai)
- [Feature Breakdown](#-feature-breakdown)
- [How It Works](#-how-it-works)
- [Why PayVault.ai Matters](#-why-payvaultai-matters)
- [Live Link](#-live-link)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#️-project-folder-structure)
- [Set Up Instruction](#-setup-instructions)
- [Contributing](#contributing)
- [Future Enhancements](#future-enhancements)
- [In Short](#in-short)
- [Contributors](#contributors)
---


## 📌 Problem Statement

In today’s fast-paced digital economy, individuals and businesses face chaos managing their **payments, invoices, EMIs, and taxes** scattered across various platforms - from banking apps and email inboxes to SMS and PDFs. Connectivity issues, missed reminders, and fragmented workflows lead to payment failures, financial mismanagement, and late fees.

---

## 🚀 Our Solution: PayVault.ai

**PayVault.ai** is a secure, intelligent, all-in-one **web-based finance vault** that empowers users to manage their entire **payment ecosystem** in one place.

Think of it as a DigiLocker, but reimagined - not just for storing documents, but for **actively managing and automating financial operations** such as **payments, invoices, taxes, EMIs, and bills** with advanced intelligence, real-time sync, and smart alerts.

### 💡 What's Unique?

PayVault.ai introduces a **Smart Payment System** powered by our innovative **SafePay Engine** - a game-changer in handling real-world connectivity issues.

#### 🔐 SafePay Engine – Smart & Reliable Offline Payment Handling

One of the biggest challenges in digital payments is the **reliability of internet connectivity**. Our SafePay Engine ensures users never miss a payment, even when offline:

- 🌐 When a user initiates a payment and there's **no internet**, the **Smart Payment System safely queues the payment** in an encrypted format.
- 🔁 Once internet connectivity is restored, the system **automatically processes the queued payment** — no user intervention required.
- 📄 It also works with **uploaded documents**, allowing the system to auto-schedule and process bill payments based on invoice metadata (like due date and amount).
- 🔔 In case of delays or retries, the system notifies users and logs all payment attempts transparently.

This feature ensures **maximum reliability**, particularly in areas with poor network coverage, and significantly **reduces failed transactions**, missed due dates, and late payment penalties.

---

By combining centralized finance management with automated syncing, real-time insights, and a **fail-safe smart payment engine**, **PayVault.ai** helps users take complete control of their financial operations - **securely, intelligently, and seamlessly.**


### 🔍 Feature Breakdown

#### ✅ Unified Financial Dashboard

- Visualizes all transactions in one place - from invoices to vendor payments.
- Categorizes transactions by:
  - **Vendors** (e.g., Amazon, Swiggy, Paytm)
  - **Categories** like Food, Travel, Utilities, Shopping, etc.
  - **Month-wise expenditure trends**
- Tracks success/failure rates, pending bills, and upcoming payments.

#### 🔁 SafePay Engine (Smart Payment System)

- Handles payments securely, even when offline.
- Ensures uninterrupted financial transactions via queuing + auto-retry.
- Enables **document-based autopay** with scheduled triggers.

#### 🔄 Auto-Sync from Gmail & SMS

- Integrates with:
  - **Gmail API**: Fetches invoice PDFs, utility bills, etc.
  - **SMS Parser**: Extracts transaction metadata from OTPs and alerts.
- Enables zero-manual-entry payment tracking and syncs future bills as they arrive.

#### 📄 Document Upload + AI Insights

- Upload PDFs/images of bills, tax slips, and EMI notices.
- Our AI engine automatically extracts:
  - Vendor
  - Amount
  - Due Date
  - Category
- Suggests actions, such as setting reminders or enabling autopay.

#### 📤 Exportable Reports

- View and export transactions based on:
  - Date ranges
  - Vendor
  - Category
  - Payment status
- Download custom reports in PDF format for record-keeping or audits.

#### 📊 Insights & Urgent Bill Alerts

- Flags high-priority bills nearing due dates.
- Shows spend trends by month and category.
- Gives a quick overview of pending actions (e.g., unpaid EMIs, tax filings).

#### 🧭 UX Enhancements & Security

- **Pagination**: Clean display with 15 records per page.
- **Responsive UI**: Fully mobile-compatible interface.
- **Notifications**: Real-time alerts for critical actions and payments.
- **Security-First**: OAuth2 for Gmail login, AES encryption for offline payment queues, and role-based data isolation.


## 🧠 How It Works

Here's a step-by-step flow of how **PayVault.ai** operates behind the scenes:

1. 🔐 **User Authentication**
   - Users securely log in using OAuth (e.g., Google) to ensure trusted access and enable sync with Gmail.

2. 📤 **Document Upload or Auto-Fetch**
   - Users can upload PDFs, bills, or invoices manually.
   - Alternatively, PayVault.ai can auto-fetch payment-related documents from **SMS alerts** and **Gmail inbox** (using APIs).

3. 🧠 **AI-Powered Metadata Extraction**
   - The system scans uploaded/fetched documents to extract key information such as:
     - 💳 Payment Amount
     - 🏷️ Vendor Name
     - 🗓️ Due Date
     - 🧾 Bill Type (EMI, tax, utility, etc.)

4. 🔁 **Payment Scheduling & SafePay Execution**
   - Users can trigger payments directly or schedule them based on due dates.
   - If internet connectivity is lost:
     - ✅ The **SafePay Engine** queues the payment securely.
     - 🌐 Once online, it **automatically processes** the pending payment — no user input needed.

5. 🔄 **Auto-Sync of New Bills**
   - The system periodically pulls new bills and invoices from Gmail and SMS in the background.
   - Extracted payments are automatically added to the dashboard with relevant metadata.

6. 📊 **Smart Dashboard & Visual Insights**
   - All transactions and documents are displayed in an interactive dashboard.
   - Users can filter and classify by:
     - Vendor
     - Category (e.g., Food, Travel, Utilities)
     - Status (Paid, Unpaid, Failed)
   - 🔔 Urgent bills are flagged, and monthly spending trends are visualized with charts.

7. 📄 **Reports & Exports**
   - Users can export filtered data into **PDF reports** for personal records or tax purposes.
   - Pagination ensures smooth browsing even with large data volumes.

---

## 🎯 Why PayVault.ai Matters

- 🔐 Centralizes your **financial ecosystem**
- 📲 Works even when **internet is offline**
- 📬 Syncs from Gmail/SMS — no manual input
- 📊 Shows **insights, not just data**
- 💡 Helps users **never miss a payment again**

## 🔗 Live Link

[PayVault.ai](https://payvaultai.vercel.app/)

---

## 🎥 Demo Video

 [ updating soon]

---

---
## 🧰 Tech Stack

| Layer             | Tools & Frameworks                                                                 |
|------------------|--------------------------------------------------------------------------------------|
| 🌐 Frontend       | Next.js, TypeScript, Tailwind CSS                                                   |
| 🔧 Backend        | Node.js, Express.js, TypeScript                                                     |
| 🧠 Offline Engine | IndexedDB (for SafePay queuing), AES Encryption (secure local storage & sync)       |
| ☁️ Database       | MongoDB                                                                             |
| 💳 Payment APIs   | Razorpay                                                                            |
| 📬 Email Sync     | Gmail API (for invoice fetching), OAuth2 (for secure access)                        |
| 📤 File Storage   | Cloudinary (upload & access of invoice documents, bills, etc.)                      |
| 🐳 DevOps         | Docker                                                                              |
| 🧪 Testing & Tools| Postman                                                                             |

---

## 🗂️ Project Folder Structure

```bash
payvault.ai/
├── payvault.frontend/
│   ├── public/          
│   ├── src/
│   │   ├── app/                            
│   │   │   ├── layout.tsx                
│   │   │   ├── page.tsx                     # Landing page
│   │   │   ├── dashboard/                   # Authenticated user dashboard
│   │   │   │   ├── layout.tsx         
│   │   │   │   ├── page.tsx                 # Dashboard overview
│   │   │   │   ├── payments/                # Initiate/view/queue payments
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── past-transactions/       # View historical transactions
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── analyze-bills/            # AI document understanding
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── bills/                   # Uploaded bills management
│   │   │   │   │   ├── page.tsx             # List all bills
│   │   │   │   │   └── [id]/                # View specific bill detail
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── upcoming-bills/         # Track upcoming due payments
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── notifications/          # Bill alerts & reminders
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── analytics/              # Charts, spending stats
│   │   │   │   │   └── page.tsx
│   ├── components/                   
│   │   ├── ui/                            
│   │   ├── layout/                       
│   │   └── charts/                      
│   ├── utils/                                                       
│
├── .env                                                  
├── next.config.js                          
├── tailwind.config.ts                     
└── tsconfig.json          

├── payvault.backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   └── utils/
│   ├── .env
│   ├── tsconfig.json
│   └── server.ts

├── payvault.flask/
│   ├── app/
│   ├── requirements.txt
│   ├── main.py
│   └── .env
├── README.md

```

## 🔧 Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone https://github.com/AashishKumarSingh1/PayVault.ai.git
   cd payvault.ai
   ```
2. **Build and Run the Docker Containers**
  ```bash
  docker-compose-up --build
  ```

3. **Open the Application in your Browser**
    Visit: [http:localhost:3000](http:localhost:3000)

## Contributing
We welcome contributors! To contribute:
1. Fork this repository
2. Create a new branch(```bash git checkout -b feature/your-feature ```)
3. Make your changes
4. Push your branch(```bash git push origin feature/your-feature ```)
5. Create a pull request

##  Future Enhancements
- Biometric/2FA login integration
- Mobile App version (React Native or Flutter)
- WhatsApp & Telegram bot notifications
- More API integrations (bank sync, tax filing APIs)

### In Short

PayVault.ai isn't just a payment tracker - it’s a **smart digital assistant** that understands your financial flow, works when the internet doesn't, and automates repetitive financial tasks. It ensures that:
- You stay on top of **bills, invoices, and payments**
- No transaction is missed due to **connectivity issues**
- Your **documents, reminders, and reports** are all in one place

This is financial management for the real world - **resilient, intelligent, and automated.**

## Contributors

<a href = "https://github.com/AashishKumarSingh1/PayVault.ai/graphs/contributors">
<img src = "https://contrib.rocks/image?repo=AashishKumarSingh1/PayVault.ai"/>
</a>
