import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandTwitter } from "@tabler/icons-react";
import React from "react";


interface Footer7Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Platform",
    links: [
      { name: "Find Tutors", href: "/tutors" },
      { name: "Become a Tutor", href: "/auth/register?role=tutor" },
      { name: "Features", href: "/#features" },
      { name: "Testimonials", href: "/#testimonials" },
      { name: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" },
      { name: "Blogs", href: "/blogs" },
    ],
  },
  // {
  //   title: "Legal",
  //   links: [
  //     // { name: "Privacy Policy", href: "/privacy-policy" },
  //     // { name: "Terms of Service", href: "/terms-and-condition" },
  //     { name: "Cookie Policy", href: "/cookies" },
  //   ],
  // },
];

const defaultSocialLinks = [
  { icon: <IconBrandInstagram className="size-5" />, href: "#", label: "Instagram" },
  { icon: <IconBrandFacebook className="size-5" />, href: "#", label: "Facebook" },
  { icon: <IconBrandTwitter className="size-5" />, href: "#", label: "Twitter" },
  { icon: <IconBrandLinkedin className="size-5" />, href: "#", label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
];

export const LandingFooter = ({
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg", // Keeping a placeholder or using a Drona logo if available, but for now I'll use text or this placeholder.
    alt: "Drona Logo",
    title: "Drona",
  },
  sections = defaultSections,
  description = "Empowering education through authentic connections between parents and tutors.",
  socialLinks = defaultSocialLinks,
  copyright = "© 2025 Drona. All rights reserved.",
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <section className="pt-32 px-8">
      <div className="container mx-auto">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            {/* Logo */}
            <div className="flex items-center gap-0 lg:justify-start">
              <a href={logo.url}>
                {/* <img
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  className="h-8"
                /> */}
              </a>
              <div className="flex flex-col items-start -space-y-1">
                <h2 className="text-xl font-semibold">{logo.title}</h2>
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase mt-0.5">Beta</span>
              </div>
            </div>
            <p className="text-muted-foreground max-w-[70%] text-sm">
              {description}
            </p>
            {/* Social Media Icons */}
            {/* <ul className="text-muted-foreground flex items-center space-x-6">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="hover:text-primary font-medium">
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul> */}
            <ul className="text-muted-foreground flex items-center space-x-6">
              <p>admin@dronaedtech.in</p>
            </ul>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="text-muted-foreground space-y-3 text-sm">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="hover:text-primary font-medium"
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="text-muted-foreground mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-primary">
                <a href={link.href}> {link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};


