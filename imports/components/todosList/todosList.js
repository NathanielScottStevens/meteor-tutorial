import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Tasks } from '../../api/tasks.js';
import template from './todosList.html';

class TodosListCtrl {
	constructor($scope) {
		$scope.viewModel(this);
		
		this.hideCompleted = false;
		
		this.helpers({
			tasks() {
				const selector = {};
				
				if (this.getReactively('hideCompleted')) {
					selector.checked = {
						$ne: true
					}
				}
				
				return Tasks.find(selector, {
					checked: {
						$ne: true
					},
					sort: {
						createdAt: -1
					}
				});				
			},
			incompleteCount() {
				return Tasks.find({
					checked: {
						$ne: true
					}
				}).count();
			}
		})
	}
	
	addTask(newTask) {
		Tasks.insert({
			text: newTask,
			createdAt: new Date
		});
		
		// Clear form
		this.newTask = ' ';
	}
	
	setChecked(task) {
		Tasks.update(task._id, {
			$set: {
				checked: !task.checked
			},
		});
	}
	
	removeTask(task) {
		Tasks.remove(task._id);
	}
}

export default angular.module('todosList', [
	angularMeteor
])
	.component('todosList', {
		templateUrl: 'imports/components/todosList/todosList.html',
		controller: ['$scope', TodosListCtrl]
	});