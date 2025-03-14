"use client";

import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { getUserByEmail } from "@/lib/db/users";
import { useActionState, useEffect, useState } from "react";
import { User } from "@/lib/definitions";
import { updateUser } from "@/app/actions/user/actions";
import CloseButton from "@/components/ui/CloseButton";

interface UserData {
    name: string;
    address: string;
    phone: string;
    email: string;
    role: string;
    dob: string | Date;
    drivingSince: string | Date;
    pictureUrl?: string;
}

export default function AccountPage() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User>();
    const [userData, setUserData] = useState<UserData>({
        name: "",
        address: "",
        phone: "",
        email: "",
        role: "CUSTOMER",
        dob: "",
        drivingSince: "",
    });
    const [error, setError] = useState<string | null>(null);
    const email = session?.user?.email;

    useEffect(() => {
        if (status === "authenticated" && email) {
            const fetchUser = async () => {
                try {
                    const userData = await getUserByEmail(email);
                    const user = userData as User;

                    if (user) {
                        setUser(user);
                        setUserData({
                            email: user.email || email,
                            name: user.name || "",
                            address: user.address || "",
                            phone: user.phone || "",
                            role: user.role || "CUSTOMER",
                            dob: user.dob || "",
                            drivingSince: user.drivingSince || "",
                            pictureUrl: user.pictureUrl || "",
                        });
                    } else {
                        setUserData((prev: UserData) => ({
                            ...prev,
                            email: email,
                        }));
                    }
                } catch (err) {
                    setError(`Error fetching user data: ${err}`);
                }
            };
            fetchUser();
        }
    }, [session, status, email]);

    const initialState = { message: "", errors: {} };
    const [formState, formAction] = useActionState(updateUser, initialState);

    if (status === "unauthenticated")
        return <p>You must be logged in to see this.</p>;

    if (error && error !== "User not found")
        return <p className="p-16 bg-slate-50 text-red-600">{error}</p>;

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col items-center w-full sm:w-11/12 md:w-10/12 mx-auto">
                <h1 className="my-8 font-semibold text-xl lg:font-bold lg:text-2xl text-center">
                    <em>Account details</em>
                </h1>
                <Image
                    src={user?.pictureUrl || "/customers/nc_default_user.png"}
                    alt="user image"
                    width={200}
                    height={200}
                    quality={80}
                    priority
                    className="rounded-full"
                />
                <p className="text-xl">
                    Hello {userData.name || session?.user?.name}!
                </p>
                <div className="flex flex-col w-full p-4 md:px-8">
                    <div className="flex flex-row justify-between align-middle mx-2">
                        <label
                            htmlFor="name"
                            className="w-3/12 xl:w-2/12 my-auto"
                        >
                            Email:
                        </label>

                        <p className="w-8/12 sm:w-9/12 p-1 my-auto rounded-md">
                            {email}
                        </p>
                    </div>
                    <div className="flex flex-row justify-between align-middle mx-2">
                        <label
                            htmlFor="name"
                            className="w-3/12 xl:w-2/12 my-auto"
                        >
                            Role:
                        </label>

                        <p className="w-8/12 sm:w-9/12 p-1 my-auto rounded-md">
                            {userData.role}
                        </p>
                    </div>
                </div>
                <form
                    action={() => {
                        const formData = new FormData();
                        Object.entries(userData).forEach(([key, value]) => {
                            formData.append(key, value as string);
                        });
                        formData.append("email", email || "");
                        formAction(formData);
                    }}
                    className="flex flex-col gap-4 justify-between align-middle w-full p-4 md:p-8"
                    noValidate
                >
                    <p className="flex flex-row justify-between align-middle mx-2">
                        <label
                            htmlFor="name"
                            className="w-3/12 xl:w-2/12 my-auto"
                        >
                            Full Name:
                        </label>
                        <input
                            className="text-zinc-950 w-8/12 sm:w-9/12 p-1 px-2 rounded-md"
                            id="name"
                            name="name"
                            type="text"
                            value={userData.name}
                            onChange={(e) =>
                                setUserData((prev: UserData) => ({
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
                        <label
                            htmlFor="address"
                            className="w-3/12 xl:w-2/12 my-auto"
                        >
                            Address:
                        </label>
                        <input
                            className="text-zinc-950 w-8/12 sm:w-9/12 p-1 px-2 rounded-md"
                            id="address"
                            name="address"
                            type="text"
                            value={userData.address}
                            onChange={(e) =>
                                setUserData((prev: UserData) => ({
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
                        <label
                            htmlFor="phone"
                            className="w-3/12 xl:w-2/12 my-auto"
                        >
                            Phone:
                        </label>
                        <input
                            className="text-zinc-950 w-8/12 sm:w-9/12 p-1 px-2 rounded-md"
                            id="phone"
                            name="phone"
                            type="text"
                            value={userData.phone}
                            onChange={(e) =>
                                setUserData((prev: UserData) => ({
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
                        <label
                            htmlFor="dob"
                            className="w-3/12 xl:w-2/12 my-auto"
                        >
                            Date of birth:
                        </label>
                        <input
                            className="text-zinc-950 w-8/12 sm:w-9/12 p-1 px-2 rounded-md"
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
                                setUserData((prev: UserData) => ({
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
                        <label
                            htmlFor="drivingSince"
                            className="w-3/12 xl:w-2/12 my-auto"
                        >
                            Driving since:{" "}
                        </label>
                        <input
                            className="text-zinc-950 w-8/12 sm:w-9/12 p-1 px-2 rounded-md"
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
                                setUserData((prev: UserData) => ({
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
                        className="bg-zinc-200 text-zinc-950 mt-4 hover:text-zinc-50 hover:bg-zinc-700 w-1/3 mx-auto"
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
            </div>
            <div className="w-full flex flex-row justify-end pb-4 pe-4">
                <CloseButton target="/" />
            </div>
        </div>
    );
}
