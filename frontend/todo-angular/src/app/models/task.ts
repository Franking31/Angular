export enum TaskStatus {
    NEW = 'new', // Minuscules pour correspondre à Sequelize
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
  }
  
  export interface Task {
    id?: number;
    title: string;
    description?: string | null; // Peut être null car allowNull: true
    completed: boolean;
    imageUrl: string;
    projectId: number;
    status: TaskStatus;
    startDate: string; // Les dates sont renvoyées sous forme de chaînes ISO dans le JSON
    endDate: string; // Idem
    createdAt?: string; // Ajouté automatiquement par Sequelize
    updatedAt?: string; // Idem
  }