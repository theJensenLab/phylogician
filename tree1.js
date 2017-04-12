// newick tree
// console.log(JSON.stringify(tnt.tree.parse_newick(newick)))
var newick = "";
var tree = tnt.tree();
var parsedObj = tnt.tree.parse_newick(newick);
var newickInput = document.getElementById("userInput").value;

tree.on("click", function (node)
{
  var root = tree.root();
  //node.sort(function (node, node.parent()) {return 1});
  var tempTree = root.subtree(node.get_all_leaves());
  var nodeParent = node.parent();
  tree.data(tempTree.data());  
  //tree.node_display(tree.node_display()
        //.size(10)
        //.fill("cyan"));
    tree.update();
});

function makeTree ()
{
document.getElementById("treemaker").innerHTML=""
  tree
    .data(parsedObj)
    .node_display(tree.node_display()
        .size(10)
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
  parsedObj=tnt.tree.parse_newick(newick);
  makeTree();
}

function submitFile()
{
  var reader=new FileReader ();
  reader.addEventListener("loadend", function() {
   // reader.result contains the contents of blob as a typed array
   document.getElementById("fileInput").innerText = reader.result;
});
  console.log(document.getElementById("fileInput").innerText);
  newick=reader.readAsText(reader.result);
  parsedObj=tnt.tree.parse_newick(newick);
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