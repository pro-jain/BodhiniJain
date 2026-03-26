import { useQuery } from "@tanstack/react-query";
import type {
  AboutMe,
  achievements,
  Experience,
  Interest,
  Portfolio,
  Project,
} from "../backend.d";

export function usePortfolio() {
  return useQuery<Portfolio>({
    queryKey: ["portfolio"],
    queryFn: async () => {
      try {
        const [projects, experiences, interests, achievements] = await Promise.all([
          fetch(`${API_BASE}api/projects`).then((r) => (r.ok ? r.json() : Promise.reject())),
          fetch(`${API_BASE}api/experiences`).then((r) => (r.ok ? r.json() : Promise.reject())),
          fetch(`${API_BASE}api/interests`).then((r) => (r.ok ? r.json() : Promise.reject())),
          fetch(`${API_BASE}api/achievements`).then((r) => (r.ok ? r.json() : Promise.reject())),
        ]);

        return {
          ...Portfolio(),
          projects,
          experiences,
          interests,
          achievements,
        };
      } catch {
        return Portfolio();
      }
    },
  });
}

export function useAboutMe() {
  return useQuery<AboutMe>({
    queryKey: ["aboutMe"],
    queryFn: async () => {
      return Portfolio().aboutMe;
    },
  });
}

const API_BASE = `${import.meta.env.VITE_BACKEND_API || "https://airy-spirit.railway.app"}/`;

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE}/api/projects`);
        if (!res.ok) throw new Error("Failed to load projects");
        return (await res.json()) as Project[];
      } catch {
        return Portfolio().projects;
      }
    },
  });
}

export function useExperiences() {
  return useQuery<Experience[]>({
    queryKey: ["experiences"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE}/api/experiences`);
        if (!res.ok) throw new Error("Failed to load experiences");
        return (await res.json()) as Experience[];
      } catch {
        return Portfolio().experiences;
      }
    },
  });
}

export function useInterests() {
  return useQuery<Interest[]>({
    queryKey: ["interests"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE}/api/interests`);
        if (!res.ok) throw new Error("Failed to load skills");
        return (await res.json()) as Interest[];
      } catch {
        return Portfolio().interests;
      }
    },
  });
}

export function useAchievements() {
  return useQuery<achievements[]>({
    queryKey: ["achievements"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE}/api/achievements`);
        if (!res.ok) throw new Error("Failed to load achievements");
        return (await res.json()) as achievements[];
      } catch {
        return Portfolio().achievements;
      }
    },
  });
}

