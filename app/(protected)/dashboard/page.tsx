"use client"

import { signOut, useSession } from 'next-auth/react';
import React from 'react'

const page = () => {
    const { data } = useSession();
    return (
        <div>
            <h2>Welcome, {data?.user?.email || data?.user.name}</h2>
            <button onClick={() => signOut()}>Sign Out</button>
        </div>
    );

}

export default page