 
// 'use client';
// import React, { useState, useEffect } from 'react';
// import { GraduationCap, BookOpen, Video, X } from 'lucide-react';
// import styles from './page.module.css';   

// interface MajorInfo {
//   id: string;
//   name: string;
//   icon: React.ReactNode;
//   iconColor: string;
//   description: string;
//   videoSrc: string;
// }

// export default function InternshipRequirements() {
//   const [mounted, setMounted] = useState(false);
//   const [selectedMajor, setSelectedMajor] = useState<MajorInfo | null>(null);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const majors: MajorInfo[] = [
//     {
//       id: 'engineering',
//       name: 'Engineering',
//       icon: <GraduationCap size={24} />,
//       iconColor: 'text-blue-500',
//       description: 'Engineering internships should focus on practical application of engineering principles in real-world settings, such as software development, electrical systems, mechanical design, or civil engineering projects.',
//       videoSrc: 'https://youtu.be/BCobr9OnqAc'
//     },
//     {
//       id: 'pharmacy',
//       name: 'Pharmacy',
//       icon: <BookOpen size={24} />,
//       iconColor: 'text-green-500',
//       description: 'Pharmacy internships should involve pharmaceutical practice, patient care, or research in settings such as hospitals, community pharmacies, or pharmaceutical companies.',
//       videoSrc: 'https://youtu.be/EjE2YN_OyVI'
//     },
//     {
//       id: 'applied-arts',
//       name: 'Applied Arts',
//       icon: <GraduationCap size={24} />,
//       iconColor: 'text-purple-500',
//       description: 'Applied Arts internships should provide experience in creative design, artistic production, media creation, or other creative fields related to your specific area of study.',
//       videoSrc: 'https://youtu.be/csTe_jKrZKY'
//     },
//     {
//       id: 'management',
//       name: 'Management',
//       icon: <GraduationCap size={24} />,
//       iconColor: 'text-yellow-500',
//       description: 'Management internships should develop skills in leadership, organization, and business operations through experience in corporate settings, non-profits, or entrepreneurial ventures.',
//       videoSrc: 'https://youtu.be/gFtH8KCQzP4'
//     },
//     {
//       id: 'business-informatics',
//       name: 'Business Informatics',
//       icon: <GraduationCap size={24} />,
//       iconColor: 'text-red-500',
//       description: 'Business Informatics internships should focus on IT systems in business contexts, such as data analytics, information systems implementation, or digital transformation projects.',
//       videoSrc: 'https://youtu.be/v6GfmPrJMEo'
//     },
//     {
//       id: 'law',
//       name: 'Law',
//       icon: <GraduationCap size={24} />,
//       iconColor: 'text-indigo-500',
//       description: 'Law internships should provide practical legal experience in various fields of law, including positions at law firms, corporate legal departments, or judicial clerkships.',
//       videoSrc: 'https://youtu.be/E9cJUuYhemY'
//     }
//   ];

//   const handleMajorSelect = (major: MajorInfo) => {
//     setSelectedMajor(major);
//   };

//   const handleCloseVideo = () => {
//     setSelectedMajor(null);
//   };

//   // Function to convert YouTube URL to embed URL
//   const getYouTubeEmbedUrl = (url: string) => {
//     const videoId = url.split('youtu.be/')[1] || url.split('v=')[1]?.split('&')[0];
//     return `https://www.youtube.com/embed/${videoId}`;
//   };

//   if (!mounted) {
//     return null;
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <div className={styles.titleContainer}>
//           <BookOpen className={styles.titleIcon} size={24} />
//           <h1 className={styles.title}>Internship Requirements by Major</h1>
//         </div>
//         <p className={styles.subtitle}>
//           Select your major to learn more about what types of internships count towards your degree requirements
//         </p>
//       </div>

//       <div className={styles.majorsGrid}>
//         {majors.map((major) => (
//           <button
//             key={major.id}
//             className={styles.majorButton}
//             onClick={() => handleMajorSelect(major)}
//           >
//             <div className={styles.majorIcon}>
//               {major.icon}
//             </div>
//             <span className={styles.majorName}>{major.name}</span>
//           </button>
//         ))}
//       </div>

//       {selectedMajor && (
//         <div className={styles.videoOverlay}>
//           <div className={styles.videoContainer}>
//             <div className={styles.videoHeader}>
//               <h2 className={styles.videoTitle}>
//                 {selectedMajor.name} Internship Requirements
//               </h2>
//               <button className={styles.closeButton} onClick={handleCloseVideo}>
//                 <X size={24} />
//               </button>
//             </div>
            
//             <div className={styles.videoWrapper}>
//               <Video size={48} className={styles.videoPlaceholder} />
//               <p className={styles.videoDescription}>
//                 {selectedMajor.description}
//               </p>
//               <iframe
//                 className={styles.video}
//                 src={getYouTubeEmbedUrl(selectedMajor.videoSrc)}
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//                 title={`${selectedMajor.name} Internship Video`}
//               />
              