// Admin mutations: require admin password and a live actor.
function Portfolio(): Portfolio {
  return {
    aboutMe: {
      bio: "I’m a prefinal year Computer Science student at NIT Surat, focused on robotics, computer vision, and AI systems. I work on building end-to-end intelligent systems involving drones, LiDAR mapping and real-time perception pipelines. I have experience with ROS, OpenCV, and embedded platforms, and I enjoy integrating software with hardware to solve real-world problems.",  
      volunteering:
        "National Cadets Corps (NCC) — Company Quarter Master Sergeant. Supported event management (including exhibitions), piloting duties, and camps; trained in sword practice, building physical and mental strength alongside leadership, teamwork, and discipline.",
      positionsOfResponsibility:
        `Design Co-Head — Mindbend
Junior Developer — Google Developers on Campus
Design Co-Head — Research and Innovation Conclave
Representative — Nexus (departmental cell)
Project Manager — SAE Phoenix Aero.`,

      contactInfo: {
        email: "jainbodhini05@gmail.com",
        github: "https://github.com/pro-jain",
        linkedin: "https://www.linkedin.com/in/bodhini-jain-6959322a6/",
        website: "https://alexrivera.dev",
      },
    },
    projects: [
      {
        name: "NIDAR 2026-Autonomous Mapping Drone and Fetilizer Spraying System",
        description:
          "• Operated and optimized an agricultural irrigation drone system for precision spraying. • Integrated flight controller telemetry with ground station(Node express) using LoRa module communication. • Processed onboard camera feed using OpenCV for visual monitoring and system validation  ",
        techStack: ["", "React", "TypeScript", "ICP"],
        link: "https://github.com/alexrivera/decentchat",
      },
      {
        name: "Rock paper Scissors game on robotic arm",
        description:
          "On the Inmoov Robotic arm I developed and rock paper scissors game when you give your hand in front of the camera it detects the gesture and the arm plays against you. I used OpenCV for hand detection and gesture recognition, and servo motors angles control the robotic arm's movements based on the game logic.",
        techStack: ["Mediapipe", "Arduino", "", "WebSockets", "PyTorch"],
        link: "https://github.com/alexrivera/pixelforge",
      },
      {
        name: "Turtle Bot- Burger Model ",
        description:
          "Assembled and performed SLAM (Simultaneous Localization and Mapping) using 2-D LIDAR and obstacle avoidance.",
        techStack: ["ROS2", "RQT", "ROSNavStack", "Redis"],
        link: "https://github.com/alexrivera/cryptovault",
      },
      {
        name: "Payload dropping Drone ",
        description:
          "Real-time navigation and obstacle avoidance.Flight control algorithms, sensor integration, circuit understanding, calibration and testing. We got AIR 2(2025) , AIR 3 (2026) in national level ADDC competition conducted by SAE-ISS ",
        techStack: ["OpenCV", "ROS", "Gazebo", "Mission Planner", "Python (NumPy, OpenCV, Dronekit)","Pixhawk","Raspberry pi"],
        link: "https://github.com/alexrivera/codecollab",
      },
      {
        name: "Fullstack Website (Google Winter Of Code)  ",
        description:
          "A fullstack website for a Surat local saree seller (Kashvi Creations). Including reel feature and Image search feature backend using mongodb. ",
        techStack: ["Rust", "Python", "ONNX", "gRPC"],
        link: "https://github.com/aayushi-1610/KC",
      },
       {
        name: "Automatic Pill Dispenser",
        description:
          "Assistive Health Device LLM Developer and Model Trainer. Elderly medication device with reminders and voice AI using GPT-2, Google TTS/STT.Integrated hardware and software also added query support like “missed doses” and “alternative meds” with disclaimer logic ",
        techStack: ["Rust", "Python", "ONNX", "gRPC"],
        link: "https://github.com/alexrivera/neuraldb",
      },
       {
        name: "DR GPT ",
        description:
          "A user-centric interface and tracks patient health data in real time and enables remote monitoring by doctors and chatbot functionality ",
        techStack: [" ReactJS,", "NextJS", " ReLU", "Figma"],
        link: "https://github.com/alexrivera/neuraldb",
      },
    ],
    experiences: [
       {
        company: "IIT Madras",
        role: "Project Intern",
        duration: "Jun 2025 – Jul 2025",
        description: "In Aerospace Engineering department, I worked on developing and custom-training computer vision YOLO models with self-curated datasets for anomaly detection in a building and human clustering using DBSCAN and head pose, followed by deployment on Jetson Orin Nano onboard drones."
      },
      {
        company: "Vaam",
        role: "UI/UX Designer",
        duration: "Dec 2024 – April 2025",
        description: "Vaam, a UK based startup working on ride sharing app. I worked as UI/UX developer. Helped building their website's prototype and fixing bugs. "
      },
    ],
    interests: [
      {
        name: "Core Areas",
        description:
          "Autonomous Robotics, Sensor Integration, Computer Vision, UAV Systems, Deep Learning, DSA, Computer Network",
      },
      {
        name: "Programming Languages",
        description:
          "C, C++, Python,Java",
      },
      {
        name: "Robotics & UAV Stack",
        description:
          "ROS1 / ROS2, Gazebo, ArduPilot, Pixhawk, MAVLink, LoRa Module, WebODM, Image Stitching (Photogrammetry), SLAM ",
      },
      {
        name: "Computer Vision & AI",
        description:
          "OpenCV, PyTorch, NumPy, YOLO (custom training), DBSCAN",
      },
      {
        name: "Web & Database",
        description:
          "ReactJS, HTML, CSS, JavaScript, MongoDB, MySQL",
      },
      {
        name: "Tools & Platforms",
        description:
          "Git, Docker, Linux, Jupyter, VS Code",
      },
    ],
    achievements: [
      {
        title: "AIR 2 ADDC 2025 & AIR 3 ADDC 2026",
        description:
          "Led the payload-dropping drone team to national AIR 2 (2025) and AIR 3 (2026) with autonomous navigation and obstacle avoidance.",
        date: "2025–2026",
      },
      {
        title: "Line Follower Bot Competition 4th place",
        description:
          "Secured 4th place in the Line Follower Bot competition at Mindbend 2024, Gujarat's largest technical fest, showcasing strong robotics and control system skills.",
        date: "2024",
      },
     
    ],
  };
}
