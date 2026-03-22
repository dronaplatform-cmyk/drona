"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";

interface OnboardingModalProps {
  userRole: "PARENT" | "TUTOR";
}

const parentSteps = [
  {
    title: "Welcome to Drona! 👋",
    description: "We are thrilled to help your child excel. Drona connects you with India's top tutors.",
  },
  {
    title: "How to Book a Class",
    description: "You can add your children from this dashboard, switch to their profile, and search for tutors to book classes instantly.",
  },
  {
    title: "Billing Cycle",
    description: "Classes are billed securely through Razorpay. You only pay for the classes you book, managed transparently with invoices generated.",
  },
];

const tutorSteps = [
  {
    title: "Welcome as a Tutor! 🎓",
    description: "Start teaching and earning on your own schedule. Update your profile to get discovered by parents.",
  },
  {
    title: "Update Your Profile",
    description: "Make sure you fill in your subjects, experience, and hourly rate so parents know exactly what you offer.",
  },
  {
    title: "Payment Breakdown",
    description: "We charge a minimal 3% commission. Your net payout is automatically calculated and credited smoothly to your account.",
  },
];

export function OnboardingModal({ userRole }: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  const steps = userRole === "PARENT" ? parentSteps : tutorSteps;

  useEffect(() => {
    setMounted(true);
    const hasCompleted = localStorage.getItem("drona_onboarding_completed");
    if (!hasCompleted && (userRole === "PARENT" || userRole === "TUTOR")) {
      setTimeout(() => setIsOpen(true), 0);
    }
  }, [userRole]);

  if (!mounted) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
    localStorage.setItem("drona_onboarding_completed", "true");
  };

  const handleInteractOutside = (e: Event) => {
    // Prevent closing until final step
    if (currentStep < steps.length - 1) {
      e.preventDefault();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="sm:max-w-[425px]"
        onPointerDownOutside={handleInteractOutside}
        onEscapeKeyDown={handleInteractOutside}
      >
        <DialogHeader>
          <DialogTitle>{steps[currentStep].title}</DialogTitle>
          <DialogDescription className="pt-4 text-base leading-relaxed">
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-4">
            <div className="flex gap-2">
                {steps.map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-2 rounded-full transition-all ${i === currentStep ? 'bg-primary w-6' : 'bg-muted w-2'}`}
                    />
                ))}
            </div>
        </div>

        <DialogFooter className="flex sm:justify-between w-full mt-4">
          <Button 
            variant="ghost" 
            onClick={handleComplete}
            className="text-muted-foreground mr-auto"
          >
            Skip Intro
          </Button>
          <Button onClick={handleNext}>
            {currentStep < steps.length - 1 ? "Next" : "Get Started"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
