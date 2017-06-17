## Version 0.1
- Load tree
    - simple newick
- Tree display
    - vertical
    - circular
- tree size 
    - readjust to fit screen - including a button for it : `FIT`
    - zoom in and out using scroll button
    - click and drag to move tree around

- tree manipulation
    - collapsing nodes
        - must resize the tree

- frond end
    - load tree from file only.
    - tree display button opens sub-menu: vertical, circular
    - `fit screen` button

- code review + tests

## Version 0.2

- Load tree
    - support for bootstrap and other values in branch labels.

- Tree display
    - draw branches support values
    - change colors of nodes and branches of a selected child node
    - change line width of branches
    - change node sizes and shapes
    - transparency of branches according to support values

- Tree manipulation
    - Tree re-root (attn to branch label placement)
    - Ordering branch up and down.

- Front end
    - retracting toolbar with:
        - button to toggle support values
        - branch line width and color
        - node size and shape
        - ordering
        - re-root
    - tool-tip with node information
    - drop-down menu to change colors of inner nodes and specific branches

- Misc
    - save settings state in JSON

- Code Review and Tests

## Version 0.3

- Load tree
    - ability to load JSON with settings.

- Tree manipulation
    - overwrite information on tree: node name and branch names.
    - flip branch

- Export
    - Tree
        - PDF
        - Newick
    - Settings
        - JSON

- Front end
    - export button + option to toolbar
    - flipping option in node menu