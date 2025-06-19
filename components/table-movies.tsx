"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  ChevronDown,
  FileWarningIcon,
  MessageCircleWarningIcon,
  MoreHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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

const TABLE_IDS = {
  CINEMAS: "32274",
  MOVIES: "32281",
  SHOWS: "32292",
}

type Data = NonNullable<Awaited<ReturnType<typeof getShowsAggregated>>>[number]

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
      <div className="capitalize">{row.getValue("movie_id")}</div>
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
    cell: ({ row }) => <div className="lowercase">{row.getValue("title")}</div>,
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
    header: () => <div className="text-center">Number of shows</div>,
    cell: ({ row }) => {
      const numberOfShows = Array.isArray(row.getValue("shows"))
        ? (row.getValue("shows") as Data["shows"]).length
        : 0

      return <div className="text-right font-medium">{numberOfShows}</div>
    },
  },
  {
    accessorKey: "errors",
    header: () => <div className="text-center">Possible errors</div>,
    cell: ({ row }) => {
      const noDirector = !Boolean(row.getValue("director") ?? "")
      const noDuration = !Boolean(row.getValue("duration") ?? "")
      const noSynopsis = !Boolean(row.getValue("synopsis") ?? "")

      console.log("row errors", row.original)

      const errors = [noDirector, noDuration, noSynopsis].filter(Boolean).length

      return (
        <div className="text-right font-medium">
          {errors > 0 && <MessageCircleWarningIcon className="text-red-500" />}
          {errors > 0 && (
            <span className="ml-2 text-sm text-red-500">{errors}</span>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
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
              Copy movie ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href={`https://supabase.com/dashboard/project/yafeugsphejhrcwqmesx/editor/${TABLE_IDS.MOVIES}?filter=id:eq:${movie.movie_id}`}
              >
                Voir le film sur supabase
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={`https://supabase.com/dashboard/project/yafeugsphejhrcwqmesx/editor/${TABLE_IDS.SHOWS}?filter=movieId:eq:${movie.movie_id}`}
              >
                Voir les séances sur supabase
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DataTableDemo({ data }: { data: Data[] }) {
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
    state: { sorting, rowSelection },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
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
