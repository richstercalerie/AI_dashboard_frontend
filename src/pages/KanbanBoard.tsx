import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Plus, 
  Calendar, 
  Tag, 
  Flag, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle,
  FileText,
  X
} from 'lucide-react';

// Initial data
const initialColumns = {
  'to-do': {
    id: 'to-do',
    title: 'To Do',
    taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
  },
  'in-progress': {
    id: 'in-progress',
    title: 'In Progress',
    taskIds: ['task-5', 'task-6', 'task-7'],
  },
  'review': {
    id: 'review',
    title: 'Review',
    taskIds: ['task-8', 'task-9'],
  },
  'completed': {
    id: 'completed',
    title: 'Completed',
    taskIds: ['task-10', 'task-11'],
  },
};

const initialTasks = {
  'task-1': {
    id: 'task-1',
    title: 'Review high-risk customer profiles',
    description: 'Analyze the accounts of customers with 70%+ churn risk',
    priority: 'high',
    dueDate: '2025-06-10',
    assignee: 'Anurag Mishra',
    tags: ['customer-retention', 'high-priority'],
  },
  'task-2': {
    id: 'task-2',
    title: 'Prepare monthly churn report',
    description: 'Compile churn statistics for May 2025',
    priority: 'medium',
    dueDate: '2025-06-08',
    assignee: 'Priya Sharma',
    tags: ['reporting', 'monthly'],
  },
  'task-3': {
    id: 'task-3',
    title: 'Investigate suspicious login attempts',
    description: 'Check security logs for potential account breaches',
    priority: 'high',
    dueDate: '2025-06-07',
    assignee: 'Vikram Mehta',
    tags: ['security', 'urgent'],
  },
  'task-4': {
    id: 'task-4',
    title: 'Update SHAP analysis dashboard',
    description: 'Add new feature importance visualizations',
    priority: 'medium',
    dueDate: '2025-06-12',
    assignee: 'Anjali Desai',
    tags: ['analytics', 'dashboard'],
  },
  'task-5': {
    id: 'task-5',
    title: 'Develop retention strategy for ULIP customers',
    description: 'Create targeted retention plan for high-value ULIP holders',
    priority: 'high',
    dueDate: '2025-06-15',
    assignee: 'Rahul Patel',
    tags: ['strategy', 'retention'],
  },
  'task-6': {
    id: 'task-6',
    title: 'Optimize customer segmentation model',
    description: 'Refine customer segments based on behavioral data',
    priority: 'medium',
    dueDate: '2025-06-18',
    assignee: 'Neha Gupta',
    tags: ['data-science', 'segmentation'],
  },
  'task-7': {
    id: 'task-7',
    title: 'Analyze policy cancellation patterns',
    description: 'Identify common factors in recently cancelled policies',
    priority: 'medium',
    dueDate: '2025-06-14',
    assignee: 'Suresh Kumar',
    tags: ['analysis', 'cancellations'],
  },
  'task-8': {
    id: 'task-8',
    title: 'Review retention campaign results',
    description: 'Evaluate effectiveness of Q2 retention initiatives',
    priority: 'high',
    dueDate: '2025-06-09',
    assignee: 'Priya Sharma',
    tags: ['campaign', 'review'],
  },
  'task-9': {
    id: 'task-9',
    title: 'Validate new churn prediction model',
    description: 'Test accuracy of updated churn prediction algorithm',
    priority: 'high',
    dueDate: '2025-06-11',
    assignee: 'Vikram Mehta',
    tags: ['model', 'validation'],
  },
  'task-10': {
    id: 'task-10',
    title: 'Deploy customer behavior tracking system',
    description: 'Launch updated behavioral analytics module',
    priority: 'medium',
    dueDate: '2025-06-01',
    assignee: 'Rahul Patel',
    tags: ['deployment', 'completed'],
  },
  'task-11': {
    id: 'task-11',
    title: 'Train team on new CRM features',
    description: 'Conduct training sessions on updated CRM functionality',
    priority: 'low',
    dueDate: '2025-06-05',
    assignee: 'Anurag Mishra',
    tags: ['training', 'internal'],
  },
};

