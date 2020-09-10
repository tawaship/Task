# @tawaship/task

Process tasks serially.

[![Build Status](https://travis-ci.org/tawaship/Task.svg?branch=master)](https://travis-ci.org/tawaship/Task)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

---


## How to install

1. on you npm project

```sh
npm install --save @tawaship/task
```

2. on your code

```javascript
import { Task } from '@tawaship/task';

// or

const { Task } = require('@tawaship/task');
```

## How to build

```sh
git clone https://github.com/tawaship/Task

cd Emitter

npm install

npm run build
```

## How to load on browser

After [install](#how-to-install) or [build](#how-to-build)

```html
<script src="/path/to/dist/Task.min.js"></script>
```

## Usage

### Single
```javascript
let a = 0;
const task = new Task(
	function() {
		a++;
	}
);

task.done();
console.log(a); // 1

task.done();
console.log(a); // 2
```

### Chaining
```javascript
const task = new Task([
	function() {
		return task.next().done();
	},
	function() {
		return 3;
	}
]);

console.log(task.done()); // 3
```

### Change position
```javascript
const task = new Task([
	function() {
		return 1
	},
	function() {
		return 2;
	},
	function() {
		return 3;
	}
]);

console.log(task.first().done()); // 1
console.log(task.next().done()); // 2
console.log(task.prev().done()); // 1
console.log(task.to(2).done()); // 3
```

### Disabled
```javascript
const task = new Task([
	function() {
		return 1
	},
	function() {
		return 2;
	},
	function() {
		return 3;
	},
	function() {
		return 4;
	}
]);

task.enabled = false;
console.log(task.first().done()); // undefined
console.log(task.next().done()); // undefined
console.log(task.prev().done()); // undefined
console.log(task.to(2).done()); // undefined
```

### Add
```javascript
const task = new Task([
	function() {
		return 1
	}
])
.add(function() {
	return 2;
});

console.log(task.next().done()); // 2
```

### Replace
```javascript
const task = new Task([
	function() {
		return 1
	}
])
.replace([
	function() {
		return 2;
	},
	function() {
		return 5;
	}
]);

console.log(task.first().done()); // 2
console.log(task.next().done()); // 5
```

### Reset
```javascript
const task = new Task([
	function() {
		return 1
	}
])
.reset();

console.log(task.first().done()); // undefined
```

### Send arguments
```javascript
const task = new Task(
	function(a, b, c) {
		console.log(a, b, c); // 1 2 3
	}
);
task.done(1, 2, 3);
```

### Specify the context
```javascript
let a = {hoge: 1};
const task = new Task(
	function() {
		this.moga = 2;
		return this;
	}
, a);

console.log(task.done()); // { hoge: 1, moga: 2 }
```

However, using the arrow function invalidates the context specification.

```javascript
// on window
let a = {hoge: 1};
const task = new Task(
	() => {
		return this;
	}
, a);

console.log(task.done()); // Window
```