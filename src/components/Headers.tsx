"use client";

import { IconChalkboardTeacher, IconFeather, IconFeatherFilled, IconMenu2 } from "@tabler/icons-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Button } from "@/src/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/src/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import LogoutButton from "./LogoutButton";
import { useSession } from "next-auth/react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";


export const LandingHeader = () => {
  const features = [
    {
      title: "Find Tutors",
      description: "Connect with qualified tutors for any subject and grade.",
      href: "/tutors",
    },
    {
      title: "Progress Tracking",
      description: "Monitor academic growth with detailed performance reports.",
      href: "/dashboard/progress",
    },
    {
      title: "Secure Messaging",
      description: "Direct, encrypted communication between parents and tutors.",
      href: "/dashboard/messages",
    },
    {
      title: "Smart Scheduling",
      description: "Manage classes, attendance, and cancellations easily.",
      href: "/dashboard/schedule",
    },
  ];
  const { data: session } = useSession();
  const pathname = usePathname();

  console.log(session, pathname);

  return (
    <section className="py-2 px-6 sticky  top-0 z-50 w-full border-b border-accent/40 rounded-b-2xl  bg-background/95 backdrop-blur-2xl supports-backdrop-filter:bg-background/60">

      <nav className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
        >

          <div className="flex flex-col items-start -space-y-1">
            <span className="text-lg font-medium tracking-tighter flex items-center gap-1">
              <IconChalkboardTeacher className="text-primary" size={18}/> Drona
            </span>
            <span className="text-[10px] font-bold text-primary tracking-widest pl-6 uppercase">Beta</span>
          </div>
        </Link>
        <NavigationMenu className="hidden  lg:block">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Features</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] grid-cols-2 p-3">
                  {features.map((feature, index) => (
                    <NavigationMenuLink
                      href={feature.href}
                      key={index}
                      className="hover:bg-muted/70 rounded-md p-3 transition-colors"
                    >
                      <div key={feature.title}>
                        <p className="text-foreground mb-1 ">
                          {feature.title}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
                About Us
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/tutors" className={navigationMenuTriggerStyle()}>
                Find Tutors
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/contact"
                className={navigationMenuTriggerStyle()}
              >
                Contact
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/blogs"
                className={navigationMenuTriggerStyle()}
              >
               Blogs
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>


        {/* {session.status === "authenticated" ? <LogoutButton /> : <div className="hidden items-center gap-4 lg:flex">
            <Button><Link href={"/auth/register"}>Register</Link></Button>
            <Button variant="outline"><Link href={"/auth/login"}>Login</Link></Button>
            
            </div>
            } */}


        <div className="flex gap-2 items-center ">
          {/* {session ? (
            <div className="hidden lg:flex items-center gap-2">
              <Button size="sm" asChild variant="secondary">
                <Link href="/dashboard">Go to App</Link>
              </Button>
          
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild variant="default">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          )} */}
<div className="hidden lg:flex items-center gap-2">
              <Button asChild variant="outline">
                <Link href="/auth/login">Login</Link>
              </Button>
          
            </div>
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <IconMenu2 className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="max-h-screen overflow-auto">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                  >
                    <div className="flex flex-col items-start -space-y-1">
                      <span className="text-lg tracking-tighter flex items-center gap-1">
                        Drona
                      </span>
                      <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Beta</span>
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-4">
                <Accordion type="single" collapsible className="mb-2 mt-4">
                  <AccordionItem value="solutions" className="border-none">
                    <AccordionTrigger className="text-base hover:no-underline">
                      Features
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2">
                        {features.map((feature, index) => (
                          <Link
                            href={feature.href}
                            key={index}
                            className="hover:bg-muted/70 rounded-md p-3 transition-colors"
                          >
                            <div key={feature.title}>
                              <p className="text-foreground mb-1 ">
                                {feature.title}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                {feature.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex flex-col gap-6">
                  <Link href="/about" className="">
                    About Us
                  </Link>
                  <Link href="/pricing" className="">
                    Pricing
                  </Link>
                  <Link href="/contact" className="">
                    Contact
                  </Link>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                     <Button asChild variant="outline">
                <Link href="/auth/login">Login</Link>
              </Button>
                  {/* {session ? (
                    <>
                      <Button asChild className="w-full"><Link href={"/dashboard"}>Go to App</Link></Button>
                      <LogoutButton/>
                    </>
                  ) : (
                    <>
                      <Button asChild className="w-full"><Link href={"/auth/register"}>Get Started</Link></Button>
                      <Button asChild variant="outline" className="w-full"><Link href={"/auth/login"}>Login</Link></Button>
                    </>
                  )} */}
                </div>


              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </section>
  );
};
export const AuthenticationPageHeader = () => {
  const features = [
    {
      title: "Find Tutors",
      description: "Connect with qualified tutors for any subject and grade.",
      href: "/tutors",
    },
    {
      title: "Progress Tracking",
      description: "Monitor academic growth with detailed performance reports.",
      href: "/dashboard/progress",
    },
    {
      title: "Secure Messaging",
      description: "Direct, encrypted communication between parents and tutors.",
      href: "/dashboard/messages",
    },
    {
      title: "Smart Scheduling",
      description: "Manage classes, attendance, and cancellations easily.",
      href: "/dashboard/schedule",
    },
  ];
  const { data: session } = useSession();
  const pathname = usePathname();

  console.log(session, pathname);

  return (
    <section className="py-2 px-6 sticky  top-0 z-50 w-full border-b border-accent/40 rounded-b-2xl  bg-background/95 backdrop-blur-2xl supports-backdrop-filter:bg-background/60">

      <nav className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
        >

          <div className="flex flex-col items-start -space-y-1">
            <span className="text-lg font-medium tracking-tighter flex items-center gap-1">
              <IconChalkboardTeacher className="text-primary" size={18}/> Drona
            </span>
            <span className="text-[10px] font-bold text-primary tracking-widest pl-6 uppercase">Beta</span>
          </div>
        </Link>
        {/* <NavigationMenu className="hidden  lg:block">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Features</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] grid-cols-2 p-3">
                  {features.map((feature, index) => (
                    <NavigationMenuLink
                      href={feature.href}
                      key={index}
                      className="hover:bg-muted/70 rounded-md p-3 transition-colors"
                    >
                      <div key={feature.title}>
                        <p className="text-foreground mb-1 ">
                          {feature.title}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
                About Us
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/tutors" className={navigationMenuTriggerStyle()}>
                Find Tutors
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/contact"
                className={navigationMenuTriggerStyle()}
              >
                Contact
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu> */}


        {/* {session.status === "authenticated" ? <LogoutButton /> : <div className="hidden items-center gap-4 lg:flex">
            <Button><Link href={"/auth/register"}>Register</Link></Button>
            <Button variant="outline"><Link href={"/auth/login"}>Login</Link></Button>
            
            </div>
            } */}


        <div className="flex gap-2 items-center ">
          {/* {session ? (
            <div className="hidden lg:flex items-center gap-2">
              <Button size="sm" asChild variant="secondary">
                <Link href="/dashboard">Go to App</Link>
              </Button>
          
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild variant="default">
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          )} */}
<div className="hidden lg:flex items-center gap-2">
              {/* <Button asChild variant="outline">
                <Link href="/auth/login">Login</Link>
              </Button> */}
          
            </div>
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <IconMenu2 className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="max-h-screen overflow-auto">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                  >
                    <div className="flex flex-col items-start -space-y-1">
                      <span className="text-lg tracking-tighter flex items-center gap-1">
                        Drona
                      </span>
                      <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Beta</span>
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-4">
                <Accordion type="single" collapsible className="mb-2 mt-4">
                  <AccordionItem value="solutions" className="border-none">
                    <AccordionTrigger className="text-base hover:no-underline">
                      Features
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2">
                        {features.map((feature, index) => (
                          <Link
                            href={feature.href}
                            key={index}
                            className="hover:bg-muted/70 rounded-md p-3 transition-colors"
                          >
                            <div key={feature.title}>
                              <p className="text-foreground mb-1 ">
                                {feature.title}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                {feature.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex flex-col gap-6">
                  <Link href="/about" className="">
                    About Us
                  </Link>
                  <Link href="/pricing" className="">
                    Pricing
                  </Link>
                  <Link href="/contact" className="">
                    Contact
                  </Link>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                     <Button asChild variant="outline">
                <Link href="/auth/login">Login</Link>
              </Button>
                  {/* {session ? (
                    <>
                      <Button asChild className="w-full"><Link href={"/dashboard"}>Go to App</Link></Button>
                      <LogoutButton/>
                    </>
                  ) : (
                    <>
                      <Button asChild className="w-full"><Link href={"/auth/register"}>Get Started</Link></Button>
                      <Button asChild variant="outline" className="w-full"><Link href={"/auth/login"}>Login</Link></Button>
                    </>
                  )} */}
                </div>


              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </section>
  );
};


