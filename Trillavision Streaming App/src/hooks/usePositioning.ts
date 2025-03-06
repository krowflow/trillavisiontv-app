import React from 'react';
import { 
  positionModal, 
  positionDropdown, 
  positionContextMenu,
  PositionOptions
} from '../utils/positioning';

/**
 * Hook for positioning a modal element
 * @param options Positioning options
 * @returns Object with refs and positioning functions
 */
export const useModalPositioning = (options: PositionOptions = {}) => {
  const triggerRef = React.useRef<HTMLElement>(null);
  const modalRef = React.useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  
  // Position the modal when it becomes visible
  React.useEffect(() => {
    if (isVisible && modalRef.current) {
      positionModal(triggerRef.current, modalRef.current, options);
      
      // Add window resize listener
      const handleResize = () => {
        if (modalRef.current) {
          positionModal(triggerRef.current, modalRef.current, options);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isVisible, options]);
  
  // Show the modal
  const showModal = () => {
    setIsVisible(true);
  };
  
  // Hide the modal
  const hideModal = () => {
    setIsVisible(false);
  };
  
  // Toggle the modal visibility
  const toggleModal = () => {
    setIsVisible(!isVisible);
  };
  
  return {
    triggerRef,
    modalRef,
    isVisible,
    showModal,
    hideModal,
    toggleModal
  };
};

/**
 * Hook for positioning a dropdown element
 * @param options Positioning options
 * @returns Object with refs and positioning functions
 */
export const useDropdownPositioning = (options: PositionOptions = {}) => {
  const triggerRef = React.useRef<HTMLElement>(null);
  const dropdownRef = React.useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  
  // Position the dropdown when it becomes visible
  React.useEffect(() => {
    if (isVisible && triggerRef.current && dropdownRef.current) {
      positionDropdown(triggerRef.current, dropdownRef.current, options);
      
      // Add window resize listener
      const handleResize = () => {
        if (triggerRef.current && dropdownRef.current) {
          positionDropdown(triggerRef.current, dropdownRef.current, options);
        }
      };
      
      // Add click outside listener
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setIsVisible(false);
        }
      };
      
      window.addEventListener('resize', handleResize);
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isVisible, options]);
  
  // Show the dropdown
  const showDropdown = () => {
    setIsVisible(true);
  };
  
  // Hide the dropdown
  const hideDropdown = () => {
    setIsVisible(false);
  };
  
  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsVisible(!isVisible);
  };
  
  return {
    triggerRef,
    dropdownRef,
    isVisible,
    showDropdown,
    hideDropdown,
    toggleDropdown
  };
};

/**
 * Hook for positioning a context menu
 * @param offset The offset from the coordinates
 * @returns Object with ref and positioning functions
 */
export const useContextMenuPositioning = (offset: number = 2) => {
  const menuRef = React.useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  
  // Position the context menu when it becomes visible
  React.useEffect(() => {
    if (isVisible && menuRef.current) {
      positionContextMenu(position.x, position.y, menuRef.current, offset);
      
      // Add click outside listener
      const handleClickOutside = () => {
        setIsVisible(false);
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, position, offset]);
  
  // Show the context menu at the specified position
  const showContextMenu = (x: number, y: number) => {
    setPosition({ x, y });
    setIsVisible(true);
  };
  
  // Hide the context menu
  const hideContextMenu = () => {
    setIsVisible(false);
  };
  
  // Handle context menu event
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    showContextMenu(event.clientX, event.clientY);
  };
  
  return {
    menuRef,
    isVisible,
    showContextMenu,
    hideContextMenu,
    handleContextMenu
  };
};

export default {
  useModalPositioning,
  useDropdownPositioning,
  useContextMenuPositioning
};