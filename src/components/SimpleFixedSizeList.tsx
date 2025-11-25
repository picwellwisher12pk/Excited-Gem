import React, { useRef, useState } from 'react';

type Props = {
    height: number;
    width: number;
    itemCount: number;
    itemSize: number;
    children: (props: { index: number; style: React.CSSProperties }) => React.ReactNode;
    itemData?: any;
};

export const SimpleFixedSizeList = React.forwardRef<HTMLDivElement, Props>(({
    height,
    width,
    itemCount,
    itemSize,
    children,
}, ref) => {
    const [scrollTop, setScrollTop] = useState(0);
    const innerRef = useRef<HTMLDivElement>(null);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    };

    const totalHeight = itemCount * itemSize;
    // Buffer a few items to prevent flickering
    const buffer = 5;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemSize) - buffer);
    const endIndex = Math.min(
        itemCount - 1,
        Math.floor((scrollTop + height) / itemSize) + buffer
    );

    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
        items.push(
            children({
                index: i,
                style: {
                    position: 'absolute',
                    top: i * itemSize,
                    left: 0,
                    width: '100%',
                    height: itemSize,
                },
            })
        );
    }

    return (
        <div
            ref={ref || innerRef}
            className="custom-scrollbar"
            style={{ height, width, overflow: 'auto', position: 'relative' }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight, width: '100%' }}>
                {items}
            </div>
        </div>
    );
});
