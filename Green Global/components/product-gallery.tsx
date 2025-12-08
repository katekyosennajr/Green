'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGalleryProps {
    images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    const [selectedindex, setSelectedIndex] = useState(0);

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedIndex(idx)}
                        className={cn(
                            "relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                            selectedindex === idx ? "border-gold-500 ring-2 ring-gold-200" : "border-transparent opacity-70 hover:opacity-100"
                        )}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative bg-cream-100 rounded-2xl overflow-hidden aspect-square md:aspect-auto md:h-[600px] border border-green-100">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedindex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={images[selectedindex]}
                            alt="Product Detail"
                            className="w-full h-full object-cover cursor-zoom-in hover:scale-125 transition-transform duration-1000 origin-center"
                        />
                    </motion.div>
                </AnimatePresence>

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-800 shadow-sm">
                    Real Pic
                </div>
            </div>
        </div>
    );
}
