// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Skeleton } from "./skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

afterEach(cleanup);

const slot = (name: string) => document.querySelector(`[data-slot="${name}"]`) as HTMLElement | null;

describe("Dialog", () => {
  it("opens from its trigger with a Polish close button and closes with it", async () => {
    render(
      <Dialog>
        <DialogTrigger>Edytuj termin</DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edytuj termin</DialogTitle>
            <DialogDescription>Zmień godzinę rozpoczęcia.</DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <DialogClose>Anuluj</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Edytuj termin" }));
    const dialog = screen.getByRole("dialog", { name: "Edytuj termin" });
    expect(dialog.className).toContain("max-w-md");
    expect(slot("dialog-overlay")?.className).toContain("bg-overlay");
    expect(screen.getAllByRole("button", { name: "Zamknij" })).toHaveLength(2);
    await userEvent.click(screen.getAllByRole("button", { name: "Zamknij" })[0]);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("can hide the corner close button", () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton={false} aria-describedby={undefined}>
          <DialogTitle>Bez przycisku</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.queryByRole("button", { name: "Zamknij" })).toBeNull();
  });
});

describe("AlertDialog", () => {
  it("asks for an explicit choice and runs the confirmed action", async () => {
    const onConfirm = vi.fn();
    render(
      <AlertDialog>
        <AlertDialogTrigger>Anuluj rezerwację</AlertDialogTrigger>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Anulować rezerwację?</AlertDialogTitle>
            <AlertDialogDescription>Płatność nie zostanie zwrócona.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Nie anuluj</AlertDialogCancel>
            <AlertDialogAction variant="destructive" size="sm" onClick={onConfirm}>
              Anuluj rezerwację
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Anuluj rezerwację" }));
    const dialog = screen.getByRole("alertdialog", { name: "Anulować rezerwację?" });
    expect(dialog.className).toContain("max-w-md");
    expect(slot("alert-dialog-overlay")?.className).toContain("bg-overlay");
    expect(screen.getByRole("button", { name: "Nie anuluj" }).dataset.variant).toBe("outline");
    await userEvent.click(screen.getByRole("button", { name: "Anuluj rezerwację" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });
});

describe("DropdownMenu", () => {
  it("renders labelled groups, an inset item and a destructive item", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Akcje</DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel inset>Zaproszenie</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem inset>Kopiuj link</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Cofnij zaproszenie</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    expect(screen.getByRole("menu").className).toContain("w-56");
    expect(screen.getByRole("menuitem", { name: "Kopiuj link" }).dataset.inset).toBe("true");
    expect(screen.getByRole("menuitem", { name: "Cofnij zaproszenie" }).dataset.variant).toBe("destructive");
    expect(slot("dropdown-menu-label")?.dataset.inset).toBe("true");
    expect(slot("dropdown-menu-separator")).not.toBeNull();
  });

  it("exposes the portal for custom content", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Konto</DropdownMenuTrigger>
        <DropdownMenuPortal>
          <span>Poza drzewem</span>
        </DropdownMenuPortal>
      </DropdownMenu>,
    );
    expect(screen.getByText("Poza drzewem")).toBeDefined();
  });
});

describe("Tooltip", () => {
  it("shows the name of an icon-only control", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger aria-label="Kopiuj link do profilu">⧉</TooltipTrigger>
          <TooltipContent className="max-w-60">Kopiuj link do profilu</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByRole("tooltip").textContent).toBe("Kopiuj link do profilu");
    expect(slot("tooltip-content")?.className).toContain("max-w-60");
  });
});

describe("Skeleton", () => {
  it("is a decorative placeholder", () => {
    render(<Skeleton className="h-4 w-32" />);
    const skeleton = slot("skeleton");
    expect(skeleton?.getAttribute("aria-hidden")).toBe("true");
    expect(skeleton?.className).toContain("w-32");
  });
});
