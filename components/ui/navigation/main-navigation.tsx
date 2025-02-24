import Link from "next/link";

export default function MainNavigation() {
    return (
        <nav className="hidden lg:flex w-8/12 items-center xl:text-xl">
            <ul className="flex flex-row justify-end w-full text-zinc-50 ">
              <li className="px-4 hover:animate-pulse hover:text-red-600">
                <Link href='/'>Cars</Link>
              </li>
              <li className="px-4 hover:animate-pulse hover:text-red-600">
                <Link href='/'>Drivers</Link>
              </li>
              <li className="px-4 hover:animate-pulse hover:text-red-600">
                <Link href='/'>Cart</Link>
              </li>
              <li className="px-4 hover:animate-pulse hover:text-red-600">
                <Link href='/'>Appointments</Link>
              </li>
              <li className="px-4 hover:animate-pulse hover:text-red-600">
                <Link href='/'>Account</Link>
              </li>
              <li className="px-4 hover:animate-pulse hover:text-red-600">
                <Link href='/'>Contact</Link>
              </li>
              <li className="px-4 hover:animate-pulse hover:text-red-600">
                <Link href='/auth/login'>Login</Link>
              </li>
            </ul>
          </nav>
    );
}