export interface ITaskData {
	context: any,
	enabled: boolean,
	index: number,
	tasks: TTaskDelegate[],
	current: TTaskDelegate | null
}

export type TTaskDelegate = (...args: any) => any;

export class Task {
	protected _taskData: ITaskData;
	
	constructor(tasks: TTaskDelegate | TTaskDelegate[], context: any = null) {
		if (tasks instanceof Function) {
			tasks = [tasks];
		}
		
		this._taskData = {
			context,
			enabled: true,
			index: 0,
			tasks,
			current: null
		};
		
		this.first();
	}
	
	/**
	 * Whether the task works.
	 */
	get enabled(): boolean {
		return this._taskData.enabled;
	}
	
	set enabled(enabled) {
		this._taskData.enabled = enabled;
	}
	
	/**
	 * Execute the current task.
	 */
	done(...args: any[]): any {
		if (!this._taskData.enabled || !this._taskData.current) {
			return;
		}
		
		return this._taskData.current.apply(this._taskData.context, args);
	}
	
	/**
	 * Change the current task to the first task.
	 */
	first() {
		if (!this._taskData.tasks[0]) {
			return this;
		}
		
		this._taskData.current = this._taskData.tasks[this._taskData.index = 0];
		
		return this;
	}
	
	/**
	 * Change the current task to the last task.
	 */
	last() {
		if (!this._taskData.tasks.length) {
			return this;
		}
		
		this._taskData.current = this._taskData.tasks[this._taskData.index = this._taskData.tasks.length - 1];
		
		return this;
	}
	
	/**
	 * Change the current task to the previos task.
	 */
	prev() {
		if (!this._taskData.tasks[this._taskData.index - 1]) {
			return this;
		}
		
		this._taskData.current = this._taskData.tasks[--this._taskData.index];
		
		return this;
	}
	
	/**
	 * Change the current task to the next task.
	 */
	next() {
		if (!this._taskData.tasks[this._taskData.index + 1]) {
			return this;
		}
		
		this._taskData.current = this._taskData.tasks[++this._taskData.index];
		
		return this;
	}
	
	/**
	 * Change the current task to the specified task.
	 */
	to(index: number) {
		if (!this._taskData.tasks[index]) {
			return this;
		}
		
		this._taskData.current = this._taskData.tasks[this._taskData.index = Number(index)];
		
		return this;
	}
	
	/**
	 * Destroy instance.
	 */
	destroy(): void {
		this._taskData.context = null;
		this._taskData.tasks = [];
		this._taskData.current = null
	}
}