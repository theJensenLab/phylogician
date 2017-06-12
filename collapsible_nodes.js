var collapse_nodes = function(div) {

    // Show different node shapes for collapsed/non-collapsed nodes
    var node_size = 3;
    var node_fill="black";
    var node_stroke="black";

    var expanded_node = tnt.tree.node_display.circle()
        .size(node_size)
        .fill(node_fill)
        .stroke(node_stroke);

    var collapsed_node = tnt.tree.node_display.triangle()
        .size(node_size)
        .fill(node_fill)
        .stroke(node_stroke);

    var node_display = tnt.tree.node_display()
        .size(3)
        .display (function (node) {
            if (node.is_collapsed()) {
                collapsed_node.display().call(this, node);
            } else {
                expanded_node.display().call(this, node);
            }
        });

    tree.on ("click", function(node){
        node.toggle();
        tree.update();
    });

    // The tree renders at this point
    tree(div);
};