export function hasOverlap(rect1: DOMRect, rect2: DOMRect): boolean {
  // Check if one rectangle is to the left of the other
  if (rect1.right <= rect2.left || rect2.right <= rect1.left) {
    return false;
  }
  // Check if one rectangle is above the other
  if (rect1.bottom <= rect2.top || rect2.bottom <= rect1.top) {
    return false;
  }
  // If neither condition is true, the rectangles overlap
  return true;
}

export function scaleRect(rect: DOMRect, scale: number): DOMRect {
  // Calculate the new width and height
  const newWidth = rect.width * scale;
  const newHeight = rect.height * scale;

  // Calculate the new left and top to keep the center the same
  const newLeft = rect.left + (rect.width - newWidth) / 2;
  const newTop = rect.top + (rect.height - newHeight) / 2;

  // Return a new DOMRect with the updated dimensions and position
  return new DOMRect(newLeft, newTop, newWidth, newHeight);
}
