import { useState, useRef } from 'react';
import { 
  Upload, Type, Trash2, Sparkles, AlertCircle, 
  CheckCircle2, Loader2, Pin, Bell, Send, 
  ChevronRight, Calendar as CalendarIcon, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance';
import Navbar from '../../components/layout/Navbar';
import { useNavigate } from 'react-router-dom';

const CreateNotice = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Type');
  const [loading, setLoading] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0); // 0-5
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    department: 'ALL',
    urgency: 'normal',
    tags: [],
    expiryDate: '',
    isPinned: false,
    isStartupNotification: false,
    isDraft: false
  });
  
  const [tagInput, setTagInput] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleCreate = async (isDraft = false) => {
    setLoading(true);
    try {
      const payload = { ...formData, isDraft };
      if (aiResult) {
        payload.heading = aiResult.heading;
        payload.summary = aiResult.summary;
        payload.tags = aiResult.suggestedTags;
        payload.urgency = aiResult.urgency;
        payload.extractedText = aiResult.extractedText;
      }
      await api.post('/notices', payload);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const runAiPipeline = async () => {
    if (!fileInputRef.current.files[0]) return;
    setLoading(true);
    try {
      // Step 1: Upload
      setPipelineStep(1);
      const fd = new FormData();
      fd.append('image', fileInputRef.current.files[0]);
      const uploadRes = await api.post('/ai/upload-image', fd);
      
      // Step 2-4 (Simulated or combined API calls)
      setPipelineStep(2); // OCR
      setPipelineStep(3); // Translate
      setPipelineStep(4); // Summarize
      
      const processRes = await api.post('/ai/process-image', { imageUrl: uploadRes.data.url });
      
      setPipelineStep(5); // Done
      setAiResult(processRes.data);
      setFormData(prev => ({
        ...prev,
        title: processRes.data.heading,
        summary: processRes.data.summary,
        urgency: processRes.data.urgency,
        tags: processRes.data.suggestedTags
      }));
    } catch (err) {
      console.error(err);
      setPipelineStep(0);
    } finally {
      setLoading(false);
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (t) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== t) });
  };

  return (
    <div className="min-h-screen bg-background text-white pb-32 md:pt-16">
      <Navbar title="Post Notice" />
      
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black italic tracking-tighter mb-2 uppercase">Broadcast Notice</h1>
          <p className="text-gray-500 font-medium tracking-[0.2em] text-[10px] uppercase">AI-Optimized Communication</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-white/5 rounded-2xl p-1.5 mb-10 overflow-hidden border border-white/5">
           <button 
             onClick={() => setTab('Type')}
             className={`flex-1 py-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${tab === 'Type' ? 'bg-primary text-white shadow-purple' : 'text-gray-500 hover:text-gray-300'}`}
           >
             <Type size={16} /> Type Content
           </button>
           <button 
             onClick={() => setTab('Upload')}
             className={`flex-1 py-3 px-6 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${tab === 'Upload' ? 'bg-primary text-white shadow-purple' : 'text-gray-500 hover:text-gray-300'}`}
           >
             <Upload size={16} /> Image-to-AI
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
           {/* Left Column: Form Content */}
           <div className="lg:col-span-3 space-y-8">
              {tab === 'Type' ? (
                <div className="space-y-6 fade-in">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Notice Heading</label>
                     <input 
                       value={formData.title}
                       onChange={e => setFormData({...formData, title: e.target.value})}
                       className="w-full bg-surface border border-white/5 rounded-2xl p-4 focus:border-primary/50 outline-none text-lg font-bold"
                       placeholder="Enter striking title..."
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Full Content</label>
                     <textarea 
                       rows={6}
                       value={formData.content}
                       onChange={e => setFormData({...formData, content: e.target.value})}
                       className="w-full bg-surface border border-white/5 rounded-2xl p-4 focus:border-primary/50 outline-none text-gray-300 leading-relaxed"
                       placeholder="Detail your notice here..."
                     />
                   </div>
                </div>
              ) : (
                <div className="space-y-8 fade-in">
                   <div 
                     onClick={() => fileInputRef.current?.click()}
                     className={`w-full h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all overflow-hidden relative cursor-pointer ${previewImage ? 'border-primary' : 'border-white/10 hover:border-white/20'}`}
                   >
                     {previewImage ? (
                       <>
                         <img src={previewImage} className="w-full h-full object-cover opacity-60" alt="Preview" />
                         <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white font-bold text-sm">Image Selected</p>
                            <p className="text-gray-400 text-[10px] uppercase font-bold">Click to Change</p>
                         </div>
                       </>
                     ) : (
                       <>
                         <div className="p-4 bg-white/5 rounded-full text-gray-600">
                           <Upload size={32} />
                         </div>
                         <p className="text-gray-400 font-bold">Drop notice image or click to browse</p>
                       </>
                     )}
                     <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                   </div>

                   <button 
                     onClick={runAiPipeline}
                     disabled={loading || !previewImage}
                     className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl ${previewImage ? 'bg-gradient-purple text-white shadow-purple hover:scale-[1.01]' : 'bg-white/5 text-gray-600 grayscale'}`}
                   >
                     {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                     Extract & Summarize with AI
                   </button>

                   {/* Pipeline Indicator */}
                   {pipelineStep > 0 && (
                     <div className="flex items-center justify-between px-2 pt-4">
                        <PipelineIcon step={1} current={pipelineStep} label="Upload" />
                        <div className="h-px bg-white/5 flex-grow mx-2 mt-4" />
                        <PipelineIcon step={2} current={pipelineStep} label="OCR" />
                        <div className="h-px bg-white/5 flex-grow mx-2 mt-4" />
                        <PipelineIcon step={5} current={pipelineStep} label="AI Ready" />
                     </div>
                   )}
                </div>
              )}

              {/* Shared Metadata Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Department</label>
                   <select 
                     value={formData.department}
                     onChange={e => setFormData({...formData, department: e.target.value})}
                     className="w-full bg-surface border border-white/5 rounded-xl p-3 outline-none text-white text-sm"
                   >
                     <option value="ALL">All Departments</option>
                     <option value="CS">Computer Science</option>
                     <option value="ME">Mechanical</option>
                     <option value="EE">Electrical</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Urgency</label>
                   <select 
                     value={formData.urgency}
                     onChange={e => setFormData({...formData, urgency: e.target.value})}
                     className="w-full bg-surface border border-white/5 rounded-xl p-3 outline-none text-white text-sm"
                   >
                     <option value="low">Low Priority</option>
                     <option value="normal">Normal</option>
                     <option value="critical">Critical / Urgent</option>
                   </select>
                 </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                 <Toggle label="Pin to Top" sub="Keep notice at the top of the feed" checked={formData.isPinned} onChange={v => setFormData({...formData, isPinned: v})} />
                 <Toggle 
                   label="Startup Notification" 
                   sub="Flash this to users on next app launch" 
                   checked={formData.isStartupNotification} 
                   onChange={v => setFormData({...formData, isStartupNotification: v})} 
                 />
              </div>
           </div>

           {/* Right Column: Settings & Actions */}
           <div className="lg:col-span-2 space-y-8">
              <div className="premium-card bg-surface/50 border-primary/10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-light mb-6 flex items-center gap-2">
                   <CalendarIcon size={14} /> Schedule & Tags
                 </h3>
                 
                 <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase">Expiry Date</label>
                      <input 
                        type="date" 
                        value={formData.expiryDate}
                        onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                        className="w-full bg-background border border-white/5 rounded-xl p-3 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Tag Management</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                         {formData.tags?.map(t => (
                           <span key={t} className="px-2 py-1 rounded bg-primary/10 border border-primary/20 text-primary-light text-[10px] font-bold flex items-center gap-1 group">
                             {t} <button onClick={() => removeTag(t)}><X size={10} /></button>
                           </span>
                         ))}
                      </div>
                      <input 
                        type="text"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={addTag}
                        placeholder="Add tag + Enter"
                        className="w-full bg-background border border-white/5 rounded-xl p-3 text-white text-xs"
                      />
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <button 
                   onClick={() => handleCreate(false)}
                   disabled={loading || !formData.title}
                   className="w-full py-5 rounded-2xl bg-gradient-purple text-white font-black uppercase tracking-[0.1em] text-sm shadow-purple-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                 >
                   {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                   Publish Broadcast
                 </button>
                 <button 
                   onClick={() => handleCreate(true)}
                   className="w-full py-4 rounded-xl bg-white/5 text-gray-400 font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors"
                 >
                   Save as Private Draft
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ label, sub, checked, onChange }) => (
  <button 
    onClick={() => onChange(!checked)}
    className="w-full flex items-center justify-between p-2 rounded-xl border border-transparent hover:bg-white/[0.02] group transition-all"
  >
    <div className="text-left">
      <p className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{label}</p>
      <p className="text-[10px] text-gray-600 uppercase font-medium">{sub}</p>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-colors ${checked ? 'bg-primary' : 'bg-gray-700'}`}>
       <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${checked ? 'left-6' : 'left-1'}`} />
    </div>
  </button>
);

const PipelineIcon = ({ step, current, label }) => {
  const isDone = current > step;
  const isCurrent = current === step;
  
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[50px]">
       <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isDone ? 'bg-green-500 border-green-500 text-white' : isCurrent ? 'border-primary text-primary animate-pulse' : 'border-white/10 text-gray-700'}`}>
          {isDone ? <CheckCircle2 size={16} /> : <span className="text-[10px] font-black">{step}</span>}
       </div>
       <span className={`text-[9px] uppercase font-black tracking-tighter ${isCurrent ? 'text-primary' : isDone ? 'text-green-500' : 'text-gray-700'}`}>{label}</span>
    </div>
  );
};

export default CreateNotice;
