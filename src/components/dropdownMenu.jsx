import React, { useState, useEffect, useRef } from 'react';
import './DropdownMenu.css';

const DropdownMenu = ({ grouping, ordering, setGrouping, setOrdering }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); 

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleGroupingChange = (option) => {
    setGrouping(option);
  };

  const handleOrderingChange = (option) => {
    setOrdering(option);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div style={{ width: '100%' }} ref={dropdownRef}>
      <div className="dropdown">
        <button className="dropdown-toggle" onClick={toggleMenu}>
          <img
            src="/icons/settings-knobs-svgrepo-com.svg"
            alt="Settings"
            height={13}
            style={{ transform: 'rotate(90deg)' }}
          />
          Display <span>&#9662;</span>
        </button>
        {isOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-group">
              <label>Grouping</label>
              <select
                value={grouping}
                onChange={(e) => handleGroupingChange(e.target.value)}
              >
                <option value="Status">Status</option>
                <option value="User">User</option>
                <option value="Priority">Priority</option>
              </select>
            </div>
            <div className="dropdown-group">
              <label>Ordering</label>
              <select
                value={ordering}
                onChange={(e) => handleOrderingChange(e.target.value)}
              >
                <option value="Priority">Priority</option>
                <option value="Title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownMenu;
