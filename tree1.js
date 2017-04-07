// newick tree1
    var newick = "(((A,B),C),(D,E));";

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

    tree(document.getElementById("mydiv"));