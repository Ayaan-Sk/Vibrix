import { motion } from 'framer-motion';
import { Bookmark, Clock, User, ChevronRight } from 'lucide-react';

const NoticeCard = ({ notice, onClick, isSaved, onSave }) => {
  const urgencyColors = {
    critical: 'border-red-500/50 text-red-500 bg-red-500/10',
    normal: 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10',
    low: 'border-green-500/50 text-green-500 bg-green-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card group relative flex flex-col h-full hover:bg-white/[0.04]"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${urgencyColors[notice.urgency]}`}>
          {notice.urgency}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); onSave(notice._id); }}
          className={`p-2 rounded-full transition-colors ${isSaved ? 'text-primary bg-primary/10' : 'text-gray-500 hover:bg-white/5'}`}
        >
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary-light transition-colors">
        {notice.heading || notice.title}
      </h3>
      
      <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
        {notice.summary}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {notice.tags?.map(tag => (
          <span key={tag} className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-500 uppercase font-medium">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="flex items-center gap-1.5">
            <User size={14} />
            <span className="text-[11px] truncate max-w-[80px]">{notice.postedBy?.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span className="text-[11px]">{new Date(notice.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <button 
          onClick={onClick}
          className="flex items-center gap-1 text-xs font-bold text-primary-light hover:text-white transition-colors"
        >
          Read More
          <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default NoticeCard;
