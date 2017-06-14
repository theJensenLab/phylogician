/*click node=view subtree
tree.on("click", function (node)
{
  var root = tree.root();
  //node.sort(function (node, node.parent()) {return 1});
  var tempTree = root.subtree(node.get_all_leaves());
  var nodeParent = node.parent();
  tree.data(tempTree.data());  
    tree.update();
});*/

/*click node=tree turns cyan
tree.on("click", function (node)
{
  var root = tree.root();
  //node.sort(function (node, node.parent()) {return 1});
  var tempTree = root.subtree(node.get_all_leaves());
  var nodeParent = node.parent();
  tree.data(tempTree.data());  
  tree.node_display(tree.node_display()
        .size(10)
        .fill("cyan"));
    tree.update();
});*/

