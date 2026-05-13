import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTopicItem } from "./SortableTopicItem";
import { FaGripVertical, FaSpinner } from "react-icons/fa";
import axiosInstance from "../../../../../../utils/axiosInstance";
import toast from "react-hot-toast";

const CourseTopicsList = ({ course, topics, onReorder, refreshCourse, readOnly }) => {
  const [items, setItems] = useState(topics);
  const [reordering, setReordering] = useState(false);

  // Update items when topics prop changes
  useEffect(() => {
    setItems(topics);
  }, [topics]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    if (readOnly) return;

    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item._id === active.id);
      const newIndex = items.findIndex((item) => item._id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);

      // Update local state immediately for smooth UX
      setItems(newItems);

      // Update order numbers
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      // Send update to server
      await updateTopicOrder(updatedItems);
    }
  };

  const updateTopicOrder = async (updatedTopics) => {
    setReordering(true);
    try {
      const topicsData = updatedTopics.map((topic) => ({
        topicId: topic._id,
        order: topic.order,
      }));

      const response = await axiosInstance.put(
        `/courses/${course?._id}/reorder-topics`,
        { topics: topicsData }
      );

      if (response.data.success) {
        toast.success("Topic order updated!");
        // Refresh course data from server
        if (refreshCourse) {
          refreshCourse();
        }
      } else {
        toast.error("Failed to update topic order");
        // Revert to original order on error
        setItems(topics);
      }
    } catch (error) {
      console.error("Error updating topic order:", error);
      toast.error("Error updating topic order");
      // Revert to original order on error
      setItems(topics);
    } finally {
      setReordering(false);
    }
  };

  const handleTopicUpdated = (updatedTopic) => {
    // Update the topic in local state
    setItems((prevItems) =>
      prevItems.map((topic) =>
        topic._id === updatedTopic._id ? { ...topic, ...updatedTopic } : topic
      )
    );

    // Refresh course data from server to ensure consistency
    if (refreshCourse) {
      refreshCourse();
    }
  };

  const handleTopicDeleted = (deletedTopicId) => {
    // Remove the topic from local state
    setItems((prevItems) =>
      prevItems.filter((topic) => topic._id !== deletedTopicId)
    );

    // Refresh course data from server
    if (refreshCourse) {
      refreshCourse();
    }
  };

  if (readOnly) {
    return (
      <div className="space-y-3">
        {items.map((topic) => (
          <SortableTopicItem
            course={course}
            key={topic._id}
            id={topic._id}
            topic={topic}
            onTopicUpdated={handleTopicUpdated}
            onTopicDeleted={handleTopicDeleted}
            readOnly={true}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {reordering && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto mb-2"></div>
            <p className="text-sm text-teal-700">Updating order...</p>
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaGripVertical className="text-teal-500" />
          <span className="text-sm font-medium text-teal-700">
            Drag topics to reorder
          </span>
        </div>
        <span className="text-xs text-gray-500">
          Drag handle (≡) to reorder
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((topic) => (
              <SortableTopicItem
                course={course}
                key={topic._id}
                id={topic._id}
                topic={topic}
                onTopicUpdated={handleTopicUpdated}
                onTopicDeleted={handleTopicDeleted}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default CourseTopicsList;
