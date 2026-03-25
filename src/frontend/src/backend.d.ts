import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Skill {
    name: string;
    detail: string;
}
export interface AboutMe {
    bio: string;
    contactInfo: ContactInfo;
    volunteering: string;
    positionsOfResponsibility: string;
}
export interface achievements {
    title: string;
    description: string;
    date: string;
}
export interface Experience {
    duration: string;
    role: string;
    description: string;
    company: string;
}
export interface Interest {
    name: string;
    description: string;
    image?: string;
}
export interface Portfolio {
    aboutMe: AboutMe;
    projects: Array<Project>;
    interests: Array<Interest>;
    experiences: Array<Experience>;
    achievements: Array<achievements>;
}
export interface Project {
    link: string;
    name: string;
    description: string;
    techStack: Array<string>;
}
export interface ContactInfo {
    linkedin: string;
    email: string;
    website: string;

    github: string;
}
export interface backendInterface {
    addExperience(adminPassword: string, newExperience: Experience): Promise<void>;
    addInterest(adminPassword: string, newInterest: Interest): Promise<void>;
    addProject(adminPassword: string, newProject: Project): Promise<void>;
    addAchievement(adminPassword: string, newAchievement: achievements): Promise<void>;
    getAboutMe(): Promise<AboutMe>;
    getExperiences(): Promise<Array<Experience>>;
    getAchievements(): Promise<Array<achievements>>;
    getInterests(): Promise<Array<Interest>>;
    getPortfolio(): Promise<Portfolio>;
    getProjects(): Promise<Array<Project>>;
    updateAboutMe(adminPassword: string, newAboutMe: AboutMe): Promise<void>;
}
