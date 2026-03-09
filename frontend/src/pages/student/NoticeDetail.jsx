import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bookmark, Share2, Languages, Image, Calendar, User, ChevronLeft, Loader2, X } from 'lucide-react';
import api from '../../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchNotice();
    checkSavedStatus();
  }, [id]);

  const fetchNotice = async () => {
    try {
      const { data } = await api.get(`/notices/${id}`);
      setNotice(data);
      setContent(data.content || data.extractedText);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkSavedStatus = async () => {
    try {
      const { data } = await api.get('/read-later');
      setIsSaved(data.some(item => item.noticeId?._id === id || item.noticeId === id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSave = async () => {
    try {
      if (isSaved) {
        await api.delete(`/read-later/${id}`);
        setIsSaved(false);
      } else {
        await api.post('/read-later', { notice_id: id });
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTranslate = async (lang) => {
    if (lang === 'English') {
      setContent(notice.content || notice.extractedText);
      return;
    }
    setTranslating(true);
    try {
      const { data } = await api.post('/ai/translate', { notice_id: id, targetLanguage: lang });
      setContent(data.translatedContent);
    } catch (err) {
      console.error(err);
    } finally {
      setTranslating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <span className="text-gray-500 font-medium tracking-widest text-xs uppercase">Loading Notice...</span>
    </div>
  );

  if (!notice) return <div className="text-white text-center mt-20">Notice not found</div>;

  return (
    <div className="min-h-screen bg-background pb-20 fade-in">
      {/* Top Navbar */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-2">
           <button onClick={handleToggleSave} className={`p-2 rounded-xl transition-all ${isSaved ? 'bg-primary/10 text-primary shadow-purple' : 'text-gray-500 hover:bg-white/5'}`}>
             <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
           </button>
           <button className="p-2 text-gray-500 hover:bg-white/5 rounded-xl transition-all">
             <Share2 size={20} />
           </button>
        </div>
      </div>

      <div className="px-6 py-8 md:max-w-3xl md:mx-auto">
        {/* Urgent Badge */}
        {notice.urgency === 'critical' && (
          <div className="mb-6 flex items-center gap-2 text-red-500 font-black uppercase tracking-[0.2em] text-[10px]">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
             Critical Update
          </div>
        )}

        <h1 className="text-4xl font-bold text-white mb-8 leading-tight">
          {notice.title || notice.heading}
        </h1>

        {/* Top Info Bar */}
        <div className="flex flex-wrap items-center gap-6 mb-10 text-gray-500 border-y border-white/5 py-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-light">
               <User size={14} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-tighter">Posted By</p>
              <p className="text-white text-sm font-medium">{notice.postedBy?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
               <Calendar size={14} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-tighter">Date</p>
              <p className="text-white text-sm font-medium">{new Date(notice.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="mt-2 flex gap-2 w-full sm:w-auto">
            {notice.tags?.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase font-bold text-gray-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* AI Summary Card */}
        <div className="mb-12 relative">
          <div className="absolute -inset-1 bg-gradient-purple blur opacity-20" />
          <div className="relative bg-surface border border-primary/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-primary-light font-bold text-sm tracking-widest uppercase">
                 <Languages size={18} />
                 AI Intelligence
              </div>
              <div className="flex gap-2">
                 {['English', 'Hindi', 'Marathi'].map(lang => (
                   <button 
                     key={lang}
                     onClick={() => handleTranslate(lang)}
                     className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[10px] font-bold text-gray-500 transition-colors uppercase"
                   >
                     {lang}
                   </button>
                 ))}
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={content}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-gray-200 text-lg leading-relaxed italic"
              >
                {translating ? (
                   <div className="flex items-center gap-3 py-4">
                     <Loader2 className="animate-spin text-primary" />
                     <span className="text-sm">Claude is translating...</span>
                   </div>
                ) : (
                  content
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Notice Images */}
        {notice.images?.length > 0 && (
          <div className="mb-12">
            <button 
              onClick={() => setShowImage(true)}
              className="w-full h-52 rounded-2xl overflow-hidden relative group"
            >
              <img src={notice.images[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Notice" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2 text-white text-sm font-medium">
                    <Image size={18} /> View Multi-touch Original
                 </div>
              </div>
            </button>
          </div>
        )}

        {/* Placeholder for long content */}
        <div className="text-gray-400 space-y-6 text-base leading-loose">
           <p>
             The College Administration is pleased to announce that the upcoming semester examinations will be conducted as per the schedule provided in the main documentation. All students are advised to maintain strict adherence to the safety protocols and reporting times mentioned.
           </p>
           <p>
             Please ensure your hall tickets are cleared from the administrative office no later than the deadline specified above. Any discrepancies in the dates should be reported to the departmental coordinator immediately.
           </p>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          >
            <button 
              onClick={() => setShowImage(false)}
              className="absolute top-10 right-10 z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white"
            >
              <X size={24} />
            </button>
            <img src={notice.images[0]} className="max-w-full max-h-full object-contain shadow-2xl" alt="Full" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoticeDetail;
