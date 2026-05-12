import { hash } from "bcryptjs";
import { Role } from "@/lib/enums";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (data.role === Role.EMPLOYER && !data.companyName?.trim()) {
    return NextResponse.json(
      { error: "Company name is required for employers" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  const passwordHash = await hash(data.password, 12);

  if (data.role === Role.EMPLOYER) {
    await prisma.user.create({
      data: {
        email: data.email.trim().toLowerCase(),
        passwordHash,
        fullName: data.fullName.trim(),
        phone: data.phone?.trim() || null,
        role: Role.EMPLOYER,
        employerProfile: {
          create: {
            companyName: data.companyName!.trim(),
            whatsapp: data.whatsapp?.trim() || null,
            location: "Kirkuk",
          },
        },
      },
    });
  } else {
    await prisma.user.create({
      data: {
        email: data.email.trim().toLowerCase(),
        passwordHash,
        fullName: data.fullName.trim(),
        phone: data.phone?.trim() || null,
        role: Role.SEEKER,
        seekerProfile: {
          create: {
            skills: "—",
            languages: "—",
            experienceYears: 0,
          },
        },
      },
    });
  }

  return NextResponse.json({ ok: true });
}
