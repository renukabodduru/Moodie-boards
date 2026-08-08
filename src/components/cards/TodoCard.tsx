import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { CanvasObject } from '../../types/board';
import { CheckSquare, Square, Plus, Trash2 } from 'lucide-react';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export const TodoCard: React.FC<{ object: CanvasObject }> = ({ object }) => {
  const { updateObject } = useBoard();
  const [items, setItems] = useState<TodoItem[]>(object.content.items || []);
  const [title, setTitle] = useState<string>(object.content.title || 'Checklist');

  const updateItems = (newItems: TodoItem[]) => {
    setItems(newItems);
    updateObject(object.id, { content: { ...object.content, items: newItems } });
  };

  const toggleCheck = (id: string) => {
    const next = items.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i));
    updateItems(next);
  };

  const addItem = () => {
    const newItem: TodoItem = {
      id: `todo-${Date.now()}`,
      text: 'New task',
      completed: false,
    };
    updateItems([...items, newItem]);
  };

  const deleteItem = (id: string) => {
    updateItems(items.filter((i) => i.id !== id));
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = items.length ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div>
        {/* Title & Progress bar */}
        <div className="flex items-center justify-between mb-2">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              updateObject(object.id, { content: { ...object.content, title: e.target.value } });
            }}
            className="font-bold text-sm bg-transparent focus:outline-none text-slate-800"
          />
          <span className="text-xs font-semibold text-slate-400">{progressPercent}%</span>
        </div>

        <div className="w-full h-1.5 bg-slate-100 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Task Items List */}
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 group/item">
              <button onClick={() => toggleCheck(item.id)} className="text-slate-400 hover:text-emerald-600">
                {item.completed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
              <input
                type="text"
                value={item.text}
                onChange={(e) => {
                  const val = e.target.value;
                  updateItems(items.map((i) => (i.id === item.id ? { ...i, text: val } : i)));
                }}
                className={`flex-1 text-xs bg-transparent focus:outline-none ${
                  item.completed ? 'line-through text-slate-400' : 'text-slate-700'
                }`}
              />
              <button
                onClick={() => deleteItem(item.id)}
                className="opacity-0 group-hover/item:opacity-100 text-red-400 hover:text-red-600 p-0.5"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={addItem}
        className="mt-2 flex items-center justify-center gap-1 w-full py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-medium border border-slate-200"
      >
        <Plus className="w-3.5 h-3.5" /> Add Item
      </button>
    </div>
  );
};
