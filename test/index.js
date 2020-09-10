const assert = require('assert');
const { Task } = require('../');

describe('Task', () => {
	it('single', () => {
		const task = new Task(function() {
			return 10;
		});
		
		assert.equal(task.done(), 10);
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
			
			task.done()
		});
	});
	
	it('context', () => {
		var a = {};
		const task = new Task(function() {
			return this;
		}, a);
		
		assert.equal(task.done(), a);
	});
	
	it('args', () => {
		const task = new Task(function(a, b, c) {
			assert.ok(a === 1 && b === 2 && c === 3);
		});
		
		task.done(1, 2, 3);
	});
	
	{
		let p = 0;
		
		const task = new Task([
			function() {
				p = 1;
			},
			function() {
				p = 2;
			},
			function() {
				p = 3
			}
		]);
			
		it('execute first', () => {
			task.first().done();
			assert.equal(p, 1);
		});
		
		it('execute next', () => {
			task.next().done();
			assert.equal(p, 2);
		});
		
		it('execute prev', () => {
			task.prev().done();
			assert.equal(p, 1);
		});
		
		it('execute to', () => {
			task.to(2).done();
			assert.equal(p, 3);
		});
		
		it('execute prev from first', () => {
			task.first().prev().done();
			assert.equal(p, 1);
		});
		
		it('execute next from last', () => {
			task.to(2).next().done();
			assert.equal(p, 3);
		});
		
		it('disabled', () => {
			task.enabled = false;
			task.first().done();
			assert.equal(p, 3);
		});
	}
	
	it('add', () => {
		const task = new Task([
			function() {
				return this.next().done();
			}
		]);
		
		task.add(function() {
			return 2;
		});
		
		assert.equal(task.first().done(), 2);
	});
	
	it('replace', () => {
		const task = new Task([
			function() {
				return 1;
			}
		]);
		
		task.replace(function() {
			return 2;
		});
		
		assert.equal(task.first().done(), 2);
	});
	
	it('reset', () => {
		const task = new Task([
			function() {
				return 1;
			}
		]);
		
		assert.equal(task.reset().done(), undefined);
	});
	
	it('destroy', () => {
		const task = new Task([
			function() {
				return 1;
			}
		]);
		
		task.destroy();
		assert.equal(task.first().done(), undefined);
	});
});