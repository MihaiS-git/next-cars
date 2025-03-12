import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../pagination";

export default async function PaginationControls({ searchParams }: { searchParams: { currentPage: number; totalPages: number } }) {
    const params = await searchParams;
    const { currentPage, totalPages } = params;

    return (
        <>
            <Pagination className="pt-8 text-zinc-200">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href={`?page=${currentPage - 1}`}
                            className={`hover:text-zinc-900 hover:bg-red-600 ${
                                currentPage === 1 ? "hidden disabled" : ""
                            }`}
                        />
                    </PaginationItem>
                    {currentPage > 2 && (
                        <PaginationItem>
                            <PaginationLink
                                href="?page=1"
                                className="hover:text-zinc-900 hover:bg-red-600 active:border-red-600 active:rounded-sm"
                            >
                                1
                            </PaginationLink>
                        </PaginationItem>
                    )}
                    {currentPage > 3 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}
                    {currentPage > 1 && (
                        <PaginationItem>
                            <PaginationLink
                                href={`?page=${currentPage - 1}`}
                                className="hover:text-zinc-900 hover:bg-red-600"
                            >
                                {currentPage - 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    <PaginationItem className="">
                        <PaginationLink
                            href={`?page=${currentPage}`}
                            className="hover:text-zinc-900 hover:bg-red-600 border border-red-600 rounded-sm"
                        >
                            {currentPage}
                        </PaginationLink>
                    </PaginationItem>

                    {currentPage < totalPages && (
                        <PaginationItem>
                            <PaginationLink
                                href={`?page=${currentPage + 1}`}
                                className="hover:text-zinc-900 hover:bg-red-600"
                            >
                                {currentPage + 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    {currentPage < totalPages - 2 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    {currentPage < totalPages - 1 && (
                        <PaginationItem className="">
                            <PaginationLink
                                href={`?page=${totalPages}`}
                                className="hover:text-zinc-900 hover:bg-red-600 active:border-red-600 active:rounded-sm"
                            >
                                {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    <PaginationItem>
                        <PaginationNext
                            href={`?page=${currentPage + 1}`}
                            className={`hover:text-zinc-900 hover:bg-red-600 ${
                                currentPage === totalPages
                                    ? "hidden disabled"
                                    : ""
                            }`}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    );
}
