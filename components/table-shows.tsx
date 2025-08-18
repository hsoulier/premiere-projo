import { useMemo, useState } from "react"
import Link from "next/link"
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid"
import { DataGridPagination } from "@/components/ui/data-grid-pagination"
import { DataGridTable } from "@/components/ui/data-grid-table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp } from "lucide-react"
import { PROJECT_ID, TABLE_IDS, type Data } from "@/components/table-movies"
import { ArrowUpDown, FileWarningIcon, MoreHorizontal } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"
import { ModalEditMovie } from "@/components/modal-edit-movie"
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { ModalCreateMovie } from "@/components/modal-create-movie"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { useQuery } from "@tanstack/react-query"
import { getCinemas } from "@/lib/queries"

export const TableShows = ({ data }: { data: Data[] }) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [openModalMovie, setOpenModalMovie] = useState<boolean>(false)

  const supabase = useSupabaseBrowser()

  const { data: cinemas } = useQuery({
    queryKey: ["cinemas"],
    queryFn: async () => await getCinemas(supabase),
  })

  const columns = useMemo<ColumnDef<Data>[]>(
    () => [
      {
        id: "id",
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <Button
              {...{
                className: "size-6 text-muted-foreground",
                onClick: row.getToggleExpandedHandler(),
                mode: "icon",
                variant: "ghost",
              }}
            >
              {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
            </Button>
          ) : null
        },
        size: 12,
        meta: {
          expandedContent: (row) => (
            <div className="ms-12 py-3 text-muted-foreground text-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Langue</TableHead>
                    <TableHead>Type AVP</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Cinéma</TableHead>
                    <TableHead className="text-right">Lien</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {row.shows.map((show) => (
                    <TableRow key={show.id}>
                      <TableCell className="font-medium">
                        {show.language}
                      </TableCell>
                      <TableCell>{show.avpType}</TableCell>
                      <TableCell>
                        {new Date(show.date || "").toLocaleString("fr-FR", {
                          timeZone: "Europe/Paris",
                        })}
                      </TableCell>
                      <TableCell>
                        {cinemas?.find((cinema) => cinema.id === show.cinemaId)
                          ?.name || show.cinemaId}
                      </TableCell>
                      <TableCell className="pr-0 text-right">
                        <Link
                          className={buttonVariants({
                            size: "sm",
                            variant: "link",
                          })}
                          href={`/films/${row.movie_id}`}
                        >
                          Page du film
                        </Link>
                        <Link
                          className={buttonVariants({
                            size: "sm",
                            variant: "link",
                          })}
                          href={`https://supabase.com/dashboard/project/${PROJECT_ID}/editor/${TABLE_IDS.SHOWS}?filter=id:eq:${show.id}`}
                        >
                          Voir sur supabase
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ),
        },
      },
      {
        id: "movie_id",
        accessorKey: "movie_id",
        header: "Id",
        size: 54,
        cell: ({ row }) => (
          <div className="capitalize text-gray-400 tabular-nums truncate">
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
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Titre
              <ArrowUpDown />
            </Button>
          )
        },
      },
      {
        accessorKey: "duration",
        size: 70,
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
        size: 50,
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
        size: 70,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
              {errors > 0 && (
                <span className="text-sm tabular-nums">{errors}</span>
              )}
            </div>
          )
        },
      },
      {
        id: "actions",
        enableHiding: false,
        size: 40,
        header: () => null,
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
    ],
    [cinemas]
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination: { pageIndex: 0, pageSize: 30 } },
    getRowId: (row: Data) => row.movie_id.toString(),
    getRowCanExpand: (row) => Boolean(row.original.shows.length > 0),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
        <AlertDialog open={openModalMovie} onOpenChange={setOpenModalMovie}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="ml-2">
              Ajouter un film
            </Button>
          </AlertDialogTrigger>
          <AlertDialogPortal>
            <ModalCreateMovie close={() => setOpenModalMovie(false)} />
          </AlertDialogPortal>
        </AlertDialog>
      </div>
      <DataGrid
        table={table}
        recordCount={data.length}
        tableLayout={{ headerBackground: true }}
      >
        <div className="w-full space-y-2.5">
          <DataGridContainer border={false}>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
          <DataGridPagination />
        </div>
      </DataGrid>
    </div>
  )
}
