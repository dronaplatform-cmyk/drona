
"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Cog, Lightbulb, ListChecks } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";

import type { CarouselApi } from "@/src/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/src/components/ui/carousel";

import { IconArrowRight, IconBolt, IconBook, IconCalendarCheck, IconMessageCircle, IconShieldCheck, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";


interface CtaProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  items?: string[];
}

const ctaItems = [
  "Verified Tutors",
  "Secure Payments",
  "Progress Tracking",
  "Direct Messaging",
  "Real-time Updates",
];



interface Hero1Props {
  badge?: string;
  heading?: string;
  description?: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  image?: {
    src: string;
    alt: string;
  };
}

export const Hero = ({ badge = "✨ Trusted by Parents & Tutors"
  , heading = "The Perfect Connection for Your child's Education"
  , description = "Drona bridges the gap between passionate tutors and parents seeking quality education. We provide a secure, transparent platform dedicated to empowering the next generation through authentic learning connections."
  , buttons = {
    primary: {
      text: "Register as Parent",
      url: "/auth/register/parent",
    },
    secondary: {
      text: "Become a Tutor",
      url: "/auth/register/tutor",
    },
  }
  , image = {
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
    alt: "Students learning",
  } }: Hero1Props) => {

  return (
    <>


      <section>
        <div className="  flex justify-between items-center gap-8  ">

          <div className="flex w-full  z-10 flex-col items-center text-center lg:items-start lg:text-left pl-4 lg:pl-20 pr-4">
            {badge && (
              <Badge variant="outline">
                {badge}
                <IconArrowRight className="ml-2 size-4" />
              </Badge>
            )}
            <h1 className="my-6 text-balance text-4xl  lg:text-6xl font-gloock">
              {heading}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button asChild className="w-full sm:w-auto">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={buttons.secondary.url}>
                    {buttons.secondary.text}
                    <IconArrowRight className="size-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="h-screen  w-screen  relative   hidden sm:block object-cover">
            <Image className=" opacity-50 mix-blend-multiply transform scale-200 dark:mix-blend-soft-light  animate-spin animation-duration-[100s]" src={'/mandala.svg'} fill alt="mandala"></Image>
            {/* <Dithering
              style={{ height: "100%", width: "100%" }}
              colorBack={true ? "#04071000" : "#f8faff00"}
              colorFront={true ? "#7f8af6" : "#3732a0"}
              shape="simplex"
              type="4x4"
              pxSize={4}
              offsetX={0}
              offsetY={0}
              scale={0.8}
              rotation={0}
              speed={0.1}
            /> */}
            {/* <HoleBackground className="   absolute inset-0 flex items-center justify-center rounded-xl" /> */}

          </div>


        </div>
      </section>
      {/* <div className="inset-0 min-h-screen h-full w-full">
        <ResumePage
          badge="✨ Trusted by Parents & Tutors"
          heading="The Perfect Connection for Your child&apos;s Education"
          description="Drona bridges the gap between passionate tutors and parents seeking quality education. We provide a secure, transparent platform dedicated to empowering the next generation through authentic learning connections."
          buttons={{
            primary: {
              text: "Find a Tutor",
              url: "/tutors",
            },
            secondary: {
              text: "Become a Tutor",
              url: "/auth/register?role=tutor",
            },
          }}
          image={{
            src: "https://placehold.co/400x600",
            alt: "Students learning",
          }}
        />
      </div> */}
    </>
  );
};

interface Feature {
  id: string;
  icon: React.ReactNode;
  heading: string;
  description: string;
  image: string;
  url: string;
  isDefault: boolean;
}

interface Feature51Props {
  features: Feature[];
}

