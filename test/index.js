const assert = require('assert');
const { Task } = require('../');

describe('Task', () => {
	it('single', () => {
		const task = new Task(function() {
			return 10;
		});
		
		assert.equal(task.first().done(), 10);
	});
	
	it('chaining', () => {
		return new Promise((resolve, reject) => {
			const task = new Task([
				function() {
					setTimeout(() => {
						task.next().done();
					}, 100);
				},
				function() {
					resolve();
				}
			]);
			
			task.first().done()
		});
	});
	
	it('context', () => {
		var a = {};
		const task = new Task(function() {
			return this;
		}, a);
		
		assert.equal(task.first().done(), a);
	});
	
	it('args', () => {
		const task = new Task(function(a, b, c) {
			assert.ok(a === 1 && b === 2 && c === 3);
		});
		
		task.first().done(1, 2, 3);
	});
	
	{
		let p = 0;
		
		const task = new Task([
			function() {
				return 1;
			},
			function() {
				return 2;
			},
			function() {
				return 3
			}
		]);
			
		it('execute first', () => {
			assert.ok(task.first().done() === task.value && task.value === 1);
		});
		
		it('execute next', () => {
			assert.ok(task.next().done() === task.value && task.value === 2);
		});
		
		it('execute prev', () => {
			assert.ok(task.prev().done() === task.value && task.value === 1);
		});
		
		it('execute to', () => {
			assert.ok(task.to(2).done() === task.value && task.value === 3);
		});
		
		it('execute prev from first', () => {
			assert.ok(task.first().prev().done() === undefined && task.value === 3);
		});
		
		it('execute next from last', () => {
			assert.ok(task.to(2).next().done() === undefined && task.value === 3);
		});
		
		it('disabled', () => {
			task.enabled = false;
			task.first().done();
			assert.equal(task.value, 3);
		});
	}
	
	it('finish', () => {
		const task = new Task([
			function() {
				return 1;
			}
		]);
		task.first().done();
		
		assert.ok(task.finish().done() === undefined);
	});
	
	it('add', () => {
		const task = new Task([
			function() {
				return 1;
			}
		]);
		
		task.add(function() {
			return 2;
		});
		
		assert.equal(task.first().next().done(), 2);
	});
	
	it('reset', () => {
		const task = new Task([
			function() {
				return 1;
			}
		]);
		
		task.first().done();
		assert.ok(task.reset().done() === undefined && task.first().done() === undefined && task.value === null);
	});
	
	it('destroy', () => {
		const task = new Task([
			function() {
				return 1;
			}
		]);
		
		task.destroy();
		assert.ok(task.first().done() === undefined && task.value === null);
	});
});