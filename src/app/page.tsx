'use client';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { AnimatePulseLoadingView } from '@/components/map/Loading';
export default function Home() {
    const Map = useMemo(
        () =>
            dynamic(() => import('@/components/map/index'), {
                loading: () => <AnimatePulseLoadingView />,
                ssr: false,
            }),
        [],
    );
    return (
        <>
            <div>
                <Map></Map>
            </div>
        </>
    );
}