export const Feature51 = ({
  features = [
    {
      id: "feature-1",
      heading: "Find Tutors",
      icon: <Lightbulb className="size-4" />,

      description:
        "Browse profiles of verified tutors, filter by subject and grade, and find the perfect match for your child.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
      url: "/tutors",
      isDefault: true,
    },
    {
      id: "feature-2",
      icon: <ListChecks className="size-4" />,

      heading: "Connect & Schedule",
      description:
        "Communicate directly with tutors, schedule classes, and manage your calendar effortlessly.",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
      url: "/dashboard",
      isDefault: false,
    },
    {
      id: "feature-3",
      icon: <Cog className="size-4" />,
      heading: "Track Progress",
      description:
        "Monitor your child&apos;s academic growth with regular progress reports and feedback.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
      url: "/dashboard",
      isDefault: false,
    },
  ],
}: Feature51Props) => {
  const defaultTab =
    features.find((tab) => tab.isDefault)?.id || features[0].id;

  return (
    <section className="py-16">
      <Tabs defaultValue={defaultTab} className="p-0">
        <TabsList className="bg-background flex h-auto w-full flex-col gap-2 p-0 md:flex-row">
          {features.map((tab) => {
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`hover:border-muted data-[state=active]:bg-muted group flex w-full flex-col items-start justify-start gap-1 whitespace-normal rounded-md border p-4 text-left shadow-none transition-opacity duration-200 hover:opacity-80 data-[state=active]:shadow-none ${tab.isDefault ? "" : ""
                  }`}
              >
                <div className="flex items-center gap-2 md:flex-col md:items-start lg:gap-4">
                  {tab.icon && (
                    <span className="bg-muted text-muted-foreground group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground flex size-8 items-center justify-center rounded-full transition-opacity duration-200 lg:size-10">
                      {tab.icon}
                    </span>
                  )}
                  <p className="text-lg  text-balance transition-opacity duration-200 md:text-2xl lg:text-xl">
                    {tab.heading}
                  </p>
                </div>
                <p className="text-muted-foreground font-normal transition-opacity duration-200 md:block">
                  {tab.description}
                </p>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {features.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className="transition-opacity duration-300"
          >
            <Image
              width={100}
              height={100}
              src={tab.image}
              alt={tab.heading}
              className="aspect-video w-full rounded-md object-cover transition-opacity duration-300"
            />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};


export const Features = () => {
  return (
    <section className="py-16">
      <div className=" container mx-auto">
        <p className="text-muted-foreground mb-4 text-sm lg:text-base">
          WHY CHOOSE DRONA
        </p>
        <h2 className="text-3xl  text-balance lg:text-4xl font-gloock">Empowering Education for Everyone</h2>
        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3">
          <div className="bg-accent/30 backdrop-blur-lg border border-border/40 rounded-lg p-5">
            <span className="bg-background mb-8 flex size-12 items-center justify-center rounded-full">
              <IconUsers className="size-6 text-primary " />

            </span>
            <h3 className="mb-2 text-xl font-medium">Verified Tutors</h3>
            <p className="text-muted-foreground leading-7">
              We ensure authenticity with standardized profiles for every tutor. Connect with knowledgeable youth and experienced professionals passionate about teaching.
            </p>
          </div>
          <div className="bg-accent/30 backdrop-blur-lg border border-border/40 rounded-lg p-5">
            <span className="bg-background mb-8 flex size-12 items-center justify-center rounded-full">
              <IconBook className="size-6 text-primary " />

            </span>
            <h3 className="mb-2 text-xl font-medium">Progress Tracking</h3>
            <p className="text-muted-foreground leading-7">
              Stay updated with daily homework logs and detailed performance reports. Our platform ensures you never miss a beat in your child&apos;s academic journey.
            </p>
          </div>
          <div className="bg-accent/30 backdrop-blur-lg border border-border/40 rounded-lg p-5">
            <span className="bg-background mb-8 flex size-12 items-center justify-center rounded-full">
              <IconShieldCheck className="size-6 text-primary " />

            </span>
            <h3 className="mb-2 text-xl font-medium">Secure & Reliable</h3>
            <p className="text-muted-foreground leading-7">
              From secure logins to encrypted messaging and safe payment interfaces, we prioritize your security and privacy at every step.
            </p>
          </div>
          <div className="bg-accent/30 backdrop-blur-lg border border-border/40 rounded-lg p-5">
            <span className="bg-background mb-8 flex size-12 items-center justify-center rounded-full">
              <IconMessageCircle className="size-6 text-primary " />

            </span>
            <h3 className="mb-2 text-xl font-medium">Direct Communication</h3>
            <p className="text-muted-foreground leading-7">
              Seamless teacher-parent messaging allows for real-time updates on classwork, scheduling, and feedback, fostering a collaborative learning environment.
            </p>
          </div>
          <div className="bg-accent/30 backdrop-blur-lg border border-border/40 rounded-lg p-5">
            <span className="bg-background mb-8 flex size-12 items-center justify-center rounded-full">
              <IconCalendarCheck className="size-6 text-primary " />

            </span>
            <h3 className="mb-2 text-xl font-medium">Smart Scheduling</h3>
            <p className="text-muted-foreground leading-7">
              Manage classes efficiently with our calendar integration. Receive instant notifications for class updates or cancellations.
            </p>
          </div>
          <div className="bg-accent/30 backdrop-blur-lg border border-border/40 rounded-lg p-5">
            <span className="bg-background mb-8 flex size-12 items-center justify-center rounded-full">
              <IconBolt className="size-6 text-primary " />

            </span>
            <h3 className="mb-2 text-xl font-medium">Employability Focus</h3>
            <p className="text-muted-foreground leading-7">
              We are committed to the bigger vision of employability, providing a platform for talented individuals to earn through their passion for teaching.
            </p>
          </div>
        </div>
      </div>
      <section className="pt-32 pb-16">
        <div className="container mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            <h2 className="row-span-2 text-3xl  text-balance lg:text-5xl font-gloock">
              Our Values and Principles
            </h2>
            <div>
              <h3 className="mb-2 text-xl font-medium">Transparency</h3>
              <p className="text-muted-foreground">
                We believe in open communication. Our platform ensures clear visibility into tutor qualifications, progress reports, and pricing, building trust with every interaction.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-medium">Empowerment</h3>
              <p className="text-muted-foreground">
                We empower students to achieve their academic goals and tutors to build rewarding careers. Education is the key to unlocking potential, and we are the facilitators.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-medium">Quality</h3>
              <p className="text-muted-foreground">
                We are committed to excellence. From our verified tutors to our seamless user experience, we strive to provide the highest quality educational support.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-medium">Integrity</h3>
              <p className="text-muted-foreground">
                We operate with honesty and strong moral principles. The safety and privacy of our students and parents are our top priorities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};


interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqProps {
  heading?: string;
  items?: FaqItem[];
}

export const Faq = ({
  heading = "Frequently asked questions",
  items = [
    {
      id: "faq-1",
      question: "How do I find a tutor?",
      answer:
        "Browse our verified tutor profiles, filter by subject and grade, and connect directly with the tutors that meet your requirements.",
    },
    {
      id: "faq-2",
      question: "Is Drona free for parents?",
      answer:
        "Yes, browsing and connecting with tutors is free. You only pay for the classes you book directly with the tutor.",
    },
    {
      id: "faq-3",
      question: "How are tutors verified?",
      answer:
        "We conduct thorough background checks and verify qualifications to ensure safety and quality for all our students.",
    },
    {
      id: "faq-4",
      question: "Can I cancel a class?",
      answer:
        "Yes, you can cancel classes through the dashboard. Cancellation policies may apply based on the tutor's terms.",
    },
    {
      id: "faq-5",
      question: "How do I pay?",
      answer:
        "We offer a secure payment interface for hassle-free transactions directly through the platform.",
    },
  ],
}: FaqProps) => {
  return (
    <section className="py-16">
      <div className="container mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl  text-balance md:mb-11 md:text-4xl font-gloock">
          {heading}
        </h1>
        <Accordion type="single" collapsible>
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="font-sans hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};




interface GalleryItem {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

interface GalleryProps {
  title?: string;
  description?: string;
  items: GalleryItem[];
}

export const galleryData = [
  {
    id: "math-tutoring",
    title: "Expert Math Tutoring",
    description:
      "Master complex concepts with personalized guidance from experienced math tutors. From algebra to calculus, find the right help for every level.",
    href: "/tutors?subject=Mathematics",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "science-labs",
    title: "Interactive Science Learning",
    description:
      "Explore the wonders of science through engaging lessons. Our tutors make physics, chemistry, and biology come alive.",
    href: "/tutors?subject=Science",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "language-arts",
    title: "Language & Literature",
    description:
      "Improve reading comprehension, writing skills, and literary analysis with dedicated language tutors.",
    href: "/tutors?subject=English",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "coding-skills",
    title: "Coding & Computer Science",
    description:
      "Start your coding journey or advance your skills in Python, Java, Web Development, and more with expert mentors.",
    href: "/tutors?subject=Computer%20Science",
    image:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2070&auto=format&fit=crop",
  },
];

export const Gallery = ({
  title = "Explore Subjects",
  description = "Discover a wide range of subjects taught by qualified professionals. From core academics to specialized skills, we have it all.",
  items = galleryData,
}: GalleryProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className="py-16">
      <div className="">
        <div className="mb-8 flex items-end justify-between md:mb-14 lg:mb-16">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl  text-balance md:text-4xl lg:text-5xl font-gloock">
              {title}
            </h2>
            <p className="text-muted-foreground max-w-lg">{description}</p>
          </div>
          <div className="hidden shrink-0 gap-2 md:flex">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0  2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="max-w-[320px] pl-[20px] lg:max-w-[360px]"
              >
                <Link href={item.href} className="group rounded-xl">
                  <div className="md:aspect-5/4 lg:aspect-video group relative h-full min-h-108 max-w-full overflow-hidden rounded-xl">
                    <Image
                      width={100}
                      height={100}
                      src={item.image}
                      alt={item.title}
                      className="brightness-30  absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 h-full bg-[linear-gradient(transparent_20%,var(--secondary)_100%)] mix-blend-multiply" />
                    <div className="text-white absolute inset-x-0 bottom-0 flex flex-col items-start p-6 md:p-8">
                      <div className="mb-2 pt-4 text-xl  md:mb-3 md:pt-4 lg:pt-4">
                        {item.title}
                      </div>
                      <div className="mb-8 text-muted-foreground line-clamp-2 md:mb-12 lg:mb-9">
                        {item.description}
                      </div>
                      <div className="flex items-center text-primary   text-sm">
                        Find Tutors{" "}
                        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${currentSlide === index ? "bg-primary" : "bg-primary/20"
                }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export const Testimonial = () => {
  return (
    <section className="py-16">
      <div className="">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 items-stretch gap-x-0 gap-y-4 lg:grid-cols-3 lg:gap-4">
            <Image
              width={100}
              height={100}
              src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop"
              alt="Students learning"
              className="h-72 w-full rounded-md object-cover lg:h-auto"
            />
            <Card className="col-span-2 flex items-center justify-center p-6">
              <div className="flex flex-col gap-4">
                <q className="text-xl font-medium lg:text-3xl">
                  Drona has completely transformed how I manage my childrenz&apos;s education. Finding reliable tutors and tracking progress has never been easier.
                </q>
                <div className="flex flex-col items-start">
                  <p>Priya Sharma</p>
                  <p className="text-muted-foreground">Parent</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <CardContent className="text-foreground/70 px-6 pt-6 leading-7">
                <q>
                  As a tutor, Drona gives me the tools I need to organize my classes and reach more students. The platform is intuitive and professional.
                </q>
              </CardContent>
              <CardFooter>
                <div className="flex gap-4 leading-5">
                  <Avatar className="ring-input size-9 rounded-full ring-1">
                    <AvatarImage
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Rahul Verma"
                    />
                    <AvatarFallback>RV</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">Rahul Verma</p>
                    <p className="text-muted-foreground">Mathematics Tutor</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardContent className="text-foreground/70 px-6 pt-6 leading-7">
                <q>
                  I love the interactive learning resources and how easy it is to connect with my tutors. It makes studying much more enjoyable.
                </q>
              </CardContent>
              <CardFooter>
                <div className="flex gap-4 leading-5">
                  <Avatar className="ring-input size-9 rounded-full ring-1">
                    <AvatarImage
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Ananya Gupta"
                    />
                    <AvatarFallback>AG</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">Ananya Gupta</p>
                    <p className="text-muted-foreground">Student, Grade 10</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardContent className="text-foreground/70 px-6 pt-6 leading-7">
                <q>
                  The verified profiles gave us peace of mind. We found an excellent science tutor for our son within days. Highly recommended!
                </q>
              </CardContent>
              <CardFooter>
                <div className="flex gap-4 leading-5">
                  <Avatar className="ring-input size-9 rounded-full ring-1">
                    <AvatarImage
                      src="https://randomuser.me/api/portraits/men/11.jpg"
                      alt="Vikram Singh"
                    />
                    <AvatarFallback>VS</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">Vikram Singh</p>
                    <p className="text-muted-foreground">Parent</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
export const Cta = ({
  title = "Ready to Transform Your Learning Journey?",
  description = "Join thousands of parents and tutors who trust Drona for authentic educational connections. Start today and experience the difference.",
  buttonText = "Get Started Now",
  buttonUrl = "/auth/register",
  items = ctaItems,
}: CtaProps) => {
  return (
    <section className="pt-16">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="max-w-screen">
            <div className="bg-muted/40 flex flex-col items-start justify-between gap-8 rounded-lg px-6 py-10 md:flex-row lg:px-20 lg:py-16">
              <div className="md:w-1/2">
                <h4 className="mb-1 text-2xl  text-balance md:text-3xl font-gloock">{title}</h4>
                <p className="text-muted-foreground">{description}</p>
                <Button className="mt-6" asChild>
                  <a href={buttonUrl} target="_blank">
                    {buttonText} <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>
              <div className="md:w-1/3">
                <ul className="flex flex-col space-y-2 text-sm font-medium">
                  {items.map((item, idx) => (
                    <li className="flex items-center" key={idx}>
                      <Check className="mr-4 size-4 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  )
}

interface FeatureSecondary {
  id: string;
  icon: React.ReactNode;
  heading: string;
  description: string;
  image: string;
  url: string;
  isDefault: boolean;
}

interface FeatureSecondary51Props {
  featureSecondarys: FeatureSecondary[];
}

const FeatureSecondary51 = ({
  featureSecondarys = [
    {
      id: "featureSecondary-1",
      heading: "Research",
      icon: <Lightbulb className="size-4" />,

      description:
        "Discover the powerful featureSecondarys that make our platform stand out from the rest.",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
      url: "https://www.dronaedtech.in",
      isDefault: true,
    },
    {
      id: "featureSecondary-2",
      icon: <ListChecks className="size-4" />,

      heading: "Refine",
      description:
        "Built with the latest technology and designed for maximum productivity.",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
      url: "https://www.dronaedtech.in",
      isDefault: false,
    },
    {
      id: "featureSecondary-3",
      icon: <Cog className="size-4" />,
      heading: "Build",
      description:
        "Create amazing experiences with our comprehensive toolkit and resources.",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg",
      url: "https://www.dronaedtech.in",
      isDefault: false,
    },
  ],
}: FeatureSecondary51Props) => {
  const defaultTab =
    featureSecondarys.find((tab) => tab.isDefault)?.id || featureSecondarys[0].id;

  return (
    <section className="py-32">
      <div className="container">
        <Tabs defaultValue={defaultTab} className="p-0">
          <TabsList className="bg-background flex h-auto w-full flex-col gap-2 p-0 md:flex-row">
            {featureSecondarys.map((tab) => {
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`hover:border-muted data-[state=active]:bg-muted group flex w-full flex-col items-start justify-start gap-1 whitespace-normal rounded-md border p-4 text-left shadow-none transition-opacity duration-200 hover:opacity-80 data-[state=active]:shadow-none ${tab.isDefault ? "" : ""
                    }`}
                >
                  <div className="flex items-center gap-2 md:flex-col md:items-start lg:gap-4">
                    {tab.icon && (
                      <span className="bg-muted text-muted-foreground group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground flex size-8 items-center justify-center rounded-full transition-opacity duration-200 lg:size-10">
                        {tab.icon}
                      </span>
                    )}
                    <p className="text-lg  transition-opacity duration-200 md:text-2xl lg:text-xl">
                      {tab.heading}
                    </p>
                  </div>
                  <p className="text-muted-foreground font-normal transition-opacity duration-200 md:block">
                    {tab.description}
                  </p>
                </TabsTrigger>
              );
            })}
          </TabsList>
          {featureSecondarys.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="transition-opacity duration-300"
            >
              <Image
                width={100}
                height={100}
                src={tab.image}
                alt={tab.heading}
                className="aspect-video w-full rounded-md object-cover transition-opacity duration-300"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export { FeatureSecondary51 };

export default function Landing() {
  return (
    <div  >
      {/* hero  */}
      {/* short intro */}
      {/* feature  */}
      <Hero />
      <Features />
      <Gallery items={galleryData} />
      <Testimonial />
      <Faq />

      {/* why chose us  */}
      {/* trust/gallery  */}
      {/* testimonidal  */}
      {/* cta  */}
      {/* footer */}

    </div>
  )
}

