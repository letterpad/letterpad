import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FC, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { Button } from "ui";

import { Collection } from "@/components/navigation-builder/types";

import { EventAction, EventCategory, EventLabel, track } from "@/track";

import { Item } from "./item";
import { SuggestionModal } from "./suggestion-modal";
import { createNewRow, mergeData } from "./utils";

import { IMenuWithError } from "@/types";

interface Props {
  items: IMenuWithError[];
  suggestions: Collection[];
  onChange: (data: IMenuWithError[]) => void;
}

export const List: FC<Props> = ({ items = [], suggestions, onChange }) => {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [libraries, setLibraries] = useState(items);
  const [showModal, setShowModal] = useState(false);

  const updateLibraries = (updatedLibraries) => {
    onChange(updatedLibraries);
    setLibraries(updatedLibraries);
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (result) => {
    const { active, over } = result;
    if (!over) {
      return;
    }
    if (active.id !== over.id) {
      const oldIndex = libraries.findIndex(
        (library) => library.id === active.id
      );
      const newIndex = libraries.findIndex((library) => library.id === over.id);
      updateLibraries(arrayMove(libraries, oldIndex, newIndex));
    }
    setActiveItem(null);
    track({
      eventAction: EventAction.Change,
      eventCategory: EventCategory.Navigation,
      eventLabel: "sort",
    });
  };

  const addNewRow = (e) => {
    e.preventDefault();
    setLibraries((libraries) => [...libraries, createNewRow(libraries)]);
  };

  const onItemChange = (change: IMenuWithError) => {
    updateLibraries(mergeData(libraries, change));
  };

  const onItemRemove = (change: IMenuWithError) => {
    const modified = libraries.filter((item) => item.id !== change.id);
    updateLibraries(modified);
    track({
      eventAction: EventAction.Click,
      eventCategory: EventCategory.Navigation,
      eventLabel: EventLabel.RemoveItem,
    });
  };

  const onSuggestionSelect = (slug: string) => {
    const item = libraries.find((item) => item.id === activeItem);
    const suggestionItem = suggestions.find((a) => a.slug === slug);
    if (item && suggestionItem)
      onItemChange({
        ...item,
        slug: slug.split("/").pop() as string,
        original_name: suggestionItem.original_name,
        type: suggestionItem.type,
      });
    setShowModal(false);
    setActiveItem(null);
  };

  const openSuggestions = (id: number) => {
    setActiveItem(id);
    setShowModal(true);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={libraries?.map((library) => ({ id: library.id }))}
        strategy={verticalListSortingStrategy}
      >
        {libraries.map((library) => (
          <Item
            key={library.id}
            library={library}
            onChange={onItemChange}
            onRemove={onItemRemove}
            openSuggestions={openSuggestions}
          />
        ))}
      </SortableContext>
      <div className="flex items-end justify-center gap-2">
        <Button
          onClick={addNewRow}
          data-testid="newMenuBtn"
          variant="primary"
          className="flex items-center justify-center gap-1"
          size={"small"}
        >
          <BiPlus size={18} />
          Add New
        </Button>
      </div>
      <SuggestionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        suggestions={suggestions}
        onSelect={onSuggestionSelect}
      />
    </DndContext>
  );
};
