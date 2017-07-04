# phyloTreeVizJS
Our approach to visualization of phylogenetics trees using javascript and d3.js

We will build a webApp for tree visualization.

Humbly inspired by the work of others, we will use TnT, d3, express and node.

## Install and run it.

f-navbar-scaffold
```bash
$ git clone git@github.com:theJensenLab/phyloTreeVizJS.git
$ cd phyloTreeVizJS
$ npm install
$ npm run server:dev
```

If you are working on a specific branch:

```bash
$ git branch _your_specific_branch_
$ npm install
$ npm run server:dev
```

If you get the `error`:

```bash
npm ERR! missing script: server:dev
```

then the branch where you are does not have the server:dev script using webpack...


=======
## How to contribute

branch name:

|prefix| meaning |
|:--:|:--:|
|f | feature |
|h | hotfix |
|t | testing/trying |

example:
`t-firstTree`


After branch is merged it can be deleted:

### To delete a branch:
```
git branch -d f-seg #local
git push origin --delete f-seg
```


develop

## Credits:

- tnt
- d3
- Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div> 
