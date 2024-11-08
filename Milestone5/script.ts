
const form = document.getElementById('resume-form') as HTMLFormElement;
const resumeDisplayElement = document.getElementById('resume-display') as HTMLDivElement;
const shareableLinkContainer = document.getElementById('shareable-link-container') as HTMLDivElement;
const shareableLinkElement = document.getElementById('shareable-link') as HTMLAnchorElement;
const downloadPdfButton = document.getElementById('download-pdf') as HTMLButtonElement;

form.addEventListener('submit', async (event: Event) => {
    event.preventDefault();

    const username = (document.getElementById('username') as HTMLInputElement).value;
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const phone = (document.getElementById('phone') as HTMLInputElement).value;
    const objective = (document.getElementById('objective') as HTMLTextAreaElement).value;
    const career = (document.getElementById('career') as HTMLTextAreaElement).value;
    const education = (document.getElementById('education') as HTMLTextAreaElement).value;
    const experience = (document.getElementById('experience') as HTMLTextAreaElement).value;
    const skills = (document.getElementById('skills') as HTMLTextAreaElement).value;
    
    const profilePicFile = (document.getElementById('profile-pic') as HTMLInputElement).files?.[0];
    let profilePicDataUrl = '';

   
    if (profilePicFile) {
        profilePicDataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(profilePicFile);
        });
    }

    const resumeData = {
        name,
        email,
        phone,
        objective,
        career,
        education,
        experience,
        skills,
        profilePicDataUrl // add profile pic data
    };
    localStorage.setItem(username, JSON.stringify(resumeData));

    const resumeHTML = `
        <h2>Editable Resume</h2>
        ${profilePicDataUrl ? `<img src="${profilePicDataUrl}" alt="Profile Picture" style="width:150px;height:150px;border-radius:50%;">` : ''}
        <h3>Personal Information</h3>
        <p><b>Name:</b> <span contenteditable="true">${name}</span></p>
        <p><b>Email:</b> <span contenteditable="true">${email}</span></p>
        <p><b>Phone:</b> <span contenteditable="true">${phone}</span></p>
        <h3>Objective</h3>
        <p contenteditable="true">${objective}</p>
        <h3>Career</h3>
        <p contenteditable="true">${career}</p>
        <h3>Education</h3>
        <p contenteditable="true">${education}</p>
        <h3>Experience</h3>
        <p contenteditable="true">${experience}</p>
        <h3>Skills</h3>
        <p contenteditable="true">${skills}</p>
    `;

    resumeDisplayElement.innerHTML = resumeHTML;

    const shareableURL = `${window.location.origin}?username=${encodeURIComponent(username)}`;
    shareableLinkContainer.style.display = 'block';
    shareableLinkElement.href = shareableURL;
    shareableLinkElement.textContent = shareableURL;
});

downloadPdfButton.addEventListener('click', () => {
    window.print();
});

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    if (username) {
        const savedResumeData = localStorage.getItem(username);
        if (savedResumeData) {
            const resumeData = JSON.parse(savedResumeData);
            (document.getElementById('username') as HTMLInputElement).value = username;
            (document.getElementById('name') as HTMLInputElement).value = resumeData.name;
            (document.getElementById('email') as HTMLInputElement).value = resumeData.email;
            (document.getElementById('phone') as HTMLInputElement).value = resumeData.phone;
            (document.getElementById('objective') as HTMLTextAreaElement).value = resumeData.objective;
            (document.getElementById('career') as HTMLTextAreaElement).value = resumeData.career;
            (document.getElementById('education') as HTMLTextAreaElement).value = resumeData.education;
            (document.getElementById('experience') as HTMLTextAreaElement).value = resumeData.experience;
            (document.getElementById('skills') as HTMLTextAreaElement).value = resumeData.skills;

            // Set profile picture if it exists
            if (resumeData.profilePicDataUrl) {
                resumeDisplayElement.innerHTML += `<img src="${resumeData.profilePicDataUrl}" alt="Profile Picture" style="width:150px;height:150px;border-radius:50%;">`;
            }
        }
    }
});
