# Phylogician - 0.2v
Our approach to visualization of phylogenetics trees using javascript and d3.js

We will build a web app for tree visualization taking in consideration commentaries and criticisms of the community such as:



Humbly inspired by the work of others, we will use TnT, d3, express and node.

## Install and run it.

```bash
$ git clone git@github.com:theJensenLab/phyloTreeVizJS.git
$ cd phyloTreeVizJS
$ npm install
$ npm run server:dev
```

If you are working on a specific branch:

```bash
$ git checkout specific_branch
$ npm install
$ npm run server:dev
```

If you get the `error`:

```bash
npm ERR! missing script: server:dev
```

then the branch where you are does not have the server:dev script using webpack...

## Testing

Please run:
```
npm test
```

We use [mocha](mochajs.org) and [chai](chaijs.com) to do test.

To make a new test, just put the file in `tests/` and name it with `tests.js` prefix.

You must load `chai` in the beginning if you will be using `expect`:

```js
'use strict'

let expect = require('chai').expect
```

## Development roadmap
We have a development roadmap separated in [milestones](https://github.com/theJensenLab/phyloTreeVizJS/blob/develop/Milestone.md) 


## Bugs & suggestions
We welcome suggestions and criticism from the community. Please use the github [issue tracker](https://github.com/theJensenLab/phyloTreeVizJS/issues)

Also, check out the [milestone page](https://github.com/theJensenLab/phyloTreeVizJS/blob/develop/Milestone.md) to see if a feature you are requesting is already schedule to be part of Phylogician.


## How to contribute
branch name:

|prefix| meaning |
|:--:|:--:|
|f | feature |
|h | hotfix |
|t | testing/trying |

example:
`t-firstTree`

### To open a branch:
```
# local
$ git checkout -b f-name-of-my-branch

# push new branch
$ git push --set-upstream f-name-of-my-branch

```


After branch is merged it can be deleted:

### To delete a branch:
```
$ git branch -d f-seg #local
$ git push origin --delete f-seg
```


develop

## Credits:

- tnt
- d3
- Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div> 
