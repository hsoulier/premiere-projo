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
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { ModalCreateMovie } from "@/components/modal-create-movie"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getCinemas } from "@/lib/queries"
import { useMovieColumns } from "@/components/colums"
import { LoaderCircle } from "@/components/animate-ui/icons/loader-circle"
import { CircleX } from "lucide-react"
import { BadgeCheck } from "@/components/animate-ui/icons/badge-check"

export const TableShows = ({ data }: { data: Data[] }) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [openModalMovie, setOpenModalMovie] = useState<boolean>(false)

  const supabase = useSupabaseBrowser()

  const { data: cinemas } = useQuery({
    queryKey: ["cinemas"],
    queryFn: async () => await getCinemas(supabase),
  })

  const { isPending, mutateAsync, isSuccess, isError } = useMutation({
    mutationKey: ["force-scrap-movies"],
    mutationFn: async () => {
      try {
        const res = await fetch(
          // "https://europe-west1-premiereprojo.cloudfunctions.net/scrapAllCinemas"
          "https://europe-west1-premiereprojo.cloudfunctions.net/scrapPathe"
        )

        if (!res?.ok) {
          throw new Error("Erreur lors de la mise à jour des films")
        }

        return {}
      } catch (error) {
        console.error(error)
        throw error
      }
    },
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
        <Button
          variant="secondary"
          className="ml-auto mr-0"
          onClick={() => mutateAsync()}
          disabled={isPending}
        >
          {isError && <CircleX className="text-red-500" />}
          {isSuccess && !isPending && (
            <BadgeCheck animateOnView className="text-green-500" />
          )}
          {isPending && <LoaderCircle animate loop />}
          Forcer la mise à jour
        </Button>
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
