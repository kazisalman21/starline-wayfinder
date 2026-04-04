import conciergeImg from '@/assets/ai-concierge-avatar.jpg';
import { cn } from '@/lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'hero';

const sizeMap: Record<AvatarSize, string> = {
  xs: 'w-7 h-7',
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  hero: 'w-40 h-40 md:w-52 md:h-52',
};

interface Props {
  size?: AvatarSize;
  glow?: boolean;
  online?: boolean;
  className?: string;
}

export default function AIConciergeAvatar({ size = 'sm', glow = false, online = false, className }: Props) {
  return (
    <div className={cn('relative flex-shrink-0', className)}>
      <div
        className={cn(
          sizeMap[size],
          'rounded-full overflow-hidden border-2 border-primary/30',
          glow && 'shadow-[0_0_20px_hsl(355_70%_42%/0.3)]',
        )}
      >
        <img
          src={conciergeImg}
          alt="Star Line Care AI Assistant"
          className="w-full h-full object-cover object-top"
        />
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-background animate-pulse" />
      )}
    </div>
  );
}
