'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DynamicMap = dynamic(() => import('@/components/ui/LeafletMap'), { ssr: false });

export default function Map() { 
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { 
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600 m-8 mx-auto mt-48 mb-8"></div>
                <div className="text-zinc-400 mb-48">Loading map...</div>
            </div>
        );
    }

    return <DynamicMap />;
}