import { GetVersionByIdAndFormId } from "@/actions/form";
import FormBuilder from "@/components/FormBuilder";
import React from "react";

async function BuilderPage({
  params,
}: {
  params: {
    id: string;
    versionId: string;
  };
}) {
  const { id, versionId } = params;
  const version = await GetVersionByIdAndFormId(Number(id), versionId);
  if (!version) {
    throw new Error("version not found");
  }
  return <FormBuilder version={version} />;
}

export default BuilderPage;
