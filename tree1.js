// newick tree
// console.log(JSON.stringify(tnt.tree.parse_newick(newick)))
var newick = "";
var tree = tnt.tree();
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

function makeTree(newick) {
    document.getElementById("treemaker").innerHTML=""
    tree
        .data(tnt.tree.parse_newick(newick))
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
  var newick=document.getElementById("userInput").value;
  makeTree(newick);
}

function submitFile() {

    var fileInput = document.getElementById("fileInput")
    console.log(fileInput.files[0])
    var newick = ''

    var file = fileInput.files[0]
    var reader = new FileReader()


    reader.onload = function(e) {
        newick = reader.result
        console.log('dsadsa')
        console.log(newick)
        makeTree(newick);
    }       
    reader.readAsText(file);
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