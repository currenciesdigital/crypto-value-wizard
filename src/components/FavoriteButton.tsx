
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
  title: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  isFavorite,
  onClick,
  title
}) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      aria-label={title}
      className={isFavorite ? 'text-red-500' : ''}
    >
      <Heart className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
    </Button>
  );
};

export default FavoriteButton;
