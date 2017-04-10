// newick tree
    var newick = "(((A,B),C),(D,E));";
  console.log(JSON.stringify(tnt.tree.parse_newick(newick)))
    var tree = tnt.tree();

    tree
        .data(tnt.tree.parse_newick(newick))
        .node_display(tree.node_display()
            .size(4)
            .fill("gray")
        )
        .label (tnt.tree.label.text()
            .fontsize(12)
            .height(24)
        )
        .layout(tnt.tree.layout.vertical()
            .width(200)
            .scale(false)
        );
    tree(document.getElementById("treemaker"));

function updateVertical()
{
            tree.layout(tnt.tree.layout.vertical().width(200).scale(false));
            tree.update();
}
function updateRadial()
{
  {
            tree.layout(tnt.tree.layout.radial().width(200).scale(false));
            tree.update();
        }
}