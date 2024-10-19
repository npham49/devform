import React from "react";
import { getFormVersionByFormId, GetFormById } from "./actions";
import VisitBtn from "@/components/VisitBtn";
import FormLinkShare from "@/components/FormLinkShare";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FormVersion } from "@prisma/client";

async function ManagePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;
  const form = await GetFormById(Number(id));
  const versions = await getFormVersionByFormId(Number(id));
  if (!form) {
    throw new Error("form not found");
  }
  return (
    <div className="flex flex-col w-full">
      <div className="py-10 border-b border-muted">
        <div className="flex justify-between container">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>
          <VisitBtn shareUrl={form.shareURL} />
        </div>
      </div>
      <div className="py-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={form.shareURL} />
        </div>
      </div>

      <div className="container pt-10">
        <VersionsTable id={form.id} versions={versions} />
      </div>
    </div>
  );
}

async function VersionsTable({
  id,
  versions,
}: {
  id: number;
  versions: FormVersion[];
}) {
  if (!versions || versions.length === 0) {
    return <p>No versions found for this form.</p>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold my-4">Form Versions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="uppercase">Version</TableHead>
              <TableHead className="uppercase">Created At</TableHead>
              <TableHead className="uppercase">Published</TableHead>
              <TableHead className="uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((version, index) => (
              <TableRow key={version.id}>
                <TableCell>v{versions.length - index}</TableCell>
                <TableCell>
                  {formatDistance(version.createdAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  {version.published ? "Published" : "Not Published"}
                </TableCell>
                <TableCell>
                  <Link className="mr-2" href={`/manage/${id}/build/${version.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/manage/${id}/preview/${version.id}`}>
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default ManagePage;
