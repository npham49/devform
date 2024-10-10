import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <Link
      href={"/"}
      className="font-bold text-3xl bg-gradient-to-r text-primary bg-clip-text hover:cursor-pointer"
    >
      DevForm
    </Link>
  );
}

export default Logo;
