import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

import { ContactPreference, JobType, Role } from "../lib/enums";

const prisma = new PrismaClient();

async function main() {
  await prisma.application.deleteMany();
  await prisma.jobListing.deleteMany();
  await prisma.employerProfile.deleteMany();
  await prisma.seekerProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("password123", 12);

  const employerData = [
    {
      email: "hassan@alnoor-kirkuk.iq",
      fullName: "Hassan Kareem",
      phone: "+9647701112233",
      isVerified: true,
      companyName: "Al-Noor Barbershop",
      industry: "Beauty & grooming",
      location: "Kirkuk City Center",
      description: "Family-run barbershop serving Kirkuk for 15 years.",
      whatsapp: "9647701112233",
    },
    {
      email: "layla@turkmanfeast.iq",
      fullName: "Layla Osman",
      phone: "+9647702223344",
      isVerified: false,
      companyName: "Turkman Feast Restaurant",
      industry: "Hospitality",
      location: "Rahimawa, Kirkuk",
      description: "Traditional Kirkuk cuisine and banquets.",
      whatsapp: "9647702223344",
    },
    {
      email: "ali@safra-iq.iq",
      fullName: "Ali Mohammed",
      phone: "+9647703334455",
      isVerified: false,
      companyName: "Safra Express Delivery",
      industry: "Logistics",
      location: "Wasiti, Kirkuk",
      description: "Same-day delivery across Kirkuk governorate.",
      whatsapp: "9647703334455",
    },
  ];

  const employers = [];
  for (const e of employerData) {
    const { companyName, industry, location, description, whatsapp, ...userFields } = e;
    const user = await prisma.user.create({
      data: {
        ...userFields,
        passwordHash,
        role: Role.EMPLOYER,
        employerProfile: {
          create: {
            companyName,
            industry,
            location,
            description,
            whatsapp,
          },
        },
      },
    });
    employers.push(user);
  }

  const seekersData = [
    {
      email: "omar.khalid@example.com",
      fullName: "Omar Khalid",
      phone: "+9647501002001",
      bio: "Experienced waiter with 4 years in casual dining.",
      experienceYears: 4,
      skills: "Customer service, POS, Arabic, Kurdish",
      languages: "Arabic, Kurdish, English",
    },
    {
      email: "rebaz.sami@example.com",
      fullName: "Rebaz Sami",
      phone: "+9647501002002",
      bio: "Professional driver with clean record and local knowledge.",
      experienceYears: 8,
      skills: "Local routes, light vehicle maintenance",
      languages: "Kurdish, Arabic, Turkish",
    },
    {
      email: "sara.hussein@example.com",
      fullName: "Sara Hussein",
      phone: "+9647501002003",
      bio: "Cleaning specialist for offices and hospitality.",
      experienceYears: 3,
      skills: "Deep cleaning, team coordination",
      languages: "Arabic, Kurdish",
    },
    {
      email: "yasin.adem@example.com",
      fullName: "Yasin Adem",
      phone: "+9647501002004",
      bio: "Line cook focused on Iraqi and Turkish dishes.",
      experienceYears: 5,
      skills: "Grill, prep, HACCP basics",
      languages: "Turkish, Kurdish, Arabic",
    },
    {
      email: "dilan.arif@example.com",
      fullName: "Dilan Arif",
      phone: "+9647501002005",
      bio: "Retail and shop floor experience.",
      experienceYears: 2,
      skills: "Cash handling, stocking, customer greeting",
      languages: "Kurdish, Arabic",
    },
  ];

  for (const s of seekersData) {
    const { bio, experienceYears, skills, languages, ...userFields } = s;
    await prisma.user.create({
      data: {
        ...userFields,
        passwordHash,
        role: Role.SEEKER,
        seekerProfile: {
          create: {
            bio,
            experienceYears,
            skills,
            languages,
          },
        },
      },
    });
  }

  const jobs: Array<{
    employerIndex: number;
    title: string;
    category: string;
    description: string;
    salaryMin: number;
    salaryMax: number;
    jobType: (typeof JobType)[keyof typeof JobType];
    location: string;
    isFeatured: boolean;
    longDescription?: string | null;
    coverImageUrl?: string | null;
    galleryUrls?: string | null;
    contactPreference?: string;
  }> = [
    {
      employerIndex: 0,
      title: "Senior Barber — Men’s cuts & fades",
      category: "Barber",
      description:
        "We need an experienced barber comfortable with fades, beard shaping, and walk-in volume at our downtown Kirkuk shop.",
      salaryMin: 450,
      salaryMax: 650,
      jobType: JobType.FULL_TIME,
      location: "Kirkuk City Center",
      isFeatured: true,
    },
    {
      employerIndex: 0,
      title: "Salon Cleaner — Evenings",
      category: "Cleaner",
      description: "Keep the shop floor, tools, and waiting area spotless between appointments.",
      salaryMin: 200,
      salaryMax: 280,
      jobType: JobType.PART_TIME,
      location: "Kirkuk City Center",
      isFeatured: false,
    },
    {
      employerIndex: 1,
      title: "Restaurant Waiter (Evenings)",
      category: "Waiter",
      description: "Serve guests in a busy family restaurant. Weekend availability required.",
      salaryMin: 300,
      salaryMax: 450,
      jobType: JobType.PART_TIME,
      location: "Rahimawa, Kirkuk",
      isFeatured: true,
    },
    {
      employerIndex: 1,
      title: "Kitchen Cook — Grill & prep",
      category: "Cook",
      description: "Prepare grilled meats and mezze during peak lunch and dinner hours.",
      salaryMin: 400,
      salaryMax: 600,
      jobType: JobType.FULL_TIME,
      location: "Rahimawa, Kirkuk",
      isFeatured: false,
    },
    {
      employerIndex: 1,
      title: "Busboy / Runner",
      category: "Busboy",
      description: "Clear tables, assist waiters, maintain dining room hygiene.",
      salaryMin: 200,
      salaryMax: 280,
      jobType: JobType.PART_TIME,
      location: "Rahimawa, Kirkuk",
      isFeatured: false,
    },
    {
      employerIndex: 2,
      title: "Motorbike Delivery Driver",
      category: "Delivery Driver",
      description: "Deliver parcels across Kirkuk using company motorbike. Valid license required.",
      salaryMin: 350,
      salaryMax: 500,
      jobType: JobType.FULL_TIME,
      location: "Kirkuk & outskirts",
      isFeatured: true,
    },
    {
      employerIndex: 2,
      title: "Van Driver — Multi-stop routes",
      category: "Driver",
      description:
        "Light commercial van; loading/unloading with helper on heavy days. Start times 7:00–15:00, routes across Kirkuk.",
      longDescription:
        "We operate a small fleet of refrigerated vans for wholesale clients. You will follow a fixed multi-stop route (Wasiti → industrial belt → city center). You must hold a valid Category C license, pass a short road assessment, and be comfortable lifting up to 20kg repeatedly. Uniform and fuel card provided after probation.\n\nWeekend rotation is shared; overtime paid at 1.25× after 45 hours. Safety briefing every Monday.",
      coverImageUrl: "https://picsum.photos/seed/shughlak-van/1200/500",
      galleryUrls:
        "https://picsum.photos/seed/van-a/800/600\nhttps://picsum.photos/seed/van-b/800/600",
      contactPreference: ContactPreference.DIRECT_ONLY,
      salaryMin: 500,
      salaryMax: 700,
      jobType: JobType.FULL_TIME,
      location: "Wasiti, Kirkuk",
      isFeatured: false,
    },
    {
      employerIndex: 1,
      title: "Retail Shop Assistant",
      category: "Shop Assistant",
      description: "Assist customers, stock shelves, and handle checkout during busy hours.",
      salaryMin: 280,
      salaryMax: 380,
      jobType: JobType.FULL_TIME,
      location: "Domiz Street, Kirkuk",
      isFeatured: false,
    },
    {
      employerIndex: 2,
      title: "Night Security — Depot gate",
      category: "Security Guard",
      description: "Monitor gate access and patrol our distribution yard on night shifts.",
      salaryMin: 320,
      salaryMax: 400,
      jobType: JobType.PART_TIME,
      location: "Industrial zone, Kirkuk",
      isFeatured: false,
    },
    {
      employerIndex: 1,
      title: "Butcher — Fresh meat counter",
      category: "Butcher",
      description: "Cut and display meats at our market counter; knowledge of halal cuts is a plus.",
      salaryMin: 320,
      salaryMax: 420,
      jobType: JobType.FULL_TIME,
      location: "Domiz Street, Kirkuk",
      isFeatured: false,
    },
  ];

  for (const j of jobs) {
    const employer = employers[j.employerIndex];
    await prisma.jobListing.create({
      data: {
        employerId: employer.id,
        title: j.title,
        category: j.category,
        description: j.description,
        longDescription: j.longDescription ?? null,
        coverImageUrl: j.coverImageUrl ?? null,
        galleryUrls: j.galleryUrls ?? null,
        contactPreference: j.contactPreference ?? ContactPreference.BOTH,
        salaryMin: j.salaryMin,
        salaryMax: j.salaryMax,
        currency: "USD",
        jobType: j.jobType,
        location: j.location,
        isActive: true,
        isFeatured: j.isFeatured,
      },
    });
  }

  console.log("Seed complete: 3 employers, 5 seekers, 10 jobs.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
