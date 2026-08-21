import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBoard } from '../../context/BoardContext';
import {
  getAnchorCoordinates,
  generateSVGPath,
  Point,
} from '../../utils/geometry';
import { Connection } from '../../types/board';

export const SVGConnectionLayer: React.FC = () => {
  const {
    boardObjects,
    boardConnections,
    selectedLineId,
    setSelectedLineId,
    updateConnection,
    draggingConnection,
    zoom,
    pan,
  } = useBoard();

  const [
    draggingControlId,
    setDraggingControlId,
  ] = useState<string | null>(null);

  /*
   * ============================================================
   * DEFAULT ARROW COLOR
   * ============================================================
   */

  const DEFAULT_ARROW_COLOR = '#000000';

  /*
   * ============================================================
   * GET ANCHOR POSITION
   * ============================================================
   */

  const getPointForAnchor = (
    objectId: string,
    anchorName?: string
  ): Point | null => {
    const obj = boardObjects.find(
      (o) => o.id === objectId
    );

    if (!obj) return null;

    return getAnchorCoordinates(
      obj,
      (anchorName as any) || 'center'
    );
  };

  /*
   * ============================================================
   * CONTROL POINT DRAG START
   * ============================================================
   */

  const handleControlMouseDown = (
    e: React.MouseEvent,
    connId: string
  ) => {
    e.stopPropagation();

    setDraggingControlId(connId);
  };

  /*
   * ============================================================
   * CONTROL POINT DRAG
   * ============================================================
   */

  const handleControlPointDrag = (
    e: React.MouseEvent,
    conn: Connection
  ) => {
    if (
      draggingControlId !== conn.id
    ) {
      return;
    }

    const canvasX =
      (e.clientX - pan.x) / zoom;

    const canvasY =
      (e.clientY - pan.y) / zoom;

    updateConnection(
      conn.id,
      {
        curveControl: {
          x: canvasX,
          y: canvasY,
        },
      }
    );
  };

  /*
   * ============================================================
   * CONTROL POINT RESET
   * ============================================================
   */

  const handleControlDoubleClick = (
    conn: Connection
  ) => {
    updateConnection(
      conn.id,
      {
        curveControl: undefined,
        lineStyle: 'straight',
      }
    );

    setDraggingControlId(null);
  };

  /*
   * ============================================================
   * CONTROL POINT RELEASE
   * ============================================================
   */

  const handleControlMouseUp = () => {
    setDraggingControlId(null);
  };

  return (
    <svg
      className="
        absolute
        inset-0
        pointer-events-none
        w-full
        h-full
        overflow-visible
        z-10
      "
      style={{
        transform: `
          translate(${pan.x}px, ${pan.y}px)
          scale(${zoom})
        `,
        transformOrigin: '0 0',
      }}
      onMouseMove={(e) => {
        if (draggingControlId) {
          const conn =
            boardConnections.find(
              (c) =>
                c.id ===
                draggingControlId
            );

          if (conn) {
            handleControlPointDrag(
              e,
              conn
            );
          }
        }
      }}
      onMouseUp={
        handleControlMouseUp
      }
    >
      {/* ======================================================
          ARROW MARKERS
          ====================================================== */}

      {[
        '#000000',
        '#6366f1',
        '#ec4899',
        '#10b981',
        '#f59e0b',
        '#3b82f6',
        '#ef4444',
      ].map((color) => {
        const colorId =
          color.replace('#', '');

        return (
          <React.Fragment
            key={color}
          >
            {/* -----------------------------------------------
                END ARROW
                ----------------------------------------------- */}

            <marker
              id={`arrow-end-${colorId}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path
                d="
                  M 0 0
                  L 10 5
                  L 0 10
                  Z
                "
                fill={color}
              />
            </marker>

            {/* -----------------------------------------------
                START ARROW
                ----------------------------------------------- */}

            <marker
              id={`arrow-start-${colorId}`}
              viewBox="0 0 10 10"
              refX="2"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
              markerUnits="strokeWidth"
            >
              <path
                d="
                  M 10 0
                  L 0 5
                  L 10 10
                  Z
                "
                fill={color}
              />
            </marker>
          </React.Fragment>
        );
      })}

      {/* ======================================================
          PERMANENT CONNECTIONS
          ====================================================== */}

      {boardConnections.map(
        (conn) => {
          /*
           * ----------------------------------------------------
           * SOURCE
           * ----------------------------------------------------
           */

          const sourcePt =
            getPointForAnchor(
              conn.source.objectId,
              conn.source.anchor
            );

          /*
           * ----------------------------------------------------
           * TARGET
           * ----------------------------------------------------
           */

          let targetPt:
            | Point
            | null = null;

          if (
            'objectId' in
            conn.target
          ) {
            targetPt =
              getPointForAnchor(
                conn.target.objectId,
                conn.target.anchor
              );
          } else if (
            'x' in conn.target
          ) {
            targetPt =
              conn.target;
          }

          if (
            !sourcePt ||
            !targetPt
          ) {
            return null;
          }

          /*
           * ----------------------------------------------------
           * SELECTED
           * ----------------------------------------------------
           */

          const isSelected =
            selectedLineId ===
            conn.id;

          /*
           * ----------------------------------------------------
           * COLOR
           *
           * If connection has no color,
           * use BLACK.
           * ----------------------------------------------------
           */

          const color =
            conn.color ||
            DEFAULT_ARROW_COLOR;

          const colorClean =
            color.replace(
              '#',
              ''
            );

          /*
           * ----------------------------------------------------
           * GENERATE PATH
           * ----------------------------------------------------
           */

          const {
            path,
            midPoint,
            controlPoint,
          } =
            generateSVGPath(
              sourcePt,
              targetPt,
              conn.lineStyle,
              conn.curveControl
            );

          /*
           * ----------------------------------------------------
           * DASH PATTERN
           * ----------------------------------------------------
           */

          let strokeDasharray =
            'none';

          if (
            conn.strokePattern ===
            'dashed'
          ) {
            strokeDasharray =
              '8,8';
          }

          if (
            conn.strokePattern ===
            'dotted'
          ) {
            strokeDasharray =
              '3,3';
          }

          return (
            <g
              key={conn.id}
              className="
                group
                pointer-events-auto
              "
            >
              {/* =================================================
                  INVISIBLE HIT AREA
                  ================================================= */}

              <path
                d={path}
                fill="none"
                stroke="transparent"
                strokeWidth={Math.max(
                  conn.strokeWidth +
                  14,
                  20
                )}
                className="
                  cursor-pointer
                "
                onClick={(e) => {
                  e.stopPropagation();

                  setSelectedLineId(
                    conn.id
                  );
                }}
              />

              {/* =================================================
                  MAIN ARROW LINE
                  ================================================= */}

              <path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth={
                  isSelected
                    ? conn.strokeWidth +
                    2
                    : conn.strokeWidth
                }
                strokeDasharray={
                  strokeDasharray
                }
                strokeLinecap="round"
                strokeLinejoin="round"
                markerEnd={
                  conn.arrowEnd
                    ? `url(#arrow-end-${colorClean})`
                    : undefined
                }
                markerStart={
                  conn.arrowStart
                    ? `url(#arrow-start-${colorClean})`
                    : undefined
                }
                className={`
                  ${isSelected
                    ? `
                        drop-shadow-[0_0_5px_rgba(0,0,0,0.25)]
                      `
                    : ''
                  }
                `}
              />

              {/* =================================================
                  LABEL
                  ================================================= */}

              {conn.label && (
                <g
                  transform={`
                    translate(
                      ${midPoint.x},
                      ${midPoint.y}
                    )
                  `}
                >
                  <rect
                    x="-40"
                    y="-12"
                    width="80"
                    height="24"
                    rx="12"
                    fill="#ffffff"
                    stroke={color}
                    strokeWidth="1.5"
                    className="
                      shadow-sm
                    "
                  />

                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#1e293b"
                    fontSize="11"
                    fontWeight="600"
                    className="
                      pointer-events-none
                      select-none
                    "
                  >
                    {conn.label}
                  </text>
                </g>
              )}

              {/* =================================================
                  CURVE CONTROL POINT
                  ================================================= */}

              {isSelected &&
                conn.lineStyle ===
                'curved' && (
                  <g
                    transform={`
                      translate(
                        ${controlPoint.x},
                        ${controlPoint.y}
                      )
                    `}
                    className="
                      cursor-grab
                      active:cursor-grabbing
                      pointer-events-auto
                    "
                    onMouseDown={(e) =>
                      handleControlMouseDown(
                        e,
                        conn.id
                      )
                    }
                    onDoubleClick={() =>
                      handleControlDoubleClick(
                        conn
                      )
                    }
                  >
                    {/* Outer handle */}

                    <circle
                      r="10"
                      fill="#ffffff"
                      stroke={color}
                      strokeWidth="3"
                      className="
                        shadow-md
                      "
                    />

                    {/* Inner point */}

                    <circle
                      r="3"
                      fill={color}
                    />
                  </g>
                )}
            </g>
          );
        }
      )}

      {/* ======================================================
          LIVE CONNECTION PREVIEW
          ====================================================== */}

      {draggingConnection &&
        (() => {
          const sourcePt =
            getPointForAnchor(
              draggingConnection.sourceObjectId,
              draggingConnection.sourceAnchor
            );

          if (!sourcePt) {
            return null;
          }

          const targetPt = {
            x: draggingConnection.currentX,
            y: draggingConnection.currentY,
          };

          /*
           * Use a straight path while
           * creating a connection.
           */

          const { path } =
            generateSVGPath(
              sourcePt,
              targetPt,
              'straight'
            );

          return (
            <g
              className="
                pointer-events-none
              "
            >
              {/* Preview line */}

              <path
                d={path}
                fill="none"
                stroke={
                  DEFAULT_ARROW_COLOR
                }
                strokeWidth="3"
                strokeDasharray="6,6"
                strokeLinecap="round"
                strokeLinejoin="round"
                markerEnd="
                  url(#arrow-end-000000)
                "
              />

              {/* Current mouse position */}
              <circle
                cx={targetPt.x}
                cy={targetPt.y}
                r={draggingConnection.targetObjectId ? "12" : "6"}
                fill={draggingConnection.targetObjectId ? "rgba(99, 102, 241, 0.3)" : DEFAULT_ARROW_COLOR}
                className="transition-all duration-150"
              />
              {draggingConnection.targetObjectId && (
                <circle
                  cx={targetPt.x}
                  cy={targetPt.y}
                  r="6"
                  fill="#6366f1"
                />
              )}
            </g>
          );
        })()}
    </svg>
  );
};