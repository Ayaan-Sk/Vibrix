require('dotenv').config();
const mongoose = require('mongoose');
const Notice = require('./src/models/Notice');
const User = require('./src/models/User');

async function seedDummyNotices() {
  await mongoose.connect(process.env.DATABASE_URL);
  
  // Find the admin user to use as the author
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.error('No admin user found to author the notices.');
    process.exit(1);
  }

  const notices = [
    {
      title: "Semester 4 Final Exams Timeline",
      summary: "The final examinations for all departments will commence on April 15. Hall tickets will be distributed starting next week from the administrative block.",
      content: "All students are hereby informed that the End Semester Examinations for Semester 4 will begin on April 15, 2026. Please ensure all your dues are cleared by April 10. Hall tickets can be collected from the main office between 10 AM and 4 PM starting Monday.",
      department: "ALL",
      urgency: "critical",
      tags: ["Exam", "Important"],
      detectedLanguage: "English",
      isPinned: true,
      isDraft: false,
      isStartupNotification: true,
      postedBy: admin._id
    },
    {
      title: "तंत्रज्ञान महोत्सव 2026 (TechFest)",
      summary: "Annual technical festival announcements and registration details. All project submissions must be completed before the deadline.",
      content: "महाविद्यालयाच्या सर्व विद्यार्थ्यांना सुचित करण्यात येते की आपला वार्षिक तंत्रज्ञान महोत्सव (TechFest 2026) पुढील महिन्यात आयोजित केला जाणार आहे. ज्या विद्यार्थ्यांना आपल्या प्रकल्पांचे सादरीकरण करायचे आहे, त्यांनी 20 तारखेपर्यंत नोंदणी पूर्ण करावी.",
      department: "CS",
      urgency: "normal",
      tags: ["Event", "TechFest", "Marathi"],
      detectedLanguage: "Marathi",
      isPinned: false,
      isDraft: false,
      isStartupNotification: false,
      postedBy: admin._id
    },
    {
      title: "होली की छुट्टियां और छात्रावास के नियम",
      summary: "College will remain closed for Holi celebrations. Hostel students must submit their leave applications to the warden prior to departure.",
      content: "सभी छात्रों को सूचित किया जाता है कि होली के शुभ अवसर पर गुरुवार और शुक्रवार को महाविद्यालय बंद रहेगा। जो छात्र अपने घर जा रहे हैं, कृपया हॉस्टल वार्डन को अपना अवकाश प्रार्थना पत्र आवश्यक रूप से जमा करें। आप सभी को होली की शुभकामनाएँ!",
      department: "ALL",
      urgency: "normal",
      tags: ["Holiday", "Hostel", "Hindi"],
      detectedLanguage: "Hindi",
      isPinned: false,
      isDraft: false,
      isStartupNotification: false,
      postedBy: admin._id
    },
    {
      title: "Campus Wi-Fi Maintenance Notice",
      summary: "Network maintenance will be carried out this weekend. Expect intermittent connectivity issues in the library and hostel areas.",
      content: "The IT department will be upgrading the core network switches this weekend. Therefore, the campus Wi-Fi network 'Vibrix-Student' will experience intermittent downtime from Saturday 10 PM to Sunday 6 AM. We apologize for the inconvenience this may cause during your study hours.",
      department: "ALL",
      urgency: "low",
      tags: ["IT", "Maintenance"],
      detectedLanguage: "English",
      isPinned: false,
      isDraft: false,
      isStartupNotification: false,
      postedBy: admin._id
    }
  ];

  try {
    await Notice.insertMany(notices);
    console.log(`Successfully seeded ${notices.length} multi-language dummy notices.`);
  } catch (error) {
    console.error('Failed to seed notices:', error);
  } finally {
    process.exit(0);
  }
}

seedDummyNotices();
