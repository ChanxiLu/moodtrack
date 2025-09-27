"use client"
import React from 'react'
import Link from 'next/link'
import { Fugaz_One, Open_Sans } from 'next/font/google';
import Button from './Button';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from "next/navigation"

const opensans = Open_Sans({subsets: ["latin"]});
const fugaz = Fugaz_One({subsets: ["latin"], weight: ['400']})

export default function Logout() {
    const { currentUser, logout } = useAuth();
    const router = useRouter()
    const pathname = usePathname()
    
    async function handleLogout() {
    try {
        await logout()
        router.push("/")   // go to landing page
        } catch (err) {
            console.error("Logout failed:", err)
        }
    }

    if (pathname === '/' && currentUser) {
        return (
            <Link href={'/dashboard'}>
                <Button text="Go to dashboard" />
            </Link>
        )
    }

    return (
        currentUser && <Button text='Logout' dark className='text-xs' clickHandler={handleLogout}></Button> 
    )
}
