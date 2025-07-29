"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, FileWarningIcon, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import type { getShowsAggregated } from "@/lib/queries"
import Link from "next/link"
import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"
import { ModalEditMovie } from "@/components/modal-edit-movie"
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export const TABLE_IDS = {
  CINEMAS: "17361",
  MOVIES: "17366",
  SHOWS: "17373",
}

export const PROJECT_ID = "ixrirhfbmbmmlsvhnccf"

export type Data = NonNullable<
  Awaited<ReturnType<typeof getShowsAggregated>>
>[number] & { errors: number }

export const columns: ColumnDef<Data>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "movie_id",
    header: "Id",
    cell: ({ row }) => (
      <div className="capitalize text-gray-400 tabular-nums">
        {row.getValue("movie_id")}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Titre
          <ArrowUpDown />
        </Button>
      )
    },
  },
  {
    accessorKey: "duration",
    header: () => <div className="text-right">Durée du film</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("duration") ? (
            row.getValue("duration")
          ) : (
            <FileWarningIcon />
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "shows",
    header: () => <div className="text-center">Nb séances</div>,
    cell: ({ row }) => {
      const numberOfShows = row.getValue<unknown[]>("shows")?.length || 0

      return (
        <div className="text-right font-medium text-gray-600">
          {numberOfShows}
        </div>
      )
    },
  },
  {
    accessorKey: "errors",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Erreurs
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      const errors = row.getValue<number>("errors")

      return (
        <div
          className={cn(
            "justify-center gap-2 flex items-center font-medium rounded-full py-1 px-2 mx-auto w-min",
            errors === 0 &&
              "text-green-700 bg-green-100/80 dark:text-green-500 dark:bg-green-800/80",
            errors === 1 &&
              "text-amber-700 bg-amber-100/80 dark:text-amber-500 dark:bg-amber-800/80",
            errors === 2 &&
              "text-orange-700 bg-orange-100/80 dark:text-orange-500 dark:bg-orange-800/80",
            errors === 3 &&
              "text-red-700 bg-red-100/80 dark:text-red-500 dark:bg-red-800/80",
            errors > 3 &&
              "text-red-700 bg-red-100/80 dark:text-red-500 dark:bg-red-800/80"
          )}
        >
          {errors > 0 && <ExclamationCircleIcon className="size-3" />}
          {errors === 0 && <CheckIcon className="text-green-600 size-3" />}
          {errors > 0 && <span className="text-sm tabular-nums">{errors}</span>}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [open, setOpen] = useState<boolean>(false)
      const movie = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(movie.movie_id.toString())
              }
            >
              Copier id film
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href={`https://supabase.com/dashboard/project/${PROJECT_ID}/editor/${TABLE_IDS.MOVIES}?filter=id:eq:${movie.movie_id}`}
              >
                Voir le film sur supabase
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={`https://supabase.com/dashboard/project/${PROJECT_ID}/editor/${TABLE_IDS.SHOWS}?filter=movieId:eq:${movie.movie_id}`}
              >
                Voir les séances sur supabase
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/films/${movie.movie_id}`}>
                Voir la page du film
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger className="w-full relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                  Editer le film
                </AlertDialogTrigger>
                <AlertDialogPortal>
                  <ModalEditMovie
                    id={movie.movie_id}
                    close={() => setOpen(false)}
                  />
                </AlertDialogPortal>
              </AlertDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DataTableMovies({ data }: { data: Data[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
      pagination: { pageIndex: 0, pageSize: 30 },
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Rechercher par titre..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
