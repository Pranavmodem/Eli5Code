"use client";

import { VisualizerKey } from "@/lib/curriculum";
import BubbleSortVisualizer from "./BubbleSortVisualizer";
import LinkedListVisualizer from "./LinkedListVisualizer";
import StackQueueVisualizer from "./StackQueueVisualizer";
import BinarySearchVisualizer from "./BinarySearchVisualizer";
import BigOChart from "./BigOChart";

export default function VisualizerHost({ vkey }: { vkey: VisualizerKey }) {
  switch (vkey) {
    case "bubble-sort":
      return <BubbleSortVisualizer />;
    case "linked-list":
      return <LinkedListVisualizer />;
    case "stack-queue":
      return <StackQueueVisualizer />;
    case "binary-search":
      return <BinarySearchVisualizer />;
    case "big-o":
      return <BigOChart />;
    default:
      return null;
  }
}
