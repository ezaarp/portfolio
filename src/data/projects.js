import lmsImg from '../assets/lms-laboratory.png';
import foodImg from '../assets/food-delivery.png';
import secureAuditImg from '../assets/secure-audit.png';
import cryptoImg from '../assets/crypto-live-market.png';
import wecareuImg from '../assets/wecareu.png';

export const projects = [
    {
        id: 1,
        title: "Field Rental Web",
        description: "A comprehensive booking platform for sports venues. Features real-time availability checking, booking management, and admin dashboard for field owners. Built as a team project for university coursework.",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop",
        technologies: ["Laravel", "Blade", "PHP", "MySQL"],
        githubUrl: "https://github.com/ezaarp/WEB-SEWA-LAPANGAN_TIM-TUBES-5_SI4701",
        liveUrl: "",
        category: "Full Stack"
    },
    {
        id: 2,
        title: "WeCareU",
        description: "Integrated healthcare platform designed to streamline patient care, appointment scheduling, and health monitoring. Focuses on accessibility and user-friendly medical data management.",
        image: wecareuImg,
        technologies: ["TypeScript", "React", "Tailwind CSS", "Node.js"],
        githubUrl: "https://github.com/ezaarp/WeCareU",
        liveUrl: "https://wecareu.pages.dev/",
        category: "Full Stack"
    },
    {
        id: 3,
        title: "Laboratory LMS",
        description: "Developed for the EISD Hackathon, this Learning Management System optimizes laboratory resource usage, assignment tracking, and student-instructor collaboration.",
        image: lmsImg,
        technologies: ["TypeScript", "React", "Vite", "Supabase"],
        githubUrl: "https://github.com/ezaarp/EISD-Hackathon",
        liveUrl: "",
        category: "Full Stack"
    },
    {
        id: 4,
        title: "WaterQuality-EDMG6",
        description: "Data analysis project focusing on Exploratory Data Mining for Water Quality assessment. Includes data cleaning, visualization, and pattern recognition for quality indicators.",
        image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=800&auto=format&fit=crop",
        technologies: ["Python", "Jupyter", "Pandas", "Scikit-learn"],
        githubUrl: "https://github.com/ezaarp/WaterQuality-EDMG6",
        liveUrl: "",
        category: "Data Science"
    },
    {
        id: 5,
        title: "Crypto Live Market",
        description: "Real-time cryptocurrency market tracker utilizing the CoinGecko API. Provides live price updates, market trends, and basic analytical charts for crypto assets.",
        image: cryptoImg,
        technologies: ["JavaScript", "HTML", "CSS", "CoinGecko API"],
        githubUrl: "https://github.com/ezaarp/web-crypto-live-market",
        liveUrl: "",
        category: "Frontend"
    },
    {
        id: 6,
        title: "Credit Risk Analysis",
        description: "Predictive model for credit risk analysis. Uses machine learning algorithms to assess borrower risk profiles and predict potential defaults based on historical data.",
        image: "https://plus.unsplash.com/premium_photo-1681487767138-ddf2d67b35c1?w=800&auto=format&fit=crop",
        technologies: ["Python", "Jupyter Notebook", "Machine Learning"],
        githubUrl: "https://github.com/ezaarp/prediksi-analisis-resiko-kredit",
        liveUrl: "",
        category: "Data Science"
    },
    {
        id: 7,
        title: "Food Delivery Web",
        description: "A web-based food delivery service interface. Features menu browsing, cart management, and order placement flows. Created for the 'tubes-iae' coursework.",
        image: foodImg,
        technologies: ["HTML", "CSS", "JavaScript"],
        githubUrl: "https://github.com/ezaarp/tubes-iae",
        liveUrl: "",
        category: "Frontend"
    },
    {
        id: 8,
        title: "SecureAudit",
        description: "A security tool designed to scan repositories for vulnerable code patterns. Features a React frontend for visualization and a Flask backend for analysis logic. (Private Repository)",
        image: secureAuditImg,
        technologies: ["React", "Flask", "Python", "Security"],
        githubUrl: "",
        liveUrl: "",
        category: "Security"
    }
];
