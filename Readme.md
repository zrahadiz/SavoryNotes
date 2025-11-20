# 🍳 SavoryNotes

SavoryNotes is a modern, full-stack food recipes blog that allows users to discover and share their favorite recipes with an intelligent AI cooking assistant powered by Google's Gemini AI.

## 📋 Project Overview

This Recipe Sharing Platform is a comprehensive web application designed for food enthusiasts who want to discover, create, and share recipes within a vibrant community. It features a modern, intuitive interface for seamless discovery, robust search and filtering capabilities, and complete user authentication. Our core differentiator is the integrated AI Chef Bot—an intelligent assistant ready to answer any cooking question, from suggesting ingredient substitutions and providing precise nutritional counts to offering step-by-step cooking tips. This platform makes personalized, successful cooking accessible to everyone.

### Key Highlights

- 🔐 Secure user authentication with role-based access control
- 📝 Admin can create, edit, and delete recipes
- 🔍 Advanced search with category and difficulty filters
- 🤖 AI-powered cooking assistant using Google Gemini
- 📱 Fully responsive design for mobile and desktop
- 🖼️ Multiple image support with image carousel
- 🏷️ Tag-based recipe organization
- ⏱️ Pagination for optimal performance
- 👥 "Admin panel for managing user registration requests (approve/reject)

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Gemini API Key
- npm or yarn package manager

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/zrahadiz/SavoryNotes.git
cd SavoryNotes
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following configuration:

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongo_uri
# Or use MongoDB Atlas:
# MONGODB_URI=mongo_atlas_uri

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
REFRESH_TOKEN_SECRET=your_super_secret_jwt_refresh_key_here_change_in_production

# Reset Password Token
RESET_TOKEN_EXPIRES_MIN=60

# Google Gemini AI
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here

# Client URL
FRONTEND_URL=http://localhost:5173

# Cloudinary (Optional - for image uploads)
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# Resend Mail API
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
```

---

### 🚀 Start the Backend Server

```bash
npm run dev
```

The backend server will run on `http://localhost:5000` (or your configured PORT).

## 📧 Email Configuration

### ⚠️ Current Status

Email functionality in the **deployed version** is currently unavailable due to pending domain verification with Resend.

---

### 🧪 Testing Locally

You can test email features in your local environment:

#### Prerequisites:

