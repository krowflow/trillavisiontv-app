# Panel Content Design Guidelines

## Overview

This document outlines the design specifications for content elements within Trillavision T.V.'s pop-out panels to ensure consistent sizing and optimal space utilization.

## Panel Dimensions

### Standard Panel Size
- Height: 200px (fixed)
- Width: Determined by grid layout (approximately 300-350px)
- Padding: 12px (p-3)

## Content Specifications

### Header Section
- Height: 24px
- Spacing: mb-1.5 (margin-bottom: 6px)
- Title: 
  - Font size: 16px (text-base)
  - Font weight: 600 (font-semibold)
- Action button:
  - Height: 20px (h-5)
  - Padding: 6px horizontal (px-1.5)
  - Font size: 11px
  - Icon size: 14px

### Content Area
- Height: Calculated (~ 164px)
  - Formula: Panel height (200px) - Header (24px) - Padding (24px)
- Scrollable with custom scrollbar
- Overflow behavior: overflow-y-auto

### Empty State
- Icon size: 24px
- Primary text: 11px
- Secondary text: 10px
- Vertical spacing: 16px (py-4)

### List Items
- Height: 28px
- Padding: 8px vertical, 12px horizontal
- Font size: 11px
- Icon size: 14px
- Spacing between items: 4px (gap-1)

### Interactive Elements
- Buttons:
  - Height: 20px (h-5)
  - Font size: 11px
  - Icon size: 14px
  - Padding: 6px horizontal
- Inputs:
  - Height: 24px
  - Font size: 11px
  - Padding: 4px vertical, 8px horizontal

## Component-Specific Guidelines

### Scene Manager
- Scene list items:
  - Height: 28px
  - Left icon: 14px
  - Scene name: 11px
  - Layout badge: 10px
  - Delete button: 14px icon

### Source Manager
- Source type list:
  - Icon: 14px
  - Label: 11px
  - Description: 10px
  - Padding: 8px vertical

### Layout Manager
- Layout grid:
  - 2 columns
  - Gap: 8px
  - Preview height: 60px
  - Label: 11px
  - Description: 10px

### Device Selector
- Device list:
  - Label: 11px
  - Select height: 24px
  - Icon size: 14px
  - Spacing: 6px between items

### Stream Controls
- Status indicators:
  - Height: 20px
  - Icon size: 14px
  - Label: 11px
- Buttons:
  - Height: 28px
  - Icon size: 16px
  - Font size: 11px

## Scrollbar Specifications

### Custom Scrollbar
- Width: 8px
- Track color: #2A0944
- Thumb color: #8E05C2
- Hover color: #580F96
- Border radius: 4px
- Border: 2px solid track color

## Best Practices

1. **Content Density**
   - Use compact layouts
   - Minimize whitespace while maintaining readability
   - Stack elements vertically when possible

2. **Typography**
   - Use smaller font sizes (10-11px) for content
   - Maintain hierarchy with font weights
   - Ensure text remains legible

3. **Interactive Elements**
   - Keep touch targets minimum 20px height
   - Use hover states for better feedback
   - Maintain consistent spacing

4. **Responsive Behavior**
   - Content should adapt to panel width
   - Use flex-grow and flex-shrink appropriately
   - Implement proper overflow handling

5. **Visual Hierarchy**
   - Use consistent spacing
   - Maintain clear section separation
   - Implement subtle borders or background colors for grouping

## Implementation Notes

1. **Performance**
   - Use CSS Grid for layout structure
   - Implement virtual scrolling for long lists
   - Optimize reflows and repaints

2. **Accessibility**
   - Maintain minimum contrast ratios
   - Ensure keyboard navigation works
   - Provide proper ARIA labels

3. **State Management**
   - Handle loading states appropriately
   - Show clear empty states
   - Manage error states effectively

## Common Issues and Solutions

### Issue: Content Overflow
**Solution:**
- Implement proper overflow handling
- Use text truncation
- Add tooltips for truncated content

### Issue: Inconsistent Sizing
**Solution:**
- Use CSS custom properties for consistent dimensions
- Implement a spacing scale
- Create reusable components

### Issue: Poor Performance
**Solution:**
- Implement virtualization for long lists
- Optimize render cycles
- Use proper CSS containment

## Testing Guidelines

1. **Visual Testing**
   - Verify content fits without overflow
   - Check all interactive states
   - Test different content lengths

2. **Functional Testing**
   - Verify scrolling behavior
   - Test keyboard navigation
   - Check touch interactions

3. **Cross-browser Testing**
   - Verify scrollbar appearance
   - Check font rendering
   - Test interactive behaviors

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | July 2025 | Initial specification |
| 0.9.0 | June 2025 | Beta testing updates |
| 0.5.0 | April 2025 | First draft |

---

This document should be reviewed and updated as the application evolves. All developers should follow these guidelines to maintain consistency across the application's panel system.