import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { ContactPreference, Role } from "@/lib/enums";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, ctx: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== Role.SEEKER) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: jobId } = await ctx.params;

  const job = await prisma.jobListing.findFirst({
    where: { id: jobId, isActive: true },
  });
  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (job.contactPreference === ContactPreference.DIRECT_ONLY) {
    return NextResponse.json(
      { error: "This listing accepts contact only (call / WhatsApp)." },
      { status: 403 }
    );
  }

  await prisma.application.upsert({
    where: {
      jobId_seekerId: {
        jobId,
        seekerId: session.user.id,
      },
    },
    update: {},
    create: {
      jobId,
      seekerId: session.user.id,
      status: "PENDING",
    },
  });

  return NextResponse.json({ ok: true });
}
