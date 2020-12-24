export interface ITaskDelegate {
	(...args: any[]): any;
}

/**
 * @private
 */
interface ITaskData {
	context: any;
	enabled: boolean;
	index: number;
	callbacks: ITaskDelegate[];
	value: any;
}

export class Task {
	protected _taskData: ITaskData;
	
	constructor(callbacks: ITaskDelegate | ITaskDelegate[], context?: unknown) {
		this._taskData = {
			context: context == null ? this : context,
			enabled: true,
			index: -1,
			callbacks: [],
			value: null
		};
		
		this.add(callbacks);
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
	 * Add the task to the end of the list.
	 */
	add(callbacks: ITaskDelegate | ITaskDelegate[]) {
		if (!Array.isArray(callbacks)) {
			callbacks = [callbacks];
		}
		
		const list = this._taskData.callbacks;
		const flag = list.length === 0;
		
		for (let i = 0; i < callbacks.length; i++) {
			if (!(callbacks[i] instanceof Function)) {
				continue;
			}
			
			list.push(callbacks[i]);
		}
		
		return this;
	}
	
	/**
	 * Execute the current task.
	 */
	done(...args: any[]): any {
		if (!this._taskData.enabled) {
			return;
		}
		
		const task = this._taskData.callbacks[this._taskData.index];
		if (!task) {
			return;
		}
		
		return this._taskData.value = task.apply(this._taskData.context, args);
	}
	
	private _to(index: number) {
		this._taskData.index = Number(index);
		
		return this;
	}
	
	/**
	 * Change the current task to the first task.
	 */
	first() {
		return this._to(0);
	}
	
	/**
	 * Change the current task to the previos task.
	 */
	prev() {
		return this._to(this._taskData.index - 1);
	}
	
	/**
	 * Change the current task to the next task.
	 */
	next() {
		return this._to(this._taskData.index + 1);
	}
	
	/**
	 * Change the current task to the specified task.
	 */
	to(index: number) {
		return this._to(index);
	}
	
	/**
	 * Skips all tasks and changes to the finished state.
	 */
	finish() {
		this._taskData.index = -1;
		
		return this;
	}
	
	/**
	 * Cancel all task and leave them unregistered.
	 */
	reset() {
		this._taskData.callbacks = [];
		this._taskData.index = -1;
		this._taskData.value = null;
		
		return this;
	}
	
	/**
	 * Destroy instance.
	 */
	destroy(): void {
		this.reset();
	}
	
	/**
	 * The value returned by the last task executed.
	 */
	get value(): any {
		return this._taskData.value;
	}
}