import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  search: string;
  tag: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTagChange: (value: string) => void;
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export function ContactsFilters({ search, tag, onSearchChange, onStatusChange, onTagChange, page, totalPages, onPrev, onNext }: Props) {
  return (
    <div className="flex gap-2 items-center flex-wrap">
      <div className="flex gap-1.5 flex-1 min-w-[200px] max-w-sm">
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Button size="icon" variant="outline" aria-label="Search">
          <HugeiconsIcon icon={Search01Icon} size={15} />
        </Button>
      </div>

      <Select onValueChange={(v) => onStatusChange(v === "ALL" ? "" : v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All statuses</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="UNSUBSCRIBED">Unsubscribed</SelectItem>
          <SelectItem value="BOUNCED">Bounced</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-1.5">
        <Input
          placeholder="Filter by tag…"
          className="w-36"
          value={tag}
          onChange={(e) => onTagChange(e.target.value)}
        />
        {tag && (
          <Button size="sm" variant="ghost" className="px-2 text-muted-foreground" onClick={() => onTagChange("")}>
            ✕
          </Button>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 ml-auto text-sm text-muted-foreground">
          <span className="whitespace-nowrap">Page {page + 1} of {totalPages}</span>
          <Button size="sm" variant="outline" disabled={page === 0} onClick={onPrev}>
            Previous
          </Button>
          <Button size="sm" variant="outline" disabled={page >= totalPages - 1} onClick={onNext}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
