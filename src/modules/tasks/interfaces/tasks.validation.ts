export const isIsoDate = (val: string): boolean => {
  const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:?\d{2})?)?$/;
  if (!isoRegex.test(val)) return false;
  const d = new Date(val);
  return !isNaN(d.getTime());
};

export const isNotPastDate = (val: string): boolean => {
  const d = new Date(val);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d.getTime() >= today.getTime();
};

export const createTaskSchema = {
  title: {
    required: true,
  },
  priority: {
    required: true,
    validate: (val: any) =>
      ['Low', 'Medium', 'High'].includes(val) || 'priority must be one of Low/Medium/High',
  },
  status: {
    required: true,
    validate: (val: any) =>
      ['To Do', 'In Progress', 'Done'].includes(val) || 'status must be one of To Do/In Progress/Done',
  },
  dueDate: {
    required: true,
    validate: (val: any) => {
      if (!isIsoDate(val)) {
        return 'dueDate must be a valid ISO date';
      }
      if (!isNotPastDate(val)) {
        return 'dueDate cannot be in the past';
      }
      return true;
    },
  },
};

export const updateTaskSchema = {
  title: {
    required: false,
    validate: (val: any) => val !== '' || 'title cannot be empty',
  },
  priority: {
    required: false,
    validate: (val: any) =>
      ['Low', 'Medium', 'High'].includes(val) || 'priority must be one of Low/Medium/High',
  },
  status: {
    required: false,
    validate: (val: any) =>
      ['To Do', 'In Progress', 'Done'].includes(val) || 'status must be one of To Do/In Progress/Done',
  },
  dueDate: {
    required: false,
    validate: (val: any) => isIsoDate(val) || 'dueDate must be a valid ISO date',
  },
};
