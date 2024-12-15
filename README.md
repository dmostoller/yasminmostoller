# Yasmin Mostoller Portfolio

A professional portfolio website for artist Yasmin Mostoller, showcasing her artwork and
professional journey. Built with modern web technologies and featuring a responsive design.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Database**: [Postgresql](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Text Editor**: TinyMCE
- **Media Management**: Cloudinary
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Forms**: Formik + Yup
- **UI Components**: Custom components with Lucide React icons
- **Analytics**: Vercel Analytics & Speed Insights
- **Animation**: Framer Motion

## ✨ Key Features

- Responsive image gallery
- Contact form with EmailJS integration
- Admin dashboard with content management
- Social media integration
- SEO optimization with Next.js metadata
- Image optimization with next/image
- Cloudinary video integration
- Dark/light mode support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

## 🔧 Environment Variables

Required environment variables grouped by function:

### Authentication
NEXTAUTH_URL         
NEXTAUTH_SECRET    
GOOGLE_CLIENT_ID     
GOOGLE_CLIENT_SECRET  

### Database
DATABASE_URL         
DIRECT_URL  
NEXT_PUBLIC_API_URL

### API Keys

NEXT_PUBLIC_TINY_API_KEY        
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 
EMAILJS_SERVICE_ID 
EMAILJS_TEMPLATE_ID 
EMAILJS_PUBLIC_KEY

# Instagram Integration
INSTAGRAM_APP_ID              
INSTAGRAM_APP_SECRET         

## 📦 Main Dependencies

@prisma/client - Database ORM 
@tanstack/react-query - Server state management 
next-auth - Authentication 
next-cloudinary - Media management 
framer-motion - Animations 
react-hot-toast - Toast notifications
swiper - Image carousel 
formik & yup - Form handling and validation
