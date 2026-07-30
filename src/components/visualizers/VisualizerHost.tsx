"use client";

import { VisualizerKey } from "@/lib/curriculum";
import BubbleSortVisualizer from "./BubbleSortVisualizer";
import LinkedListVisualizer from "./LinkedListVisualizer";
import StackQueueVisualizer from "./StackQueueVisualizer";
import BinarySearchVisualizer from "./BinarySearchVisualizer";
import BigOChart from "./BigOChart";
import BlueprintVisualizer from "./BlueprintVisualizer";
import CapsuleVisualizer from "./CapsuleVisualizer";
import InheritanceVisualizer from "./InheritanceVisualizer";
import PolymorphismVisualizer from "./PolymorphismVisualizer";
import AbstractionVisualizer from "./AbstractionVisualizer";
import ArrayVisualizer from "./ArrayVisualizer";
import TreeVisualizer from "./TreeVisualizer";
import HashMapVisualizer from "./HashMapVisualizer";
import MergeSortVisualizer from "./MergeSortVisualizer";
import QuickSortVisualizer from "./QuickSortVisualizer";
import GraphTraversalVisualizer from "./GraphTraversalVisualizer";
import MemoryVisualizer from "./MemoryVisualizer";

export default function VisualizerHost({ vkey }: { vkey: VisualizerKey }) {
  switch (vkey) {
    case "blueprint":
      return <BlueprintVisualizer focus="class" />;
    case "objects":
      return <BlueprintVisualizer focus="objects" />;
    case "capsule":
      return <CapsuleVisualizer />;
    case "inheritance":
      return <InheritanceVisualizer />;
    case "polymorphism":
      return <PolymorphismVisualizer />;
    case "abstraction":
      return <AbstractionVisualizer />;
    case "array":
      return <ArrayVisualizer />;
    case "linked-list":
      return <LinkedListVisualizer />;
    case "stack-queue":
      return <StackQueueVisualizer />;
    case "tree":
      return <TreeVisualizer />;
    case "hash-map":
      return <HashMapVisualizer />;
    case "bubble-sort":
      return <BubbleSortVisualizer />;
    case "merge-sort":
      return <MergeSortVisualizer />;
    case "quick-sort":
      return <QuickSortVisualizer />;
    case "binary-search":
      return <BinarySearchVisualizer />;
    case "bfs":
      return <GraphTraversalVisualizer algo="bfs" />;
    case "dfs":
      return <GraphTraversalVisualizer algo="dfs" />;
    case "big-o":
      return <BigOChart />;
    case "memory":
      return <MemoryVisualizer />;
    default:
      return null;
  }
}
