import React from 'react';
import { useAccordion } from 'boodoo/react';
import 'boodoo/css';

export function AccordionExample() {
  const { isExpanded, toggle } = useAccordion({ defaultExpanded: ['item1'] });

  return (
    <div className="container py-4">
      <div className="accordion">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button type="button" className={`accordion-button ${!isExpanded('item1') ? 'collapsed' : ''}`} onClick={() => toggle('item1')}>
              <span>First Section</span>
            </button>
          </h2>
          <div className={`accordion-collapse collapse ${isExpanded('item1') ? 'show' : ''}`}>
            <div className="accordion-body">
              <p><span>Content for the first collapsible section.</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}