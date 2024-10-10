"use server";

import prisma from "@/lib/prisma";

export async function getFormVersionByFormId(formId: number) {
  const versions = await prisma.formVersion.findMany({
    where: { formId },
    orderBy: { version: "desc" },
  });

  return versions;
}
