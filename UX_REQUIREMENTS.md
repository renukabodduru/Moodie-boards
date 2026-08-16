# Premium UX Requirements for a Milanote-Style App

## 1. The canvas must feel like a real physical workspace
* Infinite-feeling canvas
* Smooth pan
* Smooth zoom
* No unnecessary page boundaries
* Dotted/subtle grid
* Objects can be positioned freely
* Objects don't automatically rearrange themselves
* Canvas should preserve spatial relationships
* Zoom should feel centered around the cursor/pinch location

## 2. "Direct manipulation" should be the core UX
Almost everything should be Drag -> Drop -> Done.
* Drag cards, files, images, columns, boards, comments
* Drag objects into/out of groups
* Drag objects between boards
* Drag to trash

## 3. Zero-friction creation
* Double-click -> Note
* Drag toolbar item -> create object
* Paste image -> image card
* Paste URL -> link card
* Drop file -> upload card
* Keyboard shortcut -> create object

## 4. The toolbar should stay out of the user's way
* Don't dominate the canvas
* Use tooltips on hover
* Put less frequently used objects under a "More" menu

## 5. Selection must feel extremely clear
* Clear selection border
* Resize handles
* Connection handle/anchors
* Context toolbar
* Selected state & Multi-selection state
* Keyboard movement
* Escape -> deselect

## 6. Connection UX should feel magical ⭐⭐⭐⭐⭐
* Small line handle on selected card to drag
* Highlight valid targets while dragging
* Don't require "connect mode"
* Snap to cards
* Allow exact-point attachment
* Allow straight/curved lines
* Maintain connection when cards move

## 7. Smart snapping without taking control away
* Soft snapping
* Alignment guides
* Equal spacing guides
* Column insertion indicator
* Connection target highlighting

## 8. Objects should communicate what they can do
* Progressive disclosure (Hover for more, Selected for controls, Editing for task)

## 9. Contextual controls instead of permanent toolbars
* Show only relevant controls when an object is selected (e.g., Color/Weight for line, Crop/Replace for image)

## 10. Keyboard shortcuts should make power users extremely fast
* Double-click: New note
* Space + drag: Pan
* Z: Zoom
* Delete: Delete
* Ctrl/Cmd + Z: Undo
* Ctrl/Cmd + Shift Z: Redo
* Ctrl/Cmd + C/V/D: Copy/Paste/Duplicate
* Arrow/Shift+Arrow: Nudge
* UI should teach shortcuts

## 11. Multi-selection must feel natural
* Shift + click or Drag selection box
* Preserve relative positions when moving
* Keep connections intact

## 12. Drag-and-drop feedback
* Highlight destinations clearly (insertion lines, "ATTACH", trash highlights)

## 13. Empty states should be helpful, not ugly
* Simple text prompting creation, canvas remains usable immediately

## 14. Unsorted / Scratch Space
* Capture first, organize later area

## 15. Visual hierarchy should be user-controlled
* Allow users to arrange ideas visually to see patterns and relationships

## 16. Cards should have "quiet" visual styling
* White/neutral surfaces, subtle shadows, soft borders, clear typography

## 17. Micro-interactions
* Subtle elevations on hover, smooth drag, settling drops, natural disappearances on delete

## 18. Motion should communicate, not decorate
* Move naturally with cursor, communicate origin/destination/selection

## 19. Board navigation must feel effortless
* Breadcrumbs, Back/Forward, Parent/Recent/Favorites, Shortcuts, Search

## 20. Never make users wonder "where am I?"
* Always provide breadcrumbs and indicate current board

## 21. Collaboration should feel invisible
* Real-time updates without page refresh, presence indicators, avatars, cursors

## 22. Comments should belong to the content
* Attach to content and move with the associated card

## 23. Sharing should be one-click simple
* Simple editor/commenter/read-only sharing modes

## 24. Presentation mode
* Clean mode hiding editing controls for storyboards, moodboards, etc.

## 25. Mobile UX should be designed, not merely shrunk
* Touch-specific gestures (pinch zoom, two-finger pan, long press, touch selection)

## 26. Forgiveness is a premium UX feature
* Everything important reversible (Trash, Undo for move/edit/connect)

## 27. Never lose work
* Local state -> Autosave -> Cloud with subtle "Saved" indicator

## 28. Loading should feel intelligent
* Canvas immediate, cards appear, images progressive, large files later

## 29. Error messages should tell users what to do
* Actionable errors with "Try again" options

## 30. Keyboard + mouse + touch should feel like the same product
* Mouse drag / Touch long press / Keyboard arrows all map to the same conceptual action

## 31. The "premium UX formula"
* Simple (few controls, clean canvas)
* Direct (drag/drop, manipulation)
* Fast (instant feedback, shortcuts)
* Forgiving (undo, autosave, trash)

## 32. UX Requirements Checklist
(Refer to user prompt for the full checklist, this document serves as the master guide for development).