1. **Sign up** for a free account at [resend.com](https://resend.com)
2. **Get your API key** from the Resend dashboard

#### Setup:

Add these to your `.env` file:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
```

#### 📌 Important Limitations:

- Emails can **only be sent to email addresses** you've added to your Resend account
- To add test recipients:
  1. Go to Resend Dashboard → **Settings** → **Team**
  2. Invite the email addresses you want to test with
- The sender will show as `onboarding@resend.dev` (Resend's test domain)

---

### 🚀 Production Deployment

Once domain verification is complete, emails will be sent from `noreply@savorynotes.biz.id` and can reach any recipient.

**Status:** ⏳ Pending DNS verification

---

#### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

#### 4. Access the Application

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 🛠️ Technology Stack

### Frontend

- **React** 19.2
- **React Router DOM** - Client-side routing
- **Zustand** - State Management Library
- **Tailwind CSS** - Utility-first CSS framework
- **Daisy UI** - UI Component Library
- **React Icons** - Icon library (HeroIcons)
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **Google Generative AI (Gemini)** - AI chatbot integration
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **Cloudinary** - File Cloud Storage

### Additional Tools

- **Multer** - File upload handling
- **Slugify** - URL-friendly slug generation
- **Express Validator** - Request validation

---

## 📁 File/Folder Structure

```
SavoryNotes/
├── backend/
│   ├── config/
│   │   ├── db.js                # MongoDB connection
│   │   └── cloudinary.js        # Cloudinary configuration
│   ├── controllers/
│   │   ├── ai.controller.js     # AI (Chef Bot, Generate Description and Tags) logic
│   │   ├── auth.contoller.js    # Authentication logic
│   │   ├── post.controller.js   # Recipe CRUD operations
│   │   └── users.controller.js  # Users approval logic
│   ├── middlewares/
│   │   ├── authorization.js     # JWT authentication
│   │   └── uploadImage.js       # Upload image to cloudinary
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Post.js              # Recipe schema
│   ├── routes/
│   │   ├── ai.routes.js         # AI endpoints
│   │   ├── auth.routes.js       # Auth endpoints
│   │   ├── post.toutes.js       # Recipe endpoints
│   │   └── users.routes.js      # User endpoints
│   ├── utils/
│   │   ├── formatResponse.js    # Standardized API responses
│   │   ├── generateToken.js     # generate reset token
│   │   ├── jwt.js               # generate JWT token
│   │   ├── sendMail.js          # email setup
│   │   ├── password.js          # pass hash and compare helper
│   │   └── slugify.js           # Slug generation
│   ├── .env                     # Environment variables
│   ├── .env.example             # Environment template
│   ├── index.js                # Express app setup
│   ├── package-lock.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js         # Axios configuration
│   │   ├── assets/              # Images and static files
│   │   ├── components/          # Reusable UI components
│   │   ├── lib/
│   │   │   └── toast.js         # Toast notifications
│   │   ├── pages/               # Application pages
│   │   ├── store/               # Global state management files
│   │   │   └── authStore.js     # Handles authentication-related state, including user data, login status, and auth actions.
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── .env                     # Environment variables
│   ├── .env.example             # Environment template
│   ├── vite.config.js           # Vite configuration
│   ├── package-lock.json
│   └── package.json
│
└── README.md
```

---

## 🔌 API Routes Summary

### AI Routes

```
POST   /api/ai/generate-desc     # Generate an AI-recommended description based on recipe title
POST   /api/ai/generate-tags     # Generate AI-recommended tags based on recipe title, ingredients, and instruction
POST   /api/ai/chatBot           # Chat with AI about recipe
```

### Authentication Routes

```
POST   /api/auth/register          # Register a new user
POST   /api/auth/login             # User login
POST   /api/auth/logout            # User logout
POST   /api/auth/refresh           # Refresh access token
POST   /api/auth/forgot-password   # Send password reset link
POST   /api/auth/reset-password    # Reset user password
GET    /api/auth/me                # Get authenticated user info (Protected)
GET    /api/auth/check             # Check authentication status
```

### Recipe/Post Routes

```
POST   /api/posts/                 # Create a new post (Admin, Protected, with images)
GET    /api/posts/                 # Get all posts
GET    /api/posts/:slug            # Get a single post by slug
PUT    /api/posts/:slug            # Update a post by slug (Admin, Protected, with images)
DELETE /api/posts/:slug            # Delete a post by slug (Admin, Protected)
```

### User Management Routes (Admin)

```
GET    /api/users/pending       # Get list of pending user registration requests (Admin, Protected)
POST   /api/users/approve       # Approve a pending user (Admin, Protected)
```

## ✨ Features Implemented

### Auth Features

- ✅ User registration with email validation
- ✅ User forgot and reset password
- ✅ Secure login with JWT authentication

### Recipe Management

- ✅ Create recipes with multiple images (Admin)
- ✅ Edit and delete recipes (Admin)
- ✅ Rich recipe details (ingredients, instructions, prep/cook time)
- ✅ Category and difficulty level classification
- ✅ Tag-based organization
- ✅ SEO-friendly URL slugs
- ✅ Image carousel for multiple recipe photos

### Search & Discovery

- ✅ Advanced search functionality (Title, Description, and Tags)
- ✅ Filter by category (breakfast, lunch, dinner, dessert, etc.)
- ✅ Filter by difficulty level (easy, medium, hard)
- ✅ Pagination for better performance
- ✅ Real-time search with debouncing

### Admin Panel

- ✅ Pending user approval system
- ✅ User management for Admin (view, approve, reject)
- ✅ Paginated user list
- ✅ Search users by name/email

### UI/UX

- ✅ Fully responsive design
- ✅ Modern, clean interface with Tailwind CSS
- ✅ Smooth animations and transitions
- ✅ Loading states and error handling
- ✅ Toast notifications for user feedback
- ✅ Mobile-optimized navigation

### AI Integration

- ✅ AI Smart Description and Tags Generation
- ✅ AI cooking assistant chatbot
- ✅ Recipe-specific context awareness
- ✅ Ingredient substitution suggestions
- ✅ Cooking technique explanations
- ✅ Timing and temperature guidance

---

## 🎁 Bonus Features / Future Improvements

### Implemented Bonus Features

- 🤖 **AI Cooking Assistant** - Integrated Google Gemini AI for recipe Q&A
- 📱 **Progressive Web App (PWA)** Ready - Optimized for mobile installation
- 🎨 **Advanced UI Design** - Modern gradient designs and micro-interactions
- 📊 **Admin User Managements** - User management and approval workflow

### Future Improvements

- [ ] Recipe rating and review system
- [ ] User favorites and bookmarks
- [ ] RAG-based recipe suggestions (Based on User favorites, bookmarks, and history)
- [ ] Social features (follow users, like recipes)
- [ ] Meal planning calendar
- [ ] Nutrition information calculator
- [ ] Recipe scaling (adjust servings)
- [ ] Video recipe support
- [ ] Multi-language support

---

# 🤖 LLM Integration Explanation

This project integrates **Google Gemini 2.5 Flash** to power several intelligent recipe features, including:

1. **Recipe Description Generator**
2. **Recipe Tag Generator**
3. **Cooking Assistant Chatbot**

All AI logic is implemented in
**Location**: `backend/controllers/ai.controller.js`

# 🍽️ 1. Recipe Description Generator

### **Endpoint**

POST /api/ai/generate-desc

### **Purpose**

Generates a **short, appealing recipe description** based on the recipe title.

### **How It Works**

- Accepts a request body containing:
  ```json
  { "title": "Recipe Title" }
  Sends a prompt to Gemini to create a max 250-character appetizing description.
  ```

Returns AI-generated text as the description.

### **Example Prompt**

Create a short, appetizing description (max 250 characters) for this recipe: Chicken Curry

### **Example Output**

A rich, aromatic chicken curry simmered with warm spices and a creamy sauce.

# 🏷️ 2. Recipe Tag Generator

### **Endpoint**

POST /api/ai/generate-tags

### **Purpose**

Generates exactly 5 relevant tags based on the recipe's title, ingredients, and content.

### **How It Works**

Requires the following body:

- Accepts a request body containing:

  ```json
  {
    "title": "Recipe Title",
    "ingredients": ["item 1", "item 2"],
    "content": "Full recipe instructions..."
  }
  ```

Instructs Gemini to return tags as a:

- comma-separated list
- lowercase
- no numbering
- no explanation

Converts the string to an array before returning it.

### **Example Prompt**

Suggest exactly 5 relevant tags for this recipe.
Return ONLY comma-separated lowercase tags.

Title: Spaghetti Bolognese
Ingredients: beef, tomato, garlic
Content: simmer until thick and flavorful

### **Example Output**

italian, pasta, dinner, savory, comfort food

→ Returned as:

```json
["italian", "pasta", "dinner", "savory", "comfort food"]
```

# 💬 3. Cooking Assistant Chatbot

### **Endpoint**

POST /api/ai/chatBot

**How It Works**:

1. **Context Injection**: The chatbot receives the full recipe context including title, ingredients, instructions, cooking times, and tags
2. **Conversation History**: Maintains last 6 messages for context-aware responses
3. **Optimized Prompts**: Recipe context is condensed to avoid token limits
4. **Structured Responses**: AI is instructed to provide concise, helpful answers (2-3 paragraphs)

**Configuration**:

```javascript
generationConfig: {
  maxOutputTokens: 500,    // Limit response length
  temperature: 0.7,        // Balance between creativity and consistency
}
```

**Features**:

- Recipe Q&A
- Ingredient substitution suggestions
- Cooking technique explanations
- Timing and temperature guidance
- Dietary modification suggestions (vegan, gluten-free, etc.)
- Troubleshooting cooking issues

**Token Optimization Strategies**:

- Keep only recent message history (6 messages)

**API Key Setup**:
Get your free Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey) and add it to your `.env` file.

---

## 🌐 Deployed Demo Link

### Live Application

🔗 **Frontend**: [https://savorynotes.pages.dev/](https://savorynotes.pages.dev/)  
🔗 **Backend API**: [ttps://savorynotes-production.up.railway.app](https://savorynotes-production.up.railway.app)

### Test Credentials

```
Admin Account:
Email: test@admin.com
Password: 12345678
```

---

## 👨‍💻 Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production

**Backend**:

```bash
cd backend
npm run build
npm start
```

**Frontend**:

```bash
cd frontend
npm run build
# Output will be in the 'dist' folder
```

---

## 📧 Contact

**Rahadi Fauzan** - rahadifauzan7@gmail.com

Project Link: [https://github.com/zrahadiz/SavoryNotes.git](https://github.com/zrahadiz/SavoryNotes.git)

---

<div align="center">
  <p>Made with ❤️ and 🍕</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
