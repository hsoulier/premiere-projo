import { useState } from "react"
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid"
import { DataGridPagination } from "@/components/ui/data-grid-pagination"
import { DataGridTable } from "@/components/ui/data-grid-table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { type Data } from "@/components/table-movies"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { ModalCreateMovie } from "@/components/modal-create-movie"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { useQuery } from "@tanstack/react-query"
import { getCinemas } from "@/lib/queries"
import { useMovieColumns } from "@/components/colums"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { parseAsBoolean, useQueryState } from "nuqs"
import { getQueryClient } from "@/lib/query-client"
import { ModalScrapMovies } from "@/components/modal-scrap-movies"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const TableShows = ({ data }: { data: Data[] }) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [openModalMovie, setOpenModalMovie] = useState<boolean>(false)

  const [displayAll, setDisplayAll] = useQueryState(
    "all-movies",
    parseAsBoolean.withDefault(false)
  )

  const supabase = useSupabaseBrowser()

  const { data: cinemas } = useQuery({
    queryKey: ["cinemas"],
    queryFn: async () => await getCinemas(supabase),
  })

  const columns = useMovieColumns(cinemas ?? [])

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

  const handleOnlyAvailableChange = (checked: boolean) => {
    setDisplayAll(checked)
    getQueryClient().invalidateQueries({
      queryKey: [`movies-available-${!checked}`],
    })
  }

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

        <div className="ml-4 flex items-center space-x-2">
          <Switch
            id="display-only-available"
            checked={displayAll}
            onCheckedChange={handleOnlyAvailableChange}
          />
          <Label htmlFor="display-only-available">Tous les films</Label>
        </div>

        <Link
          href="/dashboard/scrap"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "ml-auto mr-0"
          )}
        >
          Scraper les films
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild></AlertDialogTrigger>
          <AlertDialogPortal>
            <ModalScrapMovies />
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
