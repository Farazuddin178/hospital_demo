// Central content/config used to render navigation, footer, and specialty pages.
import {
  Ambulance,
  Baby,
  Bone,
  Brain,
  Droplet,
  Dumbbell,
  Ear,
  HeartPulse,
  Hospital,
  PersonStanding,
  Salad,
  Scissors,
  ShieldPlus,
  Siren,
  Smile,
  Sparkles,
  Stethoscope,
  Syringe,
  Users,
  Utensils,
  Wind,
  BedDouble,
  type LucideIcon,
} from "lucide-react";

export const siteConfig = {
  name: "Oxygen Hospital",
  tagline: "Your Health, Our Priority",
  url: "https://www.oxygenhospital.example",
  phonePrimary: "+91 9100-100812",
  phoneSecondary: "+91 9100-500812",
  emailAdmin: "admin@oxygenhospital.example",
  emailSupport: "patient-support@oxygenhospital.example",
  address: "8-4-120/4, Example Road, Hyderabad, Telangana, IN",
  hours: "Open 24/7 · All Week Days",
  social: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
    instagram: "https://instagram.com",
  },
};

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Specialties", href: "/specialties" },
  { label: "Services", href: "/services" },
  { label: "Contact Us", href: "/contact" },
];

export type Specialty = {
  slug: string;
  name: string;
  Icon: LucideIcon;
  summary: string;
  description: string;
};

export const specialties: Specialty[] = [
  { slug: "trauma-care", name: "Trauma Care", Icon: Siren, summary: "Expert treatment for traumatic injuries.", description: "Our trauma care unit provides round-the-clock emergency response for accident and injury victims, backed by rapid-response surgical teams and a dedicated trauma ICU." },
  { slug: "general-medicine", name: "General Medicine", Icon: Stethoscope, summary: "Comprehensive medical care for various illnesses.", description: "Our general medicine physicians diagnose and manage a wide range of acute and chronic conditions, coordinating with specialists when advanced care is needed." },
  { slug: "general-surgery", name: "General Surgery", Icon: Scissors, summary: "A wide range of surgical procedures.", description: "From minimally invasive laparoscopic procedures to complex operations, our surgical team combines modern technique with meticulous post-operative care." },
  { slug: "gynecology-obstetrics", name: "Gynecology & Obstetrics", Icon: Baby, summary: "Specialized care for women's health.", description: "Comprehensive women's health services covering prenatal care, delivery, and gynecological treatment in a compassionate, private setting." },
  { slug: "pediatrics", name: "Pediatrics", Icon: PersonStanding, summary: "Expert care for infants, children, and adolescents.", description: "Our pediatric team supports children from birth through adolescence with preventive checkups, vaccinations, and treatment of childhood illnesses." },
  { slug: "orthopedics", name: "Orthopedics", Icon: Bone, summary: "Treatment for musculoskeletal disorders and injuries.", description: "Specialists in bone, joint, and muscle care, offering both non-surgical treatment and advanced joint replacement surgery." },
  { slug: "anesthesia-intensive-care", name: "Anesthesia & Intensive Care", Icon: Syringe, summary: "Advanced critical care services.", description: "Our anesthesiology and intensive care teams ensure patient safety through surgery and provide 24/7 critical care monitoring." },
  { slug: "pulmonology", name: "Pulmonology", Icon: Wind, summary: "Diagnosis and treatment of lung diseases.", description: "Diagnosis and management of asthma, COPD, and other respiratory conditions using modern pulmonary function testing." },
  { slug: "gastroenterology", name: "Gastroenterology", Icon: Utensils, summary: "Care for digestive disorders.", description: "Comprehensive evaluation and treatment of digestive system disorders, including endoscopic procedures." },
  { slug: "cardiology", name: "Cardiology", Icon: HeartPulse, summary: "Comprehensive heart care and diagnostics.", description: "Our cardiology department offers diagnostic testing, preventive cardiology, and treatment for a full range of heart conditions." },
  { slug: "diabetology", name: "Diabetology", Icon: Droplet, summary: "Specialized diabetes management.", description: "Personalized diabetes management plans combining medication, nutrition guidance, and ongoing monitoring." },
  { slug: "neurology", name: "Neurology", Icon: Brain, summary: "Diagnosis and treatment of nervous system disorders.", description: "Expert evaluation and treatment for conditions affecting the brain, spine, and nervous system." },
  { slug: "dermatology", name: "Dermatology", Icon: Sparkles, summary: "Skin, hair, and nail care.", description: "Medical and cosmetic dermatology services for patients of all ages." },
  { slug: "ent", name: "ENT", Icon: Ear, summary: "Ear, nose, and throat treatment.", description: "Comprehensive care for ear, nose, and throat conditions, from routine checkups to surgical intervention." },
  { slug: "psychiatry", name: "Psychiatry", Icon: Smile, summary: "Mental health diagnosis and treatment.", description: "Confidential, compassionate mental health care including counseling and medication management." },
  { slug: "physiotherapy", name: "Physiotherapy", Icon: Dumbbell, summary: "Rehabilitation and physical therapy.", description: "Customized rehabilitation programs to restore mobility and manage pain after injury or surgery." },
  { slug: "dietetics", name: "Dietetics", Icon: Salad, summary: "Nutrition counseling and planning.", description: "Personalized nutrition plans developed with registered dietitians to support recovery and long-term health." },
];

export type Service = {
  name: string;
  description: string;
  Icon: LucideIcon;
  image: string;
};

export const services: Service[] = [
  {
    name: "Emergency Care",
    description: "24/7 emergency services for urgent medical needs.",
    Icon: Ambulance,
    image: "article-emergency",
  },
  {
    name: "Outpatient Services",
    description: "Comprehensive outpatient consultations for various specialties.",
    Icon: Hospital,
    image: "article-recovery",
  },
  {
    name: "Inpatient Services",
    description: "Advanced inpatient care facilities for complex medical conditions.",
    Icon: BedDouble,
    image: "article-team",
  },
];

export const values = [
  { name: "Patient-Centric Care", description: "Placing patient needs at the heart of everything we do.", Icon: HeartPulse },
  { name: "Ethical Practice", description: "Adhering to the highest ethical standards in medical practice.", Icon: ShieldPlus },
  { name: "Innovation", description: "Embracing cutting-edge medical advancements.", Icon: Sparkles },
  { name: "Teamwork", description: "Fostering a collaborative and supportive work environment.", Icon: Users },
  { name: "Compassion", description: "Treating every patient with kindness and empathy.", Icon: HeartPulse },
];
