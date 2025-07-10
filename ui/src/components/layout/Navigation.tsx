"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const routes = [
  {
    label: "AI Assistant",
    href: "/agent",
    icon: (props: { className?: string }) => <Image src="/icons/message-icon.svg" alt="AI Assistant" width={20} height={20} className={props.className} />,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: (props: { className?: string }) => <Image src="/icons/profile-icon.svg" alt="Profile" width={20} height={20} className={props.className} />,
  },
  {
    label: "Study",
    href: "/study",
    icon: (props: { className?: string }) => <Image src="/icons/study-icon.svg" alt="Study" width={20} height={20} className={props.className} />,
  },
  {
    label: "Legal",
    href: "/legal",
    icon: (props: { className?: string }) => <Image src="/icons/legal-icon.svg" alt="Legal" width={20} height={20} className={props.className} />,
  },
  {
    label: "Finance",
    href: "/finance",
    icon: (props: { className?: string }) => <Image src="/icons/finance-icon.svg" alt="Finance" width={20} height={20} className={props.className} />,
  },
  {
    label: "Scholar Point",
    href: "/point",
    icon: (props: { className?: string }) => <Image src="/icons/point-icon.svg" alt="Scholar Point" width={20} height={20} className={props.className} />,
  },
];

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex items-center gap-4.5 px-2 py-4 rounded-md font-semibold text-sm text-primary transition",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}>
              <Icon className="size-5 text-neutral-500" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
