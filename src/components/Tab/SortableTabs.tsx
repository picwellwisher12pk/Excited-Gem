import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTab } from './SortableTab';
import type { Tab as TabType } from '../../store/tabSlice';

interface SortableTabsProps {
  tabs: TabType[];
  onDragEnd: (event: DragEndEvent) => void;
  children: (tab: TabType) => React.ReactNode;
}

export function SortableTabs({ tabs, onDragEnd, children }: SortableTabsProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={tabs.map(tab => tab.id)} strategy={verticalListSortingStrategy}>
        {tabs.map((tab) => (
          <SortableTab
            key={tab.id}
            tab={tab}
          >
            {children(tab)}
          </SortableTab>
        ))}
      </SortableContext>
    </DndContext>
  );
}
