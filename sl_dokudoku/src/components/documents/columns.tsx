import { ColumnDef } from "@tanstack/react-table"
import { DocumentWithRelations } from "@/types/document"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { DocumentActions } from "./document-actions"

export const columns: ColumnDef<DocumentWithRelations, any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "owner.name",
    header: "Owner",
  },
  {
    accessorKey: "folder.name",
    header: "Folder",
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue<DocumentWithRelations['tags']>("tags")
      return (
        <div className="flex gap-1">
          {tags.map(tagRelation => (
            <span key={tagRelation.tag.id} className="px-2 py-1 bg-secondary rounded-full text-xs">
              {tagRelation.tag.name}
            </span>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Modified",
    cell: ({ row }) => {
      return format(new Date(row.getValue("updatedAt")), "MMM d, yyyy")
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const document = row.original
      return <DocumentActions document={document} />
    },
  },
] 