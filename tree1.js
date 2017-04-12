// newick tree
//console.log(JSON.stringify(tnt.tree.parse_newick(newick)))
var newick = "";
var tree = tnt.tree();
var newickInput = document.getElementById("userInput").value;

function makeTree ()
{
document.getElementById("treemaker").innerHTML=""
  tree
    .data(tnt.tree.parse_newick(newick))
    .node_display(tree.node_display()
        .size(4)
        .fill("gray")
        )
    .label (tnt.tree.label.text()
    .fontsize(12)
    .height(50)
        )
    .layout(tnt.tree.layout.vertical()
    .width(300)
    .scale(false)
        );
tree(document.getElementById("treemaker"));
}

function submitNewick ()
{
  newick=document.getElementById("userInput").value;
  makeTree();
}

function updateVertical()
{
            tree.layout(tnt.tree.layout.vertical().width(300).scale(false));
            tree.update();
}

function updateRadial()
{
  {
            tree.layout(tnt.tree.layout.radial().width(300).scale(false));
            tree.update();
        }
}