//               {/* Added Approved Internship Types section from Demo */}
//               <div className={styles.approvedTypes}>
//                 <h3 className={styles.approvedTypesTitle}>Approved Internship Types:</h3>
//                 <ul className={styles.approvedTypesList}>
//                   <li>Industry placements at approved organizations</li>
//                   <li>Research positions related to your field of study</li>
//                   <li>Practical training under qualified supervision</li>
//                   <li>Field work at accredited institutions</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
//-----------------------------------------------------
// 'use client';
// import React, { useState, useEffect } from 'react';
// import { GraduationCap, Video, X } from 'lucide-react';
// import styles from './page.module.css';   

// interface MajorInfo {
//   id: string;
//   name: string;
//   icon: React.ReactNode;
//   iconColor: string;
//   description: string;
//   videoSrc: string;
// }

// export default function InternshipRequirements() {
//   const [mounted, setMounted] = useState(false);
//   const [selectedMajor, setSelectedMajor] = useState<MajorInfo | null>(null);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const majors: MajorInfo[] = [
//     {
//       id: 'engineering',
//       name: 'Engineering',
//       icon: <GraduationCap size={24} />,
//       iconColor: 'text-blue-500',
//       description: 'Engineering internships should focus on practical application of engineering principles in real-world settings, such as software development, electrical systems, mechanical design, or civil engineering projects.',
//       videoSrc: 'https://youtu.be/BCobr9OnqAc'
//     },
//     {
//       id: 'pharmacy',
//       name: 'Pharmacy',
//       icon: <GraduationCap size={24} />,
//       iconColor: 'text-green-500',
//       description: 'Pharmacy internships should involve pharmaceutical practice, patient care, or research in settings such as hospitals, community pharmacies, or pharmaceutical companies.',
//       videoSrc: 'https://youtu.be/EjE2YN_OyVI'
//     },
//     {
//       id: 'applied-arts',
//       name: 'Applied Arts',
//       icon: <GraduationCap size={24} />,
//       iconColor: 'text-purple-500',
//       description: 'Applied Arts internships should provide experience in creative design, artistic production, media creation, or other creative fields related to your specific area of study.',
//       videoSrc: 'https://youtu.be/csTe_jKrZKY'
//     },
//     {
//       id: 'management',
//       name: 'Management',
//       icon: <GraduationCap size={24} />,
//       iconColor: 'text-yellow-500',
//       description: 'Management internships should develop skills in leadership, organization, and business operations through experience in corporate settings, non-profits, or entrepreneurial ventures.',
//       videoSrc: 'https://youtu.be/gFtH8KCQzP4'
//     },
//     {
//       id: 'business-informatics',
//       name: 'Business Informatics',
//       icon: <GraduationCap size={24} />,
//       iconColor: 'text-red-500',
//       description: 'Business Informatics internships should focus on IT systems in business contexts, such as data analytics, information systems implementation, or digital transformation projects.',
//       videoSrc: 'https://youtu.be/v6GfmPrJMEo'
//     },
//     {
//       id: 'law',
//       name: 'Law',
//       icon: <GraduationCap size={24} />,
//       iconColor: 'text-indigo-500',
//       description: 'Law internships should provide practical legal experience in various fields of law, including positions at law firms, corporate legal departments, or judicial clerkships.',
//       videoSrc: 'https://youtu.be/E9cJUuYhemY'
//     }
//   ];

//   const handleMajorSelect = (major: MajorInfo) => {
//     setSelectedMajor(major);
//   };

//   const handleCloseVideo = () => {
//     setSelectedMajor(null);
//   };

//   const getYouTubeEmbedUrl = (url: string) => {
//     const videoId = url.split('youtu.be/')[1] || url.split('v=')[1]?.split('&')[0];
//     return `https://www.youtube.com/embed/${videoId}`;
//   };

//   if (!mounted) {
//     return null;
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <div className={styles.titleContainer}>
//           <GraduationCap className={styles.titleIcon} size={24} />
//           <h1 className={styles.title}>Internship Requirements by Major</h1>
//         </div>
//         <p className={styles.subtitle}>
//           Select your major to learn more about what types of internships count towards your degree requirements
//         </p>
//       </div>

//       <div className={styles.majorsGrid}>
//         {majors.map((major) => (
//           <button
//             key={major.id}
//             className={styles.majorButton}
//             onClick={() => handleMajorSelect(major)}
//           >
//             <div className={`${styles.majorIcon} ${major.iconColor}`}>
//               {major.icon}
//             </div>
//             <span className={styles.majorName}>{major.name}</span>
//           </button>
//         ))}
//       </div>

//       {selectedMajor && (
//         <div className={styles.videoOverlay}>
//           <div className={styles.videoContainer}>
//             <div className={styles.videoHeader}>
//               <h2 className={styles.videoTitle}>
//                 {selectedMajor.name} Internship Requirements
//               </h2>
//               <button className={styles.closeButton} onClick={handleCloseVideo}>
//                 <X size={24} />
//               </button>
//             </div>
            
