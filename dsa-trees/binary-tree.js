/** BinaryTreeNode: node for a general tree. */

class BinaryTreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinaryTree {
  constructor(root = null) {
    this.root = root;
  }

  /** minDepth(): return the minimum depth of the tree -- that is,
   * the length of the shortest path from the root to a leaf. */
  minDepth() {
    if (!this.root) return 0;

    const queue = [{ node: this.root, depth: 1 }];
    while (queue.length) {
      const { node, depth } = queue.shift();
      if (!node.left && !node.right) return depth;
      if (node.left) queue.push({ node: node.left, depth: depth + 1 });
      if (node.right) queue.push({ node: node.right, depth: depth + 1 });
    }
  }

  /** maxDepth(): return the maximum depth of the tree -- that is,
   * the length of the longest path from the root to a leaf. */
  maxDepth() {
    if (!this.root) return 0;

    const stack = [{ node: this.root, depth: 1 }];
    let maxDepth = 0;

    while (stack.length) {
      const { node, depth } = stack.pop();
      maxDepth = Math.max(maxDepth, depth);
      if (node.left) stack.push({ node: node.left, depth: depth + 1 });
      if (node.right) stack.push({ node: node.right, depth: depth + 1 });
    }

    return maxDepth;
  }

  /** maxSum(): return the maximum sum you can obtain by traveling along a path in the tree.
   * The path doesn't need to start at the root, but you can't visit a node more than once. */
  maxSum() {
    if (!this.root) return 0; // Handle empty tree case

    let maxSum = -Infinity;

    function helper(node) {
      if (!node) return 0;

      const leftSum = Math.max(0, helper(node.left));
      const rightSum = Math.max(0, helper(node.right));
      const localMax = node.val + leftSum + rightSum;

      maxSum = Math.max(maxSum, localMax);
      return node.val + Math.max(leftSum, rightSum);
    }

    helper(this.root);
    return maxSum;
  }

  /** nextLarger(lowerBound): return the smallest value in the tree
   * which is larger than lowerBound. Return null if no such value exists. */
  nextLarger(lowerBound) {
    if (!this.root) return null;

    let nextLarger = null;
    const stack = [this.root];

    while (stack.length) {
      const node = stack.pop();
      if (node.val > lowerBound && (nextLarger === null || node.val < nextLarger)) {
        nextLarger = node.val;
      }
      if (node.left) stack.push(node.left);
      if (node.right) stack.push(node.right);
    }

    return nextLarger;
  }

  /** areCousins(node1, node2): determine whether two nodes are cousins
   * (i.e. are at the same level but have different parents. ) */
  areCousins(node1, node2) {
    if (!this.root) return false;

    function findDepthAndParent(node, target, depth = 0, parent = null) {
      if (!node) return null;
      if (node === target) return { depth, parent };

      return (
        findDepthAndParent(node.left, target, depth + 1, node) ||
        findDepthAndParent(node.right, target, depth + 1, node)
      );
    }

    const node1Info = findDepthAndParent(this.root, node1);
    const node2Info = findDepthAndParent(this.root, node2);

    if (!node1Info || !node2Info) return false;

    return node1Info.depth === node2Info.depth && node1Info.parent !== node2Info.parent;
  }

  /** serialize(tree): serialize the BinaryTree object tree into a string. */
  static serialize(tree) {
    const result = [];

    function traverse(node) {
      if (!node) {
        result.push(null);
        return;
      }
      result.push(node.val);
      traverse(node.left);
      traverse(node.right);
    }

    traverse(tree.root);
    return JSON.stringify(result);
  }

  /** deserialize(stringTree): deserialize stringTree into a BinaryTree object. */
  static deserialize(stringTree) {
    const values = JSON.parse(stringTree);

    function buildTree() {
      if (values.length === 0) return null;

      const value = values.shift();
      if (value === null) return null;

      const node = new BinaryTreeNode(value);
      node.left = buildTree();
      node.right = buildTree();
      return node;
    }

    const root = buildTree();
    return new BinaryTree(root);
  }

  /** lowestCommonAncestor(node1, node2): find the lowest common ancestor
   * of two nodes in a binary tree. */
  lowestCommonAncestor(node1, node2) {
    function helper(node) {
      if (!node || node === node1 || node === node2) return node;

      const left = helper(node.left);
      const right = helper(node.right);

      if (left && right) return node;
      return left ? left : right;
    }

    return helper(this.root);
  }
}

module.exports = { BinaryTree, BinaryTreeNode };


