"use client";

import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { getUserByEmail } from "@/lib/queries/users-queries";
import { useActionState, useEffect, useState } from "react";
import { User } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { updateUser } from "@/app/actions/account/actions";

export default function AccountPage() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User>();
    const [userData, setUserData] = useState<{
        name: string;
        address: string;
        phone: string;
        email: string;
        role: string;
        dob: string;
        drivingSince: string;
    }>({
        name: "",
        address: "",
        phone: "",
        email: session?.user?.email || "",
        role: "CUSTOMER",
        dob: "",
        drivingSince: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            const fetchUser = async () => {
                try {
                    const user = await getUserByEmail(userData.email);

                    if (user) {
                        setUserData({
                            email: user.email,
                            name: user.name || "",
                            address: user.address || "",
                            phone: user.phone || "",
                            role: user.role ? user.role : "CUSTOMER",
                            dob: user.dob || "",
                            drivingSince: user.drivingSince || "",
                        });
                    } else {
                        setError("User not found");
                    }
                } catch (err) {
                    setError("Error fetching user data");
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        }
    }, [session, status]);

    const initialState = { message: "", errors: {} };
    const [formState, formAction] = useActionState(updateUser, initialState);

    const handleClose = () => {
        router.push("/");
    };

    if (status === "loading" || loading) return <p>Loading...</p>;

    if (status === "unauthenticated")
        return <p>You must be logged in to see this.</p>;

    if (error && error !== "User not found")
        return <p className="p-16 bg-slate-50 text-red-600">{error}</p>;

    return (
        <div className="flex flex-col items-center bg-zinc-900 text-red-600 w-full md:w-10/12 lg:w-8/12 xl:w-6/12 2xl:w-4/12 rounded-lg border border-red-600 mt-4">
            <h3 className="my-8 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                <em>Your Account</em>
            </h3>

            <Image
                src={user?.pictureUrl || "/customers/nc_default_user.png"}
                alt="user image"
                width={150}
                height={150}
                quality={80}
            />
            <p className="text-xl">
                Hello {userData.name || session?.user?.name}!
            </p>
            <form
                action={() => {
                    const formData = new FormData();
                    Object.entries(userData).forEach(([key, value]) => {
                        formData.append(key, value as string);
                    });
                    formAction(formData);
                }}
                className="flex flex-col gap-4 justify-between align-middle w-full p-4 md:p-8"
                noValidate
            >
                <p className="flex flex-row justify-between mx-2">
                    <label htmlFor="name" className="w-3/12 xl:w-2/12">
                        Full Name:
                    </label>
                    <input
                        className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                        id="name"
                        name="name"
                        type="text"
                        value={userData.name}
                        onChange={(e) =>
                            setUserData((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                            }))
                        }
                        aria-describedby="name-error"
                    />
                </p>
                <div
                    id="name-error"
                    className="text-center text-base text-red-600"
                >
                    {formState.errors?.name &&
                        formState.errors?.name.map((error) => (
                            <p key={error}>{error}</p>
                        ))}
                </div>
                <p className="flex flex-row justify-between mx-2">
                    <label htmlFor="address" className="w-3/12 xl:w-2/12">
                        Address:
                    </label>
                    <input
                        className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                        id="address"
                        name="address"
                        type="text"
                        value={userData.address}
                        onChange={(e) =>
                            setUserData((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                            }))
                        }
                        aria-describedby="address-error"
                    />
                </p>
                <div
                    id="address-error"
                    className="text-center text-base text-red-600"
                >
                    {formState.errors?.address &&
                        formState.errors?.address.map((error) => (
                            <p key={error}>{error}</p>
                        ))}
                </div>
                <p className="flex flex-row justify-between mx-2">
                    <label htmlFor="phone" className="w-3/12 xl:w-2/12">
                        Phone:
                    </label>
                    <input
                        className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                        id="phone"
                        name="phone"
                        type="text"
                        value={userData.phone}
                        onChange={(e) =>
                            setUserData((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                            }))
                        }
                        aria-describedby="phone-error"
                    />
                </p>
                <div
                    id="phone-error"
                    className="text-center text-base text-red-600"
                >
                    {formState.errors?.phone &&
                        formState.errors?.phone.map((error) => (
                            <p key={error}>{error}</p>
                        ))}
                </div>
                <p className="flex flex-row justify-between mx-2">
                    <label htmlFor="email" className="w-3/12 xl:w-2/12">
                        E-mail:
                    </label>
                    <input
                        className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        disabled
                        aria-describedby="email-error"
                    />
                </p>
                <div
                    id="email-error"
                    className="text-center text-base text-red-600"
                >
                    {formState.errors?.name &&
                        formState.errors?.name.map((error) => (
                            <p key={error} className="hidden">
                                {error}
                            </p>
                        ))}
                </div>
                <p className="flex flex-row justify-between mx-2">
                    <label htmlFor="role" className="w-3/12 xl:w-2/12">
                        Role:
                    </label>
                    <select
                        className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                        name="role"
                        id="role"
                        value={user?.role || "CUSTOMER"}
                        onChange={(e) =>
                            setUserData((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                            }))
                        }
                        disabled={user?.role === "CUSTOMER"}
                        aria-describedby="role-error"
                    >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="DRIVER">DRIVER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </p>
                <div
                    id="role-error"
                    className="text-center text-base text-red-600"
                >
                    {formState.errors?.role &&
                        formState.errors?.role.map((error) => (
                            <p key={error}>{error}</p>
                        ))}
                </div>
                <p className="flex flex-row justify-between mx-2">
                    <label htmlFor="dob" className="w-3/12 xl:w-2/12">
                        Date of birth:
                    </label>
                    <input
                        className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                        id="dob"
                        name="dob"
                        type="date"
                        value={
                            userData.dob
                                ? new Date(userData.dob)
                                      .toISOString()
                                      .split("T")[0]
                                : ""
                        }
                        onChange={(e) =>
                            setUserData((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                            }))
                        }
                        aria-describedby="dob-error"
                    />
                </p>
                <div
                    id="dob-error"
                    className="text-center text-base text-red-600"
                >
                    {formState.errors?.dob &&
                        formState.errors?.dob.map((error) => (
                            <p key={error}>{error}</p>
                        ))}
                </div>
                <p className="flex flex-row justify-between mx-2">
                    <label htmlFor="drivingSince" className="w-3/12 xl:w-2/12">
                        Driving since:{" "}
                    </label>
                    <input
                        className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                        id="drivingSince"
                        name="drivingSince"
                        type="date"
                        value={
                            userData.drivingSince
                                ? new Date(userData.drivingSince)
                                      .toISOString()
                                      .split("T")[0]
                                : ""
                        }
                        onChange={(e) =>
                            setUserData((prev) => ({
                                ...prev,
                                [e.target.name]: e.target.value,
                            }))
                        }
                        aria-describedby="drivingSince-error"
                    />
                </p>
                <div
                    id="drivingSince-error"
                    className="text-center text-base text-red-600"
                >
                    {formState.errors?.drivingSince &&
                        formState.errors?.drivingSince.map((error) => (
                            <p key={error}>{error}</p>
                        ))}
                </div>
                <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    className="mx-auto w-1/2"
                    disabled={formState.message ? true : false}
                >
                    Update
                </Button>
            </form>
            <div
                id="general-error"
                className="text-center text-base text-red-600 pb-4"
            >
                {formState.message && <p>{formState.message}</p>}
            </div>
            <div className="w-full flex flex-row justify-end pb-4 pe-4">
                <Button variant="destructive" size="icon" onClick={handleClose}>
                    <X />
                </Button>
            </div>
        </div>
    );
}
