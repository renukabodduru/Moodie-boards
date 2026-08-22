import React, { useState, useRef, useEffect } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject, AnchorPosition } from '../../types/board';
import { getAllAnchors } from '../../utils/geometry';
import {
  Lock,
  Unlock,
  Copy,
  ClipboardPaste,
  Trash2,
  Palette,
  ChevronUp,
  ChevronDown,
  Link2,
} from 'lucide-react';

interface BaseCardProps {
  object: CanvasObject;
  children: React.ReactNode;
}

export const BaseCard: React.FC<BaseCardProps> = ({
  object,
  children,
}) => {
  const {
    selectedIds,
    toggleSelectObject,
    updateObject,
    deleteObject,
    deleteSelectedObjects,
    duplicateObject,
    duplicateSelectedObjects,
    copySelectedObjects,
    pasteObjects,
    lockObject,
    changeObjectLayering,
    startDraggingConnection,
    finishDraggingConnection,
    zoom,
    pan,
    boardObjects,
    addComment,
    setActiveGuides,
    hoveredColumnId,
    setHoveredColumnId,
    groupSelectedObjects,
    ungroupSelectedObjects,
    reorderColumn,
  } = useBoard();

  const cardRef = useRef<HTMLDivElement | null>(null);

  const isSelected = selectedIds.includes(object.id);

  const isMultiSelected =
    selectedIds.length > 1 && isSelected;

  const [isDragging, setIsDragging] =
    useState(false);

  const [
    resizeMode,
    setResizeMode,
  ] = useState<
    'none' | 'corner' | 'right' | 'bottom'
  >('none');

  const [
    showColorPicker,
    setShowColorPicker,
  ] = useState(false);

  const [
    contextMenuPos,
    setContextMenuPos,
  ] = useState<{
    x: number;
    y: number;
  } | null>(null);

  /*
   * ============================================================
   * DRAG REFERENCES
   * ============================================================
   */

  const dragStartRef = useRef<{
    mouseX: number;
    mouseY: number;
    initialPositions: Record<
      string,
      {
        x: number;
        y: number;
      }
    >;
    primaryTargets?: string[];
  }>({
    mouseX: 0,
    mouseY: 0,
    initialPositions: {},
    primaryTargets: [],
  });

  const currentDeltaRef = useRef<{
    dx: number;
    dy: number;
  }>({
    dx: 0,
    dy: 0,
  });

  const animFrameIdRef =
    useRef<number | null>(null);

  /*
   * Keep the latest zoom available to the
   * mouse handlers without recreating them
   * unnecessarily.
   */
  const zoomRef = useRef(zoom);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  /*
   * ============================================================
   * RESIZE REFERENCES
   * ============================================================
   */

  const resizeStartRef = useRef<{
    mouseX: number;
    mouseY: number;
    startW: number;
    startH: number;
  }>({
    mouseX: 0,
    mouseY: 0,
    startW: object.width,
    startH: object.height,
  });

  /*
   * ============================================================
   * COLORS
   * ============================================================
   */

  const COLOR_PALETTE = [
    '#ffffff',
    '#fafafa',
    '#f5f5f5',
    '#e5e5e5',
    '#d4d4d4',
    '#a3a3a3',
    '#404040',
    '#171717',
  ];

  /*
   * ============================================================
   * START CARD DRAG
   * ============================================================
   */

  const handlePointerDown = (
    e: React.PointerEvent
  ) => {
    if (object.locked) return;

    if (e.button !== 0) return;

    const target = e.target as HTMLElement;
    if (target.closest('input, textarea, button, audio, video, a, label, select')) {
      e.stopPropagation();
      return;
    }

    e.stopPropagation();

    const multi = e.shiftKey;

    const groupIdsToToggle = object.groupId
      ? boardObjects.filter(o => o.groupId === object.groupId).map(o => o.id)
      : [object.id];

    let targets = [...selectedIds];

    if (multi) {
      if (selectedIds.includes(object.id)) {
        // Shift-clicking an already selected object deselects it.
        // We shouldn't start a drag.
        toggleSelectObject(object.id, true);
        return;
      } else {
        // Shift-clicking an unselected object adds it (and its group) to selection.
        targets = Array.from(new Set([...selectedIds, ...groupIdsToToggle]));
        toggleSelectObject(object.id, true);
      }
    } else {
      if (!selectedIds.includes(object.id)) {
        // Clicking an unselected object without shift selects only its group.
        targets = groupIdsToToggle;
        toggleSelectObject(object.id, false);
      } else {
        // Clicking a selected object without shift keeps the selection, ready to drag all.
      }
    }

    /*
     * Save their original positions.
     */

    const initialPositions: Record<
      string,
      {
        x: number;
        y: number;
      }
    > = {};

    const getChildrenRecursively = (parentId: string): string[] => {
      const children = boardObjects.filter(o => o.parentId === parentId);
      return children.reduce((acc, child) => {
        return [...acc, child.id, ...getChildrenRecursively(child.id)];
      }, [] as string[]);
    };

    const draggedIds = new Set<string>();
    targets.forEach(id => {
      draggedIds.add(id);
      getChildrenRecursively(id).forEach(childId => draggedIds.add(childId));
    });

    draggedIds.forEach((id) => {
      const targetObject =
        boardObjects.find(
          (item) =>
            item.id === id
        );

      if (targetObject) {
        initialPositions[id] = {
          x: targetObject.x,
          y: targetObject.y,
        };
      }
    });

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initialPositions,
      primaryTargets: targets,
    };

    currentDeltaRef.current = {
      dx: 0,
      dy: 0,
    };

    setIsDragging(true);
  };

  /*
   * ============================================================
   * DRAG + RESIZE
   * ============================================================
   */

  useEffect(() => {
    const handlePointerMove = (
      e: PointerEvent
    ) => {
      /*
       * ========================================================
       * CARD DRAG
       * ========================================================
       */

      if (isDragging) {
        const currentZoom =
          zoomRef.current;

        const dx =
          (e.clientX -
            dragStartRef.current
              .mouseX) /
          currentZoom;

        const dy =
          (e.clientY -
            dragStartRef.current
              .mouseY) /
          currentZoom;

        currentDeltaRef.current = {
          dx,
          dy,
        };

        /*
         * Do only ONE React update per animation
         * frame.
         *
         * This is the important part.
         *
         * Previously you changed:
         *
         *   el.style.left
         *   el.style.top
         *
         * which moved the card visually but did
         * NOT update boardObjects.
         *
         * Now we update boardObjects continuously.
         *
         * SVGConnectionLayer therefore receives
         * the new card coordinates and follows it.
         */

        if (
          animFrameIdRef.current ===
          null
        ) {
          animFrameIdRef.current =
            requestAnimationFrame(
              () => {
                const { dx, dy } = currentDeltaRef.current;
                const positions = dragStartRef.current.initialPositions;
                const primaryStart = positions[object.id];
                
                let snappedDx = dx;
                let snappedDy = dy;
                let snappedXGuides: { axis: 'x' | 'y'; position: number }[] = [];
                let snappedYGuides: { axis: 'x' | 'y'; position: number }[] = [];
                let targetColumnId: string | null = null;

                if (primaryStart && !e.altKey) {
                  const rawX = primaryStart.x + dx;
                  const rawY = primaryStart.y + dy;
                  const rawCenterX = rawX + object.width / 2;
                  const rawCenterY = rawY + object.height / 2;
                  const rawRight = rawX + object.width;
                  const rawBottom = rawY + object.height;

                  const snapThreshold = 6 / zoomRef.current;
                  let minDiffX = snapThreshold;
                  let minDiffY = snapThreshold;

                  boardObjects.forEach((other) => {
                    if (selectedIds.includes(other.id)) return;
                    if (other.type === 'column') {
                      if (
                        rawCenterX >= other.x &&
                        rawCenterX <= other.x + other.width &&
                        rawCenterY >= other.y &&
                        rawCenterY <= other.y + other.height
                      ) {
                        targetColumnId = other.id;
                      }
                      return; // skip snapping to columns
                    }

                    const otherCenterX = other.x + other.width / 2;
                    const otherCenterY = other.y + other.height / 2;
                    const otherRight = other.x + other.width;
                    const otherBottom = other.y + other.height;

                    // X Snapping
                    const checkXSnap = (dragVal: number, targetVal: number) => {
                      const diff = Math.abs(dragVal - targetVal);
                      if (diff < minDiffX) {
                        minDiffX = diff;
                        snappedDx = dx - (dragVal - targetVal);
                        snappedXGuides = [{ axis: 'x', position: targetVal }];
                      } else if (diff === minDiffX && diff < snapThreshold) {
                        snappedXGuides.push({ axis: 'x', position: targetVal });
                      }
                    };
                    checkXSnap(rawX, other.x);
                    checkXSnap(rawX, otherRight);
                    checkXSnap(rawRight, other.x);
                    checkXSnap(rawRight, otherRight);
                    checkXSnap(rawCenterX, otherCenterX);

                    // Y Snapping
                    const checkYSnap = (dragVal: number, targetVal: number) => {
                      const diff = Math.abs(dragVal - targetVal);
                      if (diff < minDiffY) {
                        minDiffY = diff;
                        snappedDy = dy - (dragVal - targetVal);
                        snappedYGuides = [{ axis: 'y', position: targetVal }];
                      } else if (diff === minDiffY && diff < snapThreshold) {
                        snappedYGuides.push({ axis: 'y', position: targetVal });
                      }
                    };
                    checkYSnap(rawY, other.y);
                    checkYSnap(rawY, otherBottom);
                    checkYSnap(rawBottom, other.y);
                    checkYSnap(rawBottom, otherBottom);
                    checkYSnap(rawCenterY, otherCenterY);
                  });
                }

                setActiveGuides([...snappedXGuides, ...snappedYGuides]);
                setHoveredColumnId(targetColumnId);

                Object.entries(positions).forEach(([id, startPosition]) => {
                  updateObject(id, {
                    x: startPosition.x + snappedDx,
                    y: startPosition.y + snappedDy,
                  });
                });

                animFrameIdRef.current =
                  null;
              }
            );
        }
      }

      /*
       * ========================================================
       * RESIZE
       * ========================================================
       */

      if (
        resizeMode !==
        'none'
      ) {
        const currentZoom =
          zoomRef.current;

        const dw =
          (e.clientX -
            resizeStartRef.current
              .mouseX) /
          currentZoom;

        const dh =
          (e.clientY -
            resizeStartRef.current
              .mouseY) /
          currentZoom;

        let newWidth =
          resizeStartRef.current
            .startW;

        let newHeight =
          resizeStartRef.current
            .startH;

        if (
          resizeMode ===
          'corner' ||
          resizeMode === 'right'
        ) {
          newWidth =
            Math.max(
              resizeStartRef.current
                .startW + dw,
              140
            );
        }

        if (
          resizeMode ===
          'corner' ||
          resizeMode === 'bottom'
        ) {
          newHeight =
            Math.max(
              resizeStartRef.current
                .startH + dh,
              75
            );
        }

        updateObject(
          object.id,
          {
            width: newWidth,
            height: newHeight,
          }
        );
      }
    };

    /*
     * ==========================================================
     * MOUSE UP
     * ==========================================================
     */

    const handlePointerUp = () => {
      /*
       * --------------------------------------------------------
       * FINISH CARD DRAG
       * --------------------------------------------------------
       */

      if (isDragging) {
        /*
         * Cancel any pending animation frame.
         */

        if (
          animFrameIdRef.current !==
          null
        ) {
          cancelAnimationFrame(
            animFrameIdRef.current
          );

          animFrameIdRef.current =
            null;
        }

        const {
          dx,
          dy,
        } = currentDeltaRef.current;

        /*
         * IMPORTANT:
         *
         * The positions have already been
         * continuously written to boardObjects
         * during the drag.
         *
         * So we do NOT need to update the
         * position again here.
         */

        const positions =
          dragStartRef.current
            .initialPositions;

        /*
         * ------------------------------------------------------
         * COLUMN NESTING
         * ------------------------------------------------------
         */

        const movedObjectStart =
          positions[object.id];

        if (movedObjectStart) {
          const finalX =
            movedObjectStart.x +
            dx;

          const finalY =
            movedObjectStart.y +
            dy;

          const parentColumn =
            boardObjects.find(
              (other) =>
                other.id !==
                object.id &&
                other.type ===
                'column' &&
                finalX >= other.x &&
                finalX <=
                other.x +
                other.width &&
                finalY >= other.y &&
                finalY <=
                other.y +
                other.height
            );

          if (
            parentColumn &&
            object.parentId !==
            parentColumn.id
          ) {
            updateObject(
              object.id,
              {
                parentId:
                  parentColumn.id,
              }
            );
            setTimeout(() => reorderColumn(parentColumn.id), 50);
            if (object.parentId) {
              setTimeout(() => reorderColumn(object.parentId as string), 50);
            }
          } else if (
            !parentColumn &&
            object.parentId
          ) {
            const oldParentId = object.parentId;
            updateObject(
              object.id,
              {
                parentId:
                  undefined,
              }
            );
            setTimeout(() => reorderColumn(oldParentId), 50);
          } else if (
            parentColumn &&
            object.parentId === parentColumn.id
          ) {
            // Dragged within same column, reorder!
            setTimeout(() => reorderColumn(parentColumn.id), 50);
          }
        }

        const primaryTargets = dragStartRef.current.primaryTargets || [];

        /*
         * Reset drag state.
         */

        currentDeltaRef.current = {
          dx: 0,
          dy: 0,
        };

        dragStartRef.current = {
          mouseX: 0,
          mouseY: 0,
          initialPositions: {},
          primaryTargets: [],
        };

        setIsDragging(false);
        setActiveGuides([]);
        
        // If we dropped into a column, update parentId for explicitly dragged objects
        if (hoveredColumnId) {
          primaryTargets.forEach((id) => {
            updateObject(id, { parentId: hoveredColumnId });
          });
        }
        setHoveredColumnId(null);
      }

      /*
       * --------------------------------------------------------
       * FINISH RESIZE
       * --------------------------------------------------------
       */

      if (
        resizeMode !==
        'none'
      ) {
        setResizeMode('none');
      }
    };

    if (
      isDragging ||
      resizeMode !== 'none'
    ) {
      window.addEventListener(
        'pointermove',
        handlePointerMove
      );

      window.addEventListener(
        'pointerup',
        handlePointerUp
      );
    }

    return () => {
      window.removeEventListener(
        'pointermove',
        handlePointerMove
      );

      window.removeEventListener(
        'pointerup',
        handlePointerUp
      );
    };
  }, [
    isDragging,
    resizeMode,
    object.id,
    object.parentId,
    updateObject,
    boardObjects,
  ]);

  /*
   * ============================================================
   * RESIZE START
   * ============================================================
   */

  const handleResizeStart = (
    e: React.PointerEvent,
    mode:
      | 'corner'
      | 'right'
      | 'bottom'
  ) => {
    e.stopPropagation();

    setResizeMode(mode);

    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startW: object.width,
      startH: object.height,
    };
  };

  /*
   * ============================================================
   * START CONNECTION
   * ============================================================
   */

  const handleAnchorPointerDown = (
    e: React.PointerEvent,
    anchor: AnchorPosition
  ) => {
    e.stopPropagation();

    const canvasX =
      (e.clientX - pan.x) /
      zoom;

    const canvasY =
      (e.clientY - pan.y) /
      zoom;

    startDraggingConnection(
      object.id,
      anchor,
      canvasX,
      canvasY
    );
  };

  /*
   * ============================================================
   * ANCHORS
   * ============================================================
   */

  const anchors =
    getAllAnchors(object);

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div
      id={`card-${object.id}`}
      ref={cardRef}
      onPointerDown={
        handlePointerDown
      }
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();

        setContextMenuPos({
          x: e.clientX,
          y: e.clientY,
        });
      }}
      className={`
        absolute
        group
        select-none
        ${isDragging
          ? `
              cursor-grabbing
              scale-[1.03]
              z-50
            `
          : `
              cursor-grab
            `
        }
      `}
      style={{
        /*
         * IMPORTANT:
         *
         * The position now comes from
         * boardObjects continuously.
         *
         * SVGConnectionLayer reads the
         * same boardObjects state.
         *
         * Therefore both stay synchronized.
         */
        left: `${object.x}px`,
        top: `${object.y}px`,

        width: `${object.width}px`,
        height: `${object.height}px`,

        zIndex: isDragging
          ? 9999
          : object.zIndex || 1,

        transform:
          object.rotation
            ? `rotate(${object.rotation}deg)`
            : undefined,

        /*
         * Don't use willChange on left/top
         * anymore because React state controls
         * the position.
         */
        willChange:
          isDragging
            ? 'transform'
            : 'auto',
      }}
    >
      {/* ======================================================
          CARD BODY
          ====================================================== */}

      <div
        className={`
          w-full
          h-full
          relative
          transition-all
          duration-300
          ease-out
          ${isDragging
            ? `
                ring-1
                ring-premium
                scale-105
              `
            : ''
          }
          ${isSelected && !isMultiSelected ? 'ring-2 ring-neutral-400' : ''}
          ${isMultiSelected ? 'ring-2 ring-neutral-400' : ''}
          ${hoveredColumnId === object.id && object.type === 'column' ? 'ring-2 ring-[#FF6B3D] bg-orange-50/30' : ''}
          ${
            !isSelected && !isDragging
              ? 'hover:-translate-y-[3px] hover:border-neutral-300'
              : ''
          }
        `}
        style={{
          borderRadius: '32px',
          boxShadow: isSelected 
            ? '0 16px 48px rgba(0,0,0,0.08)' 
            : '0 8px 30px rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.02)',
          backgroundColor:
            object.style?.bg ||
            '#ffffff',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',

          color:
            object.style?.color ||
            '#1d1d1f',

          borderColor:
            object.style?.borderColor ||
            'rgba(0,0,0,0.03)',

          borderWidth:
            object.style?.borderColor
              ? '2px'
              : '1px',

          borderStyle:
            object.style?.borderStyle ||
            'solid',

          opacity:
            object.style?.opacity ??
            1,
        }}
      >
        {/* ==================================================
            CARD CONTENT
            ================================================== */}

        <div
          className="
            w-full
            h-full
            p-4
            overflow-hidden
            rounded-3xl
            flex
            flex-col
          "
        >
          {children}
        </div>

        {/* ==================================================
            LOCK BADGE
            ================================================== */}

        {object.locked && (
          <div
            className="
              absolute
              top-2
              right-2
              p-1
              bg-amber-100
              text-amber-700
              rounded-full
              shadow-sm
            "
          >
            <Lock className="w-3.5 h-3.5" />
          </div>
        )}

        {/* ==================================================
            FLOATING TOOLBAR
            ================================================== */}

        {isSelected &&
          !object.locked && (
            <div
              className="
                absolute
                -top-12
                left-1/2
                -translate-x-1/2
                bg-premium-canvas/90
                backdrop-blur-md
                text-white
                rounded-xl
                shadow-xl
                border
                border-premium
                px-3
                py-1
                flex
                items-center
                gap-2
                z-50
                animate-in
                fade-in
                zoom-in-95
                duration-150
                whitespace-nowrap
              "
            >
              {isMultiSelected && (
                <span
                  className="
                    text-xs
                    font-extrabold
                    text-neutral-300
                    border-r
                    border-premium
                    pr-2
                  "
                >
                  {selectedIds.length}{' '}
                  Selected
                </span>
              )}

              {/* COLOR */}

              <div className="relative">
                <button
                  onClick={() =>
                    setShowColorPicker(
                      !showColorPicker
                    )
                  }
                  className="
                    p-1
                    hover:bg-premium-canvas
                    rounded-lg
                    text-premium-gray
                    hover:text-white
                    transition-colors
                  "
                  title="Change Color"
                >
                  <Palette className="w-3.5 h-3.5" />
                </button>

                {showColorPicker && (
                  <div
                    className="
                      absolute
                      top-8
                      left-0
                      bg-premium-canvas
                      border
                      border-premium
                      rounded-xl
                      p-2
                      shadow-xl
                      flex
                      gap-1
                      z-50
                    "
                  >
                    {COLOR_PALETTE.map(
                      (color) => (
                        <button
                          key={color}
                          onClick={() => {
                            selectedIds.forEach(
                              (id) =>
                                updateObject(
                                  id,
                                  {
                                    style: {
                                      ...object.style,
                                      bg: color,
                                    },
                                  }
                                )
                            );

                            setShowColorPicker(
                              false
                            );
                          }}
                          className="
                            w-5
                            h-5
                            rounded-full
                            border
                            border-white/20
                            hover:scale-110
                            transition-transform
                          "
                          style={{
                            backgroundColor:
                              color,
                          }}
                        />
                      )
                    )}
                  </div>
                )}
              </div>

              {/* GROUPING */}
              {isMultiSelected && (
                <button
                  onClick={() => {
                    const allGrouped = selectedIds.every(id => {
                      const obj = boardObjects.find(o => o.id === id);
                      return obj?.groupId;
                    });
                    if (allGrouped) {
                      ungroupSelectedObjects();
                    } else {
                      groupSelectedObjects();
                    }
                  }}
                  className="
                    p-1
                    hover:bg-premium-canvas
                    rounded-lg
                    text-premium-gray
                    hover:text-white
                    transition-colors
                  "
                  title="Group / Ungroup"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* DUPLICATE */}

              <button
                onClick={() =>
                  isMultiSelected
                    ? duplicateSelectedObjects()
                    : duplicateObject(
                      object.id
                    )
                }
                className="
                  p-1
                  hover:bg-premium-canvas
                  rounded-lg
                  text-premium-gray
                  hover:text-white
                  transition-colors
                "
                title="Duplicate (Ctrl+D)"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              {/* FRONT */}

              <button
                onClick={() =>
                  changeObjectLayering(
                    object.id,
                    'front'
                  )
                }
                className="
                  p-1
                  hover:bg-premium-canvas
                  rounded-lg
                  text-premium-gray
                  hover:text-white
                  transition-colors
                "
                title="Bring to Front"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>

              {/* BACK */}

              <button
                onClick={() =>
                  changeObjectLayering(
                    object.id,
                    'back'
                  )
                }
                className="
                  p-1
                  hover:bg-premium-canvas
                  rounded-lg
                  text-premium-gray
                  hover:text-white
                  transition-colors
                "
                title="Send to Back"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* LOCK */}

              <button
                onClick={() =>
                  lockObject(
                    object.id,
                    true
                  )
                }
                className="
                  p-1
                  hover:bg-premium-canvas
                  rounded-lg
                  text-premium-gray
                  hover:text-white
                  transition-colors
                "
                title="Lock Object"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>

              {/* DELETE */}

              <button
                onClick={() =>
                  isMultiSelected
                    ? deleteSelectedObjects()
                    : deleteObject(
                      object.id
                    )
                }
                className="
                  p-1
                  hover:bg-premium-canvas
                  rounded-lg
                  text-red-400
                  hover:text-red-300
                  transition-colors
                "
                title="Delete Selected (Delete)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        {/* ==================================================
            RESIZE HANDLES
            ================================================== */}

        {isSelected &&
          !object.locked && (
            <>
              {/* CORNER */}

              <div
                onPointerDown={(e) =>
                  handleResizeStart(
                    e,
                    'corner'
                  )
                }
                className="
                  absolute
                  -bottom-2
                  -right-2
                  w-4
                  h-4
                  bg-neutral-800
                  border-2
                  border-white
                  rounded-full
                  cursor-se-resize
                  shadow-md
                  hover:scale-150
                  transition-transform
                  z-50
                "
                title="Resize Width & Height"
              />

              {/* RIGHT */}

              <div
                onPointerDown={(e) =>
                  handleResizeStart(
                    e,
                    'right'
                  )
                }
                className="
                  absolute
                  top-1/2
                  -right-1.5
                  -translate-y-1/2
                  w-2
                  h-6
                  bg-neutral-600/80
                  hover:bg-neutral-800
                  rounded-full
                  cursor-ew-resize
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  z-50
                "
                title="Resize Width"
              />

              {/* BOTTOM */}

              <div
                onPointerDown={(e) =>
                  handleResizeStart(
                    e,
                    'bottom'
                  )
                }
                className="
                  absolute
                  -bottom-1.5
                  left-1/2
                  -translate-x-1/2
                  h-2
                  w-6
                  bg-neutral-600/80
                  hover:bg-neutral-800
                  rounded-full
                  cursor-ns-resize
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  z-50
                "
                title="Resize Height"
              />
            </>
          )}

        {/* ==================================================
            DIMENSION BADGE
            ================================================== */}

        {resizeMode !==
          'none' && (
            <div
              className="
              absolute
              -bottom-7
              right-0
              bg-premium-canvas
              text-white
              text-[10px]
              font-mono
              px-2
              py-0.5
              rounded
              shadow
              z-50
              pointer-events-none
            "
            >
              {Math.round(
                object.width
              )}
              px ×{' '}
              {Math.round(
                object.height
              )}
              px
            </div>
          )}
      </div>

      {/* ======================================================
          CONNECTION ANCHORS
          ====================================================== */}

      {anchors
        .filter(
          ({ position }) =>
            position === 'left' ||
            position === 'right' ||
            position === 'top' ||
            position === 'bottom'
        )
        .map(
          ({
            position,
          }) => {
            let posStyle: React.CSSProperties = {};
            if (position === 'left') {
              posStyle = { left: '-5px', top: '50%', transform: 'translateY(-50%)' };
            } else if (position === 'right') {
              posStyle = { right: '-5px', top: '50%', transform: 'translateY(-50%)' };
            } else if (position === 'top') {
              posStyle = { top: '-5px', left: '50%', transform: 'translateX(-50%)' };
            } else if (position === 'bottom') {
              posStyle = { bottom: '-5px', left: '50%', transform: 'translateX(-50%)' };
            }

            return (
              <div
                key={position}
                style={
                  posStyle
                }
                onPointerDown={(e) =>
                  handleAnchorPointerDown(
                    e,
                    position
                  )
                }
                className={`
                  absolute
                  w-2.5
                  h-2.5
                  rounded-full
                  border
                  border-neutral-400
                  bg-black
                  cursor-crosshair
                  shadow-sm
                  transition-all
                  duration-150
                  ${isSelected
                    ? `
                        opacity-100
                        scale-100
                        hover:scale-150
                        hover:bg-neutral-700
                        hover:ring-2
                        hover:ring-neutral-400/50
                      `
                    : `
                        opacity-0
                        group-hover:opacity-100
                        scale-90
                        hover:scale-125
                      `
                  }
                  z-50
                  touch-none
                `}
                title={`Connect from ${position}`}
              />
            );
          }
        )}

      {/* ======================================================
          CONTEXT MENU
          ====================================================== */}

      {contextMenuPos && (
        <div
          className="
            fixed
            z-50
            glass-panel
            text-premium-black
            rounded-2xl
            shadow-apple-elevated
            border-white/40
            py-1.5
            min-w-[170px]
            text-xs
            animate-in
            fade-in
            duration-100
            font-medium
          "
          style={{
            left:
              contextMenuPos.x,
            top:
              contextMenuPos.y,
          }}
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          {/* DUPLICATE */}

          <button
            onClick={() => {
              isMultiSelected
                ? duplicateSelectedObjects()
                : duplicateObject(
                  object.id
                );

              setContextMenuPos(
                null
              );
            }}
            className="
              w-full
              px-3
              py-2
              text-left
              hover:bg-neutral-100/60
              flex
              items-center
              gap-2
              transition-colors
            "
          >
            <Copy className="w-3.5 h-3.5 text-premium-gray" />

            {isMultiSelected
              ? `Duplicate (${selectedIds.length})`
              : 'Duplicate'}
          </button>

          {/* GROUP / UNGROUP */}
          {isMultiSelected && (
            <button
              onClick={() => {
                const allGrouped = selectedIds.every(id => {
                  const obj = boardObjects.find(o => o.id === id);
                  return obj?.groupId;
                });
                if (allGrouped) {
                  ungroupSelectedObjects();
                } else {
                  groupSelectedObjects();
                }
                setContextMenuPos(null);
              }}
              className="
                w-full
                px-3
                py-2
                text-left
                hover:bg-neutral-100/60
                flex
                items-center
                gap-2
                transition-colors
              "
            >
              <Link2 className="w-3.5 h-3.5 text-premium-gray" />
              Group / Ungroup
            </button>
          )}

          {/* COPY */}
          <button
            onClick={() => {
              copySelectedObjects();
              setContextMenuPos(null);
            }}
            className="
              w-full
              px-3
              py-2
              text-left
              hover:bg-neutral-100/60
              flex
              items-center
              gap-2
              transition-colors
            "
          >
            <Copy className="w-3.5 h-3.5 text-premium-gray" />
            Copy
          </button>

          {/* PASTE */}
          <button
            onClick={() => {
              pasteObjects();
              setContextMenuPos(null);
            }}
            className="
              w-full
              px-3
              py-2
              text-left
              hover:bg-neutral-100/60
              flex
              items-center
              gap-2
              transition-colors
            "
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-premium-gray" />
            Paste
          </button>

          {/* LOCK */}

          <button
            onClick={() => {
              const newLockedState = !object.locked;
              if (isMultiSelected) {
                selectedIds.forEach(id => lockObject(id, newLockedState));
              } else {
                lockObject(object.id, newLockedState);
              }

              setContextMenuPos(
                null
              );
            }}
            className="
              w-full
              px-3
              py-2
              text-left
              hover:bg-neutral-100/60
              flex
              items-center
              gap-2
              transition-colors
            "
          >
            {object.locked ? (
              <Unlock className="w-3.5 h-3.5 text-premium-gray" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-premium-gray" />
            )}

            {object.locked
              ? 'Unlock'
              : 'Lock'}
          </button>

          {/* COMMENT */}

          <button
            onClick={() => {
              addComment(
                'New comment thread on card...',
                object.id
              );

              setContextMenuPos(
                null
              );
            }}
            className="
              w-full
              px-3
              py-2
              text-left
              hover:bg-neutral-100/60
              flex
              items-center
              gap-2
              transition-colors
            "
          >
            <Palette className="w-3.5 h-3.5 text-premium-gray" />

            Add Comment
          </button>

          <div
            className="
              my-1
              border-t
              border-premium/50
            "
          />

          {/* DELETE */}

          <button
            onClick={() => {
              isMultiSelected
                ? deleteSelectedObjects()
                : deleteObject(
                  object.id
                );

              setContextMenuPos(
                null
              );
            }}
            className="
              w-full
              px-3
              py-2
              text-left
              hover:bg-red-50
              text-red-600
              flex
              items-center
              gap-2
              transition-colors
            "
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />

            {isMultiSelected
              ? `Delete (${selectedIds.length})`
              : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
};
