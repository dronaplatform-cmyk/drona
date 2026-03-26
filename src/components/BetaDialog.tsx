"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

export function BetaDialog() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenBeta = localStorage.getItem("drona_beta_dialog_seen");
    if (!hasSeenBeta) {
      setTimeout(() => setOpen(true), 500); // Small delay feels smoother
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("drona_beta_dialog_seen", "true");
    setOpen(false);
  };

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => {
        if(!val) handleClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Drona (Beta)</DialogTitle>
          <DialogDescription>
            You are exploring the early beta version of Drona. Some features might be experimental or change in the future. We'd love your feedback!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button type="button" onClick={handleClose}>
            Got it, let's explore!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
