import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";
import { siteTitle } from "./Layout";
import Link from "next/link";

export default function MobileMenu({ nvaList }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <>
      <div className="flex items-center">
        <Image
          priority
          src={isOpen ? "/images/menu_open.svg" : "/images/menu_close.svg"}
          height={20}
          width={20}
          alt="menu"
          onClick={handleOpen}
          className="cursor-pointer"
        />
        <span className="font-semibold text-white ml-2">{siteTitle}</span>
      </div>

      {isOpen && (
        <div>
          <div
            onClick={handleClose}
            className={clsx([
              "fixed",
              "left-0",
              "top-0",
              "w-full",
              "h-full",
              "bg-[#000000b3]",
              "z-2",
            ])}
          />
          <div
            className={clsx([
              "fixed",
              "left-0",
              "top-0",
              "w-[0%]",
              "h-full",
              "bg-[rgba(0, 0, 0, .7)]",
              "z-3",
              "overflow-y-auto",
              "overflow-x-hidden",
              "bg-white",
              "shadow-lg",
              "transition-width",
              "animate-slide-in-left",
            ])}
          >
            <header className="wmm-header bg-white">
              <main className="wmm-wrap bg-white flex items-center justify-between border-b border-solid border-gray-200">
                <div className="flex items-center">
                  <Image
                    priority
                    src="/images/logo_black.svg"
                    height={20}
                    width={20}
                    alt={siteTitle}
                  />
                  <span className="font-semibold text-black ml-2 whitespace-nowrap">
                    {siteTitle}
                  </span>
                </div>
                <Image
                  priority
                  src="/images/close.svg"
                  height={20}
                  width={20}
                  alt="close"
                  onClick={handleClose}
                  className="cursor-pointer"
                />
              </main>
            </header>
            <ul className="p-2">
              {nvaList.map((navItem) => (
                <li
                  key={navItem.code}
                  className={clsx([
                    "px-2",
                    "py-1.5",
                    "mx-1",
                    "rounded-sm",
                    "hover:font-semibold",
                    "hover:bg-[#0000001f]",
                    "text-black",
                  ])}
                >
                  <Link className="block" href={navItem.path}>
                    {navItem.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
