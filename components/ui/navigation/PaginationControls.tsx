import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../pagination";

export default function PaginationControls({ searchParams }: { searchParams: { currentPage: number; totalPages: number, filters?: {category?: string, transmission: string}  } }) {
    const { currentPage, totalPages, filters } = searchParams;

    return (
        <>
            <Pagination className="pt-8 text-zinc-200">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href={`?category=${filters?.category}&transmission=${filters?.transmission}&page=${currentPage - 1}`}
                            className={`hover:text-zinc-900 hover:bg-red-600 ${
                                currentPage === 1 ? "hidden disabled" : ""
                            }`}
                        />
                    </PaginationItem>
                    {currentPage > 2 && (
                        <PaginationItem>
                            <PaginationLink
                                href={`?category=${filters?.category}&transmission=${filters?.transmission}&page=1`}
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
                                href={`?category=${filters?.category}&transmission=${filters?.transmission}&page=${currentPage - 1}`}
                                className="hover:text-zinc-900 hover:bg-red-600"
                            >
                                {currentPage - 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    <PaginationItem className="">
                        <PaginationLink
                            href={`?category=${filters?.category}&transmission=${filters?.transmission}&page=${currentPage}`}
                            className="hover:text-zinc-900 hover:bg-red-600 border border-red-600 rounded-sm"
                        >
                            {currentPage}
                        </PaginationLink>
                    </PaginationItem>

                    {currentPage < totalPages && (
                        <PaginationItem>
                            <PaginationLink
                                href={`?category=${filters?.category}&transmission=${filters?.transmission}&page=${currentPage + 1}`}
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
                                href={`?category=${filters?.category}&transmission=${filters?.transmission}&page=${totalPages}`}
                                className="hover:text-zinc-900 hover:bg-red-600 active:border-red-600 active:rounded-sm"
                            >
                                {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    <PaginationItem>
                        <PaginationNext
                            href={`?category=${filters?.category}&transmission=${filters?.transmission}&page=${currentPage + 1}`}
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