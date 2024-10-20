import { Workflow } from "lucide-react";
import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <Link
      href={"/"}
      className="font-bold text-3xl bg-gradient-to-r text-primary bg-clip-text hover:cursor-pointer flex flex-row place-items-center"
    >
      <Workflow className="h-6 w-6 mr-2" />
      {/* <p className="class">DevForm</p> */}
    </Link>
  );
}

export default Logo;
