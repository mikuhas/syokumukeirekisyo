import React, { useRef, useState, useMemo } from 'react';
import { GripVertical } from 'lucide-react';
import type { SectionId } from '../../App';

const SECTION_LABELS: Record<SectionId, string> = {
  'summary':        '職務要約',
  'skill-stack':    'スキルスタック',
  'self-promotion': '自己PR',
  'work-experience':'職務経歴',
};

interface DropTarget {
  index: number;
  position: 'before' | 'after';
}

interface SectionOrderEditorProps {
  sectionOrder: SectionId[];
  setSectionOrder: (order: SectionId[]) => void;
}

function applyDrop(order: SectionId[], from: number, target: DropTarget): SectionId[] {
  let to = target.position === 'before' ? target.index : target.index + 1;
  if (from < to) to -= 1;
  if (from === to) return order;
  const next = [...order];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export const SectionOrderEditor: React.FC<SectionOrderEditorProps> = ({ sectionOrder, setSectionOrder }) => {
  const [draggedId, setDraggedId] = useState<SectionId | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  // Keep a ref for use inside event handlers without stale closure
  const dragIndexRef = useRef<number | null>(null);

  // Preview order shown in real-time while dragging
  const previewOrder = useMemo(() => {
    if (draggedId === null || !dropTarget) return sectionOrder;
    const from = sectionOrder.indexOf(draggedId);
    return applyDrop(sectionOrder, from, dropTarget);
  }, [draggedId, dropTarget, sectionOrder]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragIndexRef.current = index;
    setDraggedId(sectionOrder[index]);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIndexRef.current === index) {
      setDropTarget(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const position = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    setDropTarget(prev =>
      prev?.index === index && prev.position === position ? prev : { index, position }
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || !dropTarget) {
      reset();
      return;
    }
    const next = applyDrop(sectionOrder, from, dropTarget);
    setSectionOrder(next);
    reset();
  };

  const reset = () => {
    dragIndexRef.current = null;
    setDraggedId(null);
    setDropTarget(null);
  };

  return (
    <div className="section-order-editor">
      <h3 className="section-order-title">セクションの表示順序</h3>
      <p className="section-order-description">ドラッグして順序を変更できます。</p>
      <ol className="section-order-list">
        {sectionOrder.map((id, index) => {
          const isDragging = draggedId === id;
          const isDropBefore = dropTarget?.index === index && dropTarget.position === 'before' && !isDragging;
          const isDropAfter  = dropTarget?.index === index && dropTarget.position === 'after'  && !isDragging;
          const previewNumber = previewOrder.indexOf(id) + 1;

          return (
            <li
              key={id}
              className={[
                'section-order-item',
                isDragging   ? 'dragging'    : '',
                isDropBefore ? 'drop-before' : '',
                isDropAfter  ? 'drop-after'  : '',
              ].filter(Boolean).join(' ')}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={handleDrop}
              onDragEnd={reset}
            >
              <span className="section-order-grip">
                <GripVertical size={16} />
              </span>
              <span
                className={`section-order-index${previewNumber !== index + 1 ? ' preview-changed' : ''}`}
              >
                {previewNumber}
              </span>
              <span className="section-order-label">{SECTION_LABELS[id]}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
