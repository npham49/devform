"use server";

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";
import { currentUser } from "@clerk/nextjs/server";

class UserNotFoundErr extends Error { }

export async function GetFormVersionByFormId(formId: number) {
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

export async function GetFormStats() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.submissions || 0;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}

export async function CreateForm(data: formSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("form not valid");
  }

  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const { name, description } = data;

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const form = await prisma.form.create({
        data: {
          userId: user.id,
          name,
          description,
        },
      });

      if (!form) {
        throw new Error("Failed to create form");
      }

      const formVersion = await prisma.formVersion.create({
        data: {
          formId: form.id,
          userId: user.id,
          changes: "Form created",
        },
      });

      if (!formVersion) {
        throw new Error("Failed to create form version");
      }

      return { formId: form.id, versionId: formVersion.id };
    });

    return result;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw new Error("Failed to create form and initial version");
  }
}

export async function GetForms() {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function GetVersionByIdAndFormId(formId: number, versionId: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.formVersion.findUnique({
    where: {
      userId: user.id,
      id: versionId,
      formId,
    },
    include: {
      form: true,
    }
  });
}

export async function UpdateVersionContent(versionId: string, jsonContent: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.formVersion.update({
    where: {
      userId: user.id,
      id: versionId,
    },
    data: {
      content: jsonContent,
    },
  });
}

export async function PublishVersion(versionId: string) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.formVersion.update({
    data: {
      published: true,
    },
    where: {
      userId: user.id,
      id: versionId,
    },
  });
}

export async function GetFormContentByUrl(formUrl: string) {
  return await prisma.form.update({
    select: {
      content: true,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
    where: {
      shareURL: formUrl,
    },
  });
}

export async function SubmitForm(formUrl: string, content: string) {
  return await prisma.form.update({
    data: {
      submissions: {
        increment: 1,
      },
      FormSubmissions: {
        create: {
          content,
        },
      },
    },
    where: {
      shareURL: formUrl,
      published: true,
    },
  });
}

export async function GetFormWithSubmissions(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.findUnique({
    where: {
      userId: user.id,
      id,
    },
    include: {
      FormSubmissions: true,
    },
  });
}