const columnOrder = ['to-do', 'in-progress', 'review', 'completed'];

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignee: '',
    tags: [] as string[],
  });
  
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    
    // Drop outside a droppable area
    if (!destination) return;
    
    // Drop in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;
    
    // Moving within the same column
    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const newTaskIds = Array.from(column.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      
      const newColumn = {
        ...column,
        taskIds: newTaskIds,
      };
      
      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
      
      return;
    }
    
    // Moving from one column to another
    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    const sourceTaskIds = Array.from(sourceColumn.taskIds);
    const destinationTaskIds = Array.from(destinationColumn.taskIds);
    
    sourceTaskIds.splice(source.index, 1);
    destinationTaskIds.splice(destination.index, 0, draggableId);
    
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    };
    
    const newDestinationColumn = {
      ...destinationColumn,
      taskIds: destinationTaskIds,
    };
    
    setColumns({
      ...columns,
      [newSourceColumn.id]: newSourceColumn,
      [newDestinationColumn.id]: newDestinationColumn,
    });
  };
  
  const handleCreateTask = () => {
    const newTaskId = `task-${Object.keys(tasks).length + 1}`;
    
    // Create new task
    const taskToAdd = {
      id: newTaskId,
      ...newTask,
    };
    
    // Add to tasks state
    setTasks({
      ...tasks,
      [newTaskId]: taskToAdd,
    });
    
    // Add to To Do column
    const newToDoColumn = {
      ...columns['to-do'],
      taskIds: [...columns['to-do'].taskIds, newTaskId],
    };
    
    setColumns({
      ...columns,
      'to-do': newToDoColumn,
    });
    
    // Reset form and close modal
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignee: '',
      tags: [],
    });
    
    setShowTaskModal(false);
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300';
      case 'medium':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300';
      case 'low':
        return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Task Management</h1>
        <button 
          onClick={() => setShowTaskModal(true)} 
          className="glass-card px-4 py-2 flex items-center gap-2 text-sm font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columnOrder.map(columnId => {
            const column = columns[columnId];
            const columnTasks = column.taskIds.map(taskId => tasks[taskId]);
            
            return (
              <div key={column.id} className="flex flex-col">
                <div className="mb-3 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-white">{column.title}</h2>
                  <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                    {column.taskIds.length}
                  </span>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`kanban-column ${
                        snapshot.isDraggingOver ? 'bg-primary-100/10 dark:bg-primary-900/10' : ''
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`kanban-card ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-primary-400 dark:ring-primary-500' : ''
                              }`}
                            >
                              <h3 className="font-medium mb-2">{task.title}</h3>
                              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                                {task.description}
                              </p>
                              
                              <div className="flex flex-wrap gap-1 mb-3">
                                {task.tags.map((tag, tagIndex) => (
                                  <span 
                                    key={tagIndex}
                                    className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                                  <Flag size={10} />
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </span>
                                
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                                    <Calendar size={10} />
                                    {task.dueDate}
                                  </span>
                                  
                                  <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-primary-600 dark:text-primary-300 text-xs">
                                    {task.assignee.charAt(0)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {column.taskIds.length === 0 && (
                        <div className="p-4 text-center text-sm text-neutral-500 dark:text-neutral-400 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg">
                          Drag tasks here
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
      
      {/* Task creation modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 w-full max-w-md mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Add New Task</h2>
              <button 
                onClick={() => setShowTaskModal(false)}
                className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Title
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Description
                </label>
                <textarea 
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Priority
                  </label>
                  <select 
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Due Date
                  </label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Assignee
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  placeholder="Assignee name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Tags (comma separated)
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. urgent, reporting"
                  onChange={(e) => setNewTask({ ...newTask, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateTask}
                  className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
                  disabled={!newTask.title}
                >
                  Create Task
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default KanbanBoard;