//             <div className={styles.videoWrapper}>
//               <Video size={48} className={styles.videoPlaceholder} />
//               <p className={styles.videoDescription}>
//                 {selectedMajor.description}
//               </p>
//               <iframe
//                 className={styles.video}
//                 src={getYouTubeEmbedUrl(selectedMajor.videoSrc)}
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//                 title={`${selectedMajor.name} Internship Video`}
//               />
              
//               <div className={styles.approvedTypes}>
//                 <h3 className={styles.approvedTypesTitle}>Approved Internship Types:</h3>
//                 <ul className={styles.approvedTypesList}>
//                   <li>Industry placements at approved organizations</li>
//                   <li>Research positions related to your field of study</li>
//                   <li>Practical training under qualified supervision</li>
//                   <li>Field work at accredited institutions</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';
import React, { useState, useEffect } from 'react';
import { GraduationCap, Video, X } from 'lucide-react';
import styles from './page.module.css';   

interface MajorInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  videoSrc: string;
}

export default function InternshipRequirements() {
  const [mounted, setMounted] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<MajorInfo | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const majors: MajorInfo[] = [
    {
      id: 'engineering',
      name: 'Engineering',
      icon: <GraduationCap size={24} />,
      color: '#3B82F6',
      description: 'Engineering internships should focus on practical application of engineering principles in real-world settings, such as software development, electrical systems, mechanical design, or civil engineering projects.',
      videoSrc: 'https://youtu.be/BCobr9OnqAc'
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy',
      icon: <GraduationCap size={24} />,
      color: '#34D399',
      description: 'Pharmacy internships should involve pharmaceutical practice, patient care, or research in settings such as hospitals, community pharmacies, or pharmaceutical companies.',
      videoSrc: 'https://youtu.be/EjE2YN_OyVI'
    },
    {
      id: 'applied-arts',
      name: 'Applied Arts',
      icon: <GraduationCap size={24} />,
      color: '#A855F7',
      description: 'Applied Arts internships should provide experience in creative design, artistic production, media creation, or other creative fields related to your specific area of study.',
      videoSrc: 'https://youtu.be/csTe_jKrZKY'
    },
    {
      id: 'management',
      name: 'Management',
      icon: <GraduationCap size={24} />,
      color: '#FBBF24',
      description: 'Management internships should develop skills in leadership, organization, and business operations through experience in corporate settings, non-profits, or entrepreneurial ventures.',
      videoSrc: 'https://youtu.be/gFtH8KCQzP4'
    },
    {
      id: 'business-informatics',
      name: 'Business Informatics',
      icon: <GraduationCap size={24} />,
      color: '#EF4444',
      description: 'Business Informatics internships should focus on IT systems in business contexts, such as data analytics, information systems implementation, or digital transformation projects.',
      videoSrc: 'https://youtu.be/v6GfmPrJMEo'
    },
    {
      id: 'law',
      name: 'Law',
      icon: <GraduationCap size={24} />,
      color: '#6366F1',
      description: 'Law internships should provide practical legal experience in various fields of law, including positions at law firms, corporate legal departments, or judicial clerkships.',
      videoSrc: 'https://youtu.be/E9cJUuYhemY'
    }
  ];

  const handleMajorSelect = (major: MajorInfo) => {
    setSelectedMajor(major);
  };

  const handleCloseVideo = () => {
    setSelectedMajor(null);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('youtu.be/')[1] || url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <GraduationCap className={styles.titleIcon} size={24} />
          <h1 className={styles.title}>Internship Requirements by Major</h1>
        </div>
        <p className={styles.subtitle}>
          Select your major to learn more about what types of internships count towards your degree requirements
        </p>
      </div>

      <div className={styles.majorsGrid}>
        {majors.map((major) => (
          <button
            key={major.id}
            className={styles.majorButton}
            onClick={() => handleMajorSelect(major)}
          >
            <div className={styles.majorIcon} style={{ color: major.color }}>
              {major.icon}
            </div>
            <span className={styles.majorName}>{major.name}</span>
          </button>
        ))}
      </div>

      {selectedMajor && (
        <div className={styles.videoOverlay}>
          <div className={styles.videoContainer}>
            <div className={styles.videoHeader}>
              <h2 className={styles.videoTitle}>
                {selectedMajor.name} Internship Requirements
              </h2>
              <button className={styles.closeButton} onClick={handleCloseVideo}>
                <X size={24} />
              </button>
            </div>
            
            <div className={styles.videoWrapper}>
              <Video size={48} className={styles.videoPlaceholder} />
              <p className={styles.videoDescription}>
                {selectedMajor.description}
              </p>
              <iframe
                className={styles.video}
                src={getYouTubeEmbedUrl(selectedMajor.videoSrc)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${selectedMajor.name} Internship Video`}
              />
              
              <div className={styles.approvedTypes}>
                <h3 className={styles.approvedTypesTitle}>Approved Internship Types:</h3>
                <ul className={styles.approvedTypesList}>
                  <li>Industry placements at approved organizations</li>
                  <li>Research positions related to your field of study</li>
                  <li>Practical training under qualified supervision</li>
                  <li>Field work at accredited institutions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}