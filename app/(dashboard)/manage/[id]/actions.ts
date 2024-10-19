"use server";
import { currentUser } from "@clerk/nextjs";
import prisma from "@/lib/prisma";

export async function getFormVersionByFormId(formId: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const versions = await prisma.formVersion.findMany({
    where: { formId, userId: user.id },
    orderBy: { version: "desc" },
  });

  return versions;
}

export async function GetFormById(formId: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const form = await prisma.form.findUnique({
    where: { id: formId, userId: user.id },
  });

  return form;
}
