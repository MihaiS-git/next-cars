"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ListItem } from "./list-item";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import LogoutButton from "@/components/ui/auth/logout-button";
import { components } from "./cars-menu-components";
import styles from "./main-navigation.module.css";

export default function MainNavigation() {
    const { data: session, status } = useSession();

    if (status === "loading") return <p className="text-zinc-50">Loading...</p>;

    return (
        <>
            <nav className="hidden lg:flex">
                <NavigationMenu className="flex flex-row justify-end w-full text-zinc-50 ">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger
                                className={`${styles.NavigationMenuTrigger} bg-zinc-950 text-zinc-50`}
                            >
                                Cars
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="bg-zinc-950 text-zinc-50">
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] grid-cols-2 lg:w-[600px] ">
                                    {components.map((component) => (
                                        <ListItem
                                            key={component.title}
                                            title={component.title}
                                            href={component.href}
                                        >
                                            {component.description}
                                        </ListItem>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/drivers" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={`${navigationMenuTriggerStyle()} ${
                                        styles.NavigationMenuTrigger
                                    } bg-zinc-950 text-zinc-50`}
                                >
                                    Drivers
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/cart" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={`${navigationMenuTriggerStyle()} ${
                                        styles.NavigationMenuTrigger
                                    } bg-zinc-950 text-zinc-50`}
                                >
                                    Cart
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/appointments" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={`${navigationMenuTriggerStyle()} ${
                                        styles.NavigationMenuTrigger
                                    } bg-zinc-950 text-zinc-50`}
                                >
                                    Appointments
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/account" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={`${navigationMenuTriggerStyle()} ${
                                        styles.NavigationMenuTrigger
                                    } bg-zinc-950 text-zinc-50`}
                                >
                                    Account
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/contact" legacyBehavior passHref>
                                <NavigationMenuLink
                                    className={`${navigationMenuTriggerStyle()} ${
                                        styles.NavigationMenuTrigger
                                    } bg-zinc-950 text-zinc-50`}
                                >
                                    Contact
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        {status === "authenticated" ? (
                            <li className="px-4 hover:animate-pulse hover:text-red-600">
                                <LogoutButton />
                            </li>
                        ) : (
                            <li className="px-4 hover:animate-pulse text-zinc-50 hover:text-red-600">
                                <Link href="/auth/login">Login</Link>
                            </li>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>
            </nav>
        </>
    );
}


