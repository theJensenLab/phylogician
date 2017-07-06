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

/*var numOpenPar = 0;
var numClosedPar = 0;
var numCommas = 0;
    numCommas=0;
  for (var x=0; x<newick.length; x++)
    {
      if (newick.charAt(x)==='(')
        {
        numOpenPar++;
        }
      if (newick.charAt(x)===')')
        {
        numClosedPar++;
        }
      if (newick.charAt(x)==',')
        {
          numCommas++;
        }
    }
  if (numOpenPar!==numClosedPar || newick.charAt(0)!=='(' || newick.charAt(newick.length-1)!==';')
    {  document.getElementById("errorspot").style.color="Red"
      document.getElementById("errorspot").innerHTML = "ERROR: INVALID INPUT";
      resetPar();
  }
   else
    {
      resetPar();
      }

*/

/*tooltips
tree.on("click", function (d) {
                tnt.tooltip.table()
                    .width(120)
                    .call(this, {
                        "header" : "Node",
                        "rows" : [
                            {"label": "id", "value": d.id()}
                        ]
                    })
            })
            */

            /*dynamic resizing (with bug: nodes uncollapse)
$(window).resize(function() {
  var newick=document.getElementById("userInput").value;
  makeTree(newick);
});*/