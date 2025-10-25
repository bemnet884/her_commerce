import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Pagination({ totalPages, currentPage, safeSearchParams }: any) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2">
      <Button asChild variant="outline" disabled={currentPage === 1}>
        <Link href={{ pathname: "/products", query: { ...safeSearchParams, page: currentPage - 1 } }}>
          Previous
        </Link>
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button key={page} asChild variant={currentPage === page ? "default" : "outline"}>
          <Link href={{ pathname: "/products", query: { ...safeSearchParams, page } }}>{page}</Link>
        </Button>
      ))}

      <Button asChild variant="outline" disabled={currentPage === totalPages}>
        <Link href={{ pathname: "/products", query: { ...safeSearchParams, page: currentPage + 1 } }}>
          Next
        </Link>
      </Button>
    </div>
  );
}
