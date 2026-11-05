import {
  TOPIC_MAP_CLUSTERS,
  TOPIC_MAP_NODES,
  type TopicMapClusterId,
} from "./data";

/**
 * Deterministic geometry of the 3 AImigo topic map in viewBox units. Clusters
 * sit in a fixed 3×2 grid with the monthly digests as a timeline strip below;
 * nodes fill their cluster in data order and add rows as needed. Nothing here measures the DOM, so
 * prerendered and hydrated markup match.
 */

export const MAP_WIDTH = 1200;
export const NODE_WIDTH = 172;
export const NODE_HEIGHT = 66;

const MARGIN = 16;
const GAP = 16;
const COLUMN_WIDTH = (MAP_WIDTH - 2 * MARGIN - 2 * GAP) / 3;
const NODE_TOP_OFFSET = 56;
const NODE_ROW_STEP = NODE_HEIGHT + 14;
const STRIP_COLUMNS = 6;
const count = (cluster: string) => TOPIC_MAP_NODES.filter((node) => node.cluster === cluster).length;
const extraRows = (clusters: string[], columns: number, initialRows: number) =>
  Math.max(0, ...clusters.map((cluster) => Math.ceil(count(cluster) / columns) - initialRows)) * NODE_ROW_STEP;
const ROW_ONE_HEIGHT = 300 + extraRows(['delivery', 'models', 'people'], 2, 3);
const ROW_TWO_HEIGHT = 228 + extraRows(['autonomy', 'agent-customer', 'ai-native'], 2, 2);
const STRIP_HEIGHT = 128 + extraRows(['digests'], STRIP_COLUMNS, 1);
export const MAP_HEIGHT = MARGIN * 2 + GAP * 2 + ROW_ONE_HEIGHT + ROW_TWO_HEIGHT + STRIP_HEIGHT;

export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

const column = (index: number) => MARGIN + index * (COLUMN_WIDTH + GAP);
const ROW_TWO_Y = MARGIN + ROW_ONE_HEIGHT + GAP;
const STRIP_Y = ROW_TWO_Y + ROW_TWO_HEIGHT + GAP;

export const CLUSTER_BOXES: Readonly<Record<TopicMapClusterId, Box>> = {
  delivery: { x: column(0), y: MARGIN, width: COLUMN_WIDTH, height: ROW_ONE_HEIGHT },
  models: { x: column(1), y: MARGIN, width: COLUMN_WIDTH, height: ROW_ONE_HEIGHT },
  people: { x: column(2), y: MARGIN, width: COLUMN_WIDTH, height: ROW_ONE_HEIGHT },
  autonomy: { x: column(0), y: ROW_TWO_Y, width: COLUMN_WIDTH, height: ROW_TWO_HEIGHT },
  "agent-customer": { x: column(1), y: ROW_TWO_Y, width: COLUMN_WIDTH, height: ROW_TWO_HEIGHT },
  "ai-native": { x: column(2), y: ROW_TWO_Y, width: COLUMN_WIDTH, height: ROW_TWO_HEIGHT },
  digests: { x: MARGIN, y: STRIP_Y, width: MAP_WIDTH - 2 * MARGIN, height: STRIP_HEIGHT },
};

const gridNodeBoxes = (cluster: Box, count: number): Box[] => {
  const inset = (cluster.width - 2 * NODE_WIDTH) / 3;
  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / 2);
    const isLonelyLast = index === count - 1 && count % 2 === 1;
    const x = isLonelyLast
      ? cluster.x + (cluster.width - NODE_WIDTH) / 2
      : cluster.x + inset + (index % 2) * (NODE_WIDTH + inset);
    return { x, y: cluster.y + NODE_TOP_OFFSET + row * NODE_ROW_STEP, width: NODE_WIDTH, height: NODE_HEIGHT };
  });
};

const stripNodeBoxes = (strip: Box, count: number): Box[] => {
  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / STRIP_COLUMNS);
    const members = Math.min(count - row * STRIP_COLUMNS, STRIP_COLUMNS);
    const gap = (strip.width - members * NODE_WIDTH) / (members + 1);
    return {
      x: strip.x + gap + (index % STRIP_COLUMNS) * (NODE_WIDTH + gap),
      y: strip.y + 48 + row * NODE_ROW_STEP,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    };
  });
};

const computeNodeBoxes = (): ReadonlyMap<string, Box> => {
  const boxes = new Map<string, Box>();
  for (const cluster of TOPIC_MAP_CLUSTERS) {
    const members = TOPIC_MAP_NODES.filter((node) => node.cluster === cluster.id);
    const frame = CLUSTER_BOXES[cluster.id];
    const placed = cluster.id === "digests"
      ? stripNodeBoxes(frame, members.length)
      : gridNodeBoxes(frame, members.length);
    members.forEach((node, index) => boxes.set(node.id, placed[index]));
  }
  return boxes;
};

export const NODE_BOXES = computeNodeBoxes();

export const nodeBox = (id: string): Box => {
  const box = NODE_BOXES.get(id);
  if (!box) throw new Error(`Unknown topic map node: ${id}`);
  return box;
};

const centre = (box: Box) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });

/** Point where the segment from the box centre towards `target` leaves the box, pushed out by `gap`. */
const exitPoint = (box: Box, target: { x: number; y: number }, gap: number) => {
  const from = centre(box);
  const dx = target.x - from.x;
  const dy = target.y - from.y;
  const scaleX = dx === 0 ? Infinity : (box.width / 2 + gap) / Math.abs(dx);
  const scaleY = dy === 0 ? Infinity : (box.height / 2 + gap) / Math.abs(dy);
  const scale = Math.min(scaleX, scaleY, 1);
  return { x: from.x + dx * scale, y: from.y + dy * scale };
};

/** Edge segment between two node outlines, so lines never run under labels. */
export const edgeSegment = (fromId: string, toId: string, gap = 2) => {
  const fromBox = nodeBox(fromId);
  const toBox = nodeBox(toId);
  return {
    start: exitPoint(fromBox, centre(toBox), gap),
    end: exitPoint(toBox, centre(fromBox), gap),
  };
};

/** Percent box for the HTML hit target laid over a node. */
export const percentBox = (box: Box) => ({
  left: `${(box.x / MAP_WIDTH) * 100}%`,
  top: `${(box.y / MAP_HEIGHT) * 100}%`,
  width: `${(box.width / MAP_WIDTH) * 100}%`,
  height: `${(box.height / MAP_HEIGHT) * 100}%`,
});
