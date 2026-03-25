import List "mo:core/List";

// Simple single-admin guard: change this to your secret before deploy.
let adminPassword : Text = "Portfolio_Bodhi_2026";

func assertAdmin(pwd : Text) {
  if (pwd != adminPassword) {
    throw Error.reject("Unauthorized: invalid admin password");
  };
};

actor {
  type Skill = {
    name : Text;
    detail: Text;
  };

  type ContactInfo = {
    email : Text;
  
    linkedin : Text;
    github : Text;
    website : Text;
  };

  type AboutMe = {
    bio : Text;
    skills : [Skill];
    contactInfo : ContactInfo;
  };

  type Project = {
    name : Text;
    description : Text;
    techStack : [Text];
    link : Text;
  };

  type Achievement = {
    title : Text;
    description : Text;
    date : Text;
  };

  type Experience = {
    company : Text;
    role : Text;
    duration : Text;
    description : Text;
  };

  type Interest = {
    name : Text;
    description : Text;
  };

  type Portfolio = {
    aboutMe : AboutMe;
    projects : [Project];
    experiences : [Experience];
    achievements : [Achievement];
    interests : [Interest];
  };

  var aboutMe : AboutMe = {
    bio = "Full-stack developer with a passion for creating intuitive user experiences.";
    skills = [];
    contactInfo = {
      email = "example@email.com";
      linkedin = "linkedin.com/in/example";
      github = "github.com/example";
      website = "example.com";
    };
  };

  let projects = List.fromArray<Project>([{
    name = "Portfolio Website";
    description = "A personal portfolio website built with Motoko and React.";
    techStack = ["Motoko", "React", "Internet Computer"];
    link = "https://portfolio.icp";
  }, {
    name = "Task Manager";
    description = "A task management app for teams.";
    techStack = ["React", "Node.js", "MongoDB"];
    link = "https://taskmanager.app";
  }]);

  let experiences = List.fromArray<Experience>([{
    company = "Example Corp";
    role = "Software Engineer";
    duration = "2018-2020";
    description = "Developed web applications using React and Node.js.";
  }, {
    company = "Tech Solutions";
    role = "Frontend Developer";
    duration = "2016-2018";
    description = "Worked on UI development and optimization.";
  }]);

  let interests = List.fromArray<Interest>([{
    name = "Coding";
    description = "Passionate about learning new programming languages.";
  }, {
    name = "Photography";
    description = "Enjoy capturing nature and landscapes.";
  }]);

  let achievements = List.fromArray<Achievement>([{
    title = "Sample Achievement";
    description = "Replace with real achievements.";
    date = "2026";
  }]);

  public query ({ caller }) func getAboutMe() : async AboutMe {
    aboutMe;
  };

  public query ({ caller }) func getProjects() : async [Project] {
    projects.toArray();
  };

  public query ({ caller }) func getExperiences() : async [Experience] {
    experiences.toArray();
  };

  public query ({ caller }) func getAchievements() : async [Achievement] {
    achievements.toArray();
  };

  public query ({ caller }) func getInterests() : async [Interest] {
    interests.toArray();
  };

  public query ({ caller }) func getPortfolio() : async Portfolio {
    {
      aboutMe;
      projects = projects.toArray();
      experiences = experiences.toArray();
      achievements = achievements.toArray();
      interests = interests.toArray();
    };
  };

  public shared ({ caller }) func updateAboutMe(pwd : Text, newAboutMe : AboutMe) : async () {
    assertAdmin(pwd);
    aboutMe := newAboutMe;
  };

  public shared ({ caller }) func addProject(pwd : Text, newProject : Project) : async () {
    assertAdmin(pwd);
    projects.add(newProject);
  };

  public shared ({ caller }) func addExperience(pwd : Text, newExperience : Experience) : async () {
    assertAdmin(pwd);
    experiences.add(newExperience);
  };

  public shared ({ caller }) func addInterest(pwd : Text, newInterest : Interest) : async () {
    assertAdmin(pwd);
    interests.add(newInterest);
  };

  public shared ({ caller }) func addAchievement(pwd : Text, newAchievement : Achievement) : async () {
    assertAdmin(pwd);
    achievements.add(newAchievement);
  };
};
