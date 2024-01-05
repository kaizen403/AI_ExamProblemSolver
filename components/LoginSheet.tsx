import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import RegSheet from "./RegSheet";

export function LoginSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Create an account</Button>
      </SheetTrigger>
      <SheetContent side="top" className="min-h-full bg-black">
        <RegSheet />
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
