class OrderAdjuster {
  /**
   * Adjust order numbers in an array after insertion
   * @param {Array} items - Array of items with order property
   * @param {Number} newOrder - New order position (1-based)
   * @param {Boolean} isDelete - Whether adjusting for deletion
   * @returns {Array} Updated array with adjusted orders
   */
  static adjustOrderAfterInsert(items, newOrder, isDelete = false) {
    return items.map(item => {
      if (isDelete) {
        // For deletion, decrement order of items after the deleted one
        if (item.order > newOrder) {
          return { ...item, order: item.order - 1 };
        }
      } else {
        // For insertion, increment order of items at or after the new position
        if (item.order >= newOrder) {
          return { ...item, order: item.order + 1 };
        }
      }
      return item;
    });
  }

  /**
   * Adjust order numbers when moving an item
   * @param {Array} items - Array of items with order property
   * @param {Number} oldOrder - Current order position
   * @param {Number} newOrder - New order position
   * @returns {Array} Updated array with adjusted orders
   */
  static adjustOrderAfterMove(items, oldOrder, newOrder) {
    if (oldOrder === newOrder) return items;

    return items.map(item => {
      if (oldOrder < newOrder) {
        // Moving down (1 -> 3)
        if (item.order > oldOrder && item.order <= newOrder) {
          return { ...item, order: item.order - 1 };
        }
      } else {
        // Moving up (3 -> 1)
        if (item.order >= newOrder && item.order < oldOrder) {
          return { ...item, order: item.order + 1 };
        }
      }
      
      if (item.order === oldOrder) {
        return { ...item, order: newOrder };
      }
      
      return item;
    });
  }

  /**
   * Validate that order numbers are sequential without gaps
   * @param {Array} items - Array of items with order property
   * @returns {Boolean} True if orders are sequential
   */
  static validateSequentialOrder(items) {
    if (items.length === 0) return true;
    
    const sortedItems = [...items].sort((a, b) => a.order - b.order);
    
    for (let i = 0; i < sortedItems.length; i++) {
      if (sortedItems[i].order !== i + 1) {
        return false;
      }
    }
    return true;
  }

  /**
   * Fix order numbers to make them sequential
   * @param {Array} items - Array of items with order property
   * @returns {Array} Items with fixed sequential order
   */
  static fixOrderSequence(items) {
    return items
      .sort((a, b) => a.order - b.order)
      .map((item, index) => ({
        ...item,
        order: index + 1
      }));
  }
}

module.exports = OrderAdjuster;