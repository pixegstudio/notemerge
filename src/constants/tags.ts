export interface TagType {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export const PredefinedTags: TagType[] = [
  {
    id: 'vize',
    name: 'Vize',
    color: '#FF6B9D',
    icon: 'school',
  },
  {
    id: 'final',
    name: 'Final',
    color: '#5A7FE8',
    icon: 'trophy',
  },
  {
    id: 'quiz',
    name: 'Quiz',
    color: '#FFB84D',
    icon: 'help-circle',
  },
  {
    id: 'lab',
    name: 'Lab',
    color: '#4ECDC4',
    icon: 'flask',
  },
  {
    id: 'odev',
    name: 'Ödev',
    color: '#A78BFA',
    icon: 'document-text',
  },
  {
    id: 'proje',
    name: 'Proje',
    color: '#F59E0B',
    icon: 'construct',
  },
  {
    id: 'ders-notu',
    name: 'Ders Notu',
    color: '#10B981',
    icon: 'book',
  },
  {
    id: 'ozet',
    name: 'Özet',
    color: '#EC4899',
    icon: 'list',
  },
  {
    id: 'merged',
    name: 'Birleştirilmiş',
    color: '#10B981',
    icon: 'git-merge',
  },
];
