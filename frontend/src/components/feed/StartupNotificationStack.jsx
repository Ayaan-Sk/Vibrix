import { useState, useEffect } from 'react';
import { useSprings, animated, to } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { Bookmark, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to determine the transform for each card
const toStyles = (i) => ({
  x: 0,
  y: i * -10,
  scale: 1 - i * 0.05,
  rot: 0,
  opacity: 1,
  delay: i * 100,
});

const fromStyles = (_i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000, opacity: 0 });

const trans = (r, s) =>
  `perspective(1500px) rotateX(10deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

const StartupNotificationStack = ({ notices, onSave, onDismiss, onComplete }) => {
  const [gone] = useState(() => new Set()); 
  const [props, api] = useSprings(notices.length, (i) => ({
    ...toStyles(i),
    from: fromStyles(i),
  }));

  const bind = useDrag(({ args: [index], active, movement: [mx], direction: [xDir], velocity: [vx] }) => {
    const trigger = vx > 0.2; // If you flick hard enough it should trigger the card to fly out
    const dir = xDir < 0 ? -1 : 1; // Direction should be -1 or 1

    if (!active && trigger) gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out

    api.start((i) => {
      if (index !== i) return; // We're only interested in changing the current card
      const isGone = gone.has(index);
      const x = isGone ? (200 + window.innerWidth) * dir : active ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
      const rot = mx / 100 + (isGone ? dir * 10 * vx : 0); // How much the card tilts, flicking it harder makes it rotate more
      const scale = active ? 1.1 : 1; // Active cards lift up a bit
      
      // Notify parent about save/dismiss on flick
      if (!active && isGone) {
        if (dir === -1) onSave(notices[index]._id); // Left = Save
        else onDismiss(notices[index]._id); // Right = Dismiss
      }

      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 },
      };
    });

    if (!active && gone.size === notices.length) {
      setTimeout(onComplete, 600);
    }
  });

  if (notices.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 overflow-hidden">
      <div className="relative w-full max-w-sm h-[500px]">
        {props.map(({ x, y, rot, scale, opacity }, i) => (
          <animated.div
            key={i}
            style={{ x, y, opacity }}
            className="absolute w-full h-full flex items-center justify-center will-change-transform"
          >
            <animated.div
              {...bind(i)}
              style={{
                transform: to([rot, scale], trans),
              }}
              className="relative w-full h-[450px] bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl cursor-grab active:cursor-grabbing select-none"
            >
              {/* Overlays */}
              <animated.div 
                style={{ opacity: x.to(v => Math.max(0, -v / 150)) }}
                className="absolute inset-0 bg-primary/20 rounded-3xl flex items-center justify-center z-10 pointer-events-none"
              >
                <div className="flex flex-col items-center gap-2 text-primary-light">
                  <Bookmark size={60} strokeWidth={2.5} />
                  <span className="font-bold text-xl uppercase tracking-widest">Save</span>
                </div>
              </animated.div>

              <animated.div 
                style={{ opacity: x.to(v => Math.max(0, v / 150)) }}
                className="absolute inset-0 bg-gray-500/20 rounded-3xl flex items-center justify-center z-10 pointer-events-none"
              >
                <div className="flex flex-col items-center gap-2 text-white">
                  <X size={60} strokeWidth={2.5} />
                  <span className="font-bold text-xl uppercase tracking-widest">Dismiss</span>
                </div>
              </animated.div>

              {/* Content */}
              <div className="h-full flex flex-col pt-4">
                <div className="inline-block px-3 py-1 rounded-full border border-primary/30 text-primary-light text-xs font-bold tracking-widest uppercase mb-4 w-fit">
                  {notices[i].urgency}
                </div>
                <h2 className="text-3xl font-bold leading-tight mb-4 text-white">
                  {notices[i].title || notices[i].heading}
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed flex-grow">
                  {notices[i].summary}
                </p>
                
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                   <div className="flex gap-2">
                     {notices[i].tags?.map(tag => (
                       <span key={tag} className="text-[10px] text-gray-500 uppercase tracking-tighter">#{tag}</span>
                     ))}
                   </div>
                   <span className="text-xs text-gray-500">{new Date(notices[i].createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </animated.div>
          </animated.div>
        ))}

        {/* Progress Dots */}
        <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-2">
           {notices.map((_, i) => (
             <div 
               key={i} 
               className={`h-1.5 rounded-full transition-all duration-300 ${gone.has(i) ? 'bg-white/10 w-4' : 'bg-primary w-8'}`}
             />
           ))}
        </div>
      </div>
      
      <button 
        onClick={onComplete}
        className="absolute bottom-10 text-gray-500 hover:text-white transition-colors text-sm font-medium tracking-widest uppercase underline underline-offset-8 decoration-gray-800"
      >
        Skip all notices
      </button>
    </div>
  );
};

export default StartupNotificationStack;
