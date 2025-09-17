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
import { ModalEditShow } from "@/components/modal-edit-show"
import { useMovieColumns } from "@/components/colums"

export const TableShows = ({ data }: { data: Data[] }) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [openModalMovie, setOpenModalMovie] = useState<boolean>(false)
  const [opemModalScreening, setOpemModalScreening] = useState<boolean>(false)

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
