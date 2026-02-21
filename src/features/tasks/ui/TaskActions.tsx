"use client"

import { CheckCircle2, MoreHorizontal, Pencil, Trash2, XCircle } from "lucide-react"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import type { TaskStatus } from "@/entities/task"

interface TaskActionsProps {
  status: TaskStatus
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (status: TaskStatus) => void
}

export function TaskActions({ status, onEdit, onDelete, onStatusChange }: TaskActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        {status !== "DONE" && (
          <DropdownMenuItem onClick={() => onStatusChange("DONE")}>
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
            Mark as Done
          </DropdownMenuItem>
        )}
        {status !== "CANCELLED" && (
          <DropdownMenuItem onClick={() => onStatusChange("CANCELLED")}>
            <XCircle className="h-4 w-4 mr-2 text-muted-foreground" />
            Mark as Cancelled
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
