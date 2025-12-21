'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, GripVertical, MessageCircle, Paperclip, Plus } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: {
    name: string;
    avatar: string;
  };
  tags?: string[];
  dueDate?: string;
  attachments?: number;
  comments?: number;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color?: string;
}

const sampleData: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: '#2F6FA3',
    tasks: [
      {
        id: '1',
        title: 'Análise de Sistema de Design',
        description: 'Revisar e atualizar biblioteca de componentes',
        priority: 'high',
        assignee: { name: 'Maria Silva', avatar: 'https://i.pravatar.cc/150?img=1' },
        tags: ['Design', 'Sistema'],
        dueDate: '2024-01-15',
        attachments: 3,
        comments: 7,
      },
      {
        id: '2',
        title: 'Análise de Pesquisa de Usuário',
        description: 'Analisar feedback de entrevistas recentes',
        priority: 'medium',
        assignee: { name: 'João Santos', avatar: 'https://i.pravatar.cc/150?img=12' },
        tags: ['Pesquisa', 'UX'],
        dueDate: '2024-01-18',
        comments: 4,
      },
    ],
  },
  {
    id: 'progress',
    title: 'Em Progresso',
    color: '#7BC043',
    tasks: [
      {
        id: '3',
        title: 'Redesign do App Mobile',
        description: 'Implementando novos padrões de navegação',
        priority: 'high',
        assignee: { name: 'Pedro Costa', avatar: 'https://i.pravatar.cc/150?img=33' },
        tags: ['Mobile', 'UI'],
        attachments: 8,
        comments: 12,
      },
    ],
  },
  {
    id: 'review',
    title: 'Em Revisão',
    color: '#6B6E73',
    tasks: [
      {
        id: '4',
        title: 'Documentação da API',
        description: 'Completar documentação para desenvolvedores',
        priority: 'medium',
        assignee: { name: 'Ana Oliveira', avatar: 'https://i.pravatar.cc/150?img=45' },
        tags: ['Documentação', 'API'],
        dueDate: '2024-01-20',
        comments: 2,
      },
    ],
  },
  {
    id: 'done',
    title: 'Concluído',
    color: '#2F6FA3',
    tasks: [
      {
        id: '5',
        title: 'Otimização de Landing Page',
        description: 'Melhorou taxa de conversão em 23%',
        priority: 'low',
        assignee: { name: 'Carlos Lima', avatar: 'https://i.pravatar.cc/150?img=68' },
        tags: ['Marketing', 'Web'],
        attachments: 2,
        comments: 8,
      },
    ],
  },
];

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(sampleData);

  const handleDragStart = (e: React.DragEvent, task: Task, columnId: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ task, sourceColumnId: columnId }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { task, sourceColumnId } = data;

    if (sourceColumnId === targetColumnId) return;

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === sourceColumnId) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== task.id) };
        }
        if (col.id === targetColumnId) {
          return { ...col, tasks: [...col.tasks, task] };
        }
        return col;
      }),
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Kanban Board
        </h1>
        <p className="text-muted-foreground">Gerencie tarefas com arrastar e soltar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-muted/30 backdrop-blur-sm rounded-lg p-4 border"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
                <h3 className="font-semibold">
                  {column.title}
                </h3>
                <Badge variant="secondary" className="ml-auto">
                  {column.tasks.length}
                </Badge>
              </div>
              <button className="p-1 rounded-md hover:bg-accent transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {column.tasks.map((task) => (
                <Card
                  key={task.id}
                  className="cursor-move transition-all hover:shadow-md"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, column.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-sm leading-tight">
                          {task.title}
                        </h4>
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-move shrink-0" />
                      </div>

                      {task.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {task.tags && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span className="text-xs">Jan 15</span>
                            </div>
                          )}
                          {task.comments && (
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              <span className="text-xs">{task.comments}</span>
                            </div>
                          )}
                          {task.attachments && (
                            <div className="flex items-center gap-1">
                              <Paperclip className="w-3 h-3" />
                              <span className="text-xs">{task.attachments}</span>
                            </div>
                          )}
                        </div>

                        {task.assignee && (
                          <Avatar className="w-6 h-6 ring-2 ring-background">
                            <AvatarImage src={task.assignee.avatar} />
                            <AvatarFallback className="text-xs">
                              {task.assignee.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
